import { Repository } from ".";
import { InsertUser, userTable } from "../database/schema/auth";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class UserRepository implements Repository<typeof userTable> {
    private db;

    constructor(db: NodePgDatabase) {
        this.db = db;
    }

    async getAll() {
        return this.db.select().from(userTable);
    }

    async getById(id: string) {
        const users = await this.db.select().from(userTable).where(eq(userTable.id, id)).limit(1);
        return users.shift() ?? null;
    }

    async getByEmail(email: string) {
        const users = await this.db
            .select()
            .from(userTable)
            .where(eq(userTable.email, email))
            .limit(1);
        return users.shift() ?? null;
    }

    async createOne(data: InsertUser) {
        const created = await this.db.insert(userTable).values(data).returning();
        return created.shift() ?? null;
    }
}
