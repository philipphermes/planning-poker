import {Server, Socket} from "socket.io";

export interface SocketHandlerInterface {
    handle(socket: Socket, io: Server): void;
}

export abstract class AbstractSocketHandler<TData> implements SocketHandlerInterface {
    handle(socket: Socket, io: Server): void {
        socket.on(this.event, (data?: TData) => this.listener(socket, io, data));
    }

    protected abstract get event(): string;

    protected abstract listener(socket: Socket, io: Server, data?: TData): Promise<void>;
}