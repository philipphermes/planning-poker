import {data, redirect, useFetcher, useLoaderData} from '@remix-run/react';
import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {getAndValidateFormData} from "~/utils/formData";
import {roomSchema} from "~/validators/roomSchema";
import {deleteRoom, findRoomById, updateRoom} from "~/db/queries/roomQueries";
import {toast} from "~/.server/toast";
import EditRoomForm from "~/components/room/EditRoomForm";
import {UserSearch} from "~/components/room/UserSearch";

export async function loader({request, params}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);

    if (!params.roomId) return redirect('/rooms/list');

    const room = await findRoomById(params.roomId)
    if (!room) return redirect('/rooms/list');

    return data({user, room});
}

export async function action({request, params}: ActionFunctionArgs) {
    await getCurrentUser(request)

    if (!params.roomId) return redirect('/')

    const formData = await request.formData()

    if (formData.has('delete')) return await deleteRoomAction(params.roomId, request)
    if (formData.has('save')) return await saveRoomAction(params.roomId, request, formData)

    return await toast.getDataWithToasts(request, {message: 'Invalid action', status: 'error'}, null)
}

async function deleteRoomAction(roomId: string, request: Request) {
    const changes = await deleteRoom(roomId)

    if (!changes) return await toast.getDataWithToasts(request, {message: 'Failed deleting room!', status: 'error'}, null)

    await toast.throwRedirectWithToasts(request, {message: 'Deleted room successfully!', status: 'success'}, '/')
}

async function saveRoomAction(roomId: string, request: Request, formData: FormData) {
    const result = await getAndValidateFormData(formData, request, roomSchema)
    if (result.init) return result

    const changes = await updateRoom({id: roomId, name: result.name})
    if (!changes) return await toast.getDataWithToasts(request, {message: 'Failed update room!', status: 'error'}, null)

    return await toast.getDataWithToasts(request, {message: 'Updated room successfully!', status: 'success'}, null)
}

export default function RoomsRoomIdEdit() {
    const {user, room} = useLoaderData<typeof loader>()
    const removeUserFetcher = useFetcher();

    function removeUserFromRoom(userId: string) {
        removeUserFetcher.submit(
            {userId: userId, roomId: room?.id ?? null},
            {method: 'POST', action: '/rooms/user/remove'}
        )
    }

    return (
        <div className="flex w-full flex-col border-opacity-50 gap-6">
            <EditRoomForm room={room?.name}/>
            <div className="flex w-full flex-col border-opacity-50 gap-2">
                {room?.usersToRooms.map((usersToRooms) => (
                    <div key={usersToRooms.user.id}>
                        <div className="card bg-base-300 rounded-box p-4 grid grid-cols-2 place-items-center justify-items-end gap-2">
                            <h3 className="text-lg w-full">{usersToRooms.user.email}</h3>
                            {usersToRooms.user.id !== user.id
                                ? <button onClick={() => removeUserFromRoom(usersToRooms.user.id)} className="btn btn-outline btn-secondary">Remove</button>
                                : <span className="btn btn-ghost cursor-default">You</span>
                            }
                        </div>
                    </div>
                ))}
            </div>
            <div className="divider"/>
            <UserSearch roomId={room?.id}/>
        </div>
    );
}