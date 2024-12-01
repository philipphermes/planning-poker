import { z } from "zod";

export const estimationSchema = z.object({
    time: z.string().regex(/^\d+$/),
})