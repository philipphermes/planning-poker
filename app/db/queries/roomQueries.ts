import { ROLE_OWNER, Room } from "~/models/Room";
import { db } from "../db.server";
import { and, eq } from "drizzle-orm";
import { toInsertRoom, toRoom } from "../mappers/roomMapper";
import { rooms, usersToRooms } from "../schema/schema";
import { toUser } from "../mappers/userMapper";

export async function findRoomsByUserId(userId: string): Promise<Room[]> {
    const userToRooms = await db.query.usersToRooms.findMany({
        with: {
            room: true,
        },
        where: eq(usersToRooms.userId, userId)
    })

    return userToRooms.map(userToRoom => toRoom(userToRoom.room))
}

export async function findRoomById(id: string): Promise<Room | null> {
    const roomDataNew = await db.query.rooms.findFirst({
        with: {
            usersToRooms: {
                with: {
                    user: true
                }
            }
        },
        where: eq(rooms.id, id)
    })

    return roomDataNew ? new Room(
        roomDataNew.name,
        roomDataNew.visible,
        roomDataNew.id,
        roomDataNew.usersToRooms.map(usersToRoom => toUser(usersToRoom.user)),
    ) : null
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