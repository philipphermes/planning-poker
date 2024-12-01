import { relations, sql } from "drizzle-orm"
import { sqliteTable, integer, text, primaryKey } from "drizzle-orm/sqlite-core"
import { ROLE_MEMBER } from "~/models/Room";

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

export type InsertRoom = typeof rooms.$inferInsert;
export type SelectRoom = typeof rooms.$inferSelect;

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

export const usersToRooms = sqliteTable('users_to_rooms', {
    userId: text('user_id').notNull().references(() => users.id),
    roomId: text('room_id').notNull().references(() => rooms.id),
    role: text().notNull().default(ROLE_MEMBER),
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

export type InsertRound = typeof rounds.$inferInsert;
export type SelectRound = typeof rounds.$inferSelect;

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

export type InsertEstimation = typeof estimations.$inferInsert;
export type SelectEstimation = typeof estimations.$inferSelect;

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