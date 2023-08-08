import { defaultColumns, uuidPrimaryKey } from "./common";
import { type InferModel, eq } from "drizzle-orm";
import { pgTable, pgView, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuidPrimaryKey(),

    firstName: text("firstName"),
    lastName: text("lastName"),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    salt: text("salt").notNull(),

    // Preferences
    theme: text("theme"),
    language: text("language"),

    ...defaultColumns,
});

export const roleTable = pgTable("role", {
    id: uuidPrimaryKey(),

    name: text("name").notNull(),
    description: text("description"),

    ...defaultColumns,
});

export const userToRoleTable = pgTable("userRole", {
    userId: uuid("userId")
        .notNull()
        .references(() => userTable.id),
    roleId: uuid("roleId")
        .notNull()
        .references(() => roleTable.id),

    ...defaultColumns,
});

export const userWithRolesView = pgView("userWithRoles").as((qb) =>
    qb
        .select({
            user: {
                id: userTable.id,
                firstName: userTable.firstName,
                lastName: userTable.lastName,
                email: userTable.email,
                theme: userTable.theme,
                language: userTable.language,
                createdAt: userTable.createdAt,
            },
            role: {
                id: roleTable.id,
                name: roleTable.name,
                description: roleTable.description,
                createdAt: roleTable.createdAt,
            },
            createdAt: userToRoleTable.createdAt,
        })
        .from(userToRoleTable)
        .leftJoin(userTable, eq(userToRoleTable.userId, userTable.id))
        .leftJoin(roleTable, eq(userToRoleTable.roleId, roleTable.id)),
);

export const sessionTable = pgTable("session", {
    id: uuidPrimaryKey(),

    userId: uuid("userId")
        .notNull()
        .references(() => userTable.id),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),

    userAgent: text("userAgent").notNull(),
    ip: text("ip").notNull(),

    ...defaultColumns,
});

export type SelectUser = InferModel<typeof userTable>;
export type InsertUser = InferModel<typeof userTable, "insert">;

export type SelectSession = InferModel<typeof sessionTable>;
export type InsertSession = InferModel<typeof sessionTable, "insert">;

export type SelectRole = InferModel<typeof roleTable>;
export type InsertRole = InferModel<typeof roleTable, "insert">;
