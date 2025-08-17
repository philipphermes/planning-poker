import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {haveRoom} from "../../../../helpers/room.helper";
import {haveCardSet} from "../../../../helpers/card-set.helper";
import {haveUser} from "../../../../helpers/user.helper";
import {Server, Socket} from "socket.io";
import {cleanupDb} from "../../../../helpers/db.helper";
import {SocketHandlerInterface} from "../../../../../src/features/socket/server/handlers/abstract.socket-handler";
import {getUserService} from "../../../../../src/features/user/server";
import {getRoomService} from "../../../../../src/features/room/server";
import {getRoundService} from "../../../../../src/features/round/server";
import {NewRoundSocketHandler} from "../../../../../src/features/socket/server/handlers/new-round.socket-handler";
import {getDB} from "../../../../../src/lib/server/db";
import {RoundFormInput} from "../../../../../src/features/round/shared/round.validations";

describe('new round handler', () => {
    let socketHandler: SocketHandlerInterface;

    beforeEach(() => {
        socketHandler = new NewRoundSocketHandler(
            getUserService(),
            getRoomService(),
            getRoundService(),
        );
    })

    afterEach(async () => {
        await cleanupDb();
    })

    describe('on new round', () => {
        it('should start new round and emit data', async () => {
            const user = await haveUser({email: 'test@email.com'}, getDB());
            const cardSet = await haveCardSet({userId: user.id}, getDB());
            const room = await haveRoom({ownerId: user.id, name: 'test room', cardSetId: cardSet.id}, getDB());

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

            const roundHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'new-round')?.[1];
            expect(roundHandler).toBeInstanceOf(Function);

            const data: RoundFormInput = {
                id: undefined,
                roomId: room.id,
                name: 'test round'
            }

            await roundHandler?.(data);

            expect(toMock).toHaveBeenCalledWith(room.id);
            expect(toEmitMock).toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).toHaveBeenCalledWith('estimates', []);
            expect(toEmitMock).toHaveBeenCalledWith('estimate', null);
        });

        it('should not start new round when user was not found', async () => {
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

            const roundHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'new-round')?.[1];
            expect(roundHandler).toBeInstanceOf(Function);

            const data: RoundFormInput = {
                id: undefined,
                roomId: 'test',
                name: 'test round'
            }

            await roundHandler?.(data);

            expect(disconnectMock).toHaveBeenCalledWith(true)

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', []);
            expect(toEmitMock).not.toHaveBeenCalledWith('estimate', null);
        });

        it('should not start new round when data is invalid', async () => {
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

            const roundHandler = (socket.on as vi.Mock).mock.calls.find(call => call[0] === 'new-round')?.[1];
            expect(roundHandler).toBeInstanceOf(Function);

            const data: RoundFormInput = {
                id: undefined,
                roomId: 'test',
                name: 'test round'
            }

            await roundHandler?.(data);

            expect(toMock).not.toHaveBeenCalledWith('test');
            expect(toEmitMock).not.toHaveBeenCalledWith('round', expect.any(Object));
            expect(toEmitMock).not.toHaveBeenCalledWith('estimates', []);
            expect(toEmitMock).not.toHaveBeenCalledWith('estimate', null);

            logSpy.mockRestore();
        });
    })
})