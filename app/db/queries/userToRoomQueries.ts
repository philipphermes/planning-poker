import {UsersToRooms, usersToRooms} from "~/db/schema/schema";
import {db} from "~/db/db.server";
import {and, eq} from "drizzle-orm";

export async function addUserToRoom(userToRoom: UsersToRooms) {
    const result = await db
        .insert(usersToRooms)
        .values(userToRoom)
        .onConflictDoNothing()

    return result.changes
}

export async function deleteUserToRoom(userToRoom: UsersToRooms) {
    const result = await db
        .delete(usersToRooms)
        .where(and(
            eq(usersToRooms.roomId, userToRoom.roomId),
            eq(usersToRooms.userId, userToRoom.userId)
        ))

    return result.changes
}

export async function deleteUsersToRooms(roomId: string) {
    const result = await db
        .delete(usersToRooms)
        .where(eq(usersToRooms.roomId, roomId));

    return result.changes;
}

export async function findUsersToRoomsByUserId(userId: string) {
    return await db.query.usersToRooms.findMany({
        with: {
            room: true,
            user: true,
        },
        where: eq(usersToRooms.userId, userId)
    })
}
