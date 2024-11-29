import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { rooms } from "./rooms";
import { estimations } from "./estimations";

export const rounds = sqliteTable('rounds', {
    id: text().primaryKey(),
    name: text().notNull(),
    roomId: text('room_id').notNull().references(() => rooms.id), time: integer(),
    createdAt: integer('created_at', { mode: "timestamp" }).notNull().default(sql`current_timestamp`),
})

export const roundsRelations = relations(rounds, ({ one, many }) => ({
    room: one(rooms, {
        fields: [rounds.roomId],
        references: [rooms.id],
    }),
    estimations: many(estimations),
}));