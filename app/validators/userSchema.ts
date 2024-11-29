import { z } from "zod";

export const userSchema = z.object({
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(8, 'Password must contain at least 8 characters')
        .max(50, 'Password only is allowed to have a max length of 50 characters'),
})