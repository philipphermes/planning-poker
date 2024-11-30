import {User} from "~/models/User";
import {Estimation} from "~/models/Estimation";
import {Room} from "~/models/Room";

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

export function broadcastEstimationToRoom(room: Room, estimation: Estimation) {
    if (!room.id) {
        throw new Error('roomId is required')
    }

    if (!controllers.has(room.id)) {
        throw new Error('No clients connected')
    }

    if (!room.visible) {
        estimation.time = 0
    }

    controllers.get(room.id)?.forEach(controller => {
        controller.enqueue(`data: ${JSON.stringify(estimation)}\n\n`);
    })
}