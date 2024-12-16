import {data, redirect, useLoaderData} from "@remix-run/react";
import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {findRoomById} from "~/db/queries/roomQueries";
import {useEffect, useState} from "react";
import {SSEMessage} from "~/models/SSEMessage";
import {ROLE_OWNER} from "~/db/schema/schema";
import {RoundForm} from "~/components/round/RoundForm";
import {PlacedEstimationList} from "~/components/estimation/PlacedEstimationList";
import {EstimationList} from "~/components/estimation/EstimationList";
import {newRoundAction} from "~/.server/round";
import {addEstimationAction} from "~/.server/estimation";

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

    if (!room) {
        throw redirect('/')
    }

    return data({user, room});
}

export async function action({request, params}: ActionFunctionArgs) {
    const user = await getCurrentUser(request)
    if (!params.roomId) {
        throw redirect('/')
    }

    const formData = await request.formData();

    if (formData.has('round')) return await newRoundAction(request, formData, params)
    if (formData.has('estimate')) return await addEstimationAction(request, formData, params, user)

    return data(null)
}

export default function Index() {
    const {room, user} = useLoaderData<typeof loader>()
    const [sseMessage, setSSEMessage] = useState<SSEMessage>()
    const [time, setTime] = useState<string>("0")

    useEffect(() => {
        const connectedUsersEventSource = new EventSource(`/room/${room?.id}/sse`);

        connectedUsersEventSource.onmessage = (event) => {
            const data: SSEMessage = JSON.parse(event.data);
            setSSEMessage(data)

            data?.estimations.forEach(message => {
                if (message.user === user.email) {
                    setTime(message.estimation?.toString() ?? '0')
                }
            })
        };

        connectedUsersEventSource.onerror = () => {
            connectedUsersEventSource.close();
        };

        return () => connectedUsersEventSource.close();
    }, [room?.id, user.email]);

    return (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="text-2xl">Room: {room?.name}, Round: {sseMessage?.round}</h1>

            { room.usersToRooms.filter(userToRoom => userToRoom.user.id === user.id && userToRoom.role === ROLE_OWNER).length === 1 &&
                <RoundForm />
            }

            <EstimationList
                user={user}
                sseMessage={sseMessage}
                value={time}
                onChange={e => setTime(e.target.value)}
            />

           <PlacedEstimationList sseMessage={sseMessage} />
        </div>
    );
}