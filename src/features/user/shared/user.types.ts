import {users} from "@/lib/server/db/schema";

export type User = typeof users.$inferSelect;

export interface UserDto {
    id: string | null;
    email: string;
    name: string | null;
    image: string | null;
}