import {findRoomById} from "~/db/queries/roomQueries";
import {getCurrentUser} from "~/.server/auth/user";
import {ROLE_OWNER} from "~/types/Users";

export function isOwnerOfRoom(room: Awaited<ReturnType<typeof findRoomById>>, user: Awaited<ReturnType<typeof getCurrentUser>>) {
    return room?.usersToRooms.filter(userToRoom => userToRoom.user.id === user.id && userToRoom.role === ROLE_OWNER).length === 1
}