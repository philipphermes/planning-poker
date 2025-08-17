import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {haveRound} from "../../../../helpers/round.helper";
import {haveRoomParticipants} from "../../../../helpers/room-participants.helper";
import {haveRoom} from "../../../../helpers/room.helper";
import {haveCardSet} from "../../../../helpers/card-set.helper";
import {haveUser} from "../../../../helpers/user.helper";
import {Server, Socket} from "socket.io";
import {haveEstimate} from "../../../../helpers/estimate.helper";
import {cleanupDb} from "../../../../helpers/db.helper";
import {SocketHandlerInterface} from "../../../../../src/features/socket/server/handlers/abstract.socket-handler";
import {getUserService} from "../../../../../src/features/user/server";
import {getRoomService} from "../../../../../src/features/room/server";
import {getRoundService} from "../../../../../src/features/round/server";
import {RevealSocketHandler} from "../../../../../src/features/socket/server/handlers/reveal.socket-handler";
import {getEstimateService} from "../../../../../src/features/estimate/server";
import {getDB} from "../../../../../src/lib/server/db";
import {RoundFormInput} from "../../../../../src/features/round/shared/round.validations";

describe('reveal handler', () => {
    let socketHandler: SocketHandlerInterface;

    beforeEach(() => {
        socketHandler = new RevealSocketHandler(
            getUserService(),
            getRoomService(),
            getRoundService(),
            getEstimateService(),
        );
    })

    afterEach(async () => {
        await cleanupDb();
    })

    describe('on new round', () => {
        it('should reveal round and emit data', async () => {
            const user = await haveUser({email: 'test@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user.id}, getDB());
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id}, getDB());
            await haveRoomParticipants({roomId: room.id, userId: user.id}, getDB());
            const round = await haveRound({roomId: room.id, name: 'test round 1', status: 'active'}, getDB());
            await haveEstimate({roundId: round.id, userId: user.id, value: '10'}, getDB())

            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                id: crypto.randomUUID(),
                data: {user: {email: user.email}}
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const revealHandlerMock = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'reveal')?.[1];
            expect(revealHandlerMock).toBeInstanceOf(Function);

            const data: RoundFormInput = {
                id: round.id,
                roomId: room.id,
                name: 'test round'
            }

            await revealHandlerMock?.(data);

            expect(toMock).toHaveBeenCalledWith(room.id);
            expect(toEmitMock).toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).toHaveBeenCalledWith('estimates', expect.any(Array));
        });

        it('should not reveal round and emit data when user was not found', async () => {
            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));
            const disconnectMock = vi.fn();

            const socket = {
                on: vi.fn(),
                id: crypto.randomUUID(),
                data: {user: {email: 'test'}},
                disconnect: disconnectMock
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const revealHandlerMock = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'reveal')?.[1];
            expect(revealHandlerMock).toBeInstanceOf(Function);

            const data: RoundFormInput = {
                id: 'test',
                roomId: 'test',
                name: 'test round'
            }

            await revealHandlerMock?.(data);

            expect(disconnectMock).toHaveBeenCalledWith(true);

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', expect.any(Array));
        });

        it('should not reveal round and emit data when data is invalid', async () => {
            const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            });

            const user = await haveUser({email: 'test@email.com'}, getDB());

            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                id: crypto.randomUUID(),
                data: {user: {email: user.email}}
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const revealHandlerMock = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'reveal')?.[1];
            expect(revealHandlerMock).toBeInstanceOf(Function);

            const data: RoundFormInput = {
                id: 'test',
                roomId: 'test',
                name: 'test round'
            }

            await revealHandlerMock?.(data);

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', expect.any(Array));

            logSpy.mockRestore();
        });

        it('should not reveal round and emit data round was not found', async () => {
            const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            });

            const user = await haveUser({email: 'test@email.com'}, getDB());

            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                id: crypto.randomUUID(),
                data: {user: {email: user.email}}
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const revealHandlerMock = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'reveal')?.[1];
            expect(revealHandlerMock).toBeInstanceOf(Function);

            const data: RoundFormInput = {
                id: crypto.randomUUID(),
                roomId: crypto.randomUUID(),
                name: 'test round'
            }

            await revealHandlerMock?.(data);

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', expect.any(Array));

            logSpy.mockRestore();
        });
    })
})