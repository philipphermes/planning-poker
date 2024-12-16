import {findNewestRoundByRoomIdWithEstimations} from "~/db/queries/roundQueries";
import {Room, User} from "~/db/schema/schema";
import {SSEMessage} from "~/models/SSEMessage";

const controllers = new Map<string, Map<string, ReadableStreamDefaultController>>();

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

    const message: SSEMessage = {
        round: round.name,
        estimations: round?.estimations.map(estimation => {
            return {
                user: estimation.user.email,
                estimation: estimation.time,
            }
        })
    }

    controllers.get(roomId)?.forEach(controller => {
        controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
    })
}