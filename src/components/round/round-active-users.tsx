'use client'

import {AvatarWithTooltip} from "@/components/user/avatar";
import {useEffect, useState} from "react";
import {UserActiveDto} from "@/features/room-participant/shared/room-participant.types";
import {useSocket} from "@/features/socket/client/socket.hooks";

export function RoundActiveUsers() {
    const [participants, setParticipants] = useState<UserActiveDto[]>([]);
    const {socket} = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handler = (users: UserActiveDto[]) => setParticipants(users);
        socket.on('participants', handler);

        return () => {
            socket.off('participants', handler);
        };
    }, [socket])

    return (
        <div
            className='fixed bottom-8 right-8 *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2'>
            {participants.map(participant =>
                <AvatarWithTooltip key={participant.id} user={participant} status={participant.status}/>
            )}
        </div>
    )
}