import {beforeEach, describe, expect, it, vi} from "vitest";
import {Server} from "socket.io";
import {ISocketService} from "../../../../src/features/socket/server/socket.service.interface";
import {getSocketService} from "../../../../src/features/socket/server";

describe('socket singleton', () => {
    let socketService: ISocketService;

    beforeEach(() => {
        globalThis._io = undefined;
        socketService = getSocketService();
    });

    describe('setIoInstance and getIoInstance', () => {
        it('should set io instance and be available globally', () => {
            const serverMock = {
                close: vi.fn()
            } as unknown as Server;

            socketService.setIoInstance(serverMock);

            const server = socketService.getIoInstance();

            expect(server).toEqual(serverMock);
        })
    })

    describe('getIoInstance', () => {
        it('should throw Error when instance is not set', () => {
            expect(() => socketService.getIoInstance()).toThrow('Socket.IO instance not initialized.');
        })
    })
})