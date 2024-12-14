import {Link} from "@remix-run/react";
import NewRoomForm from "~/components/room/NewRoomForm";
import {findUsersToRoomsByUserId} from "~/db/queries/userToRoomQueries";

type FindUsersToRoomsByUserIdType = Awaited<ReturnType<typeof findUsersToRoomsByUserId>>;

export type RoomList = {
    usersToRooms: FindUsersToRoomsByUserIdType;
}

export function RoomList({usersToRooms}: RoomList) {
    return (
        <div className="flex w-full flex-col border-opacity-50">
            {usersToRooms.map(userToRoom => (
                <div key={userToRoom.room.id}>
                    <div className="card bg-base-300 rounded-box p-4 grid grid-cols-2 place-items-center gap-4">
                        <h3 className="col-span-2 text-lg">{userToRoom.room.name}</h3>
                        {
                            userToRoom.role === 'owner'
                            && <Link to={`/room/${userToRoom.room.id}/edit`} prefetch="intent" className="btn btn-outline w-full btn-secondary">Edit</Link>
                        }
                        <Link to={`/room/${userToRoom.room.id}`} prefetch="intent" className="btn w-full btn-primary">Open</Link>
                    </div>
                    <div className="divider"></div>
                </div>
            ))}
            <NewRoomForm/>
        </div>
    )
}