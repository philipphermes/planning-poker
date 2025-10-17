import { NextRequest } from "next/server";
import {getUserService} from "@/features/user/server";
import {createActionResponse, createErrorResponse, createSuccessResponse} from "@/lib/server/utils";
import {getFileService} from "@/features/file/server";
import {userUpdateScheme} from "@/features/user/shared/user.validations";
import {logger} from "@/lib/server/logger";

export const POST = async (req: NextRequest) => {
    const userService = getUserService();
    const fileService = getFileService();

    try {
        const user = await userService.getCurrentUser();
        if (!user?.id) {
            return createErrorResponse('Unauthorized', 401);
        }

        fileService.deleteFile(user.image);

        const file = await fileService.uploadFile(req, user.id, [
            'image/jpeg',
            'image/png',
        ]);
        if (!file) {
            return createErrorResponse('Failed to upload image. Please try again.', 400);
        }

        const validated = userUpdateScheme.parse({
            id: user.id,
            name: user.name,
            image: file,
        });
        await userService.update(validated);

        return createSuccessResponse('Upload successfully', {
            image: file,
        });
    } catch (error) {
        logger.error(error instanceof Error ? error.message : 'Failed to upload image.');
        return createErrorResponse('Failed to upload image. Please try again.', 400);
    }
};

export const DELETE = async () => {
    const userService = getUserService();
    const fileService = getFileService();

    try {
        const user = await userService.getCurrentUser();
        if (!user?.id) {
            return createErrorResponse('Unauthorized', 401);
        }

        fileService.deleteFile(user.image);

        await userService.update({
            id: user.id,
            name: user.name ?? '',
            image: null,
        });

        return createSuccessResponse('Deleted successfully', null);
    } catch (error) {
        logger.error(error instanceof Error ? error.message : 'Failed to delete image.');
        return createErrorResponse('Failed to delete image. Please try again.', 400);
    }
}