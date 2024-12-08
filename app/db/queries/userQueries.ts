import {db} from "../db.server";
import {and, eq, like, notInArray} from "drizzle-orm";
import {User, users} from "../schema/schema";
import {v4 as uuidV4} from "uuid";

export async function findOneUserByEmail(email: string) {
    return await db.query.users.findFirst({
        where: eq(users.email, email)
    })
}

export async function findOneUserById(id: string) {
    return await db.query.users.findFirst({
        where: eq(users.id, id)
    })
}

export async function findUsers(search: string, excludeUserId: string[]) {
    return await db.query.users.findMany({
        where: and(
            like(users.email, `%${search}%`),
            notInArray(users.id, excludeUserId)
        )
    })
}

export async function createUser(user: User) {
    user.id = uuidV4()
    user.createdAt = new Date().valueOf()

    const userData = await db
        .insert(users)
        .values(user)
        .returning()
        .onConflictDoNothing();

    return userData[0] ?? user;
}