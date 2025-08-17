import {sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {relations} from 'drizzle-orm';
import {cardSets} from "@/lib/server/db/schema/card-sets";
import {roomParticipants} from "@/lib/server/db/schema/room-participants";
import {rounds} from "@/lib/server/db/schema/rounds";

export const rooms = sqliteTable('room', {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    cardSetId: text('card_set_id').notNull().references(() => cardSets.id),
    ownerId: text('owner_id').notNull().references(() => users.id),
});

export const roomsRelations = relations(rooms, ({one, many}) => ({
    owner: one(users, {
        fields: [rooms.ownerId],
        references: [users.id],
    }),
    cardSet: one(cardSets, {
        fields: [rooms.cardSetId],
        references: [cardSets.id],
    }),
    roomParticipants: many(roomParticipants),
    rounds: many(rounds)
}));