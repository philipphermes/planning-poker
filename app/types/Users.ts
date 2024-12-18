import {users} from "~/db/schema/schema";

export const ROLE_OWNER = 'owner';
export const ROLE_MEMBER = 'member';

export type Users = typeof users.$inferInsert;
