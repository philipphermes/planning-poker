import * as schema from '../../src/lib/server/db/schema';
import {getDB} from '../../src/lib/server/db';

export async function cleanupDb() {
    const db = getDB();

    const drizzleNameSymbol = Object.getOwnPropertySymbols(Object.values(schema)[0]).find(sym => sym.toString() === 'Symbol(drizzle:Name)');
    const tableNames = Object.values(schema).map(table => table[drizzleNameSymbol]).filter(tableName => !!tableName);

    await db.run('PRAGMA foreign_keys = OFF');
    for (const table of tableNames) {
        await db.run(`DELETE FROM ${table}`).execute();
    }
    await db.run('PRAGMA foreign_keys = ON');
}