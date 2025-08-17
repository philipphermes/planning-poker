import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core"
import {relations} from "drizzle-orm";
import {roomParticipants} from "@/lib/server/db/schema/room-participants";
import {estimates} from "@/lib/server/db/schema/estimates";

export const users = sqliteTable("user", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique().notNull(),
    emailVerified: integer("emailVerified", {mode: "timestamp_ms"}),
    image: text("image"),
});

export const usersRelations = relations(users, ({many}) => ({
    roomParticipants: many(roomParticipants),
    estimates: many(estimates),
}));