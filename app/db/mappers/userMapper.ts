import {User} from "~/models/User";
import {v4 as uuidV4} from "uuid";
import * as argon2 from "argon2";
import {InsertUser, SelectUser, SelectedUsersToRooms} from "../schema/schema";


export async function toInsertUser(user: User): Promise<InsertUser> {
    if (!user.password) {
        throw Error('Password is required to create a user!')
    }

    return {
        id: uuidV4(),
        email: user.email,
        password: await argon2.hash(user.password),
    }
}

export function toUser(user: SelectUser, userToRoom?: SelectedUsersToRooms): User {
    const mappedUser = new User(
        user.email,
        user.id,
        user.password,
    )

    mappedUser.role = userToRoom?.role

    return mappedUser
}