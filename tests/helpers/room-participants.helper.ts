import {roomParticipants} from "../../src/lib/server/db/schema";
import {getDB} from "../../src/lib/server/db";

export async function haveRoomParticipants(data: {
    roomId: string,
    userId: string,
}) {
    const database = getDB();
    const [round] = await database.insert(roomParticipants).values(data).returning();

    return round;
}