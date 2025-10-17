import {z} from "zod";
import {sanitize, sanitizeOptional} from "@/lib/shared/utils";

export const userUUIDZodType = z.uuid("Invalid user ID");
export const ownerUUIDZodType = z.uuid("Invalid owner ID");

export const userUpdateScheme = z.object({
    id: userUUIDZodType,
    name: z.string().min(3, "Name required").max(100, "Name to long").transform(sanitize),
    image: z.string().nullable().optional().transform(sanitizeOptional),
});

export const userDeleteScheme = z.object({
    id: userUUIDZodType,
});

export const userUpdateFromSchema = z.object({
    name: z.string().min(3, "Name required").max(100, "Name to long").transform(sanitize),
})

export type UserUpdateInput = z.infer<typeof userUpdateScheme>;
export type UserUpdateFormInput = z.infer<typeof userUpdateFromSchema>;