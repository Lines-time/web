import db from "../database/client";
import { User, usersTable } from "../database/schema/user";
import { Service } from "./service";
import { eq } from "drizzle-orm";

export class UserService implements Service<User> {
    async getAll() {
        return db.select().from(usersTable);
    }

    async getById(id: number) {
        const users = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
        return users.shift() ?? null;
    }
}
