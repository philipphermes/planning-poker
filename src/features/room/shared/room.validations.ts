import {z} from "zod";
import {sanitize} from "@/lib/shared/utils";
import {ownerUUIDZodType, userUUIDZodType} from "@/features/user/shared/user.validations";
import {cardSetUUIDZodType} from "@/features/card-set/shared/card-set.validations";

export const roomUUIDZodType = z.uuid("Invalid room ID");
export const roomNameZodType = z.string().min(1, "Room name is required").max(100, "Room name too long").transform(sanitize);
export const userIdsZodType = z.array(userUUIDZodType)

export const createRoomSchema = z.object({
    name: roomNameZodType,
    cardSetId: cardSetUUIDZodType,
    userIds: userIdsZodType.default([]),
    ownerId: ownerUUIDZodType,
});

export const updateRoomSchema = z.object({
    id: roomUUIDZodType,
    name: roomNameZodType,
    cardSetId: cardSetUUIDZodType,
    userIds: userIdsZodType.default([]),
    ownerId: ownerUUIDZodType,
});

export const formRoomSchema = z.object({
    id: roomUUIDZodType.optional(),
    name: roomNameZodType,
    cardSetId: cardSetUUIDZodType,
    userIds: userIdsZodType,
});

export const deleteRoomSchema = z.object({
    id: roomUUIDZodType,
    ownerId: ownerUUIDZodType,
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type DeleteRoomInput = z.infer<typeof deleteRoomSchema>;
export type FormRoomInput = z.infer<typeof formRoomSchema>;