import {IFileService} from "@/features/file/server/file.service.interface";
import {FileService} from "@/features/file/server/file.service";
import path from "path";

let fileService: IFileService;

export function getFileService(): IFileService {
    if (fileService) {
        return fileService;
    }

    const uploadDir = path.resolve(`public/${process.env.UPLOAD_DIR!}`);

    fileService = new FileService(
        uploadDir,
    );

    return fileService;
}