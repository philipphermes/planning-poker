import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {haveRound} from "../../../../helpers/round.helper";
import {haveRoomParticipants} from "../../../../helpers/room-participants.helper";
import {haveRoom} from "../../../../helpers/room.helper";
import {haveCardSet} from "../../../../helpers/card-set.helper";
import {haveUser} from "../../../../helpers/user.helper";
import {Server, Socket} from "socket.io";
import {cleanupDb} from "../../../../helpers/db.helper";
import {getDB} from "../../../../../src/lib/server/db";
import {ConnectionSocketHandler} from "../../../../../src/features/socket/server/handlers/connection.socket-handler";
import {getUserService} from "../../../../../src/features/user/server";
import {getRoomParticipantService} from "../../../../../src/features/room-participant/server";
import {getEstimateService} from "../../../../../src/features/estimate/server";
import {getRoomService} from "../../../../../src/features/room/server";
import {getRoundService} from "../../../../../src/features/round/server";
import {SocketHandlerInterface} from "../../../../../src/features/socket/server/handlers/abstract.socket-handler";

describe('connection handler', () => {
    let socketHandler: SocketHandlerInterface;

    beforeEach(() => {
        socketHandler = new ConnectionSocketHandler(
            getUserService(),
            getRoomParticipantService(),
            getEstimateService(),
            getRoomService(),
            getRoundService(),
        );
    })

    afterEach(async () => {
        await cleanupDb();
    })

    describe('on join', () => {
        it('should join provided room and emit data', async () => {
            const user = await haveUser({email: 'test@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user.id}, getDB());
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id}, getDB());
            await haveRoomParticipants({roomId: room.id, userId: user.id}, getDB());
            await haveRound({roomId: room.id, name: 'test round 1', status: 'active'}, getDB());

            const joinMock = vi.fn();
            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                join: joinMock,
                id: crypto.randomUUID(),
                data: {user: {email: user.email}}
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            // Attach handler
            socketHandler.handle(socket, io);

            // Extract the "join" listener
            const joinHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'join')?.[1];
            expect(joinHandler).toBeInstanceOf(Function);

            // Trigger the join handler with the test room ID
            await joinHandler?.(room.id);

            // Assertions
            expect(joinMock).toHaveBeenCalledWith(room.id);

            expect(toMock).toHaveBeenCalledWith(room.id);
            expect(toEmitMock).toHaveBeenCalledWith('participants', expect.any(Array));
            expect(toEmitMock).toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).toHaveBeenCalledWith('estimates', []);

            expect(toMock).toHaveBeenCalledWith(socket.id);
            expect(toEmitMock).toHaveBeenCalledWith('estimate', null);
        });

        it('should join provided room and emit data except round when not active', async () => {
            const user = await haveUser({email: 'test@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user.id}, getDB());
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id}, getDB());
            await haveRoomParticipants({roomId: room.id, userId: user.id}, getDB());
            await haveRound({roomId: room.id, name: 'test round 1', status: 'completed'}, getDB());

            const joinMock = vi.fn();
            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                join: joinMock,
                id: crypto.randomUUID(),
                data: {user: {email: user.email}}
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            // Attach handler
            socketHandler.handle(socket, io);

            // Extract the "join" listener
            const joinHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'join')?.[1];
            expect(joinHandler).toBeInstanceOf(Function);

            // Trigger the join handler with the test room ID
            await joinHandler?.(room.id);

            // Assertions
            expect(joinMock).toHaveBeenCalledWith(room.id);

            expect(toMock).toHaveBeenCalledWith(room.id);
            expect(toEmitMock).toHaveBeenCalledWith('participants', expect.any(Array));

            expect(toEmitMock).not.toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', []);
            expect(toMock).not.toHaveBeenCalledWith(socket.id);
            expect(toEmitMock).not.toHaveBeenCalledWith('estimate', null);
        });

        it('should not join room when user was not found and should disconnect', async () => {
            const joinMock = vi.fn();
            const emitMock = vi.fn();
            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));
            const disconnectMock = vi.fn();

            const socket = {
                on: vi.fn(),
                join: joinMock,
                emit: emitMock,
                disconnect: disconnectMock,
                id: crypto.randomUUID(),
                data: {user: {email: 'test'}}
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            // Attach handler
            socketHandler.handle(socket, io);

            // Extract the "join" listener
            const joinHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'join')?.[1];
            expect(joinHandler).toBeInstanceOf(Function);

            // Trigger the join handler with the test room ID
            await joinHandler?.('test');

            // Assertions
            expect(joinMock).not.toHaveBeenCalled()
            expect(disconnectMock).toHaveBeenCalledWith(true)
        });

        it('should not join room when user has no access to room', async () => {
            const user1 = await haveUser({email: 'user1@email.com'}, getDB());
            const user2 = await haveUser({email: 'user2@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user1.id}, getDB());
            const room = await haveRoom({ownerId: user1.id, name: 'test room', cardSetId: cardSet.id}, getDB());
            // Don't add user2 as a participant

            const joinMock = vi.fn();
            const emitMock = vi.fn();
            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                join: joinMock,
                emit: emitMock,
                id: crypto.randomUUID(),
                data: {user: {email: user2.email}}
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            // Attach handler
            socketHandler.handle(socket, io);

            // Extract the "join" listener
            const joinHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'join')?.[1];
            expect(joinHandler).toBeInstanceOf(Function);

            // Trigger the join handler with the test room ID
            await joinHandler?.(room.id);

            // Assertions
            expect(joinMock).not.toHaveBeenCalled()
        });

        it('should not join room when room ID is invalid', async () => {
            const user = await haveUser({email: 'test@email.com'}, getDB());

            const joinMock = vi.fn();
            const emitMock = vi.fn();
            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                join: joinMock,
                emit: emitMock,
                id: crypto.randomUUID(),
                data: {user: {email: user.email}}
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            // Attach handler
            socketHandler.handle(socket, io);

            // Extract the "join" listener
            const joinHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'join')?.[1];
            expect(joinHandler).toBeInstanceOf(Function);

            // Trigger the join handler with non-existent but valid UUID room ID
            await joinHandler?.(crypto.randomUUID());

            // Assertions
            expect(joinMock).not.toHaveBeenCalled()
        });
    })
})