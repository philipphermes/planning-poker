import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";
import { rounds } from "./rounds";

export const estimations = sqliteTable('estimations', {
    id: text().primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    roundId: text('round_id').notNull().references(() => rounds.id),
    time: integer(),
    createdAt: integer('created_at', { mode: "timestamp" }).notNull().default(sql`current_timestamp`),
})

export const estimationsRelations = relations(estimations, ({ one }) => ({
    user: one(users, {
        fields: [estimations.userId],
        references: [users.id],
    }),
    round: one(rounds, {
        fields: [estimations.roundId],
        references: [rounds.id],
    }),
}));