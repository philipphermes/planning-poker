import {Server} from "socket.io";

export interface ISocketService {
    connect(io: Server): void;

    setIoInstance(server: Server): void;

    getIoInstance(): Server;

    clearIoInstance(): void;
}