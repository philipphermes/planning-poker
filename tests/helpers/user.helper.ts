import {users} from "../../src/lib/server/db/schema";
import {UserDto} from "../../src/features/user/shared/user.types";
import {getDB} from "../../src/lib/server/db";

export async function haveUser({email, name, image}: {
    email: string,
    name?: string,
    image?: string
}): Promise<UserDto> {
    const database = getDB();
    const data = {
        email,
        name: name ?? null,
        image: image ?? null,
    };

    const [user] = await database.insert(users).values(data).returning();
    return user;
}