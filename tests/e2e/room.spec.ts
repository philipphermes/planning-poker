import {test, expect} from '@playwright/test';
import {db} from "../../app/db/db.server";
import {rooms, users, usersToRooms} from "../../app/db/schema/schema";
import * as argon2 from "argon2";
import {v4 as uuidV4} from "uuid";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import {eq} from "drizzle-orm";

test.beforeAll(async () => {
    migrate(db, {migrationsFolder: "./app/db/migrations/"});
})

test.beforeEach(async ({page}) => {
    await db
        .insert(users)
        .values({
            id: uuidV4(),
            email: 'test1@email.com',
            password: await argon2.hash('password1'),
            createdAt: (new Date()).valueOf()
        })
        .onConflictDoNothing()

    await page.goto('/login');

    await page.getByPlaceholder('Type here').click();
    await page.getByPlaceholder('Type here').fill('test1@email.com');

    await page.getByPlaceholder('********').click();
    await page.getByPlaceholder('********').fill('password1');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('/');
})

test.afterEach(async () => {
    await db.delete(usersToRooms)
    await db.delete(users)
    await db.delete(rooms)
})

test('can create room and open', async ({page}) => {
    await page.goto('/');

    await page.getByPlaceholder('Type here').click();
    await page.getByPlaceholder('Type here').fill('Test Room');

    await page.getByRole('button', { name: 'Create new room' }).click();

    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: 'Open' }).click();

    const room = await db
        .query
        .rooms
        .findFirst({
            where: eq(rooms.name, 'Test Room'),
        })

    await expect(page).toHaveURL(`/room/${room.id}`);
});
