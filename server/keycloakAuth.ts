import axios from "axios";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { users } from "../drizzle/schema";
import { getDb } from "./db";

// Keycloak configuration from environment variables
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || "http://localhost:8080";
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || "ssigrc";
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || "sigma-frontend";
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || "";
const KEYCLOAK_ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USERNAME || "admin";
const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || "admin";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export interface KeycloakAuthUser {
  id: number;
  email: string;
  name: string | null;
  role: "user" | "admin";
  organizationId: number;
  keycloakId?: string;
}

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token?: string;
  "not-before-policy"?: number;
  session_state?: string;
  scope?: string;
}

/**
 * Get Keycloak admin access token
 */
async function getAdminToken(): Promise<string> {
  try {
    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "password",
        client_id: "admin-cli",
        username: KEYCLOAK_ADMIN_USERNAME,
        password: KEYCLOAK_ADMIN_PASSWORD,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("[Keycloak] Failed to get admin token:", error);
    throw new Error("Failed to authenticate with Keycloak admin API");
  }
}

/**
 * Login user via Keycloak Direct Access Grants
 */
export async function loginWithKeycloak(
  email: string,
  password: string,
  organizationId: number = 1
): Promise<{ success: boolean; error?: string; user?: KeycloakAuthUser; tokens?: KeycloakTokenResponse }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    // Step 1: Authenticate with Keycloak using Direct Access Grants
    const tokenResponse = await axios.post<KeycloakTokenResponse>(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "password",
        client_id: KEYCLOAK_CLIENT_ID,
        client_secret: KEYCLOAK_CLIENT_SECRET,
        username: email,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokens = tokenResponse.data;

    // Step 2: Decode access token to get user info
    const userInfo = await axios.get(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const keycloakUser = userInfo.data;

    // Step 3: Check if user exists in local database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, keycloakUser.email))
      .limit(1);

    let user: KeycloakAuthUser;

    if (existingUser.length > 0) {
      // User exists, update keycloakId if needed
      if (!existingUser[0].keycloakId) {
        await db
          .update(users)
          .set({ keycloakId: keycloakUser.sub })
          .where(eq(users.id, existingUser[0].id));
      }

      user = {
        id: existingUser[0].id,
        email: existingUser[0].email!,
        name: existingUser[0].name,
        role: existingUser[0].role,
        organizationId: existingUser[0].organizationId,
        keycloakId: keycloakUser.sub,
      };
    } else {
      // User doesn't exist, create in local database
      const openId = `keycloak_${keycloakUser.sub}`;

      await db.insert(users).values({
        email: keycloakUser.email,
        name: keycloakUser.name || keycloakUser.preferred_username,
        organizationId,
        role: "user",
        openId,
        loginMethod: "keycloak",
        keycloakId: keycloakUser.sub,
      });

      const newUser = await db
        .select()
        .from(users)
        .where(eq(users.openId, openId))
        .limit(1);

      if (newUser.length === 0) {
        return { success: false, error: "Failed to create user" };
      }

      user = {
        id: newUser[0].id,
        email: newUser[0].email!,
        name: newUser[0].name,
        role: newUser[0].role,
        organizationId: newUser[0].organizationId,
        keycloakId: keycloakUser.sub,
      };
    }

    return { success: true, user, tokens };
  } catch (error: any) {
    console.error("[Keycloak] Login error:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return { success: false, error: "Invalid email or password" };
    }
    
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Register user in Keycloak
 */
export async function registerWithKeycloak(
  email: string,
  password: string,
  name: string,
  organizationId: number = 1
): Promise<{ success: boolean; error?: string; user?: KeycloakAuthUser }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    // Step 1: Check if user already exists in local database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Email already registered" };
    }

    // Step 2: Get admin token
    const adminToken = await getAdminToken();

    // Step 3: Create user in Keycloak
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || "";

    const createUserResponse = await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
      {
        username: email,
        email: email,
        firstName: firstName,
        lastName: lastName,
        enabled: true,
        emailVerified: false,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 4: Get the created user ID from Location header
    const locationHeader = createUserResponse.headers.location;
    if (!locationHeader) {
      return { success: false, error: "Failed to get user ID from Keycloak" };
    }

    const keycloakUserId = locationHeader.split("/").pop();

    // Step 5: Set password for the user
    await axios.put(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${keycloakUserId}/reset-password`,
      {
        type: "password",
        value: password,
        temporary: false,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 6: Create user in local database
    const openId = `keycloak_${keycloakUserId}`;

    await db.insert(users).values({
      email,
      name,
      organizationId,
      role: "user",
      openId,
      loginMethod: "keycloak",
      keycloakId: keycloakUserId,
    });

    const newUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, openId))
      .limit(1);

    if (newUser.length === 0) {
      return { success: false, error: "Failed to create user in local database" };
    }

    const user: KeycloakAuthUser = {
      id: newUser[0].id,
      email: newUser[0].email!,
      name: newUser[0].name,
      role: newUser[0].role,
      organizationId: newUser[0].organizationId,
      keycloakId: keycloakUserId,
    };

    return { success: true, user };
  } catch (error: any) {
    console.error("[Keycloak] Registration error:", error.response?.data || error.message);
    
    if (error.response?.status === 409) {
      return { success: false, error: "User already exists in Keycloak" };
    }
    
    return { success: false, error: "Registration failed" };
  }
}

/**
 * Refresh Keycloak access token
 */
export async function refreshKeycloakToken(
  refreshToken: string
): Promise<{ success: boolean; error?: string; tokens?: KeycloakTokenResponse }> {
  try {
    const tokenResponse = await axios.post<KeycloakTokenResponse>(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: KEYCLOAK_CLIENT_ID,
        client_secret: KEYCLOAK_CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return { success: true, tokens: tokenResponse.data };
  } catch (error: any) {
    console.error("[Keycloak] Token refresh error:", error.response?.data || error.message);
    return { success: false, error: "Failed to refresh token" };
  }
}

/**
 * Logout user from Keycloak
 */
export async function logoutFromKeycloak(
  refreshToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await axios.post(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`,
      new URLSearchParams({
        client_id: KEYCLOAK_CLIENT_ID,
        client_secret: KEYCLOAK_CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error("[Keycloak] Logout error:", error.response?.data || error.message);
    return { success: false, error: "Failed to logout from Keycloak" };
  }
}

/**
 * Generate a JWT token for a user (local session)
 */
export async function generateToken(user: KeycloakAuthUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    keycloakId: user.keycloakId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<KeycloakAuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as KeycloakAuthUser;
  } catch (error) {
    console.error("[Keycloak] Token verification failed:", error);
    return null;
  }
}
