import {ISocketService} from "@/features/socket/server/socket.service.interface";
import {Server} from "socket.io";
import {SocketHandlerInterface} from "@/features/socket/server/handlers/abstract.socket-handler";

declare global {
    var _io: Server | undefined;
}

export class SocketService implements ISocketService {
    protected socketHandlers: SocketHandlerInterface[];

    constructor(
        socketHandlers: SocketHandlerInterface[],
    ) {
        this.socketHandlers = socketHandlers;
    }

    connect(io: Server): void {
        io.on('connection', (socket) => {
            this.socketHandlers.forEach((socketHandler) => {
                socketHandler.handle(socket, io)
            })
        });
    };

    setIoInstance = (server: Server) => {
        this.clearIoInstance();
        globalThis._io = server;
    };

    getIoInstance = (): Server => {
        if (!globalThis._io) {
            throw new Error("Socket.IO instance not initialized.");
        }
        return globalThis._io;
    };

    clearIoInstance = () => {
        if (globalThis._io) {
            globalThis._io.close();
            globalThis._io = undefined;
        }
    };
}