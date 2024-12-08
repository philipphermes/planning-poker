import {v4 as uuidV4} from "uuid";
import {createUser, deleteUser} from "~/db/queries/userQueries";
import * as argon2 from "argon2";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import {db} from "~/db/db.server";
import {afterAll, beforeAll} from 'vitest';

const usersData = [
    {id: uuidV4(), email: 'test1@email.com', password: 'password1'},
    {id: uuidV4(), email: 'test2@email.com', password: 'password2'},
];

async function importData() {
    for (const user of usersData) {
        user.password = await argon2.hash(user.password)
        await createUser(user);
    }
}

async function deleteData() {
    for (const user of usersData) {
        await deleteUser(user);
    }
}

beforeAll(async () => {
    console.log('Setup')

    migrate(db, {migrationsFolder: "./app/db/migrations/"});
    console.log('1. Migrated')

    await importData()
    console.log('2. data imported')
});

afterAll(async () => {
    console.log('Teardown')

    await deleteData()
    console.log('1. data deleted')
})