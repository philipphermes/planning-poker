'use client';

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {UserDto} from "@/features/user/shared/user.types";
import {RoomParticipantsStatus} from "@/lib/server/db/schema";

export type AvatarProps = {
    user?: UserDto;
    status?: RoomParticipantsStatus;
    className?: string;
}

export function AvatarWithoutTooltip({user, status = 'active', className}: AvatarProps) {
    return (<Avatar className={`h-8 w-8 rounded-lg ${className}`}>
        <AvatarImage className={status === 'active' ? '' : 'grayscale'} src={user?.image ?? undefined}
                     alt={user?.name ?? user?.email}/>
        <AvatarFallback className="rounded-lg"><User2/></AvatarFallback>
    </Avatar>)
}

export function AvatarWithTooltip({user, status = 'active'}: AvatarProps) {
    return (<Tooltip>
        <TooltipTrigger>
            <AvatarWithoutTooltip
                className={`border-2 cursor-pointer ${status === 'active' ? 'border-green-600' : 'border-destructive'}`}
                user={user} status={status}/>
        </TooltipTrigger>
        <TooltipContent className='flex flex-col gap-2 p-2'>
            <p>{user?.name ?? user?.email}</p>
        </TooltipContent>
    </Tooltip>)
}