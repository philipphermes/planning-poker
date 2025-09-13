'use client'

import {useEffect, useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User2} from "lucide-react";
import {EstimateDto} from "@/features/estimate/shared/estimate.types";
import {useSocket} from "@/features/socket/client/socket.hooks";

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
                <div
                    className="relative bg-primary h-24 min-w-24 p-4 flex justify-center items-center rounded-md"
                    key={estimate.userId}>
                    <span className='text-5xl text-primary-foreground'>{estimate.value}</span>

                    <Tooltip>
                        <TooltipTrigger asChild className='cursor-pointer'>
                            <Avatar className='absolute top-1 right-1 h-8 w-8 rounded-lg'>
                                <AvatarImage
                                    src={estimate.user?.image ?? undefined}
                                    alt={estimate.user?.name ?? estimate.user?.email}
                                />
                                <AvatarFallback className="rounded-lg"><User2/></AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent className='flex flex-col gap-2 p-2'>
                            <p>{estimate.user?.name ?? estimate.user?.email ?? 'Na'}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            ))}
        </div>
    </div>)
}