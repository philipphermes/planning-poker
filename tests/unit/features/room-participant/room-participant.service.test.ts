import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {haveRoomParticipants} from "../../../helpers/room-participants.helper";
import {haveRoom} from "../../../helpers/room.helper";
import {haveCardSet} from "../../../helpers/card-set.helper";
import {haveUser} from "../../../helpers/user.helper";
import {cleanupDb} from "../../../helpers/db.helper";
import {
    IRoomParticipantService
} from "../../../../src/features/room-participant/server/room-participant.service.interface";
import {getRoomParticipantService} from "../../../../src/features/room-participant/server";

describe('RoomParticipantService', () => {
    let service: IRoomParticipantService;

    beforeEach(async () => {
        service = getRoomParticipantService();
    })

    afterEach(async () => {
        await cleanupDb()
    })

    describe('updateRoomParticipant', () => {
        it('should update room participant', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const participant = await haveUser({email: 'test2@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test 1', cardSetId: cardSet.id});

            await haveRoomParticipants({roomId: room.id, userId: participant.id});

            await service.updateStatus({
                userId: participant.id,
                roomId: room.id,
            }, 'active')

            const roomParticipants = await service.getManyByRoomId(room.id);

            expect(roomParticipants).toHaveLength(1);
            expect(roomParticipants[0].status).toEqual('active');
        });
    })

    describe('updateRoomParticipants', () => {
        it('should add and remove room participants', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const oldParticipant = await haveUser({email: 'test2@email.com'});
            const newParticipant_1 = await haveUser({email: 'test3@email.com'});
            const newParticipant_2 = await haveUser({email: 'test4@email.com'});

            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test 1', cardSetId: cardSet.id});

            //To remove
            await haveRoomParticipants({roomId: room.id, userId: oldParticipant.id});

            await service.update(
                room.id,
                [newParticipant_1.id, newParticipant_2.id],
            )

            const roomParticipants = await service.getManyByRoomId(room.id);

            expect(roomParticipants).toHaveLength(2);
            expect(roomParticipants[0].status).toEqual('inactive');
        })
    })

    describe('getRoomParticipants', () => {
        it('should get room participants by room id', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const participant = await haveUser({email: 'test2@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test 1', cardSetId: cardSet.id});

            await haveRoomParticipants({roomId: room.id, userId: participant.id});

            const roomParticipants = await service.getManyByRoomId(room.id);

            expect(roomParticipants).toHaveLength(1);
            expect(roomParticipants[0].id).toEqual(participant.id);
            expect(roomParticipants[0].status).toEqual('inactive');
        });
    })
})