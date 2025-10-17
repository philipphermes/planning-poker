import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import {IFileService} from "@/features/file/server/file.service.interface";
import {UserDto} from "@/features/user/shared/user.types";

export class FileService implements IFileService {
    constructor(
        private uploadDir: string,
        private publicPath: string,
    ) {
    }

    public async uploadFile(req: NextRequest, fileName: string, mimeTypeWhitelist: string[]): Promise<string | null> {
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
        const uint8Array = new Uint8Array(buffer);

        const detected = await fileTypeFromBuffer(uint8Array);
        const detectedMime = detected?.mime ?? file.type;
        if (!detectedMime || !mimeTypeWhitelist.includes(detectedMime)) {
            return null;
        }

        const ext = detected?.ext || path.extname(file.name).replace(".", "") || "bin";

        if (!fileName.endsWith(`.${ext}`)) {
            fileName = `${fileName}.${ext}`;
        }

        const filePath = path.resolve(this.uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);

        return `/${this.publicPath}/${fileName}`;
    }

    public deleteFile(publicPath: string|null) {
        if (!publicPath) {
            return;
        }

        if (this.uploadDir.includes('public')) {
            publicPath = `public/${publicPath}`;
        }

        const file = path.resolve(publicPath);

        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }
}
