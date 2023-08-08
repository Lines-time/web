import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
    all: publicProcedure.query(({ ctx }) => {
        return ctx.repository.user.getAll();
    }),
    byId: publicProcedure.input(z.string().uuid()).query(({ ctx, input }) => {
        return ctx.repository.user.getById(input);
    }),
});
