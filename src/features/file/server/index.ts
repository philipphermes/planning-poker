import {IFileService} from "@/features/file/server/file.service.interface";
import {FileService} from "@/features/file/server/file.service";
import path from "path";

let fileService: IFileService;

export function getFileService(): IFileService {
    if (fileService) {
        return fileService;
    }

    const rootPath = process.env.UPLOAD_DIR!;
    const uploadDir = path.resolve(rootPath);
    const publicDir = rootPath.replace("public/", "");

    fileService = new FileService(
        uploadDir,
        publicDir,
    );

    return fileService;
}