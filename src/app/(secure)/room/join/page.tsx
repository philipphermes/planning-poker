'use server';

import {RoomList} from "@/components/room/room-list";
import {redirect} from "next/navigation";
import {getRoomService} from "@/features/room/server";
import {getUserService} from "@/features/user/server";

export default async function HomePage() {
    const userService = getUserService();
    const roomService = getRoomService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        redirect('/')
    }

    const userRooms = await roomService.getManyByUserId(user.id);

    return (<div className="flex flex-1 flex-col gap-4 p-4">
        <RoomList userRooms={userRooms} user={user}/>
    </div>);
}
