import {describe, it, expect} from 'vitest'
import {
    roundInputSchema,
    roundSchemaInputFormSchema,
} from '../../../../src/features/round/shared/round.validations'

describe('Round Validation Schemas', () => {
    describe('roundInputSchema', () => {
        it('should validate valid round input schema data', () => {
            const validData = {
                id: crypto.randomUUID(),
                name: 'Round',
                roomId: crypto.randomUUID(),
                ownerId: crypto.randomUUID(),
            }

            const result = roundInputSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for id', () => {
            const invalidData = {
                id: 'invalid-id',
                name: 'Round',
                roomId: crypto.randomUUID(),
                ownerId: crypto.randomUUID(),
            }

            const result = roundInputSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid round ID')
            }
        })

        it('should reject invalid UUID for roomId', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'Round',
                roomId: 'invalid-id',
                ownerId: crypto.randomUUID(),
            }

            const result = roundInputSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid room ID')
            }
        })

        it('should reject invalid UUID for ownerId', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'Round',
                roomId: crypto.randomUUID(),
                ownerId: 'invalid-id',
            }

            const result = roundInputSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid owner ID')
            }
        })

        it('should reject empty round name', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: '',
                roomId: crypto.randomUUID(),
                ownerId: crypto.randomUUID(),
            }

            const result = roundInputSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Round name is required')
            }
        })

        it('should reject round name longer than 100 characters', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'a'.repeat(101),
                roomId: crypto.randomUUID(),
                ownerId: crypto.randomUUID(),
            }

            const result = roundInputSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Round name too long')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {
                id: undefined,
            }

            const result = roundInputSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(3)
            }
        })
    })

    describe('roundSchemaInputFormSchema', () => {
        it('should validate valid round input form schema data', () => {
            const validData = {
                id: crypto.randomUUID(),
                name: 'Round',
                roomId: crypto.randomUUID(),
            }

            const result = roundSchemaInputFormSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for id', () => {
            const invalidData = {
                id: 'invalid-id',
                name: 'Round',
                roomId: crypto.randomUUID(),
            }

            const result = roundSchemaInputFormSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid round ID')
            }
        })

        it('should reject invalid UUID for roomId', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'Round',
                roomId: 'invalid-id',
            }

            const result = roundSchemaInputFormSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid room ID')
            }
        })

        it('should reject empty round name', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: '',
                roomId: crypto.randomUUID(),
            }

            const result = roundSchemaInputFormSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Round name is required')
            }
        })

        it('should reject round name longer than 100 characters', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'a'.repeat(101),
                roomId: crypto.randomUUID(),
            }

            const result = roundSchemaInputFormSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Round name too long')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {
                id: undefined,
            }

            const result = roundSchemaInputFormSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(2)
            }
        })
    })
})