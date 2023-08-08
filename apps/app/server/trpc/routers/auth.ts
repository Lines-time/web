import { AuthError, convertAuthErrorToTRPCError } from "../../service/error";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({
    login: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.service.auth.login(input.email, input.password);
            if (result.success) {
                setCookie(ctx.event, "lines-session", result.session.token, {
                    expires: result.session.expires,
                });
                return result;
            } else {
                throw convertAuthErrorToTRPCError(result.type);
            }
        }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
        const result = await ctx.service.auth.logout();
        // TODO)) Return value?
    }),
    register: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
                repeatPassword: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.service.auth.register(
                input.email,
                input.password,
                input.repeatPassword,
            );
            if (result.success) {
                setCookie(ctx.event, "lines-session", result.session.token, {
                    expires: result.session.expires,
                });
                return result;
            } else {
                throw convertAuthErrorToTRPCError(result.type);
            }
        }),
});
