'use client';

import {useEffect, useState} from "react";
import {RoundForm} from "@/components/round/round-form";
import {RoundActiveUsers} from "@/components/round/round-active-users";
import {RoundOverview} from "@/components/round/round-overview";
import {RoundEstimates} from "@/components/round/round-estimates";
import {RoomDto} from "@/features/room/shared/room.types";
import {UserDto} from "@/features/user/shared/user.types";
import {RoundDto} from "@/features/round/shared/round.types";
import {useSocket} from "@/features/socket/client/socket.hooks";

export function Round({room, user}: { room: RoomDto, user: UserDto }) {
    const [round, setRound] = useState<RoundDto | undefined>(undefined);
    const {socket} = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            socket.emit('join', room.id);
        });

        socket.on('round', (round: RoundDto) => {
            setRound(round)
        });

        return () => {
            socket.off('connect')
            socket.off('round')
        }
    }, [socket, room.id]);

    return (<div className="flex flex-1 flex-col gap-4 h-full">
        <RoundForm room={room} round={round} user={user}/>
        <RoundOverview room={room} round={round}/>
        <RoundEstimates/>
        <RoundActiveUsers/>
    </div>)
}