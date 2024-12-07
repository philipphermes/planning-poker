import { ROLE_OWNER, Room } from "~/models/Room";
import { db } from "../db.server";
import { and, eq } from "drizzle-orm";
import { toInsertRoom, toRoom } from "../mappers/roomMapper";
import {estimations, rooms, rounds, usersToRooms} from "../schema/schema";
import { toUser } from "../mappers/userMapper";
import {toUserToRoom} from "~/db/mappers/userToRoomMapper";
import {UserToRoom} from "~/models/UserToRoom";

export async function findRoomsByUserId(userId: string): Promise<UserToRoom[]> {
    const userToRooms = await db.query.usersToRooms.findMany({
        with: {
            room: true,
            user: true,
        },
        where: eq(usersToRooms.userId, userId)
    })

    return userToRooms.map(userToRoom => toUserToRoom(userToRoom))
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
    try {
        const roundList = await db.query.rounds.findMany({
            where: eq(rounds.roomId, roomId)
        })

        for (const round of roundList) {
            await db.delete(estimations).where(eq(estimations.roundId, round.id))
            await db.delete(rounds).where(eq(rounds.id, round.id))
        }

        await db.delete(usersToRooms).where(eq(usersToRooms.roomId, roomId))
        const result = await db.delete(rooms).where(eq(rooms.id, roomId))

        return result.changes
    } catch (e) {
        return 0
    }
}