import {usersToRooms} from "~/db/schema/schema";

export type UsersToRooms = typeof usersToRooms.$inferInsert;
