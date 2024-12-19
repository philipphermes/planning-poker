import {Form, Link, redirect, useFetcher, useOutletContext} from '@remix-run/react';
import {ActionFunctionArgs} from "@remix-run/node";
import {toast} from "~/.server/toast/toast";
import {UserSearch} from "~/components/user/UserSearch";
import {
    deleteRoomAction,
    generateRoomCardsAction,
    saveRoomAction,
    saveRoomCardsAction
} from "~/.server/room/roomAction";
import {getCurrentUser} from "~/.server/auth/user";
import {CardGridWrapper} from "~/components/card/CardGridWrapper";
import {CardInput} from "~/components/card/CardInput";
import {Button} from "~/components/form/Button";
import {InputWithIcon} from "~/components/form/Input";
import {PencilIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import {isOwnerOfRoom} from "~/utils/room";
import {Card} from "~/components/card/Card";
import {RoomRoomIdContext} from "~/routes/rooms.$roomId";

export async function action({request, params}: ActionFunctionArgs) {
    await getCurrentUser(request)

    if (!params.roomId) return redirect('/rooms')

    const formData = await request.formData()

    if (formData.has('delete')) return await deleteRoomAction(params.roomId, request)
    if (formData.has('save')) return await saveRoomAction(params.roomId, request, formData)
    if (formData.has('updateCards')) return await saveRoomCardsAction(params.roomId, request, formData)
    if (formData.has('generateCards')) return await generateRoomCardsAction(params.roomId, request, formData)

    return await toast.getDataWithToasts(request, {message: 'Invalid action', status: 'error'}, null)
}

export default function RoomsRoomId() {
    const {user, room, cards} = useOutletContext<RoomRoomIdContext>()

    const removeUserFetcher = useFetcher();
    const [roomName, setRoomName] = useState(room?.name);

    function removeUserFromRoom(userId: string) {
        removeUserFetcher.submit(
            {userId: userId, roomId: room?.id ?? null},
            {method: 'POST', action: '/rooms/user/remove'}
        )
    }

    const isOwner = isOwnerOfRoom(room, user);

    return (
        <div className="w-full min-h-full md:flex md:justify-center md:items-center">
            <div className="w-full p-4 pt-20 md:pt-4 bg-base-300 md:max-w-2xl md:rounded-box">

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl uppercase">{room?.name}</h1>
                    <div className="flex gap-2">
                        <Link to="#" className="btn btn-disabled w-20">Log</Link>
                        <Link to="play" className="btn btn-primary w-20">Open</Link>
                    </div>
                </div>

                {isOwnerOfRoom(room, user) && <Form method="POST" className="w-full flex justify-between gap-2">
                    <Button text="Delete" name="delete" type="submit" className="w-fit btn-ghost btn-outline w-20"/>
                    <InputWithIcon
                        type="text"
                        name="name"
                        placeholder="Name"
                        icon={<PencilIcon className="h-4 opacity-70"/>}
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                    />
                    <Button text="Save" name="save" type="submit" className="w-fit btn-secondary btn-outline w-20"/>

                </Form>}

                <div className="divider">Cards</div>

                <CardGridWrapper isForm={isOwner} extraClasses="gap-4 grid-cols-4 md:grid-cols-6 my-4">
                    {isOwner && cards.map(card => <CardInput key={card.id} name={`cards[${card.id}]`} value={card.value} extraClasses="bg-base-100"/>)}
                    {!isOwner && cards.map(card => <Card key={card.id} value={card.value} extraClasses="bg-base-100"/>)}

                    {isOwner && <CardInput key="new" name="cards[new]" extraClasses="bg-base-100"/>}

                    {isOwner && <div className="col-span-4 md:col-span-6 flex gap-2">
                        <select className="select select-bordered w-full" name="generateType">
                            <option disabled selected>Select a type</option>
                            <option value="fibonacci">Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34)</option>
                            <option value="t-shirts">T-Shirt Sizes (XS, S, M, L, XL, XXL)</option>
                            <option value="powers-of-two">Powers of 2 (1, 2, 4, 8, 16, 32)</option>
                            <option value="sequential">Sequential (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)</option>
                        </select>
                        <Button text="Generate" type="submit" name="generateCards" className="btn-accent btn-outline col-span-4 md:col-span-6"/>
                        <Button text="Save Cards" type="submit" name="updateCards" className="btn-accent col-span-4 md:col-span-6"/>
                    </div>}
                </CardGridWrapper>

                <div className="divider">Users</div>

                <div className="flex w-full flex-col border-opacity-50 gap-2">
                    {room?.usersToRooms.map((usersToRooms) => (
                        <div key={usersToRooms.user.id}>
                            <div
                                className="card bg-base-100 rounded-box p-4 grid grid-cols-2 place-items-center justify-items-end gap-2">
                                <h3 className="text-base md:text-lg w-full">{usersToRooms.user.email}</h3>
                                {usersToRooms.user.id !== user.id
                                    ? (isOwnerOfRoom(room, user) ?
                                        <button onClick={() => removeUserFromRoom(usersToRooms.user.id)}
                                                className="btn btn-outline btn-accent">Remove</button> : null)
                                    : <span className="btn btn-ghost cursor-default">You</span>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {isOwner && <div>
                    <div className="divider">Add Users</div>
                    <UserSearch roomId={room?.id}/>
                </div>}
            </div>
        </div>
    );
}
