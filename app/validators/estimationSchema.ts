import { z } from "zod";

export const estimationSchema = z.object({
    estimate: z.string(),
})