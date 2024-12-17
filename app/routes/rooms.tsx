import {Link, Outlet, useLoaderData} from '@remix-run/react';
import {data, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {findUsersToRoomsByUserId} from "~/db/queries/userToRoomQueries";
import Navigation, {NavigationLink} from "~/components/Navigation";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

const navigationLinks: NavigationLink[] = [
    {
        url: "/logout",
        title: "Logout",
        prefetch: "none"
    }
]

export type RoomsContext = {
    user: Awaited<ReturnType<typeof getCurrentUser>>;
    usersToRooms: Awaited<ReturnType<typeof findUsersToRoomsByUserId>>;
}

export async function loader({request}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);
    const usersToRooms = await findUsersToRoomsByUserId(user.id)

    return data({user, usersToRooms});
}

export default function Rooms() {
    const {user, usersToRooms} = useLoaderData<typeof loader>()

    return (
        <main className="min-h-dvh">
            <Navigation title="Planning Poker" links={navigationLinks} />
            <div className="max-w-2xl mx-10 md:mx-auto mt-20">
                <Link to='list' prefetch='intent'>
                    <h1 className="text-4xl p-4">Rooms</h1>
                </Link>
                <Outlet context={{user, usersToRooms}}/>
            </div>
        </main>
    );
}
