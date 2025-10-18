import {describe, it, expect, vi, beforeEach} from 'vitest'
import {ZodError} from 'zod'
import {NextResponse} from 'next/server'
import {handleApiError, createErrorResponse, createSuccessResponse} from '../../../../src/lib/server/utils'
import {logger} from '../../../../src/lib/server/logger'
import {NotFoundError} from "../../../../src/lib/shared/errors";

// Mock logger
vi.mock('../../../../src/lib/server/logger', () => ({
    logger: {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn()
    }
}))

vi.mock('next/server', () => ({
    NextResponse: {
        json: vi.fn((data, options) => ({data, options})),
    },
}))

describe('API Utils', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('handleApiError', () => {
        it('should handle Zod validation errors', () => {
            const zodError = new ZodError([
                {
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'number',
                    path: ['name'],
                    message: 'Expected string, received number',
                },
                {
                    code: 'too_small',
                    minimum: 1,
                    type: 'string',
                    inclusive: true,
                    path: ['email'],
                    message: 'String must contain at least 1 character(s)',
                },
            ])

            const result = handleApiError(zodError)

            expect(logger.error).toHaveBeenCalledWith('API validation failed - invalid request data')
            expect(NextResponse.json).toHaveBeenCalledWith(
                {
                    error: 'Invalid request data',
                    success: false
                },
                {status: 400}
            )
        })

        it('should handle nested Zod validation errors', () => {
            const zodError = new ZodError([
                {
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    path: ['user', 'profile', 'name'],
                    message: 'Required',
                },
            ])

            // Act
            const result = handleApiError(zodError)

            expect(NextResponse.json).toHaveBeenCalledWith(
                {
                    error: 'Invalid request data',
                    success: false
                },
                {status: 400}
            )
        })

        it('should handle custom AppError instances', () => {
            const appError = new NotFoundError('UserRepository')

            const result = handleApiError(appError)

            expect(logger.error).toHaveBeenCalledWith('API error - UserRepository not found')
            expect(NextResponse.json).toHaveBeenCalledWith(
                {error: 'UserRepository not found', success: false},
                {status: 404}
            )
        })

        it('should handle unexpected errors', () => {
            const unexpectedError = new Error('Database connection failed')

            const result = handleApiError(unexpectedError)

            expect(logger.error).toHaveBeenCalledWith('Unexpected API error occurred')
            expect(NextResponse.json).toHaveBeenCalledWith(
                {error: 'Internal server error', success: false},
                {status: 500}
            )
        })

        it('should handle string errors', () => {
            const stringError = 'Something went wrong'

            const result = handleApiError(stringError)

            expect(logger.error).toHaveBeenCalledWith('Unexpected API error occurred')
            expect(NextResponse.json).toHaveBeenCalledWith(
                {error: 'Internal server error', success: false},
                {status: 500}
            )
        })

        it('should handle null/undefined errors', () => {
            const nullResult = handleApiError(null)
            const undefinedResult = handleApiError(undefined)

            expect(logger.error).toHaveBeenCalledTimes(2)
            expect(logger.error).toHaveBeenCalledWith('Unexpected API error occurred')
            expect(NextResponse.json).toHaveBeenCalledWith(
                {error: 'Internal server error', success: false},
                {status: 500}
            )
        })
    })

    describe('createErrorResponse', () => {
        it('should create error response with default status', () => {
            const message = 'Something went wrong'

            const result = createErrorResponse(message)

            expect(NextResponse.json).toHaveBeenCalledWith(
                {error: message, success: false},
                {status: 400}
            )
        })

        it('should create error response with custom status', () => {
            const message = 'Unauthorized access'

            const result = createErrorResponse(message, 401)

            expect(NextResponse.json).toHaveBeenCalledWith(
                {error: message, success: false},
                {status: 401}
            )
        })

        it('should handle empty error message', () => {
            const result = createErrorResponse('')

            expect(NextResponse.json).toHaveBeenCalledWith(
                {error: '', success: false},
                {status: 400}
            )
        })
    })

    describe('createSuccessResponse', () => {
        it('should create successful response with default status', () => {
            const data = {id: '1', name: 'Test'}

            const result = createSuccessResponse('message', data)

            expect(NextResponse.json).toHaveBeenCalledWith({
                message: 'message',
                data: data,
                success: true,
            }, {status: 200})
        })

        it('should create successful response with custom status', () => {
            const data = {id: '1', name: 'Test'}

            const result = createSuccessResponse('message', data, 201)

            expect(NextResponse.json).toHaveBeenCalledWith({
                message: 'message',
                data: data,
                success: true,
            }, {status: 201})
        })

        it('should handle null data', () => {
            const result = createSuccessResponse('message', null)

            expect(NextResponse.json).toHaveBeenCalledWith({
                message: 'message',
                data: null,
                success: true,
            }, {status: 200})
        })

        it('should handle array data', () => {
            const data = [{id: '1'}, {id: '2'}]

            const result = createSuccessResponse('message', data)

            expect(NextResponse.json).toHaveBeenCalledWith({
                message: 'message',
                data: data,
                success: true,
            }, {status: 200})
        })
    })
})