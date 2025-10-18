import {NextResponse} from "next/server";
import {ZodError} from "zod";
import {AppError} from "@/lib/shared/errors";
import {logger} from "@/lib/server/logger";

export function handleApiError(error: unknown): NextResponse {
    if (error instanceof ZodError) {
        logger.error('API validation failed - invalid request data');
        return createErrorResponse('Invalid request data', 400);
    }

    if (error instanceof AppError) {
        logger.error(`API error - ${error.message}`);
        return createErrorResponse(error.message, error.statusCode)
    }

    logger.error('Unexpected API error occurred');
    return createErrorResponse('Internal server error', 500);
}

export function createSuccessResponse<T>(message: string, data: T, status: number = 200): NextResponse {
    return NextResponse.json({
        success: true,
        message: message,
        data: data
    }, {status});
}

export function createErrorResponse(message: string, status: number = 400): NextResponse {
    return NextResponse.json({
        success: false,
        error: message
    }, {status});
}

export function createActionResponse<T = unknown>(
    message: string,
    success: boolean,
    data?: T
) {
    return {
        message: message,
        success: success,
        data: data
    }
}