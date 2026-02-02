import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { verifyToken } from "../localAuth";
import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Parse cookies
    const cookies = opts.req.headers.cookie
      ? parseCookieHeader(opts.req.headers.cookie)
      : {};
    const sessionCookie = cookies[COOKIE_NAME];

    if (!sessionCookie) {
      // No session cookie found
      return {
        req: opts.req,
        res: opts.res,
        user: null,
      };
    }

    // Try local authentication first (for our local auth system)
    try {
      console.log("[Context] Trying local auth with cookie:", sessionCookie?.substring(0, 20) + "...");
      const localAuthUser = await verifyToken(sessionCookie);
      console.log("[Context] Local auth user:", localAuthUser);
      if (localAuthUser) {
        // Import db function here to avoid circular dependency
        const { getUserById } = await import("../db");
        user = await getUserById(localAuthUser.id);
        console.log("[Context] User from DB:", user);
      }
    } catch (localError) {
      console.log("[Context] Local auth failed:", localError);
      // Local auth failed, try OAuth authentication
      try {
        user = await sdk.authenticateRequest(opts.req);
      } catch (oauthError) {
        // Both authentication methods failed
        console.debug("[Context] Both OAuth and local auth failed");
        user = null;
      }
    }
  } catch (error) {
    // Any other errors
    console.debug("[Context] Authentication error:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
