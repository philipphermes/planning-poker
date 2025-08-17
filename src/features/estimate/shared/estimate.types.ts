import {estimates} from "@/lib/server/db/schema";
import {UserDto} from "@/features/user/shared/user.types";

export type InsertEstimate = typeof estimates.$inferInsert;

export interface EstimateDto {
    roundId: string;
    userId: string;
    user?: UserDto;
    value: string | null;
}