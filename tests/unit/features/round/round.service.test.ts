import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {haveRoomParticipants} from "../../../helpers/room-participants.helper";
import {haveRoom} from "../../../helpers/room.helper";
import {haveCardSet} from "../../../helpers/card-set.helper";
import {haveUser} from "../../../helpers/user.helper";
import {haveRound} from "../../../helpers/round.helper";
import {cleanupDb} from "../../../helpers/db.helper";
import {IRoundService} from "../../../../src/features/round/server/round.service.interface";
import {getRoundService} from "../../../../src/features/round/server";

describe('RoundService', () => {
    let service: IRoundService;

    beforeEach(async () => {
        service = getRoundService();
    })

    afterEach(async () => {
        await cleanupDb();
    })

    describe('createRound', () => {
        it('should create round', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id});

            const round = await service.create({
                roomId: room.id,
                ownerId: user.id,
                name: 'test round',
            })

            expect(round.id).not.toBeNull();
        });
    })

    describe('updateRound', () => {
        it('should update round', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id});
            const round = await haveRound({roomId: room.id, name: 'test round', status: 'active'});

            const roundUpdated = await service.update(round)

            expect(roundUpdated.status).toEqual('completed')
        });

        it('should throw error when id is not provided', async () => {
            await expect(service.update({}))
                .rejects
                .toThrow('Id required');
        });
    })

    describe('getCurrentRound', () => {
        it('should get current round', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room.id, userId: user.id});
            await haveRound({roomId: room.id, name: 'test round 1', status: 'inactive'});
            const round_2 = await haveRound({roomId: room.id, name: 'test round 2', status: 'active'});

            const currentRound = await service.getCurrentByRoomIdAndUserId(room.id, user.id)

            expect(currentRound.id).toEqual(round_2.id)
        });

        it('should get null when there is no current round', async () => {
            const currentRound = await service.getCurrentByRoomIdAndUserId('test', 'test')

            expect(currentRound).toBeNull()
        });
    })

    describe('getRoundById', () => {
        it('should get round by id', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room.id, userId: user.id});
            await haveRound({roomId: room.id, name: 'test round 1', status: 'inactive'});
            const round_2 = await haveRound({roomId: room.id, name: 'test round 2', status: 'active'});

            const currentRound = await service.getOneByIdAndUserId(round_2.id, user.id)

            expect(currentRound.id).toEqual(round_2.id)
        });

        it('should get null when no round was found', async () => {
            const currentRound = await service.getOneByIdAndUserId('test', 'test')

            expect(currentRound).toBeNull()
        });
    })

    describe('getRoundByOwnerId', () => {
        it('should get round by id and owner', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id});
            const round = await haveRound({roomId: room.id, name: 'test round 1', status: 'inactive'});

            const roundByOwner = await service.getOneIdAndOwnerId({
                id: round.id,
                ownerId: user.id,
            });

            expect(roundByOwner.id).toEqual(round.id)
        });

        it('should get null when id not given', async () => {
            const roundByOwner = await service.getOneIdAndOwnerId({ownerId: 'test'});

            expect(roundByOwner).toBeNull();
        });

        it('should get null when round not found', async () => {
            const roundByOwner = await service.getOneIdAndOwnerId({
                id: 'test',
                ownerId: 'test',
            });

            expect(roundByOwner).toBeNull();
        });
    })
});