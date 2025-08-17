import {LibSQLDatabase} from "drizzle-orm/libsql";
import * as schema from '@/lib/server/db/schema';
import {safeExecute} from "@/lib/server/db";

export abstract class AbstractRepository {
    protected db: LibSQLDatabase<typeof schema>;

    constructor(db: LibSQLDatabase<typeof schema>) {
        this.db = db;
    }

    protected async safeExecute<T>(operation: string, callback: () => Promise<T>): Promise<T> {
        return safeExecute(operation, callback);
    }
}