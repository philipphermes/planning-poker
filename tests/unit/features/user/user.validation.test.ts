import {describe, it, expect} from 'vitest'
import {
    userUpdateScheme,
    userDeleteScheme,
} from '../../../../src/features/user/shared/user.validations'

describe('UserRepository Validation Schemas', () => {
    describe('userUpdateScheme', () => {
        it('should validate valid user update schema data', () => {
            const validData = {
                id: crypto.randomUUID(),
                name: 'User',
                image: 'http://test/img.png',
            }

            const result = userUpdateScheme.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for ID', () => {
            const invalidData = {
                id: 'invalid-id',
                name: 'User',
                image: 'http://test/img.png',
            }

            const result = userUpdateScheme.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid user ID')
            }
        })

        it('should reject empty user name', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'a',
                image: 'http://test/img.png',
            }

            const result = userUpdateScheme.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Name required')
            }
        })

        it('should reject user name longer than 100 characters', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'a'.repeat(101),
                image: 'http://test/img.png',
            }

            const result = userUpdateScheme.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Name to long')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = userUpdateScheme.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(2)
            }
        })
    })
    describe('userDeleteScheme', () => {
        it('should validate valid user delete schema data', () => {
            const validData = {
                id: crypto.randomUUID(),
            }

            const result = userDeleteScheme.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for ID', () => {
            const invalidData = {
                id: 'invalid-id',
            }

            const result = userDeleteScheme.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid user ID')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = userDeleteScheme.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(1)
            }
        })
    })
})