import {RoomParticipantsStatus} from "@/lib/server/db/schema";
import {UserActiveDto} from "@/features/room-participant/shared/room-participant.types";
import {Transaction} from "@/lib/server/db/types";
import {SocketConnection} from "@/features/socket/shared/socket.validations";

export interface IRoomParticipantService {
    updateStatus(input: SocketConnection, status: RoomParticipantsStatus): Promise<void>;

    update(roomId: string, userIds: string[]): Promise<void>;

    getManyByRoomId(roomId: string): Promise<UserActiveDto[]>;

    deleteByUserId(userId: string, tx: Transaction): Promise<void>;

    deleteByRoomIdTransaction(roomId: string, tx: Transaction): Promise<void>;
}