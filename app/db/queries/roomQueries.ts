import {db} from "../db.server";
import {eq} from "drizzle-orm";
import {ROLE_OWNER, Room, rooms} from "../schema/schema";
import {deleteRound, findRoundsByRoomId} from "./roundQueries";
import {deleteEstimations} from "./estimationQueries";
import {addUserToRoom, deleteUsersToRooms} from "./userToRoomQueries";
import {v4 as uuidV4} from "uuid";

export async function findRoomById(id: string) {
    return await db.query.rooms.findFirst({
        with: {
            usersToRooms: {
                with: {
                    user: true
                }
            }
        },
        where: eq(rooms.id, id)
    })
}

export async function createRoom(room: Room, ownerId: string) {
    room.id = uuidV4()
    room.createdAt = new Date().valueOf()

    const roomData = await db
        .insert(rooms)
        .values(room)
        .returning()
        .onConflictDoNothing();

    if (!roomData[0]) {
        return room;
    }

    await addUserToRoom({
        userId: ownerId,
        roomId: roomData[0].id,
        role: ROLE_OWNER,
    })

    return roomData[0]
}

export async function updateRoom(room: Room) {
    const result = await db
        .update(rooms)
        .set({
            name: room.name,
        })
        .where(eq(rooms.id, room.id))

    return result.changes
}

export async function deleteRoom(roomId: string) {
    try {
        const rounds = await findRoundsByRoomId(roomId);

        for (const round of rounds) {
            await deleteEstimations(round.id)
            await deleteRound(round.id)
        }

        await deleteUsersToRooms(roomId)

        const result = await db.delete(rooms).where(eq(rooms.id, roomId))

        return result.changes
    } catch (e) {
        return 0
    }
}