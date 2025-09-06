import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {haveUser} from '../../../helpers/user.helper';
import {haveCardSet} from '../../../helpers/card-set.helper';
import {cleanupDb} from '../../../helpers/db.helper';
import {UserDto} from "../../../../src/features/user/shared/user.types";
import {CardSetDto} from "../../../../src/features/card-set/shared/card-set.types";
import {RoomDto} from "../../../../src/features/room/shared/room.types";
import {haveRoom} from "../../../helpers/room.helper";
import {deleteRoomAction, persistRoomAction} from "../../../../src/features/room/server/room.actions";

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

const mockGetCurrentUser = vi.fn();

vi.mock('../../../../src/features/user/server', () => ({
    getUserService: () => ({
        getCurrentUser: mockGetCurrentUser,
    }),
}));

const mockEmit = vi.fn();
const mockTo = vi.fn(() => ({ emit: mockEmit }));
const mockIoInstance = vi.fn();

vi.mock('../../../../src/features/socket/server', () => ({
    getSocketService: () => ({
        getIoInstance: mockIoInstance,
    }),
}));

describe('Room Actions', () => {
    let testUser: UserDto;
    let testCardSet: CardSetDto;
    let testRoomDto: RoomDto;

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
        testRoomDto = await haveRoom({
            ownerId: testUser.id,
            name: 'Test Room',
            cardSetId: testCardSet.id,
        });
        
        mockGetCurrentUser.mockResolvedValue(testUser);
    });

    afterEach(async () => {
        await cleanupDb();
        vi.clearAllMocks();
    });

    describe('persistRoomAction', () => {
        it('should create a new room when no id is provided', async () => {
            const roomData = {
                name: 'New Room 2',
                cardSetId: testCardSet.id,
                userIds: [],
            };

            const result = await persistRoomAction(roomData);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully saved room.');
            expect(result.data).toBeDefined();
            expect(result.data?.name).toBe(roomData.name);
            expect(result.data?.cardSetId).toEqual(roomData.cardSetId);
        });

        it('should update an existing room when id is provided', async () => {
            const roomData = {
                id: testRoomDto.id,
                name: 'New Room Updated',
                cardSetId: testCardSet.id,
                userIds: [],
            };

            const result = await persistRoomAction(roomData);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully saved room.');
            expect(result.data).toBeDefined();
            expect(result.data?.id).toBe(testRoomDto.id);
            expect(result.data?.name).toBe(roomData.name);
            expect(result.data?.cardSetId).toEqual(roomData.cardSetId);
        });

        it('should return error when user is not authenticated', async () => {
            mockGetCurrentUser.mockResolvedValue(null);

            const result = await persistRoomAction({
                name: 'New Room Updated',
                cardSetId: testCardSet.id,
                userIds: [],
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to persist room. Please try again.');
        });

        it('should handle validation errors', async () => {
            const result = await persistRoomAction({
                name: '',
                cardSetId: testCardSet.id,
                userIds: [],
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to persist room. Please try again.');
        });
    });

    describe('deleteRoomAction', () => {
        it('should delete a room successfully', async () => {
            mockIoInstance.mockReturnValue({ to: mockTo });

            const result = await deleteRoomAction(testRoomDto.id);

            expect(mockIoInstance).toHaveBeenCalled();
            expect(mockTo).toHaveBeenCalledWith(testRoomDto.id);
            expect(mockEmit).toHaveBeenCalledWith('room', null);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Successfully deleted room.');
            expect(result.data).toBe(testRoomDto.id);
        });

        it('should return error when user is not authenticated', async () => {
            mockGetCurrentUser.mockResolvedValue(null);

            const result = await deleteRoomAction(testRoomDto.id);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to delete room. Please try again.');
            expect(result.data).toBe(testRoomDto.id);
        });

        it('should return error when trying to delete non-existent card set', async () => {
            const result = await deleteRoomAction('non-existent-id');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to delete room. Please try again.');
            expect(result.data).toBe('non-existent-id');
        });
    });
});