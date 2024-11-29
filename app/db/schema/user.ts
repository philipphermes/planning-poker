import { relations, sql } from "drizzle-orm"
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { usersToRooms } from "./usersToRooms";
import { estimations } from "./estimations";

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const users = sqliteTable('users', {
    id: text().primaryKey(),
    email: text().unique().notNull(),
    password: text().notNull(),
    createdAt: integer('created_at', { mode: "timestamp" }).default(sql`current_timestamp`),
})

export const usersRelations = relations(users, ({ many }) => ({
    usersToRooms: many(usersToRooms),
    estimations: many(estimations),
}));
