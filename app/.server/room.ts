import {User} from "~/models/User";
import {Room} from "~/models/Room";
import {findOneUserById} from "~/db/queries/userQueries";

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

setInterval(async () => {
    controllers.forEach(userControllers => {
        const usernames: string[] = [];

        userControllers.forEach(async (controller, userId) => {
            if (!users.has(userId)) {
                const user = await findOneUserById(userId)
                if (user) users.set(userId, user)
            }

            const mail = users.get(userId)?.email
            if (mail) usernames.push(mail)
        })

        userControllers.forEach(controller => {
            console.log(usernames)
            controller.enqueue(`data: ${JSON.stringify({
                type: 'connected-users',
                users: usernames,
            })}\n\n`);
        })
    })
}, Number.parseInt(process.env.CONNECTED_USERS_PING_INTERVAL ?? '5000'))