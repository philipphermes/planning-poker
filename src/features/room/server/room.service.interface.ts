import {RoomDto} from "@/features/room/shared/room.types";
import {CreateRoomInput, DeleteRoomInput, UpdateRoomInput} from "@/features/room/shared/room.validations";
import {Transaction} from "@/lib/server/db/types";

export interface IRoomService {
    getManyByOwnerId(ownerId: string): Promise<RoomDto[]>;

    getManyByUserId(userId: string): Promise<RoomDto[]>;

    getOneByIdAndUserId(roomId: string, userId: string): Promise<RoomDto | null>;

    create(input: CreateRoomInput): Promise<RoomDto>;

    update(input: UpdateRoomInput): Promise<RoomDto>;

    delete(input: DeleteRoomInput): Promise<void>;

    getOneByIdAndOwnerIdForExport(roomId: string, userId: string): Promise<RoomDto | null>;

    isCardSetInRoom(cardSetId: string): Promise<boolean>;

    deleteByOwnerId(ownerId: string, tx: Transaction): Promise<void>;

    hasUserAccess(userId: string, roomId: string): Promise<boolean>;

    isRoomOwner(userId: string, roomId: string): Promise<boolean>;
}