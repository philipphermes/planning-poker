import {NextRequest} from "next/server";
import {UserDto} from "@/features/user/shared/user.types";

export interface IFileService {
    uploadFile(req: NextRequest, fileName: string): Promise<string | null>;

    deleteFile(user: UserDto): void;
}