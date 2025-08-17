import { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "@/lib/server/db/schema";

type DatabaseTransactionCallback = Parameters<LibSQLDatabase<typeof schema>['transaction']>[0];
export type Transaction = Parameters<DatabaseTransactionCallback>[0];