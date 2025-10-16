import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import fs from "fs";
import path from "path";
import {NextRequest} from "next/server";
import {IFileService} from "../../../../src/features/file/server/file.service.interface";
import {getFileService} from "../../../../src/features/file/server";
import {UserDto} from "../../../../src/features/user/shared/user.types";

const TEST_UPLOAD_DIR = process.env.UPLOAD_DIR!;

describe('FileService', () => {
    let service: IFileService;

    beforeEach(async () => {
        service = getFileService();
    })

    afterEach(async () => {
        const filePath = path.resolve(TEST_UPLOAD_DIR, "myfile.txt");
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath);
        }
    })

    describe('uploadFile', async () => {
        it("should create a new file when none exists", async () => {
            const content = "Hello world!";
            const fileData = Buffer.from(content, 'utf-8');

            const mockFile = {
                name: "test.txt",
                type: "text/plain",
                size: fileData.length,
                async arrayBuffer() {
                    return fileData;
                },
            } as unknown as File;

            const formDataMock: FormData = {
                get: (key: string) => (key === "file" ? mockFile : null),
            } as unknown as FormData;

            const mockReq = {
                formData: async () => formDataMock,
            } as unknown as NextRequest;

            const fileName = "myfile";
            const result = await service.uploadFile(mockReq, fileName);

            const expectedFileNameWithExt = "myfile.txt";
            const expectedFilePath = path.resolve(TEST_UPLOAD_DIR, expectedFileNameWithExt);

            expect(fs.existsSync(expectedFilePath)).toBe(true);

            const savedContent = fs.readFileSync(expectedFilePath, "utf-8");
            expect(savedContent).toBe(content);

            const expectedPublicPath = TEST_UPLOAD_DIR.replace("public", "");
            expect(result).toBe(`/${expectedPublicPath.replace(/^\/|\/$/g, '')}/${expectedFileNameWithExt}`);
        });

        it("should return when no file provided", async () => {
            const formDataMock: FormData = {
                get: (key: string) => null,
            } as unknown as FormData;

            const mockReq = {
                formData: async () => formDataMock,
            } as unknown as NextRequest;

            const fileName = "myfile";
            const result = await service.uploadFile(mockReq, fileName);

            expect(result).toBe(null);
        });
    })

    describe('deleteUserImage', async () => {
        it("should delete the user image", async () => {
            const testFilePath = path.resolve(TEST_UPLOAD_DIR, "test.txt");
            const deleteFilePath = path.resolve(TEST_UPLOAD_DIR, "delete.txt");
            fs.copyFileSync(testFilePath, deleteFilePath)

            service.deleteUserImage({
                image: `${TEST_UPLOAD_DIR}/delete.txt`,
            } as UserDto)

            expect(fs.existsSync(deleteFilePath)).toBe(false);
        })

        it("should do nothing when user hasn't got an image", async () => {
            const testFilePath = path.resolve(TEST_UPLOAD_DIR, "test.txt");

            service.deleteUserImage({
                image: null,
            } as UserDto)

            expect(fs.existsSync(testFilePath)).toBe(true);
        })
    })
})