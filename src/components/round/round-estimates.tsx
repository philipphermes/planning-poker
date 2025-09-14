'use client'

import {useEffect, useState} from "react";
import {EstimateDto} from "@/features/estimate/shared/estimate.types";
import {useSocket} from "@/features/socket/client/socket.hooks";
import {RoundEstimatesCard} from "@/components/round/round-estimates-card";

export function RoundEstimates() {
    const {socket} = useSocket();
    const [estimates, setEstimates] = useState<EstimateDto[]>([]);

    useEffect(() => {
        if (!socket) return;

        const estimatesHandler = (estimates: EstimateDto[]) => setEstimates(estimates);
        socket.on('estimates', estimatesHandler);

        return () => {
            socket.off('estimates', estimatesHandler);
        }
    }, [socket]);

    return (<div className="bg-muted/50 h-full rounded-xl md:min-h-min p-4">
        <div className='flex flex-wrap gap-4'>
            {estimates.map(estimate => (
                <RoundEstimatesCard estimate={estimate} key={estimate.roundId + estimate.userId} />
            ))}
        </div>
    </div>)
}