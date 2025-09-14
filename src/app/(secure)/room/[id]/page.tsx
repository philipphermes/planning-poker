import {RoomForm} from "@/components/room/room-form";
import {RoomList} from "@/components/room/room-list";
import {redirect} from "next/navigation";
import {getRoomService} from "@/features/room/server";
import {getCardSetService} from "@/features/card-set/server";
import {getUserService} from "@/features/user/server";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Room",
    description: "Manage a planning poker room.",
};

export default async function HomePage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const userService = getUserService();
    const roomService = getRoomService();
    const cardSetService = getCardSetService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        redirect('/')
    }

    const room = await roomService.getOneByIdAndUserId(id, user.id)
    const userCardSets = await cardSetService.getManyByOwnerId(user.id);
    const usersList = await userService.getManyExcept(user.id);
    const userRooms = await roomService.getManyByOwnerId(user.id);

    return (<div className="flex flex-1 flex-col gap-4 p-4">
        <RoomForm userCardSets={userCardSets} roomWithUsers={room ?? undefined} userList={usersList}></RoomForm>
        <RoomList userRooms={userRooms} user={user}/>
    </div>);
}
