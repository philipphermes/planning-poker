import { users } from "./user";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { rooms } from "./rooms";
import { relations } from "drizzle-orm";

export const usersToRooms = sqliteTable('users_to_rooms', {
    userId: text('user_id').notNull().references(() => users.id),
    roomId: text('room_id').notNull().references(() => rooms.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roomId] }),
}));

export const usersToRoomsRelations = relations(usersToRooms, ({ one }) => ({
    user: one(users, {
        fields: [usersToRooms.userId],
        references: [users.id],
    }),
    room: one(rooms, {
        fields: [usersToRooms.roomId],
        references: [rooms.id],
    }),
}));