import {rooms} from "~/db/schema/schema";

export type Rooms = typeof rooms.$inferInsert;
