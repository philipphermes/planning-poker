import {sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {relations} from 'drizzle-orm';
import {rooms} from "@/lib/server/db/schema/rooms";

export const cardSets = sqliteTable('card_set', {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    cards: text('cards', {mode: 'json'}).$type<string[]>().notNull(),
    ownerId: text('owner_id').notNull().references(() => users.id),
});

export const cardSetsRelations = relations(cardSets, ({one, many}) => ({
    owner: one(users, {
        fields: [cardSets.ownerId],
        references: [users.id],
    }),
    rooms: many(rooms),
}));