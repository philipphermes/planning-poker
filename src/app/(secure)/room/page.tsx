import {RoomForm} from "@/components/room/room-form";
import {RoomList} from "@/components/room/room-list";
import {redirect} from "next/navigation";
import {getCardSetService} from "@/features/card-set/server";
import {getUserService} from "@/features/user/server";
import {getRoomService} from "@/features/room/server";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Rooms",
    description: "Manage your planning poker rooms.",
};

export default async function HomePage() {
    const userService = getUserService();
    const roomService = getRoomService();
    const cardSetService = getCardSetService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        redirect('/')
    }

    const userCardSets = await cardSetService.getManyByOwnerId(user.id);
    const usersList = await userService.getManyExcept(user.id);
    const userRooms = await roomService.getManyByOwnerId(user.id);

    return (<div className="flex flex-1 flex-col gap-4 p-4">
        <RoomForm userCardSets={userCardSets} userList={usersList}></RoomForm>
        <RoomList userRooms={userRooms} user={user}/>
    </div>);
}
