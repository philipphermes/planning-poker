'use client'

import {useEffect, useState, ReactNode} from 'react';
import {io, Socket} from 'socket.io-client';
import {useSession} from 'next-auth/react';
import {toast} from "sonner";
import {SocketContext} from "@/features/socket/client/socket.hooks";

export function SocketProvider({children}: { children: ReactNode }) {
    const {status} = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (status !== 'authenticated') return;

        const newSocket = io({
            withCredentials: true,
        });

        setSocket(newSocket);

        //Default handlers
        const connectHandler = () => toast("Connected to room");
        newSocket.on('connect', connectHandler);

        const disconnectHandler = () => toast("Disconnected from room");
        newSocket.on('disconnect', disconnectHandler);

        return () => {
            newSocket.disconnect();

            newSocket.off('connect')
            newSocket.off('disconnect')

            setSocket(null);
        };
    }, [status]);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
}