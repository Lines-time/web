import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const authRouter = router({
    login: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            }),
        )
        .mutation(({ input }) => {
            // TODO))
        }),
    logout: publicProcedure.mutation(({ ctx }) => {
        // TODO))
    }),
    register: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            }),
        )
        .mutation(({ ctx }) => {
            // TODO))
        }),
});
