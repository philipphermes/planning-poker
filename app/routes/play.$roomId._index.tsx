import {data, redirect, useLoaderData, useOutletContext} from "@remix-run/react";
import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {useEffect, useState} from "react";
import {SSEMessage} from "~/models/SSEMessage";
import {RoundForm} from "~/components/round/RoundForm";
import {PlacedEstimationList} from "~/components/estimation/PlacedEstimationList";
import {EstimationList} from "~/components/estimation/EstimationList";
import {flipAction, newRoundAction} from "~/.server/round";
import {addEstimationAction} from "~/.server/estimation";
import {getCurrentUser} from "~/.server/auth/user";
import {CardList} from "~/components/estimation/CardList";
import {findRoomById} from "~/db/queries/roomQueries";
import {isOwnerOfRoom} from "~/utils/room";

export const meta: MetaFunction = () => {
    return [
        {title: "Play"},
        {name: "description", content: ""},
    ];
};

export async function loader({request}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);
    return data(user);
}

export async function action({request, params}: ActionFunctionArgs) {
    const user = await getCurrentUser(request)
    if (!params.roomId) {
        throw redirect('/')
    }

    const formData = await request.formData();

    if (formData.has('round')) return await newRoundAction(request, formData, params)
    if (formData.has('estimate')) return await addEstimationAction(request, formData, params, user)
    if (formData.has('flip')) return await flipAction(request, params)

    return data(null)
}

export default function RoomsRoomIdPlay() {
    const user = useLoaderData<typeof loader>()
    const room = useOutletContext<Awaited<ReturnType<typeof findRoomById>>>()

    const [sseMessage, setSSEMessage] = useState<SSEMessage>()
    const [value, setValue] = useState<number>(0)

    useEffect(() => {
        const connectedUsersEventSource = new EventSource(`/rooms/${room?.id}/sse`);

        connectedUsersEventSource.onmessage = (event) => {
            const data: SSEMessage = JSON.parse(event.data);
            setSSEMessage(data)

            data?.estimations.forEach(message => {
                if (message.user === user.email) {
                    setValue(message.estimation ?? 0)
                }
            })
        };

        connectedUsersEventSource.onerror = () => {
            connectedUsersEventSource.close();
        };

        return () => connectedUsersEventSource.close();
    }, [room?.id, user.email]);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="divider text-2xl">Round: {sseMessage?.round}</div>

            {isOwnerOfRoom(room, user) && <RoundForm/>}

            <EstimationList sseMessage={sseMessage}/>

            <div className="divider">Available Cards</div>

            <CardList value={value} setValue={setValue}/>

            <PlacedEstimationList sseMessage={sseMessage}/>
        </div>
    );
}