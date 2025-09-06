import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {haveUser} from '../../../helpers/user.helper';
import {cleanupDb} from '../../../helpers/db.helper';
import {UserDto} from "../../../../src/features/user/shared/user.types";
import {deleteUserAction, updateUserAction} from "../../../../src/features/user/server/user.action";

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

const mockGetCurrentUser = vi.fn();

vi.mock("../../../../src/features/user/server", async () => {
    const actual = await vi.importActual<
        typeof import("../../../../src/features/user/server")
    >("../../../../src/features/user/server");

    return {
        ...actual,
        getUserService: () => {
            const service = actual.getUserService();
            service.getCurrentUser = mockGetCurrentUser;

            return service;
        },
    };
});

describe('User Actions', () => {
    let testUser: UserDto;

    beforeEach(async () => {
        testUser = await haveUser({
            email: 'test@example.com',
            name: 'Test User',
        });
        
        mockGetCurrentUser.mockResolvedValue(testUser);
    });

    afterEach(async () => {
        await cleanupDb();
        vi.clearAllMocks();
    });

    describe('updateUserAction', () => {
        it('should update user', async () => {
            const userData = {
                name: 'Test User Update',
                image: 'http://127.0.0.1/image.png'
            };

            const result = await updateUserAction(userData);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully updated account.');
            expect(result.data).toBeDefined();
            expect(result.data?.name).toBe(userData.name);
            expect(result.data?.image).toBe(userData.image);
        });

        it('should return error when user is not authenticated', async () => {
            mockGetCurrentUser.mockResolvedValue(null);

            const result = await updateUserAction({
                id: testUser.id,
                name: 'Test User Update',
                image: 'http://127.0.0.1/image.png'
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to update account. Please try again.');
        });

        it('should handle validation errors', async () => {
            const result = await updateUserAction({
                id: testUser.id,
                name: '',
                image: 'http://127.0.0.1/image.png'
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to update account. Please try again.');
        });
    });

    describe('deleteUserAction', () => {
        it('should delete a user successfully', async () => {
            const result = await deleteUserAction();

            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully deleted account.');
            expect(result.data).toBeUndefined();
        });

        it('should return error when user is not authenticated', async () => {
            mockGetCurrentUser.mockResolvedValue(null);

            const result = await deleteUserAction();

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to delete account. Please try again.');
            expect(result.data).toBeUndefined();
        });
    });
});