import {describe, it, expect} from 'vitest'
import {
    createRoomSchema,
    updateRoomSchema,
    formRoomSchema,
    deleteRoomSchema
} from '../../../../src/features/room/shared/room.validations'

describe('Room Validation Schemas', () => {
    describe('createRoomSchema', () => {
        it('should validate valid room creation data', () => {
            const validData = {
                name: 'Sprint Planning',
                cardSetId: crypto.randomUUID(),
                userIds: [crypto.randomUUID()],
                ownerId: crypto.randomUUID(),
            }

            const result = createRoomSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should validate with empty userIds array (default)', () => {
            const validData = {
                name: 'Sprint Planning',
                cardSetId: crypto.randomUUID(),
                ownerId: crypto.randomUUID(),
            }

            const result = createRoomSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.userIds).toEqual([])
            }
        })

        it('should reject empty room name', () => {
            const invalidData = {
                name: '',
                cardSetId: crypto.randomUUID(),
                userIds: [],
                ownerId: crypto.randomUUID(),
            }

            const result = createRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Room name is required')
            }
        })

        it('should reject room name longer than 100 characters', () => {
            const invalidData = {
                name: 'a'.repeat(101),
                cardSetId: crypto.randomUUID(),
                userIds: [],
                ownerId: crypto.randomUUID(),
            }

            const result = createRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Room name too long')
            }
        })

        it('should reject invalid UUID for cardSetId', () => {
            const invalidData = {
                name: 'Sprint Planning',
                cardSetId: 'invalid-uuid',
                userIds: [],
                ownerId: crypto.randomUUID(),
            }

            const result = createRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid card set ID')
            }
        })

        it('should reject invalid UUID in userIds array', () => {
            const invalidData = {
                name: 'Sprint Planning',
                cardSetId: crypto.randomUUID(),
                userIds: ['invalid-uuid'],
                ownerId: crypto.randomUUID(),
            }

            const result = createRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid user ID')
            }
        })

        it('should reject invalid UUID for owner ID', () => {
            const invalidData = {
                name: 'Sprint Planning',
                cardSetId: crypto.randomUUID(),
                userIds: [crypto.randomUUID()],
                ownerId: 'invalid-uuid',
            }

            const result = createRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid owner ID')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = createRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(3)
            }
        })
    })

    describe('updateRoomSchema', () => {
        it('should validate valid room update data', () => {
            const validData = {
                id: crypto.randomUUID(),
                name: 'Updated Sprint Planning',
                cardSetId: crypto.randomUUID(),
                userIds: [crypto.randomUUID()],
                ownerId: crypto.randomUUID(),
            }

            const result = updateRoomSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should validate with default empty userIds', () => {
            const validData = {
                id: crypto.randomUUID(),
                name: 'Updated Sprint Planning',
                cardSetId: crypto.randomUUID(),
                ownerId: crypto.randomUUID(),
            }

            const result = updateRoomSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.userIds).toEqual([])
            }
        })

        it('should reject invalid room ID', () => {
            const invalidData = {
                id: 'invalid-uuid',
                name: 'Updated Sprint Planning',
                cardSetId: crypto.randomUUID(),
                userIds: [],
                ownerId: crypto.randomUUID(),
            }

            const result = updateRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid room ID')
            }
        })

        it('should reject invalid owner ID', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                name: 'Updated Sprint Planning',
                cardSetId: crypto.randomUUID(),
                userIds: [],
                ownerId: 'invalid-uuid',
            }

            const result = updateRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid owner ID')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {}

            const result = updateRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(4)
            }
        })
    })

    describe('formRoomSchema', () => {
        it('should validate valid room form data', () => {
            const validData = {
                id: crypto.randomUUID(),
                name: 'Updated Sprint Planning',
                cardSetId: crypto.randomUUID(),
                userIds: [crypto.randomUUID()],
            }

            const result = formRoomSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid room ID', () => {
            const invalidData = {
                id: 'invalid-uuid',
                name: 'Updated Sprint Planning',
                cardSetId: crypto.randomUUID(),
                userIds: [],
            }

            const result = formRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid room ID')
            }
        })

        it('should reject missing required fields', () => {
            const invalidData = {
                id: undefined,
            }

            const result = formRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues).toHaveLength(3)
            }
        })
    })

    describe('deleteRoomSchema', () => {
        it('should validate valid room deletion data', () => {
            const validData = {
                id: crypto.randomUUID(),
                ownerId: crypto.randomUUID(),
            }

            const result = deleteRoomSchema.safeParse(validData)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should reject invalid room ID', () => {
            const invalidData = {
                id: 'invalid-uuid',
                ownerId: crypto.randomUUID(),
            }

            const result = deleteRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid room ID')
            }
        })

        it('should reject invalid owner ID', () => {
            const invalidData = {
                id: crypto.randomUUID(),
                ownerId: 'invalid-uuid',
            }

            const result = deleteRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid owner ID')
            }
        })

        it('should reject missing ID field', () => {
            const invalidData = {}

            const result = deleteRoomSchema.safeParse(invalidData)

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].code).toBe('invalid_type')
            }
        })
    })
})