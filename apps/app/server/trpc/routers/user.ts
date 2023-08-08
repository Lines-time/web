import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
    all: publicProcedure.query(({ ctx }) => {
        return ctx.userService.getAll();
    }),
    byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
        return ctx.userService.getById(input);
    }),
});
