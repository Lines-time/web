import createClient from "../database/client";
import { UserService } from "../service/userService";
import { inferAsyncReturnType } from "@trpc/server";

const dbClient = createClient();

export async function createContext() {
    return {
        db: await dbClient,
        userService: new UserService(),
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
