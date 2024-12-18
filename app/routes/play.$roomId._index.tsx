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
import {findCardsByRoomId} from "~/db/queries/cardsQueries";

export const meta: MetaFunction = () => {
    return [
        {title: "Play"},
        {name: "description", content: ""},
    ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);

    if (!params.roomId) return redirect('/rooms')
    const cards = await findCardsByRoomId(params.roomId);

    return data({user, cards});
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
    const {user, cards} = useLoaderData<typeof loader>()
    const room = useOutletContext<Awaited<ReturnType<typeof findRoomById>>>()

    const [sseMessage, setSSEMessage] = useState<SSEMessage>()
    const [value, setValue] = useState<number>(0)

    useEffect(() => {
        let retryTimeout: NodeJS.Timeout | null = null;
        let retryCount = 0;
        const maxRetries = 5;
        const baseRetryDelay = 5000;

        const connectToSSE = () => {
            const connectedUsersEventSource = new EventSource(`/rooms/${room?.id}/sse`);

            connectedUsersEventSource.onopen = () => {
                retryCount = 0;
                if (retryTimeout !== null) {
                    clearTimeout(retryTimeout);
                    retryTimeout = null;
                }
            };

            connectedUsersEventSource.onmessage = (event) => {
                const data: SSEMessage = JSON.parse(event.data);
                setSSEMessage(data);

                data?.estimations.forEach(message => {
                    if (message.user === user.email && message.estimation) {
                        setValue(message.estimation);
                    }
                });
            };

            connectedUsersEventSource.onerror = () => {
                connectedUsersEventSource.close();

                if (retryCount < maxRetries) {
                    retryCount += 1;

                    const retryDelay = baseRetryDelay * Math.pow(2, retryCount - 1);
                    retryTimeout = setTimeout(() => {
                        connectToSSE();
                    }, retryDelay);
                } else {
                    console.error("Maximum retry limit reached. Could not reconnect to SSE.");
                }
            };

            return connectedUsersEventSource;
        };

        const eventSource = connectToSSE();

        return () => {
            eventSource.close();
            if (retryTimeout !== null) {
                clearTimeout(retryTimeout);
            }
        };
    }, [room?.id, user.email]);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="divider text-2xl">Round: {sseMessage?.round}</div>

            {isOwnerOfRoom(room, user) && <RoundForm/>}

            <EstimationList sseMessage={sseMessage}/>

            <div className="divider">Available Cards</div>

            <CardList value={value} setValue={setValue} cards={cards}/>

            <PlacedEstimationList sseMessage={sseMessage}/>
        </div>
    );
}