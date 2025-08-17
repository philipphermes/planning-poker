import {rooms} from "../../src/lib/server/db/schema";
import {RoomDto} from "../../src/features/room/shared/room.types";
import {getDB} from "../../src/lib/server/db";

export async function haveRoom(data: {
    ownerId: string,
    name: string,
    cardSetId: string,
}): Promise<RoomDto> {
    const database = getDB();
    const [room] = await database.insert(rooms).values(data).returning();
    return room;
}