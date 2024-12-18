import {data, Form, redirect, useFetcher, useLoaderData} from '@remix-run/react';
import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {findRoomById} from "~/db/queries/roomQueries";
import {toast} from "~/.server/toast/toast";
import {UserSearch} from "~/components/user/UserSearch";
import {deleteRoomAction, saveRoomAction, saveRoomCardsAction} from "~/.server/room/roomAction";
import {getCurrentUser} from "~/.server/auth/user";
import {findCardsByRoomId} from "~/db/queries/cardsQueries";
import {CardGridWrapper} from "~/components/card/CardGridWrapper";
import {CardInput} from "~/components/card/CardInput";
import {Button} from "~/components/form/Button";
import {InputWithIcon} from "~/components/form/Input";
import {PencilIcon} from "@heroicons/react/24/outline";
import {useState} from "react";

export async function loader({request, params}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);

    if (!params.roomId) return redirect('/rooms/list');

    const room = await findRoomById(params.roomId)
    if (!room) return redirect('/rooms/list');

    const cards = await findCardsByRoomId(params.roomId);

    return data({user, room, cards});
}

export async function action({request, params}: ActionFunctionArgs) {
    await getCurrentUser(request)

    if (!params.roomId) return redirect('/rooms')

    const formData = await request.formData()

    if (formData.has('delete')) return await deleteRoomAction(params.roomId, request)
    if (formData.has('save')) return await saveRoomAction(params.roomId, request, formData)
    if (formData.has('updateCards')) return await saveRoomCardsAction(params.roomId, request, formData)

    return await toast.getDataWithToasts(request, {message: 'Invalid action', status: 'error'}, null)
}

export default function RoomsRoomIdEdit() {
    const {user, room, cards} = useLoaderData<typeof loader>()
    const removeUserFetcher = useFetcher();
    const [roomName, setRoomName] = useState(room.name);

    function removeUserFromRoom(userId: string) {
        removeUserFetcher.submit(
            {userId: userId, roomId: room?.id ?? null},
            {method: 'POST', action: '/rooms/user/remove'}
        )
    }

    return (
        <div className="flex w-full flex-col border-opacity-50 gap-6">
            <Form method="POST" className="w-full flex justify-between gap-2">
                <InputWithIcon
                    type="text"
                    name="name"
                    placeholder="Name"
                    icon={<PencilIcon className="h-4 opacity-70"/>}
                    value={roomName}
                    className="input-ghost"
                    onChange={e => setRoomName(e.target.value)}
                />
                <Button text="Save" name="save" type="submit" className="w-fit btn-primary btn-outline"/>
                <Button text="Delete" name="delete" type="submit" className="w-fit btn-ghost btn-outline"/>
            </Form>


            <div className="flex w-full flex-col border-opacity-50 gap-2">
                {room?.usersToRooms.map((usersToRooms) => (
                    <div key={usersToRooms.user.id}>
                        <div
                            className="card bg-base-300 rounded-box p-4 grid grid-cols-2 place-items-center justify-items-end gap-2">
                            <h3 className="text-lg w-full">{usersToRooms.user.email}</h3>
                            {usersToRooms.user.id !== user.id
                                ? <button onClick={() => removeUserFromRoom(usersToRooms.user.id)}
                                          className="btn btn-outline btn-secondary">Remove</button>
                                : <span className="btn btn-ghost cursor-default">You</span>
                            }
                        </div>
                    </div>
                ))}
            </div>

            <div className="divider">Room Cards</div>

            <CardGridWrapper cols={6} isForm={true}>
                {cards.map(card => <CardInput key={card.id} name={`cards[${card.id}]`} value={card.time}/>)}
                <CardInput key="new" name="cards[new]"/>
                <Button text="Save" type="submit" name="updateCards" className="btn-accent col-span-6"/>
            </CardGridWrapper>

            <div className="divider">Add Users</div>
            <UserSearch roomId={room?.id}/>
        </div>
    );
}
