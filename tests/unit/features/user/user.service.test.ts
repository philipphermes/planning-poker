import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {haveUser} from "../../../helpers/user.helper";
import {Socket} from "socket.io";
import {haveEstimate} from "../../../helpers/estimate.helper";
import {haveRound} from "../../../helpers/round.helper";
import {haveRoom} from "../../../helpers/room.helper";
import {haveCardSet} from "../../../helpers/card-set.helper";
import {haveRoomParticipants} from "../../../helpers/room-participants.helper";
import {cleanupDb} from "../../../helpers/db.helper";
import {getUserService} from "../../../../src/features/user/server";
import {IUserService} from "../../../../src/features/user/server/user.service.interface";

describe('UserService', () => {
    let service: IUserService;

    beforeEach(async () => {
        service = getUserService();
    })

    afterEach(async () => {
        await cleanupDb();
    })

    describe('getUserByEmail', () => {
        it('should get user by email', async () => {
            const user = await haveUser({email: 'test@email.com'});

            const userByMail = await service.getOneByEmail(user.email);

            expect(userByMail.id).toEqual(user.id);
        });

        it('should get null when user not found by email', async () => {
            const userByMail = await service.getOneByEmail('test');

            expect(userByMail).toBeNull()
        });
    })

    describe('getUserBySocket', () => {
        it('should get user by socket', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const socket = {
                data: {user}
            } as Socket;

            const userBySocket = await service.getOneBySocket(socket)

            expect(userBySocket.id).toEqual(user.id);
        })

        it('should close socket when no user is provided in socket data', async () => {
            const socket = {
                data: {},
                disconnect: vi.fn()
            } as unknown as Socket;

            const userBySocket = await service.getOneBySocket(socket)

            expect(userBySocket).toBeNull()
            expect(socket.disconnect).toHaveBeenCalledTimes(1);
            expect(socket.disconnect).toHaveBeenCalledWith(true);
        })

        it('should close socket when no user was found', async () => {
            const socket = {
                data: {user: {email: 'test'}},
                disconnect: vi.fn()
            } as unknown as Socket;

            const userBySocket = await service.getOneBySocket(socket)

            expect(userBySocket).toBeNull()
            expect(socket.disconnect).toHaveBeenCalledTimes(1);
            expect(socket.disconnect).toHaveBeenCalledWith(true);
        })
    })

    describe('getAllUsersExcept', () => {
        it('should get all users except the provided id', async () => {
            const user = await haveUser({email: 'test1@email.com', name: 'shouldNotGetUser'});
            await haveUser({email: 'test2@email.com', name: 'shouldGetUser'});
            await haveUser({email: 'test3@email.com', name: 'shouldGetUser'});

            const users = await service.getManyExcept(user.id);

            expect(users).toHaveLength(2);

            users.forEach((user) => {
                expect(user.name).toEqual('shouldGetUser');
            })
        })
    })

    describe('updateUser', () => {
        it('should update the user', async () => {
            const user = await haveUser({email: 'test1@email.com', name: 'create'});
            user.name = 'test update';

            const updatedUser = await service.update(user);

            expect(updatedUser.name).toEqual('test update');
        })
    })

    describe('deleteUser', () => {
        it('should delete the user with all related data', async () => {
            const user_1 = await haveUser({email: 'test1@email.com'});
            const user_2 = await haveUser({email: 'test2@email.com'});

            const cardSet_1 = await haveCardSet({userId: user_1.id});
            const cardSet_2 = await haveCardSet({userId: user_2.id});

            const room_1 = await haveRoom({ownerId: user_1.id, name: 'test', cardSetId: cardSet_1.id});
            const room_2 = await haveRoom({ownerId: user_2.id, name: 'test 2', cardSetId: cardSet_2.id});

            const round_1 = await haveRound({roomId: room_1.id, name: 'test round', status: 'active'})
            const round_2 = await haveRound({roomId: room_2.id, name: 'test round 2', status: 'active'})

            await haveRoomParticipants({roomId: room_2.id, userId: user_1.id});

            await haveEstimate({roundId: round_1.id, userId: user_1.id, value: '5'})
            await haveEstimate({roundId: round_2.id, userId: user_1.id, value: '5'})

            await service.deleteByUserId(user_1.id);

            const deletedUser = await service.getOneByEmail(user_1.email);

            expect(deletedUser).toBeNull()
        })
    })
})