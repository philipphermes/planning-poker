import {Outlet, useLoaderData} from '@remix-run/react';
import {data, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth/user";
import {findUsersToRoomsByUserId} from "~/db/queries/userToRoomQueries";
import {Drawer} from "~/components/navigation/Drawer";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export async function loader({request}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);
    const usersToRooms = await findUsersToRoomsByUserId(user.id)

    return data({user, usersToRooms});
}

export default function Rooms() {
    const {user, usersToRooms} = useLoaderData<typeof loader>()

    return (
        <main className="min-h-dvh w-full">
            <Drawer usersToRooms={usersToRooms}>
                <Outlet context={user}/>
            </Drawer>
        </main>
    );
}
