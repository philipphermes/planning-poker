import { User } from "~/models/User";
import { db } from "../db.server";
import { and, eq, like, notInArray } from "drizzle-orm";
import { toInsertUser, toUser } from "../mappers/userMapper";
import { InsertUser, users } from "../schema/schema";


export async function findOneUserByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    })

    return user ? toUser(user) : null
}

export async function findOneUserById(id: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
        where: eq(users.id, id)
    })

    return user ? toUser(user) : null
}

export async function findUsers(search: string, excludeUserId: string[]): Promise<User[]> {
    const usersData = await db.query.users.findMany({
        where: and(
            like(users.email, `%${search}%`),
            notInArray(users.id, excludeUserId)
        )
    })

    return usersData.map(user => toUser(user))
}

export async function createUser(user: User): Promise<User> {
    let newUser: InsertUser;

    try {
        newUser = await toInsertUser(user)
    } catch {
        return user
    }

    const userData = await db
        .insert(users)
        .values(newUser)
        .returning()
        .onConflictDoNothing();

    if (!userData[0]) {
        return user;
    }

    return toUser(userData[0])
}