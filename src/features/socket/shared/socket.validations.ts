import {z} from "zod";
import {userUUIDZodType} from "@/features/user/shared/user.validations";
import {roomUUIDZodType} from "@/features/room/shared/room.validations";

export const socketConnectionSchema = z.object({
    userId: userUUIDZodType,
    roomId: roomUUIDZodType,
});

export type SocketConnection = z.infer<typeof socketConnectionSchema>;