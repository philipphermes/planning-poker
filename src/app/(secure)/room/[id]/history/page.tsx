'use server';

import {redirect} from "next/navigation";
import {getRoomService} from "@/features/room/server";
import {getUserService} from "@/features/user/server";
import {RoomEstimates} from "@/components/room/room-estimates";
import Link from "next/link";
import {Download} from "lucide-react";

export default async function RoomHistoryPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const userService = getUserService();
    const roomService = getRoomService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        redirect('/')
    }

    const room = await roomService.getOneByIdAndOwnerIdForExport(id, user.id)
    if (!room) {
        redirect('/room')
    }

    return (<div className="flex flex-1 flex-col gap-4 p-4">
        <div className="bg-muted rounded-xl min-h-min p-4 flex justify-between items-center gap-4">
            <h1 className='text-4xl'>{room.name}</h1>
            <Link download={true} href={`/api/rooms/${room.id}/export`}><Download/></Link>
        </div>

        {room.rounds?.map(round => (<div key={round.id} className='bg-muted/50 rounded-xl min-h-min p-4'>
            <h2 className='text-2xl'>{round.name}</h2>
            <RoomEstimates round={round}></RoomEstimates>
        </div>))}
    </div>);
}
