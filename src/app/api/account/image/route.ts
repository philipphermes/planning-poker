import { NextRequest } from "next/server";
import {getUserService} from "@/features/user/server";
import {createErrorResponse, createSuccessResponse} from "@/lib/server/utils";
import {getFileService} from "@/features/file/server";
import {userUpdateImageSchema} from "@/features/user/shared/user.validations";
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

        const validated = userUpdateImageSchema.parse({
            id: user.id,
            image: file,
        });
        await userService.updateImage(validated);

        return createSuccessResponse('Uploaded successfully', {
            image: file,
        });
    } catch (error) {
        console.log(error);
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
        await userService.updateImage({
            id: user.id,
            image: null,
        });

        return createSuccessResponse('Deleted successfully', null);
    } catch (error) {
        logger.error(error instanceof Error ? error.message : 'Failed to delete image.');
        return createErrorResponse('Failed to delete image. Please try again.', 400);
    }
}