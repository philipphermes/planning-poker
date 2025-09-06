import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {haveRoom} from "../../../helpers/room.helper";
import {haveCardSet} from "../../../helpers/card-set.helper";
import {haveUser} from "../../../helpers/user.helper";
import {haveRoomParticipants} from "../../../helpers/room-participants.helper";
import {haveRound} from "../../../helpers/round.helper";
import {haveEstimate} from "../../../helpers/estimate.helper";
import {cleanupDb} from "../../../helpers/db.helper";
import {IRoomService} from "../../../../src/features/room/server/room.service.interface";
import {getRoomService} from "../../../../src/features/room/server";

describe('RoomService', () => {
    let service: IRoomService

    beforeEach(async () => {
        service = getRoomService();
    })

    afterEach(async () => {
        await cleanupDb()
    })

    describe('getRoomsByOwner', () => {
        it('returns rooms by owner with owner, cardSet and participants', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const participant = await haveUser({email: 'test2@email.com'});
            const cardSet = await haveCardSet({userId: user.id});

            const room_1 = await haveRoom({ownerId: user.id, name: 'test 1', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room_1.id, userId: participant.id});

            const room_2 = await haveRoom({ownerId: user.id, name: 'test 2', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room_2.id, userId: participant.id});

            const result = await service.getManyByOwnerId(user.id)

            expect(result).toHaveLength(2)
        })

        it('returns empty array by owner when nothing was found', async () => {
            const result = await service.getManyByOwnerId('test')

            expect(result).toHaveLength(0)
        })
    })

    describe('getRoomsByUser', () => {
        it('returns rooms by user with owner, cardSet and participants', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const participant = await haveUser({email: 'test2@email.com'});
            const cardSet = await haveCardSet({userId: user.id});

            const room_1 = await haveRoom({ownerId: user.id, name: 'test 1', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room_1.id, userId: participant.id});

            const room_2 = await haveRoom({ownerId: user.id, name: 'test 2', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room_2.id, userId: participant.id});

            const result = await service.getManyByUserId(participant.id)

            expect(result).toHaveLength(2)
        })

        it('returns empty array by user when nothing was found', async () => {
            const result = await service.getManyByUserId('test')

            expect(result).toEqual([])
        })
    })

    describe('getRoomByUser', () => {
        it('returns room by user with owner, cardSet and participants', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const participant = await haveUser({email: 'test2@email.com'});
            const cardSet = await haveCardSet({userId: user.id});

            const room = await haveRoom({ownerId: user.id, name: 'test 1', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room.id, userId: participant.id});

            const result = await service.getOneByIdAndUserId(room.id, participant.id)

            expect(result.name).toEqual('test 1')
        })

        it('returns room by owner with owner, cardSet and participants', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const participant = await haveUser({email: 'test2@email.com'});
            const cardSet = await haveCardSet({userId: user.id});

            const room = await haveRoom({ownerId: user.id, name: 'test 1', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room.id, userId: participant.id});

            const result = await service.getOneByIdAndUserId(room.id, user.id)

            expect(result.name).toEqual('test 1')
        })

        it('return null by user when nothing was found', async () => {
            const result = await service.getOneByIdAndUserId('room-123', 'user-123')

            expect(result).toEqual(null)
        })
    })

    describe('createRoom', () => {
        it('should create a new room', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const participant = await haveUser({email: 'test2@email.com'});
            const cardSet = await haveCardSet({userId: user.id});

            const result = await service.create({
                ownerId: user.id,
                name: 'test create',
                userIds: [participant.id],
                cardSetId: cardSet.id,
            })

            //TODO test participants
            expect(result).not.toBeNull()
        })

        it('should create room without participants only owner', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});

            const result = await service.create({
                ownerId: user.id,
                name: 'test create',
                userIds: [],
                cardSetId: cardSet.id,
            })

            //TODO test participants
            expect(result).not.toBeNull()
        })
    })

    describe('updateRoom', () => {
        it('should update room', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const participant = await haveUser({email: 'test2@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test new', cardSetId: cardSet.id});

            const result = await service.update({
                id: room.id,
                ownerId: user.id,
                name: 'test update',
                userIds: [participant.id],
                cardSetId: cardSet.id,
            })

            //TODO test participants
            expect(result.id).toEqual(room.id)
            expect(result.name).toEqual('test update')
        })

        it('should update room without participants only owner', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test new', cardSetId: cardSet.id});

            const result = await service.update({
                id: room.id,
                ownerId: user.id,
                name: 'test update',
                userIds: [],
                cardSetId: cardSet.id,
            })

            //TODO test participants
            expect(result.id).toEqual(room.id)
            expect(result.name).toEqual('test update')
        })
    })

    describe('deleteRoom', () => {
        it('should delete room and all related data', async () => {
            const user = await haveUser({email: 'test1@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test', cardSetId: cardSet.id});
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'active'})
            await haveEstimate({roundId: round.id, userId: user.id, value: '5'})

            await service.delete({
                id: room.id,
                ownerId: user.id,
            })

            const roomThatShouldNotExists = await service.getOneByIdAndUserId(room.id, user.id);

            expect(roomThatShouldNotExists).toBeNull();
        })

        it('should not delete room when room is not assigned to owner', async () => {
            const user = await haveUser({email: 'test1@email.com'});
            const user2 = await haveUser({email: 'test2@email.com'});

            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test', cardSetId: cardSet.id});
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'active'})
            await haveEstimate({roundId: round.id, userId: user.id, value: '5'})

            try {
                await service.delete({
                    id: room.id,
                    ownerId: user2.id,
                })
            } catch (error) {
                expect(error.message).toEqual('Room not found');
            }
        })
    })

    describe('getRoomByOwnerForExport', () => {
        it('returns room by owner with rounds, estimations and users', async () => {
            const user = await haveUser({email: 'test1@email.com'});
            const user2 = await haveUser({email: 'test2@email.com'});

            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test', cardSetId: cardSet.id});
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'active'})

            await haveRoomParticipants({roomId: room.id, userId: user.id});
            await haveRoomParticipants({roomId: room.id, userId: user2.id});

            await haveEstimate({roundId: round.id, userId: user.id, value: '5'})
            await haveEstimate({roundId: round.id, userId: user2.id, value: '5'})

            const result = await service.getOneByIdAndOwnerIdForExport(room.id, user.id);

            expect(result.rounds[0].estimates).toHaveLength(2)
        })

        it('return null by owner when nothing was found', async () => {
            const result = await service.getOneByIdAndOwnerIdForExport('room-123', 'owner-123')

            expect(result).toEqual(null)
        })
    })

    describe('roomsHaveCardSet', () => {
        it('should return true when card set is related to rooms', async () => {
            const user = await haveUser({email: 'test1@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            await haveRoom({ownerId: user.id, name: 'test', cardSetId: cardSet.id});

            const result = await service.isCardSetInRoom(cardSet.id)

            expect(result).toEqual(true)
        })

        it('should return false when card set is not related to rooms', async () => {
            const user = await haveUser({email: 'test1@email.com'});
            const cardSet = await haveCardSet({userId: user.id});

            const result = await service.isCardSetInRoom(cardSet.id)

            expect(result).toEqual(false)
        })
    })
})