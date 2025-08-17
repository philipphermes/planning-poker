import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {haveUser} from '../../../helpers/user.helper';
import {haveCardSet} from '../../../helpers/card-set.helper';
import {cleanupDb} from '../../../helpers/db.helper';
import {UserDto} from "../../../../src/features/user/shared/user.types";
import {CardSetDto} from "../../../../src/features/card-set/shared/card-set.types";
import {deleteCardSetAction, persistCardSetAction} from "../../../../src/features/card-set/server/card-set.actions";

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

const mockGetCurrentUser = vi.fn();

vi.mock('../../../../src/features/user/server', () => ({
    getUserService: () => ({
        getCurrentUser: mockGetCurrentUser,
    }),
}));

describe('CardSet Actions', () => {
    let testUser: UserDto;
    let testCardSet: CardSetDto;

    beforeEach(async () => {
        testUser = await haveUser({
            email: 'test@example.com',
            name: 'Test User',
        });
        testCardSet = await haveCardSet({
            userId: testUser.id,
            name: 'Test Card Set',
            cards: ['1', '2', '3', '5'],
        });
        
        mockGetCurrentUser.mockResolvedValue(testUser);
    });

    afterEach(async () => {
        await cleanupDb();
        vi.clearAllMocks();
    });

    describe('persistCardSetAction', () => {
        it('should create a new card set when no id is provided', async () => {
            const cardSetData = {
                name: 'New Test Card Set',
                cards: [{value: '1'}, {value: '2'}, {value: '3'}],
            };

            const result = await persistCardSetAction(cardSetData);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully saved card set.');
            expect(result.data).toBeDefined();
            expect(result.data?.name).toBe(cardSetData.name);
            expect(result.data?.cards).toEqual(['1', '2', '3']);
        });

        it('should update an existing card set when id is provided', async () => {
            const cardSetData = {
                id: testCardSet.id,
                name: 'Updated Card Set',
                cards: [{value: '1'}, {value: '2'}, {value: '3'}, {value: '5'}],
            };

            const result = await persistCardSetAction(cardSetData);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully saved card set.');
            expect(result.data).toBeDefined();
            expect(result.data?.id).toBe(testCardSet.id);
            expect(result.data?.name).toBe(cardSetData.name);
            expect(result.data?.cards).toEqual(['1', '2', '3', '5']);
        });

        it('should return error when user is not authenticated', async () => {
            mockGetCurrentUser.mockResolvedValue(null);

            const result = await persistCardSetAction({
                name: 'Test Card Set',
                cards: [{value: '1'}, {value: '2'}, {value: '3'}],
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to persist card set. Please try again.');
        });

        it('should handle validation errors', async () => {
            const result = await persistCardSetAction({
                name: '', // Invalid name
                cards: [],
            } as any);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to persist card set. Please try again.');
        });
    });

    describe('deleteCardSetAction', () => {
        it('should delete a card set successfully', async () => {
            const result = await deleteCardSetAction(testCardSet.id);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully deleted card set.');
            expect(result.data).toBeUndefined();
        });

        it('should return error when user is not authenticated', async () => {
            mockGetCurrentUser.mockResolvedValue(null);

            const result = await deleteCardSetAction(testCardSet.id);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to delete card set. Please try again.');
            expect(result.data).toBeUndefined();
        });

        it('should return error when trying to delete non-existent card set', async () => {
            const result = await deleteCardSetAction('non-existent-id');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to delete card set. Please try again.');
            expect(result.data).toBeUndefined();
        });
    });
});