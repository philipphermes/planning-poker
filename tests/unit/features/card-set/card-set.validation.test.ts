import {describe, it, expect} from 'vitest'
import {
    persistCardSetSchema,
    deleteCardSetSchema
} from '../../../../src/features/card-set/shared/card-set.validations'

describe('Card Set Validation Schemas', () => {
    describe('persistCardSetSchema', () => {
        it('should validate valid card set creation data', () => {
            const validData = {
                name: 'Fibonacci Sequence',
                cards: ['1', '2', '3', '5', '8', '13', '21'],
                ownerId: crypto.randomUUID(),
            }

            const result = persistCardSetSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should validate single card in array', () => {
            const validData = {
                name: 'Single Card',
                cards: ['1'],
                ownerId: crypto.randomUUID(),
            }

            const result = persistCardSetSchema.safeParse(validData)

            expect(result.success).toBe(true)
        })

        it('should reject empty card set name', () => {
            const invalidData = {
                name: '',
                cards: ['1', '2', '3'],
                ownerId: crypto.randomUUID(),
            }

            const result = persistCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Card set name is required')
            }
        })

        it('should reject card set name longer than 100 characters', () => {
            const invalidData = {
                name: 'a'.repeat(101),
                cards: ['1', '2', '3'],
                ownerId: crypto.randomUUID(),
            }

            const result = persistCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Card set name too long')
            }
        })

        it('should reject empty cards array', () => {
            const invalidData = {
                name: 'Empty Cards',
                cards: [],
                ownerId: crypto.randomUUID(),
            }

            const result = persistCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('At least one card is required')
            }
        })

        it('should reject invalid UUID for ownerId', () => {
            const invalidData = {
                name: 'Empty Cards',
                cards: ['1', '2', '3'],
                ownerId: 'invalid-uuid',
            }

            const result = persistCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid owner ID')
            }
        })

        it('should reject missing required fields', () => {
            // Arrange
            const invalidData = {}

            // Act
            const result = persistCardSetSchema.safeParse(invalidData)

            // Assert
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(3)
            }
        })
    })

    describe('updateCardSetSchema', () => {
        it('should validate valid card set update data', () => {
            const validData = {
                id:  crypto.randomUUID(),
                name: 'Updated Fibonacci',
                cards: ['0', '1', '2', '3', '5', '8'],
                ownerId: crypto.randomUUID(),
            }

            const result = persistCardSetSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for id', () => {
            const invalidData = {
                id: 'invalid-uuid',
                name: 'Updated Fibonacci',
                cards: ['1', '2', '3'],
                ownerId: crypto.randomUUID(),
            }

            const result = persistCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid card set ID')
            }
        })

        it('should reject invalid UUID for ownerId', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'Updated Fibonacci',
                cards: ['1', '2', '3'],
                ownerId: 'invalid-uuid',
            }

            const result = persistCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid owner ID')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {
                id:  crypto.randomUUID(),
            }

            const result = persistCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(3)
            }
        })
    })

    describe('deleteCardSetSchema', () => {
        it('should validate valid card set deletion data', () => {
            const validData = {
                id: crypto.randomUUID(),
                ownerId: crypto.randomUUID(),
            }

            const result = deleteCardSetSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for id', () => {
            const invalidData = {
                id: 'invalid-uuid',
                ownerId: crypto.randomUUID(),
            }

            const result = deleteCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid card set ID')
            }
        })

        it('should reject invalid UUID for id', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                ownerId: 'invalid-uuid',
            }

            const result = deleteCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid owner ID')
            }
        })

        it('should reject missing ID field', () => {
            const invalidData = {}

            const result = deleteCardSetSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(2)
            }
        })
    })
})