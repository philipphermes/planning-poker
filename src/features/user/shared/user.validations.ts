import {z} from "zod";
import {sanitize, sanitizeOptional} from "@/lib/shared/utils";

export const userUUIDZodType = z.uuid("Invalid user ID");
export const ownerUUIDZodType = z.uuid("Invalid owner ID");

export const userUpdateNameSchema = z.object({
    id: userUUIDZodType,
    name: z.string().min(3, "Name required").max(100, "Name to long").transform(sanitize),
});

export const userUpdateImageSchema = z.object({
    id: userUUIDZodType,
    image: z.string().nullable().optional().transform(sanitizeOptional),
});

export const userDeleteScheme = z.object({
    id: userUUIDZodType,
});

export const userUpdateFromSchema = z.object({
    name: z.string().min(3, "Name required").max(100, "Name to long").transform(sanitize),
})

export type UserUpdateNameInput = z.infer<typeof userUpdateNameSchema>;
export type UserUpdateImageInput = z.infer<typeof userUpdateImageSchema>;
export type UserUpdateFormInput = z.infer<typeof userUpdateFromSchema>;