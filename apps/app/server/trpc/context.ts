import createClient from "../database/client";
import { SessionRepository } from "../repository/session";
import { UserRepository } from "../repository/user";
import { AuthService } from "../service/auth";
import { inferAsyncReturnType } from "@trpc/server";
import { H3Event } from "h3";

const dbClient = createClient();

export async function createContext(event: H3Event) {
    const db = await dbClient;

    const userRepository = new UserRepository(db);
    const sessionRepository = new SessionRepository(db);
    return {
        event,
        db,
        repository: {
            user: userRepository,
            session: sessionRepository,
        },
        service: {
            auth: new AuthService(userRepository, sessionRepository),
        },
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
