import { z } from "zod";

export const roundSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must contain at least 3 characters')
        .max(25, 'Name only is allowed to have a max length of 25 characters'),
})