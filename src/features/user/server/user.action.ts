'use server';

import {getUserService} from "@/features/user/server/index";
import {UserUpdateFormInput, userUpdateNameSchema} from "@/features/user/shared/user.validations";
import {createActionResponse} from "@/lib/server/utils";
import {logger} from "@/lib/server/logger";
import {UserDto} from "@/features/user/shared/user.types";
import {getFileService} from "@/features/file/server";

export async function updateUserAction(data: UserUpdateFormInput) {
    const userService = getUserService();

    try {
        const user = await userService.getCurrentUser();
        if (!user?.id) return createActionResponse<undefined>(
            'Failed to update account. Please try again.',
            false,
        );

        const validated = userUpdateNameSchema.parse({
            ...data,
            id: user.id,
            image: user.image,
        });

        const updatedUser = await userService.updateName(validated);

        return createActionResponse<UserDto>(
            'Successfully updated account.',
            true,
            updatedUser,
        );
    } catch (error) {
        logger.error(error instanceof Error ? error.message : 'Failed to update account.');
        return createActionResponse<undefined>(
            'Failed to update account. Please try again.',
            false,
        );
    }
}

export async function deleteUserAction() {
    const userService = getUserService();
    const fileService = getFileService();

    try {
        const user = await userService.getCurrentUser();
        if (!user?.id) return createActionResponse(
            'Failed to delete account. Please try again.',
            false,
        );

        await userService.deleteByUserId(user.id)
        fileService.deleteFile(user.image)

        return createActionResponse(
            'Successfully deleted account.',
            true,
        );
    } catch (error) {
        logger.error(error instanceof Error ? error.message : 'Failed to delete account.');
        return createActionResponse(
            'Failed to delete account. Please try again.',
            false,
        );
    }
}