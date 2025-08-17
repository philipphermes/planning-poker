'use server';

import { redirect } from "next/navigation";
import {Round} from "@/components/round/round";
import {SocketProvider} from "@/components/socket/socket-provider";
import {getRoomService} from "@/features/room/server";
import {getUserService} from "@/features/user/server";

export default async function HomePage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const userService = getUserService();
    const roomService = getRoomService();

    const user = await userService.getCurrentUser();

    if (!user?.id) {
        redirect('/')
    }

    const userRoom = await roomService.getOneByIdAndUserId(id, user.id);

    if (!userRoom || !userRoom.cardSet) {
        redirect('/room/join')
    }

    return (<div className="flex flex-1 flex-col gap-4 p-4">
        <div className="bg-muted/50 min-h-[100vh] rounded-xl md:min-h-min p-4">
            <h1 className='text-4xl'>{userRoom.name}</h1>
        </div>

        <SocketProvider>
            <Round room={userRoom} user={user} />
        </SocketProvider>
    </div>);
}
