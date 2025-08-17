import {createContext, useContext} from 'react';
import {Socket} from 'socket.io-client';

type SocketContextType = {
    socket: Socket | null;
};

export const SocketContext = createContext<SocketContextType>({socket: null});

export function useSocket() {
    return useContext(SocketContext);
}