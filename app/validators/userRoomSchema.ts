import { z } from "zod";

export const userRoomSchema = z.object({
    roomId: z.string(),
    userId: z.string(),
})