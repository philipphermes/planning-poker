import {Outlet, redirect, useLoaderData, useOutletContext} from '@remix-run/react';
import {data, LoaderFunctionArgs} from "@remix-run/node";
import {findRoomById} from "~/db/queries/roomQueries";
import {findCardsByRoomId} from "~/db/queries/cardsQueries";
import {RoomsContext} from "~/routes/rooms";

export type RoomRoomIdContext = {
    room: Awaited<ReturnType<typeof findRoomById>>;
    cards: Awaited<ReturnType<typeof findCardsByRoomId>>;
    user: RoomsContext;
}

export async function loader({params}: LoaderFunctionArgs) {
    if (!params.roomId) return redirect('/rooms/list');

    const room = await findRoomById(params.roomId)
    if (!room) return redirect('/rooms/list');

    const cards = await findCardsByRoomId(params.roomId);

    return data({room, cards});
}

export default function Rooms() {
    const {room, cards} = useLoaderData<typeof loader>()
    const user = useOutletContext<RoomsContext>()

    return (
        <Outlet context={{room, cards, user}}/>
    );
}
