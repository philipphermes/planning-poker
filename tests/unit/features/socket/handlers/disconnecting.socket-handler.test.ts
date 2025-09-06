import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {haveRoomParticipants} from "../../../../helpers/room-participants.helper";
import {haveRoom} from "../../../../helpers/room.helper";
import {haveCardSet} from "../../../../helpers/card-set.helper";
import {haveUser} from "../../../../helpers/user.helper";
import {Server, Socket} from "socket.io";
import {cleanupDb} from "../../../../helpers/db.helper";
import {SocketHandlerInterface} from "../../../../../src/features/socket/server/handlers/abstract.socket-handler";
import {getUserService} from "../../../../../src/features/user/server";
import {getRoomParticipantService} from "../../../../../src/features/room-participant/server";
import {
    DisconnectingSocketHandler
} from "../../../../../src/features/socket/server/handlers/disconnecting.socket-handler";

describe('disconnecting handler', () => {
    let socketHandler: SocketHandlerInterface;

    beforeEach(() => {
        socketHandler = new DisconnectingSocketHandler(
            getUserService(),
            getRoomParticipantService(),
        );
    })

    afterEach(async () => {
        await cleanupDb();
    })

    describe('on disconnecting', () => {
        it('should disconnect from room', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room.id, userId: user.id});

            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socketId = crypto.randomUUID();
            const socket = {
                on: vi.fn(),
                id: socketId,
                data: {user: {email: user.email}},
                rooms: new Set([room.id, socketId]), // Socket.IO uses Set for rooms
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const disconnectHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'disconnecting')?.[1];
            await disconnectHandler?.();  // wait until async work finishes

            expect(toMock).toHaveBeenCalledWith(room.id);
            expect(toMock).toHaveBeenCalledTimes(1);

            expect(toEmitMock).toHaveBeenCalledWith('participants', expect.any(Array));
            expect(toEmitMock).toHaveBeenCalledTimes(1);
        });

        it('should disconnect and not emit anything if user was not found', async () => {
            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));
            const disconnectMock = vi.fn();

            const socketId = crypto.randomUUID();
            const socket = {
                on: vi.fn(),
                id: socketId,
                data: {user: {email: 'test'}},
                rooms: new Set(['id', socketId]),
                disconnect: disconnectMock
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const disconnectHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'disconnecting')?.[1];
            await disconnectHandler?.();

            expect(disconnectMock).toHaveBeenCalledWith(true)
            expect(toMock).not.toHaveBeenCalled();
            expect(toEmitMock).not.toHaveBeenCalled();
        });

        it('should disconnect and not emit anything if room Id is not valid', async () => {
            const user = await haveUser({email: 'test@email.com'});

            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socketId = crypto.randomUUID();
            const socket = {
                on: vi.fn(),
                id: socketId,
                data: {user: {email: user.email}},
                rooms: new Set(['id', socketId]),
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const disconnectHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'disconnecting')?.[1];
            await disconnectHandler?.();

            expect(toMock).not.toHaveBeenCalled();
            expect(toEmitMock).not.toHaveBeenCalled();
        });
    })
});