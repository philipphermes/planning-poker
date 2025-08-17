import '@testing-library/jest-dom'
import {migrate} from "drizzle-orm/libsql/migrator";
import {getDB} from '../../src/lib/server/db';

try {
    await migrate(getDB(), {migrationsFolder: './drizzle'});
} catch (_e) {
}