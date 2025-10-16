import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import {IFileService} from "@/features/file/server/file.service.interface";
import {UserDto} from "@/features/user/shared/user.types";

export class FileService implements IFileService {
    private uploadDir: string;

    constructor(
        uploadDir: string,
    ) {
        this.uploadDir = uploadDir;
    }

    public async uploadFile(req: NextRequest, fileName: string): Promise<string | null> {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            return null;
        }

        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const detected = await fileTypeFromBuffer(buffer);
        const ext = detected?.ext || path.extname(file.name).replace(".", "") || "bin";

        if (!fileName.endsWith(`.${ext}`)) {
            fileName = `${fileName}.${ext}`;
        }

        const filePath = path.resolve(this.uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);

        return `/${process.env.UPLOAD_DIR!}/${fileName}`;
    }

    public deleteFile(user: UserDto) {
        if (!user.image) {
            return;
        }

        const file = path.resolve(`public/${user.image}`);

        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }
}
