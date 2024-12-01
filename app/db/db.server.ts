import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema/schema';

export const db = drizzle({ connection: { source: process.env.DATABASE_URL }, schema: schema });