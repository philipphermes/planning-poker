import {Room} from "~/models/Room";
import {v4 as uuidV4} from "uuid";
import {toUser} from "./userMapper";
import {InsertRoom, SelectRoom, SelectUser} from "../schema/schema";

export function toRoom(room: SelectRoom, user?: SelectUser): Room {
    const roomTransfer = new Room(
        room.name,
        room.visible,
        room.id,
    )

    if (user) roomTransfer.users.push(toUser(user).toSafeUser())

    return roomTransfer
}

export function toInsertRoom(room: Room): InsertRoom {
    return {
        id: uuidV4(),
        name: room.name,
    }
}