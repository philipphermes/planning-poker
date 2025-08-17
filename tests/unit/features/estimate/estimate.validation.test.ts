import {describe, it, expect} from 'vitest'
import {
    submitEstimateSchema,
    submitEstimateFormSchema,
} from '../../../../src/features/estimate/shared/estimate.validations'

describe('Estimate Validation Schemas', () => {
    describe('submitEstimateSchema', () => {
        it('should validate valid estimate submission data', () => {
            const validData = {
                userId: crypto.randomUUID(),
                roundId: crypto.randomUUID(),
                value: '5',
            }

            const result = submitEstimateSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should validate various estimate values', () => {
            const testCases = [
                {userId: crypto.randomUUID(), roundId: crypto.randomUUID(), value: '1'},
                {userId: crypto.randomUUID(), roundId: crypto.randomUUID(), value: '13'},
                {userId: crypto.randomUUID(), roundId: crypto.randomUUID(), value: 'XL'},
                {userId: crypto.randomUUID(), roundId: crypto.randomUUID(), value: '?'},
                {userId: crypto.randomUUID(), roundId: crypto.randomUUID(), value: '∞'},
            ]

            testCases.forEach(testCase => {
                const result = submitEstimateSchema.safeParse(testCase)
                expect(result.success).toBe(true)
            })
        })

        it('should reject invalid UUID for roundId', () => {
            const invalidData = {
                userId: crypto.randomUUID(),
                roundId: 'invalid-uuid',
                value: '5',
            }

            const result = submitEstimateSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid round ID')
            }
        })

        it('should reject invalid UUID for userId', () => {
            const invalidData = {
                roundId: crypto.randomUUID(),
                userId: 'invalid-uuid',
                value: '5',
            }

            const result = submitEstimateSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid user ID')
            }
        })

        it('should reject empty estimate value', () => {
            const invalidData = {
                userId: crypto.randomUUID(),
                roundId: crypto.randomUUID(),
                value: '',
            }

            const result = submitEstimateSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Estimate value is required')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = submitEstimateSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(3)
            }
        })
    })

    describe('submitEstimateFormSchema', () => {
        it('should validate valid estimate submission data', () => {
            const validData = {
                roundId: crypto.randomUUID(),
                value: '5',
            }

            const result = submitEstimateFormSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should validate various estimate values', () => {
            const testCases = [
                {roundId: crypto.randomUUID(), value: '1'},
                {roundId: crypto.randomUUID(), value: '13'},
                {roundId: crypto.randomUUID(), value: 'XL'},
                {roundId: crypto.randomUUID(), value: '?'},
                {roundId: crypto.randomUUID(), value: '∞'},
            ]

            testCases.forEach(testCase => {
                const result = submitEstimateFormSchema.safeParse(testCase)
                expect(result.success).toBe(true)
            })
        })

        it('should reject invalid UUID for roundId', () => {
            const invalidData = {
                roundId: 'invalid-uuid',
                value: '5',
            }

            const result = submitEstimateFormSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid round ID')
            }
        })

        it('should reject empty estimate value', () => {
            const invalidData = {
                roundId: crypto.randomUUID(),
                value: '',
            }

            const result = submitEstimateFormSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Estimate value is required')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = submitEstimateFormSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(2)
            }
        })
    })
})