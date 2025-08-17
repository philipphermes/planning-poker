import {drizzle, LibSQLDatabase} from 'drizzle-orm/libsql';
import * as schema from './schema';
import {createClient} from '@libsql/client';
import {logger} from '@/lib/server/logger';
import {DatabaseError} from "@/lib/shared/errors";

let db: LibSQLDatabase<typeof schema>;

export function getDB() {
    if (db) {
        return db;
    }

    try {
        const client = createClient({url: process.env.DB_URL!});
        db = drizzle(client, {schema});

        return db;
    } catch (error) {
        logger.error(`Failed to create database client: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
}

export async function safeExecute<T>(operation: string, callback: () => Promise<T>): Promise<T> {
    try {
        return await callback();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';

        logger.error(`Repository error in ${operation}: ${message}`);
        throw new DatabaseError(`Database operation failed in ${operation}: ${message}`);
    }
}
