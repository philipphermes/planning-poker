import {Link, redirect, useOutletContext} from '@remix-run/react';
import {RoomsContext} from "~/routes/rooms";
import NewRoomForm from "~/components/room/NewRoomForm";
import {ActionFunctionArgs} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {getAndValidateFormData} from "~/utils/formData";
import {roomSchema} from "~/validators/roomSchema";
import {createRoom} from "~/db/queries/roomQueries";
import {v4 as uuidV4} from "uuid";
import {toast} from "~/.server/toast";

export async function action({request}: ActionFunctionArgs) {
    const user = await getCurrentUser(request);
    if (!user) throw redirect('/login')

    const result = await getAndValidateFormData(await request.formData(), request, roomSchema)
    if (result.init) return result

    const room = await createRoom({id: uuidV4(), name: result.name}, user.id)

    return await toast.getDataWithToasts(request, {
        message: room.id ? 'Room was created successfully!' : 'Failed to create new room!',
        status: room.id ? 'success' : 'error',
    }, null)
}

export default function RoomsList() {
    const {usersToRooms} = useOutletContext<RoomsContext>();

    return (
        <div>
            <div className="divider"></div>
            <div className="flex w-full max-h-[40dvh] flex-col border-opacity-50 overflow-y-auto gap-4 rounded-box">
                {usersToRooms.map(userToRoom => (
                    <div key={userToRoom.room.id}>
                        <div className="card bg-base-300 rounded-box p-4 grid grid-cols-2 place-items-center gap-4">
                            <h3 className="col-span-2 text-lg">{userToRoom.room.name}</h3>
                            {
                                userToRoom.role === 'owner'
                                && <Link to={`/rooms/${userToRoom.room.id}/edit`} prefetch="intent"
                                         className="btn btn-outline w-full btn-secondary">Edit</Link>
                            }
                            <Link to={`/room/${userToRoom.room.id}`} prefetch="intent"
                                  className="btn w-full btn-primary">Open</Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="divider"></div>
            <NewRoomForm/>
        </div>
    )
}
