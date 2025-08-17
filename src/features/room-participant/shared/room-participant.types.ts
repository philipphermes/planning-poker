import {RoomParticipantsStatus} from "@/lib/server/db/schema";

export interface UserActiveDto {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    status: RoomParticipantsStatus;
}