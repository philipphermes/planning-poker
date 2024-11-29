import { relations, sql } from "drizzle-orm"
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { usersToRooms } from "./usersToRooms";
import { rounds } from "./rounds";

export const rooms = sqliteTable('rooms', {
    id: text().primaryKey(),
    name: text().notNull(),
    visible: integer({ mode: 'boolean' }),
    createdAt: integer('created_at', { mode: "timestamp" }).notNull().default(sql`current_timestamp`),
})

export const roomsRelations = relations(rooms, ({ many }) => ({
    usersToRooms: many(usersToRooms),
    rounds: many(rounds),
}));