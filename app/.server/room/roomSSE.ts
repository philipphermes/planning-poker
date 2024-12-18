import {findNewestRoundByRoomIdWithEstimations} from "~/db/queries/roundQueries";
import {SSEMessage} from "~/types/SSEMessage";
import {Users} from "~/types/Users";
import {Rooms} from "~/types/Rooms";

const controllers = new Map<string, Map<string, ReadableStreamDefaultController>>();

export async function addClient(room: Rooms, user: Users, controller: ReadableStreamDefaultController) {
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

export async function removeClient(room: Rooms, user: Users) {
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
        visible: round.visible,
        estimations: round?.estimations.map(estimation => {
            return {
                user: estimation.user.email,
                estimation: round.visible ? estimation.time : null,
            }
        })
    }

    controllers.get(roomId)?.forEach(controller => {
        controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
    })
}