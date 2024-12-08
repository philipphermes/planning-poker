import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './app/db/migrations/',
    schema: './app/db/schema/',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'file:' + process.env.DATABASE_URL,
    },
});