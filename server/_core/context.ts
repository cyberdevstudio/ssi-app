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

    // Try OAuth authentication first
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (oauthError) {
      // OAuth failed, try local authentication
      try {
        const localAuthUser = await verifyToken(sessionCookie);
        if (localAuthUser) {
          // Import db function here to avoid circular dependency
          const { getUserById } = await import("../db");
          user = await getUserById(localAuthUser.id);
        }
      } catch (localError) {
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
