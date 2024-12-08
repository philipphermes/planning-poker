import {data, LoaderFunctionArgs} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {findRoomById} from "~/db/queries/roomQueries";
import {findUsers} from "~/db/queries/userQueries";

export async function loader({request}: LoaderFunctionArgs) {
    await getCurrentUser(request);

    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    const roomId = url.searchParams.get("r");
    const excludeUserId: string[] = []

    if (!query) {
        return data({results: []});
    }

    if (roomId) {
        const room = await findRoomById(roomId)
        if (room) room.usersToRooms.map(userToRoom => excludeUserId.push(userToRoom.user.id))
    }

    const users = await findUsers(query, excludeUserId)

    return data(users)
}