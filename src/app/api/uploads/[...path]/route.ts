import { NextResponse } from 'next/server';
import path from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import {fileTypeFromFile} from "file-type";
import {logger} from "@/lib/server/logger";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const {path: requestPath} = await params;
    const filePath = path.join(process.cwd(), process.env.UPLOAD_DIR!, ...requestPath);

    try {
        await stat(filePath);
        const fileType = await fileTypeFromFile(filePath);
        const mime = fileType?.mime || 'application/octet-stream';
        const stream = createReadStream(filePath);

        return new NextResponse(stream as any, {
            headers: {
                'Content-Type': mime,
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        logger.error(`Failed to fetch image: ${error}`);
        return new NextResponse('Not found', { status: 404 });
    }
}