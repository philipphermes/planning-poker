import {test, expect} from '@playwright/test';
import {db} from "../../app/db/db.server";
import {users} from "../../app/db/schema/schema";
import * as argon2 from "argon2";
import {v4 as uuidV4} from "uuid";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";

test.beforeAll(async () => {
    migrate(db, {migrationsFolder: "./app/db/migrations/"});
})

test.afterEach(async () => {
    await db.delete(users)
})

test('redirected to login when not authenticated', async ({page}) => {
    await page.goto('/');

    await expect(page).toHaveURL('/auth');
});

test('redirected to / authenticated successfully and can logout', async ({page}) => {
    await db
        .insert(users)
        .values({
            id: uuidV4(),
            email: 'test1@email.com',
            password: await argon2.hash('password1'),
            createdAt: (new Date()).valueOf()
        })
        .onConflictDoNothing()

    await page.goto('/auth');

    await page.getByPlaceholder('Type here').click();
    await page.getByPlaceholder('Type here').fill('test1@email.com');

    await page.getByPlaceholder('********').click();
    await page.getByPlaceholder('********').fill('password1');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('/');

    await page.goto('/logout');

    await expect(page).toHaveURL('/auth');
});

