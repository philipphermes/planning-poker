import { z } from "zod";

export const cardTypeSchema = z.object({
    generateType: z.enum(["fibonacci", "powers-of-two", "sequential", "t-shirts"]),
})