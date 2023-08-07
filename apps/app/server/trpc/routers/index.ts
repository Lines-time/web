import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
    hello: publicProcedure
        .input(
            z.object({
                text: z.string().nullish(),
            }),
        )
        .query(({ input }) => {
            // throw new TRPCError({ message: "Error", code: "INTERNAL_SERVER_ERROR" });
            return {
                greeting: `Hello ${input.text ?? "world"}`,
            };
        }),
});

export type AppRouter = typeof appRouter;
