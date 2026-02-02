// ============================================
// AJOUTEZ CE CODE DANS server/routers.ts
// ============================================

import { z } from "zod";
import { loginUser, registerUser } from "./localAuth";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

// Ajoutez ces routes dans votre appRouter:

export const appRouter = router({
  // ... autres routes existantes ...

  // Routes d'authentification locale
  localAuth: router({
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email("Email invalide"),
          password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
          name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
          organizationId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await registerUser(
          input.email,
          input.password,
          input.name,
          input.organizationId || 1
        );

        if (!result.success) {
          throw new Error(result.error || "Registration failed");
        }

        // Generate token and set cookie
        const token = await generateToken(result.user!);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
          success: true,
          user: result.user,
        };
      }),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().email("Email invalide"),
          password: z.string().min(1, "Le mot de passe est requis"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await loginUser(input.email, input.password);

        if (!result.success) {
          throw new Error(result.error || "Login failed");
        }

        // Set cookie with token
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, result.token!, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
          success: true,
          user: result.user,
        };
      }),
  }),
});

// ============================================
// MODIFIEZ AUSSI server/_core/context.ts
// ============================================

// Remplacez la fonction createContext pour supporter l'authentification locale:

import { verifyToken } from "../localAuth";

export async function createContext({
  req,
  res,
}: CreateContextOptions): Promise<TrpcContext> {
  let user: User | undefined;

  try {
    const sessionCookie = req.cookies[COOKIE_NAME];
    if (!sessionCookie) {
      return { req, res, user: undefined };
    }

    // Try local auth first
    const localUser = await verifyToken(sessionCookie);
    if (localUser) {
      // Fetch full user from database
      const dbUser = await getUserByOpenId(`local_${localUser.id}`);
      if (dbUser) {
        user = dbUser;
      }
    } else {
      // Fallback to Manus OAuth
      const payload = await jwtVerify(sessionCookie, JWT_SECRET);
      const openId = payload.openId as string;
      if (openId) {
        user = await getUserByOpenId(openId);
      }
    }
  } catch (error) {
    console.error("[Context] Session verification failed:", error);
  }

  return { req, res, user };
}
