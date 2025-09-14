import Link from "next/link";
import {RoomDelete} from "@/components/room/room-delete";
import {Edit, Eye, Rocket} from "lucide-react";
import {RoomDto} from "@/features/room/shared/room.types";
import {UserDto} from "@/features/user/shared/user.types";

export async function RoomList({userRooms, user}: { userRooms: RoomDto[], user: UserDto }) {
    return (
        <div className="bg-muted/50 flex flex-col rounded-xl h-full p-4 gap-4">
            {userRooms.map(room => (
                <div key={room.id} className="bg-muted/75 h-18 w-full rounded-xl p-4 flex justify-between items-center">
                    <div className='flex flex-col'>
                        <span className='text-lg'>{room.name}</span>
                        {room.ownerId !== user.id &&
                            <span className='text-xs'>Created by {room.owner?.name ?? room.owner?.email}</span>}
                    </div>
                    <div className='flex items-center gap-4'>
                        <Link href={`/room/${room.id}/play`} className='text-blue-600'><Rocket/></Link>
                        {room.ownerId === user.id && <Link href={`/room/${room.id}`}><Edit/></Link>}
                        {room.ownerId === user.id && <Link href={`/room/${room.id}/history`}><Eye/></Link>}
                        {room.ownerId === user.id && <RoomDelete id={room.id}/>}
                    </div>
                </div>
            ))}
        </div>
    )
}