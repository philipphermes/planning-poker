import { User } from "~/models/User";
import { Room } from "~/models/Room";
import { findOneUserById } from "~/db/queries/userQueries";
import { Round } from "~/models/Round";
import { findNewestRoundByRoomIdWithEstimations } from "~/db/queries/roundQueries";
import { estimations } from "~/db/schema/schema";
import { SSEEstimation, SSEMessage } from "~/models/SSEMessage";

const controllers = new Map<string, Map<string, ReadableStreamDefaultController>>();
const users = new Map<string, User>();

export async function addClient(room: Room, user: User, controller: ReadableStreamDefaultController) {
    if (!room.id || !user.id) {
        throw new Error('roomId and userId are required')
    }

    if (!controllers.has(room.id)) {
        controllers.set(room.id, new Map());
    }

    if (controllers.has(room.id) && controllers.get(room.id)?.has(user.id)) {
        return
    }

    controllers.get(room.id)?.set(user.id, controller)
}

export async function removeClient(room: Room, user: User) {
    if (!room.id || !user.id) {
        throw new Error('roomId and userId are required')
    }

    controllers.get(room.id)?.delete(user.id)

    if (controllers.get(room.id)?.size === 0) {
        controllers.delete(room.id)
    }
}

export async function broadcastToRoom(roomId: string) {
    if (!roomId) {
        throw new Error('RoomId is required')
    }

    if (!controllers.has(roomId)) {
        throw new Error('No clients connected')
    }

    const round = await findNewestRoundByRoomIdWithEstimations(roomId)

    if (!round) {
        return
    }

    const message = new SSEMessage(
        round?.name,
        round?.estimations.map(estimation => {
            return new SSEEstimation(
                estimation.user?.email,
                estimation.time
            )
        })
    )

    controllers.get(roomId)?.forEach(controller => {
        controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
    })
}