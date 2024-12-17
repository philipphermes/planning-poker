import {Link, Outlet, useOutletContext} from '@remix-run/react';
import {MetaFunction} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {findUsersToRoomsByUserId} from "~/db/queries/userToRoomQueries";
import Navigation, {NavigationConfig} from "~/components/Navigation";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export type RoomsContext = {
    user: Awaited<ReturnType<typeof getCurrentUser>>;
    usersToRooms: Awaited<ReturnType<typeof findUsersToRoomsByUserId>>;
}

export default function Rooms() {
    const config = useOutletContext<NavigationConfig>()

    return (
        <main className="min-h-dvh">
            <Navigation title={config.title} links={config.links} />
            <div className="max-w-2xl mx-10 md:mx-auto mt-20">
                <Link to='/rooms' prefetch='intent'>
                    <h1 className="text-4xl p-4">Rooms</h1>
                </Link>
                <div className="divider"></div>
                <Outlet/>
            </div>
        </main>
    );
}
