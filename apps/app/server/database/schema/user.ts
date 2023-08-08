import { type InferModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    username: text("username"),
    password: text("password").notNull(),
    salt: text("salt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = InferModel<typeof usersTable>;
