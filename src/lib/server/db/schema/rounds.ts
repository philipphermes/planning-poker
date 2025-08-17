import {sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {rooms} from './rooms';
import {relations} from 'drizzle-orm';
import {estimates} from "./estimates";

export const roundStatusValues = ['active', 'completed'] as const;
export type RoundStatus = typeof roundStatusValues[number];

export const rounds = sqliteTable('round', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    roomId: text('room_id').notNull().references(() => rooms.id),
    name: text('name').notNull(),
    status: text('status', {enum: roundStatusValues}).notNull().default('active'),
});

export const roundsRelations = relations(rounds, ({one, many}) => ({
    room: one(rooms, {
        fields: [rounds.roomId],
        references: [rooms.id],
    }),
    estimates: many(estimates),
}));

