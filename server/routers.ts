import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { loginUser, registerUser, generateToken } from "./localAuth";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await loginUser(input.email, input.password);
        
        if (!result.success) {
          throw new Error(result.error || "Login failed");
        }

        // Set the auth cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, result.token, cookieOptions);

        return {
          success: true,
          user: result.user,
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
        const result = await registerUser(
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
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
