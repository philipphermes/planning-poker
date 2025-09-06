import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {haveRound} from "../../../../helpers/round.helper";
import {haveRoomParticipants} from "../../../../helpers/room-participants.helper";
import {haveRoom} from "../../../../helpers/room.helper";
import {haveCardSet} from "../../../../helpers/card-set.helper";
import {haveUser} from "../../../../helpers/user.helper";
import {Server, Socket} from "socket.io";
import {cleanupDb} from "../../../../helpers/db.helper";
import {SocketHandlerInterface} from "../../../../../src/features/socket/server/handlers/abstract.socket-handler";
import {getUserService} from "../../../../../src/features/user/server";
import {getRoomService} from "../../../../../src/features/room/server";
import {getRoundService} from "../../../../../src/features/round/server";
import {getEstimateService} from "../../../../../src/features/estimate/server";
import {
    SubmitEstimateSocketHandler
} from "../../../../../src/features/socket/server/handlers/submit-estimate.socket-handler";
import {SubmitEstimateFormInput} from "../../../../../src/features/estimate/shared/estimate.validations";

describe('estimate handler', () => {
    let socketHandler: SocketHandlerInterface;

    beforeEach(() => {
        socketHandler = new SubmitEstimateSocketHandler(
            getUserService(),
            getRoomService(),
            getRoundService(),
            getEstimateService(),
        );
    })

    afterEach(async () => {
        await cleanupDb();
    })

    describe('on submit estimate', () => {
        it('should submit estimate and emit data', async () => {
            const user = await haveUser({email: 'test@email.com'});
            const cardSet = await haveCardSet({userId: user.id});
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id});
            await haveRoomParticipants({roomId: room.id, userId: user.id});
            const round = await haveRound({roomId: room.id, name: 'test round 1', status: 'active'});

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

            const estimateHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'submit-estimate')?.[1];
            expect(estimateHandler).toBeInstanceOf(Function);

            const data: SubmitEstimateFormInput = {
                roundId: round.id,
                value: '10'
            }

            await estimateHandler?.(data);

            expect(toMock).toHaveBeenCalledWith(socket.id);
            expect(toEmitMock).toHaveBeenCalledWith('estimate', expect.any(Object));

            expect(toMock).toHaveBeenCalledWith(room.id);
            expect(toEmitMock).toHaveBeenCalledWith('estimates', expect.any(Array));
        });

        it('should not submit estimate when user not found', async () => {
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

            const estimateHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'submit-estimate')?.[1];
            expect(estimateHandler).toBeInstanceOf(Function);

            const data: SubmitEstimateFormInput = {
                roundId: 'test',
                value: '10'
            }

            await estimateHandler?.(data);

            expect(disconnectMock).toHaveBeenCalledWith(true)

            expect(toMock).not.toHaveBeenCalledWith(socket.id);
            expect(toEmitMock).not.toHaveBeenCalledWith('estimate', expect.any(Object));

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', expect.any(Array));
        });

        it('should not submit estimate when data is invalid', async () => {
            const user = await haveUser({email: 'test@email.com'});

            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                id: crypto.randomUUID(),
                data: {user: {email: user.email}},
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const estimateHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'submit-estimate')?.[1];
            expect(estimateHandler).toBeInstanceOf(Function);

            const data: SubmitEstimateFormInput = {
                roundId: 'test',
                value: '10'
            }

            await estimateHandler?.(data);

            expect(toMock).not.toHaveBeenCalledWith(socket.id);
            expect(toEmitMock).not.toHaveBeenCalledWith('estimate', expect.any(Object));

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', expect.any(Array));
        });

        it('should not submit estimate when room was not found', async () => {
            const user = await haveUser({email: 'test@email.com'});

            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                id: crypto.randomUUID(),
                data: {user: {email: user.email}},
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const estimateHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'submit-estimate')?.[1];
            expect(estimateHandler).toBeInstanceOf(Function);

            const data: SubmitEstimateFormInput = {
                roundId: crypto.randomUUID(),
                value: '10'
            }

            await estimateHandler?.(data);

            expect(toMock).not.toHaveBeenCalledWith(socket.id);
            expect(toEmitMock).not.toHaveBeenCalledWith('estimate', expect.any(Object));

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', expect.any(Array));
        });

        it('should not submit estimate when data not provided', async () => {
            const toEmitMock = vi.fn();
            const toMock = vi.fn(() => ({emit: toEmitMock}));

            const socket = {
                on: vi.fn(),
                id: crypto.randomUUID(),
            } as unknown as Socket;

            const io = {
                to: toMock,
            } as unknown as Server;

            socketHandler.handle(socket, io);

            const estimateHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'submit-estimate')?.[1];
            expect(estimateHandler).toBeInstanceOf(Function);

            await estimateHandler?.();

            expect(toMock).not.toHaveBeenCalledWith(socket.id);
            expect(toEmitMock).not.toHaveBeenCalledWith('estimate', expect.any(Object));

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', expect.any(Array));
        });
    })
})