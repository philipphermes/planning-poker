import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import {getUserService} from "@/features/user/server";
import {createErrorResponse, createSuccessResponse} from "@/lib/server/utils";

const UPLOAD_DIR = path.resolve(`public/${process.env.UPLOAD_DIR!}`);

export const POST = async (req: NextRequest) => {
    const userService = getUserService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        return createErrorResponse('Unauthorized', 401);
    }

    const formData = await req.formData();
    if (!formData.has('file')) {
        return createErrorResponse('No file provided', 400);
    }

    const file = formData.get("file") as File;

    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${user.id}.jpeg`;
    const filePath = path.resolve(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicImagePath = `/${process.env.UPLOAD_DIR!}/${fileName}`;

    await userService.update({
        id: user.id,
        name: user.name ?? '',
        image: publicImagePath,
    });

    return createSuccessResponse('Uploade successfully', {
        image: publicImagePath,
    });
};

export const DELETE = async () => {
    const userService = getUserService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        return createErrorResponse('Unauthorized', 401);
    }

    const fileName = `${user.id}.jpeg`;
    const filePath = path.resolve(UPLOAD_DIR, fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);

        await userService.update({
            id: user.id,
            name: user.name ?? '',
            image: null,
        });

        return createSuccessResponse('Deleted successfully', null);
    }

    return createErrorResponse('Unexpected error accrued', 505);
}