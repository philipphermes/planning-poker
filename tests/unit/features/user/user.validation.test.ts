import {describe, it, expect} from 'vitest'
import {
    userUpdateNameSchema,
    userDeleteScheme, userUpdateImageSchema,
} from '../../../../src/features/user/shared/user.validations'

describe('UserRepository Validation Schemas', () => {
    describe('userUpdateNameScheme', () => {
        it('should validate valid user update schema data', () => {
            const validData = {
                id: crypto.randomUUID(),
                name: 'User',
            }

            const result = userUpdateNameSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for ID', () => {
            const invalidData = {
                id: 'invalid-id',
                name: 'User',
            }

            const result = userUpdateNameSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid user ID')
            }
        })

        it('should reject empty user name', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'a',
            }

            const result = userUpdateNameSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Name required')
            }
        })

        it('should reject user name longer than 100 characters', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'a'.repeat(101),
            }

            const result = userUpdateNameSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Name to long')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = userUpdateNameSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(2)
            }
        })
    })
    describe('userUpdateImageScheme', () => {
        it('should validate valid user update schema data', () => {
            const validData = {
                id: crypto.randomUUID(),
                image: '/uploads/user.png',
            }

            const result = userUpdateImageSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for ID', () => {
            const invalidData = {
                id: 'invalid-id',
                image: '/uploads/user.png',
            }

            const result = userUpdateImageSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid user ID')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = userUpdateImageSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(1)
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