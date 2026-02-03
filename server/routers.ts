import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { 
  loginWithKeycloak, 
  registerWithKeycloak, 
  generateToken,
  refreshKeycloakToken,
  logoutFromKeycloak
} from "./keycloakAuth";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    logout: publicProcedure
      .input(z.object({
        refreshToken: z.string().optional(),
      }).optional())
      .mutation(async ({ ctx, input }) => {
        // Clear local session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
        
        // Logout from Keycloak if refresh token is provided
        if (input?.refreshToken) {
          await logoutFromKeycloak(input.refreshToken);
        }
        
        return {
          success: true,
        } as const;
      }),
    
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        organizationId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Login via Keycloak
        const result = await loginWithKeycloak(
          input.email, 
          input.password,
          input.organizationId || 1
        );
        
        if (!result.success) {
          throw new Error(result.error || "Login failed");
        }

        // Generate local JWT token for session
        const token = await generateToken(result.user!);
        
        // Set the auth cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

        return {
          success: true,
          user: result.user,
          tokens: result.tokens, // Keycloak tokens (access_token, refresh_token)
        };
      }),
    
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
        organizationId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Register via Keycloak
        const result = await registerWithKeycloak(
          input.email,
          input.password,
          input.name,
          input.organizationId || 1
        );
        
        if (!result.success) {
          throw new Error(result.error || "Registration failed");
        }

        // Generate token and set auth cookie
        const token = await generateToken(result.user!);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

        return {
          success: true,
          user: result.user,
        };
      }),
    
    refreshToken: publicProcedure
      .input(z.object({
        refreshToken: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Refresh Keycloak access token
        const result = await refreshKeycloakToken(input.refreshToken);
        
        if (!result.success) {
          throw new Error(result.error || "Token refresh failed");
        }

        return {
          success: true,
          tokens: result.tokens,
        };
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
