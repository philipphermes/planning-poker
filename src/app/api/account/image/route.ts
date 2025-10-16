import { NextRequest } from "next/server";
import {getUserService} from "@/features/user/server";
import {createErrorResponse, createSuccessResponse} from "@/lib/server/utils";
import {getFileService} from "@/features/file/server";

export const POST = async (req: NextRequest) => {
    const userService = getUserService();
    const fileService = getFileService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        return createErrorResponse('Unauthorized', 401);
    }

    fileService.deleteUserImage(user);

    const file = await fileService.uploadFile(req, user.id);
    if (!file) {
        return createErrorResponse('Upload failed', 400);
    }

    await userService.update({
        id: user.id,
        name: user.name ?? '',
        image: file,
    });

    return createSuccessResponse('Upload successfully', {
        image: file,
    });
};

export const DELETE = async () => {
    const userService = getUserService();
    const fileService = getFileService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        return createErrorResponse('Unauthorized', 401);
    }

    fileService.deleteUserImage(user);

    await userService.update({
        id: user.id,
        name: user.name ?? '',
        image: null,
    });

    return createSuccessResponse('Deleted successfully', null);
}