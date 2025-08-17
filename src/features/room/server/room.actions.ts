'use server';

import {getUserService} from "@/features/user/server";
import {revalidatePath} from "next/cache";
import {getSocketService} from "@/features/socket/server";
import {deleteRoomSchema, FormRoomInput, formRoomSchema} from "@/features/room/shared/room.validations";
import {getRoomService} from "@/features/room/server";
import {createActionResponse} from "@/lib/server/utils";
import {RoomDto} from "@/features/room/shared/room.types";
import {logger} from "@/lib/server/logger";

export async function persistRoomAction(data: FormRoomInput) {
    const userService = getUserService();
    const roomService = getRoomService();

    try {
        const user = await userService.getCurrentUser();
        if (!user?.id) return createActionResponse<undefined>(
            'Failed to persist room. Please try again.',
            false,
        );

        const validated = formRoomSchema.parse(data);

        let persistedRoom;
        if (validated.id) persistedRoom = await roomService.update({id: validated.id, ownerId: user.id, ...validated});
        else persistedRoom = await roomService.create({ownerId: user.id, ...validated});

        revalidatePath('/room')
        if (persistedRoom) revalidatePath(`/room/${persistedRoom.id}`);

        return createActionResponse<RoomDto>(
            'Successfully saved room.',
            true,
            persistedRoom,
        );
    } catch (error) {
        logger.error(error instanceof Error ? error.message : 'Failed to persist room.');
        return createActionResponse<undefined>(
            'Failed to persist room. Please try again.',
            false,
        );
    }
}

export async function deleteRoomAction(roomId: string) {
    const userService = getUserService();
    const roomService = getRoomService();
    const socketService = getSocketService();

    try {
        const user = await userService.getCurrentUser();
        if (!user?.id) return createActionResponse<string>(
            'Failed to delete room. Please try again.',
            false,
            roomId,
        );

        const validated = deleteRoomSchema.parse({
            id: roomId,
            ownerId: user.id,
        });

        await roomService.delete(validated);

        const io = socketService.getIoInstance();
        io.to(roomId).emit('room', null);

        return createActionResponse<string>(
            'Successfully deleted room.',
            true,
            roomId,
        );
    } catch (error) {
        logger.error(error instanceof Error ? error.message : `Failed to delete room ${roomId}.`);
        return createActionResponse<string>(
            'Failed to delete room. Please try again.',
            false,
            roomId,
        );
    }
}