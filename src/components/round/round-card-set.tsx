'use client'

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {RoundDto} from "@/features/round/shared/round.types";
import {RoomDto} from "@/features/room/shared/room.types";
import {EstimateDto} from "@/features/estimate/shared/estimate.types";
import {SubmitEstimateFormInput} from "@/features/estimate/shared/estimate.validations";
import {useSocket} from "@/features/socket/client/socket.hooks";

export function RoundCardSet({round, room}: { round?: RoundDto, room: RoomDto }) {
    const {socket} = useSocket();
    const [estimate, setEstimate] = useState<string|null>();

    useEffect(() => {
        if (!socket) return;

        const estimateListener = (estimate?: EstimateDto) => setEstimate(estimate?.value)
        socket.on('estimate', estimateListener);

        return () => {
            socket.off('estimate', estimateListener);
        }
    }, [socket]);

    if (!room.cardSet || !room || !round?.id) {
        return null;
    }

    const onButtonClick = async (value: string) => {
        if (!round?.id) {
            return;
        }

        setEstimate(value);
        const data: SubmitEstimateFormInput = {
            roundId: round.id,
            value: value,
        }

        socket?.emit('submit-estimate', data)
    }

    return (
        <div className='flex gap-2 flex-wrap'>
            {room.cardSet.cards.map(card => (
                <Button
                    type='button'
                    variant={estimate === card ? 'outline' : 'default'}
                    onClick={() => onButtonClick(card)}
                    key={card}
                    className='hover:cursor-pointer h-12 min-w-12 text-lg'>
                    {card}
                </Button>
            ))}
        </div>
    )
}
