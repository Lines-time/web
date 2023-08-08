import { Repository } from ".";
import { InsertSession, sessionTable } from "../database/schema/auth";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class SessionRepository implements Repository<typeof sessionTable> {
    private db;

    constructor(db: NodePgDatabase) {
        this.db = db;
    }

    async getAll() {
        return this.db.select().from(sessionTable);
    }

    async getById(id: string) {
        const sessions = await this.db
            .select()
            .from(sessionTable)
            .where(eq(sessionTable.id, id))
            .limit(1);
        return sessions.shift() ?? null;
    }

    async createOne(data: InsertSession) {
        const created = await this.db.insert(sessionTable).values(data).returning();
        return created.shift() ?? null;
    }
}
