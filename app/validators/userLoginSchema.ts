import { z } from "zod";

export const userLoginSchema = z.object({
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(8, 'Password is required'),
})