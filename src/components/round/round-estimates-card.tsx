'use client'

import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User2} from "lucide-react";
import {EstimateDto} from "@/features/estimate/shared/estimate.types";

export function RoundEstimatesCard({estimate}: {estimate: EstimateDto}) {
    return (<div className="relative bg-primary h-24 min-w-24 p-4 flex justify-center items-center rounded-md">
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
    </div>)
}