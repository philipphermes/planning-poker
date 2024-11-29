import { Room } from "~/models/Room";
import { db } from "../db.server";
import { rooms } from "../schema/rooms";
import { usersToRooms } from "../schema/usersToRooms";
import { and, eq } from "drizzle-orm";
import { toInsertRoom, toRoom } from "../mappers/roomMapper";

export async function findRoomsByUserId(userId: string): Promise<Room[]> {
    const roomsData = await db
        .select()
        .from(rooms)
        .innerJoin(usersToRooms, and(eq(rooms.id, usersToRooms.roomId), eq(usersToRooms.userId, userId)));

    return roomsData.map(room => toRoom(room.rooms))
}

export async function findRoomById(id: string): Promise<Room | null> {
    const roomsData = await db
        .select()
        .from(rooms)
        .where(eq(rooms.id, id))
        .limit(1)

    return roomsData[0] ? toRoom(roomsData[0]) : null
}

export async function createRoom(room: Room): Promise<Room> {
    if (room.users.length === 0 || !room.users[0].id) {
        throw Error('At least one user is required to create a room')
    }

    const roomData = await db
        .insert(rooms)
        .values(toInsertRoom(room))
        .returning()
        .onConflictDoNothing();

    if (!roomData[0]) {
        return room;
    }

    await db
        .insert(usersToRooms)
        .values({
            userId: room.users[0].id,
            roomId: roomData[0].id,
        })

    return toRoom(roomData[0])
}