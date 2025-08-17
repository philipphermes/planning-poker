import {sqliteTable, text, primaryKey} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {rooms} from './rooms';
import {relations} from 'drizzle-orm';

export const roomParticipantsStatusValues = ['active', 'inactive'] as const;
export type RoomParticipantsStatus = typeof roomParticipantsStatusValues[number];

export const roomParticipants = sqliteTable('room_participant',
    {
        userId: text('user_id').notNull().references(() => users.id),
        roomId: text('room_id').notNull().references(() => rooms.id),
        status: text('status', {enum: roomParticipantsStatusValues}).notNull().default('inactive'),
    },
    (table) => ({
        pk: primaryKey({columns: [table.userId, table.roomId]}),
    })
);

export const roomParticipantsRelations = relations(roomParticipants, ({one}) => ({
    room: one(rooms, {
        fields: [roomParticipants.roomId],
        references: [rooms.id],
    }),
    user: one(users, {
        fields: [roomParticipants.userId],
        references: [users.id],
    }),
}));