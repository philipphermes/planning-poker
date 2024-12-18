import {test, expect} from '@playwright/test';
import {db} from "../../app/db/db.server";
import {users} from "../../app/db/schema/schema";
import * as argon2 from "argon2";
import {v4 as uuidV4} from "uuid";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import {eq} from "drizzle-orm";

test.beforeAll(async () => {
    migrate(db, {migrationsFolder: "./app/db/migrations/"});
})

test.afterEach(async () => {
    await db.delete(users)
})

test('can register', async ({page}) => {
    await page.goto('/auth/register');

    await page.getByPlaceholder('Type here').click();
    await page.getByPlaceholder('Type here').fill('test2@email.com');

    await page.getByPlaceholder('********').click();
    await page.getByPlaceholder('********').fill('password1');

    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page).toHaveURL('/auth');

    const user = await db
        .query
        .users
        .findFirst({
            where: eq(users.email, 'test2@email.com'),
        })

    await expect(user.email).toBe('test2@email.com')
});

test('cant register email already used', async ({page}) => {
    await db
        .insert(users)
        .values({
            id: uuidV4(),
            email: 'test1@email.com',
            password: await argon2.hash('password1'),
            createdAt: (new Date()).valueOf()
        })
        .onConflictDoNothing()

    await page.goto('/auth/register');

    await page.getByPlaceholder('Type here').click();
    await page.getByPlaceholder('Type here').fill('test1@email.com');

    await page.getByPlaceholder('********').click();
    await page.getByPlaceholder('********').fill('password1');

    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page).toHaveURL('/auth/register');
});

