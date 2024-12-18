import { z } from "zod";

export const cardsSchema = z.object({
    cards: z.map(z.string(), z.string().regex(/^\d*$/)),
})