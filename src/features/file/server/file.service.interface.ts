import {NextRequest} from "next/server";

export interface IFileService {
    uploadFile(req: NextRequest, fileName: string, mimeTypeWhitelist: string[]): Promise<string | null>;

    deleteFile(publicPath: string|null): void;
}