import {data, Form, redirect, useLoaderData, useOutletContext} from "@remix-run/react";
import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {useEffect, useState} from "react";
import {SSEMessage} from "~/types/SSEMessage";
import {flipAction, newRoundAction} from "~/.server/round/round";
import {addEstimationAction} from "~/.server/estimation/estimation";
import {getCurrentUser} from "~/.server/auth/user";
import {findRoomById} from "~/db/queries/roomQueries";
import {isOwnerOfRoom} from "~/utils/room";
import {findCardsByRoomId} from "~/db/queries/cardsQueries";
import {CardGridWrapper} from "~/components/card/CardGridWrapper";
import {CardTwoSided} from "~/components/card/CardTwoSided";
import {CardForm} from "~/components/card/CardForm";
import {InputWithIcon} from "~/components/form/Input";
import {PencilIcon} from "@heroicons/react/24/outline";
import {Button} from "~/components/form/Button";

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
        throw redirect('/rooms')
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
        const connectedUsersEventSource = new EventSource(`/rooms/${room?.id}/sse`);

        const closeConnection = () => {
            console.log("disconnected");
            connectedUsersEventSource.close();
        }

        connectedUsersEventSource.onopen = () => console.log("connected")

        connectedUsersEventSource.onmessage = (event) => {
            const data: SSEMessage = JSON.parse(event.data);

            setSSEMessage(data);

            data?.estimations.forEach(message => {
                if (message.user === user.email && message.estimation) setValue(message.estimation);
            });
        };

        connectedUsersEventSource.onerror = () => closeConnection()

        return () => closeConnection();
    }, [room?.id, user.email]);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="divider text-2xl">Round: {sseMessage?.round}</div>

            {isOwnerOfRoom(room, user) && <Form method="POST" className="flex justify-between gap-2">
                <InputWithIcon
                    type="text"
                    name="name"
                    placeholder="New Round"
                    className="input-bordered"
                    icon={<PencilIcon className="h-4 opacity-70"/>}
                />
                <Button name="round" type="submit" text="Start" className="btn-outline btn-primary" />
                <Button name="flip" type="submit" text="Flip Cards" className="btn-outline btn-secondary" />
            </Form>}

            <CardGridWrapper cols={6}>
                {sseMessage?.estimations.map((estimation, key) => <CardTwoSided
                    key={key}
                    value={estimation.estimation ?? 0}
                    email={estimation.user}
                    visible={sseMessage?.visible}
                />)}
            </CardGridWrapper>

            <div className="divider">Available Cards</div>

            <CardGridWrapper cols={8}>
                {cards.map(card => <CardForm
                    key={card.id}
                    value={card.time}
                    active={value === card.time}
                />)}
            </CardGridWrapper>
        </div>
    );
}