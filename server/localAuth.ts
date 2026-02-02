import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { users } from "../drizzle/schema";
import { getDb } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export interface LocalAuthUser {
  id: number;
  email: string;
  name: string | null;
  role: "user" | "admin";
  organizationId: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export async function generateToken(user: LocalAuthUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<LocalAuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as LocalAuthUser;
  } catch (error) {
    console.error("[LocalAuth] Token verification failed:", error);
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  name: string,
  organizationId: number = 1
): Promise<{ success: boolean; error?: string; user?: LocalAuthUser }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Email already registered" };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await db.insert(users).values({
      email,
      passwordHash,
      name,
      organizationId,
      role: "user",
      openId: `local_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      loginMethod: "local",
    });

    const userId = Number(result.insertId);

    // Fetch created user
    const newUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (newUser.length === 0) {
      return { success: false, error: "Failed to create user" };
    }

    const user: LocalAuthUser = {
      id: newUser[0].id,
      email: newUser[0].email!,
      name: newUser[0].name,
      role: newUser[0].role,
      organizationId: newUser[0].organizationId,
    };

    return { success: true, user };
  } catch (error) {
    console.error("[LocalAuth] Registration error:", error);
    return { success: false, error: "Registration failed" };
  }
}

/**
 * Login a user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: LocalAuthUser; token?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    // Find user by email
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }

    const dbUser = result[0];

    // Check if user has a password (local auth)
    if (!dbUser.passwordHash) {
      return { success: false, error: "This account uses a different login method" };
    }

    // Verify password
    const isValid = await verifyPassword(password, dbUser.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Update last signed in
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, dbUser.id));

    const user: LocalAuthUser = {
      id: dbUser.id,
      email: dbUser.email!,
      name: dbUser.name,
      role: dbUser.role,
      organizationId: dbUser.organizationId,
    };

    // Generate token
    const token = await generateToken(user);

    return { success: true, user, token };
  } catch (error) {
    console.error("[LocalAuth] Login error:", error);
    return { success: false, error: "Login failed" };
  }
}
