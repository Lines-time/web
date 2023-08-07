import { Context } from "./context";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;