import {data, Link, Outlet, redirect, useLoaderData, useOutletContext} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import Navigation, {NavigationConfig} from "~/components/Navigation";
import {findRoomById} from "~/db/queries/roomQueries";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export async function loader({params}: LoaderFunctionArgs) {
    if (!params.roomId) return redirect('/rooms')

    const room = await findRoomById(params.roomId)
    if (!room) return redirect('/rooms')

    return data(room);
}

export default function Rooms() {
    const config = useOutletContext<NavigationConfig>()
    const room = useLoaderData<typeof loader>()

    return (
        <main className="min-h-dvh">
            <Navigation title={config.title} links={config.links} />
            <div className="max-w-7xl mx-10 md:mx-auto mt-20">
                <Link to='/rooms' prefetch='intent'>
                    <h1 className="text-4xl p-4">Room: {room.name}</h1>
                </Link>
                <Outlet context={room}/>
            </div>
        </main>
    );
}
