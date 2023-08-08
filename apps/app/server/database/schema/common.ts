import { timestamp, uuid } from "drizzle-orm/pg-core";

export const uuidPrimaryKey = () => uuid("id").primaryKey().defaultRandom();

export const defaultColumns = {
    createdAt: timestamp("createdAt").defaultNow().notNull(),
};
