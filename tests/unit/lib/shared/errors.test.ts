import {describe, it, expect} from 'vitest'
import {
    AppError,
    NotFoundError,
    ConflictError
} from '../../../../src/lib/shared/errors'

describe('Custom Error Classes', () => {
    describe('AppError', () => {
        it('should create error with default values', () => {
            // Act
            const error = new AppError('Something went wrong')

            // Assert
            expect(error.message).toBe('Something went wrong')
            expect(error.statusCode).toBe(500)
            expect(error.code).toBeUndefined()
            expect(error.name).toBe('AppError')
            expect(error).toBeInstanceOf(Error)
        })

        it('should create error with custom status code and code', () => {
            // Act
            const error = new AppError('Custom error', 418, 'CUSTOM_ERROR')

            // Assert
            expect(error.message).toBe('Custom error')
            expect(error.statusCode).toBe(418)
            expect(error.code).toBe('CUSTOM_ERROR')
            expect(error.name).toBe('AppError')
        })

        it('should have proper stack trace', () => {
            // Act
            const error = new AppError('Test error')

            // Assert
            expect(error.stack).toBeDefined()
            expect(error.stack).toContain('AppError')
        })
    })

    describe('NotFoundError', () => {
        it('should create not found error with default resource', () => {
            // Act
            const error = new NotFoundError()

            // Assert
            expect(error.message).toBe('Resource not found')
            expect(error.statusCode).toBe(404)
            expect(error.code).toBe('NOT_FOUND')
            expect(error.name).toBe('NotFoundError')
            expect(error).toBeInstanceOf(AppError)
        })

        it('should create not found error with custom resource', () => {
            // Act
            const error = new NotFoundError('UserRepository')

            // Assert
            expect(error.message).toBe('UserRepository not found')
            expect(error.statusCode).toBe(404)
            expect(error.code).toBe('NOT_FOUND')
            expect(error.name).toBe('NotFoundError')
        })
    })

    describe('ConflictError', () => {
        it('should create conflict error with correct properties', () => {
            // Act
            const error = new ConflictError('Resource already exists')

            // Assert
            expect(error.message).toBe('Resource already exists')
            expect(error.statusCode).toBe(409)
            expect(error.code).toBe('CONFLICT')
            expect(error.name).toBe('ConflictError')
            expect(error).toBeInstanceOf(AppError)
        })
    })

    describe('Error inheritance', () => {
        it('should maintain proper inheritance chain for all error types', () => {
            // Arrange
            const errors = [
                new NotFoundError('test'),
                new ConflictError('test'),
            ]

            // Act & Assert
            errors.forEach(error => {
                expect(error).toBeInstanceOf(Error)
                expect(error).toBeInstanceOf(AppError)
                expect(error.statusCode).toBeGreaterThanOrEqual(400)
                expect(error.statusCode).toBeLessThan(600)
                expect(error.code).toBeDefined()
                expect(error.name).toBeDefined()
            })
        })
    })
})