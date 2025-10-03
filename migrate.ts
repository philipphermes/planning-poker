import 'dotenv/config';
import {createClient} from "@libsql/client";
import {migrate} from "drizzle-orm/libsql/migrator";
import {drizzle} from "drizzle-orm/libsql";
import * as schema from "@/lib/server/db/schema";

async function runMigrations() {
    const client = createClient({url: process.env.DB_URL!});
    const db = drizzle(client, {schema});

    try {
        await migrate(db, {migrationsFolder: 'drizzle'})
        console.log('Migration completed ✅')
    } catch (error) {
        console.error('Migration failed 🚨:', error)
    } finally {
        client.close()
    }
}

runMigrations().catch((error) => {
    console.error('Error in migration process 🚨:', error);
    process.exit(1);
});