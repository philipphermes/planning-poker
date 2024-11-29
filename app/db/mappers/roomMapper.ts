import { InsertRoom, SelectRoom } from "../schema/rooms";
import { Room } from "~/models/Room";
import { v4 as uuidV4 } from "uuid";

export function toRoom(room: SelectRoom): Room {
    return new Room(
        room.name,
        room.visible,
        room.id,
    )
}

export function toInsertRoom(room: Room): InsertRoom {
    return {
        id: uuidV4(),
        name: room.name,
    }
}