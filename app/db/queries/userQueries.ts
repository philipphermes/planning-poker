import { User } from "~/models/User";
import { db } from "../db.server";
import { InsertUser, users } from "../schema/user";
import { and, eq, like, notInArray } from "drizzle-orm";
import { toInsertUser, toUser } from "../mappers/userMapper";


export async function findOneUserByEmail(email: string): Promise<User | null> {
    const userData = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (!userData[0]) {
        return null
    }

    return toUser(userData[0])
}

export async function findUsers(search: string, excludeUserId: string[]): Promise<User[]> {
    const userData = await db
        .select()
        .from(users)
        .where(and(
            like(users.email, `%${search}%`),
            notInArray(users.id, excludeUserId)
        ));

    return userData.map(user => toUser(user))
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