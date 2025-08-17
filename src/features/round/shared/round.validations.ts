import {z} from "zod";
import {sanitize} from "@/lib/shared/utils";
import {ownerUUIDZodType} from "@/features/user/shared/user.validations";
import {roomUUIDZodType} from "@/features/room/shared/room.validations";

export const roundUUIDZodType = z.uuid("Invalid round ID");
export const roundNameZodType = z.string().min(1, "Round name is required").max(100, "Round name too long").transform(sanitize);

export const roundInputSchema = z.object({
    id: roundUUIDZodType.optional(),
    name: roundNameZodType,
    roomId: roomUUIDZodType,
    ownerId: ownerUUIDZodType,
});

export const roundSchemaInputFormSchema = z.object({
    id: roundUUIDZodType.optional(),
    roomId: roomUUIDZodType,
    name: roundNameZodType,
});

export type RoundInput = z.infer<typeof roundInputSchema>;
export type RoundFormInput = z.infer<typeof roundSchemaInputFormSchema>;