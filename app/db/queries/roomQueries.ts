import { ROLE_OWNER, Room } from "~/models/Room";
import { db } from "../db.server";
import { rooms } from "../schema/rooms";
import { usersToRooms } from "../schema/usersToRooms";
import { and, eq } from "drizzle-orm";
import { toInsertRoom, toRoom } from "../mappers/roomMapper";
import { users } from "../schema/user";

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
        .innerJoin(usersToRooms, eq(rooms.id, usersToRooms.roomId))
        .innerJoin(users, eq(usersToRooms.userId, users.id))

    //TODO refactor
    const roomTransfers = roomsData.map(roomData => toRoom(roomData.rooms, roomData.users))
    const room = new Room(
        roomTransfers[0]?.name,
        roomTransfers[0]?.visible,
        roomTransfers[0]?.id,
        roomTransfers.map(room => { return room.users[0] ?? null })
    )

    return room
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
            role: ROLE_OWNER,
        })

    return toRoom(roomData[0])
}

//TODO use room object
export async function updateRoom(id: string, name: string) {
    const result = await db
        .update(rooms)
        .set({
            name: name,
        })
        .where(eq(rooms.id, id))

    return result.changes
}

export async function addUserToRoom(roomId: string, userId: string) {
    const result = await db
        .insert(usersToRooms)
        .values({
            roomId,
            userId,
        })
        .onConflictDoNothing()

    return result.changes
}

export async function deleteUserToRoom(roomId: string, userId: string) {
    const result = await db
        .delete(usersToRooms)
        .where(and(
            eq(usersToRooms.roomId, roomId),
            eq(usersToRooms.userId, userId)
        ))

    return result.changes
}

export async function deleteRoom(roomId: string) {
    const resultDeleteUsersToRooms = await db
        .delete(usersToRooms)
        .where(eq(usersToRooms.roomId, roomId))

    if (resultDeleteUsersToRooms.changes > 0) {
        const result = await db
            .delete(rooms)
            .where(eq(rooms.id, roomId))

        return result.changes
    }

    return 0
}