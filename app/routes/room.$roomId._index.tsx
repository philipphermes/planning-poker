import {data, redirect, useLoaderData} from "@remix-run/react";
import {LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {findRoomById} from "~/db/queries/roomQueries";
import {useEffect, useState} from "react";
import {User} from "~/models/User";
import {Estimation} from "~/models/Estimation";

export const meta: MetaFunction = () => {
    return [
        {title: "Room"},
        {name: "description", content: ""},
    ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);

    if (!params.roomId) {
        throw redirect('/')
    }

    const room = await findRoomById(params.roomId)

    return data({user, room});
}

export default function Index() {
    const {room} = useLoaderData<typeof loader>()
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
    const [estimations, setEstimations] = useState<Estimation[]>([]);

    //TODO retries if con failed
    useEffect(() => {
        //Connected users
        const connectedUsersEventSource = new EventSource(`/room/${room?.id}/users`);

        connectedUsersEventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setConnectedUsers(data.users);
        };
        connectedUsersEventSource.onerror = () => {
            connectedUsersEventSource.close();
        };

        //Estimations
        const estimationsEventSource = new EventSource(`/room/${room?.id}/estimations`);
        estimationsEventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setEstimations(data);

            console.log(estimations)
        };
        estimationsEventSource.onerror = () => {
            estimationsEventSource.close();
        };

        return () => {
            connectedUsersEventSource.close();
            estimationsEventSource.close();
        }
    }, []);

    return (
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h1>{room?.name}</h1>

            {connectedUsers.length === 0 ? <span className="loading loading-dots loading-md"></span>
                : <ul>
                    {connectedUsers.map(user =>
                        <li key={user}>{user}</li>
                    )}
                </ul>}
        </div>
    );
}