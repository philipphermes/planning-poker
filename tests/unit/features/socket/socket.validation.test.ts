import {describe, it, expect} from 'vitest'
import {
    socketConnectionSchema,
} from '../../../../src/features/socket/shared/socket.validations'

describe('Socket Validation Schemas', () => {
    describe('socketConnectionSchema', () => {
        it('should validate valid socket connection schema data', () => {
            const validData = {
                userId: crypto.randomUUID(),
                roomId: crypto.randomUUID(),
            }

            const result = socketConnectionSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid UUID for user ID', () => {
            const invalidData = {
                userId: 'invalid-id',
                roomId: crypto.randomUUID(),
            }

            const result = socketConnectionSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid user ID')
            }
        })

        it('should reject invalid UUID for room ID', () => {
            const invalidData = {
                userId: crypto.randomUUID(),
                roomId: 'invalid-id',
            }

            const result = socketConnectionSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid room ID')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = socketConnectionSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(2)
            }
        })
    })
})