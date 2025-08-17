import {rooms} from "@/lib/server/db/schema";
import {UserDto} from "@/features/user/shared/user.types";
import {RoundDto} from "@/features/round/shared/round.types";
import {CardSetDto} from "@/features/card-set/shared/card-set.types";

export type InsertRoom = typeof rooms.$inferInsert;
export type SelectRoom = typeof rooms.$inferSelect;

export interface RoomDto {
    id: string;
    name: string;
    cardSetId: string;
    cardSet?: CardSetDto;
    ownerId: string;
    owner?: UserDto;
    participants?: UserDto[];
    rounds?: RoundDto[];
}