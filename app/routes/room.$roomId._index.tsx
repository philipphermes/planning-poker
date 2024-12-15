import {data, Form, Params, redirect, useLoaderData} from "@remix-run/react";
import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {findRoomById} from "~/db/queries/roomQueries";
import {useEffect, useState} from "react";
import {ClockIcon, PencilIcon} from "@heroicons/react/24/outline";
import {roundSchema} from "~/validators/roundSchema";
import {sessionStorage} from "~/.server/session";
import {createRound, findNewestRoundByRoomIdWithEstimations} from "~/db/queries/roundQueries";
import {SSEMessageInterface} from "~/models/SSEMessage";
import {broadcastToRoom} from "~/.server/roomSSE";
import {estimationSchema} from "~/validators/estimationSchema";
import {createEstimation, updateEstimation} from "~/db/queries/estimationQueries";
import {v4 as uuidV4} from "uuid";
import {ROLE_OWNER, User} from "~/db/schema/schema";
import {InputWithIcon} from "~/components/Input";
import {Button} from "~/components/Button";
import {toast} from "~/.server/toast";
import {getAndValidateFormData} from "~/utils/formData";

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

async function newRoundAction(request: Request, formData: FormData, params: Params<string>) {
    if (!params.roomId) return await toast.getDataWithToasts(request, {message: 'Failed start new round!', status: 'error'}, null)

    const result = await getAndValidateFormData(formData, request, roundSchema)
    if (result.init) return result

    const room = await createRound({
        id: uuidV4(),
        name: result.name,
        roomId: params.roomId,
    })

    if (room.id) await broadcastToRoom(params.roomId)

    return await toast.getDataWithToasts(request, {
        message: room.id ? 'Started new round successfully!' : 'Failed start new round!',
        status: room.id ? 'success' : 'error',
    }, null)
}

async function addEstimationAction(request: Request, formData: FormData, params: Params<string>, user: User) {
    if (!params.roomId) return await toast.getDataWithToasts(request, {message: 'Failed to add estimate!', status: 'error'}, null)

    const round = await findNewestRoundByRoomIdWithEstimations(params.roomId)
    if (!round) return await toast.getDataWithToasts(request, {message: 'Failed to add estimate!', status: 'error'}, null)

    const result = await getAndValidateFormData(formData, request, estimationSchema)
    if (result.init) return result

    const estimation = round.estimations.filter(estimation => estimation?.user?.id === user.id)

    if (estimation[0]) {
        estimation[0].time = Number.parseInt(result.time)
        const changes = await updateEstimation(estimation[0])

        if (changes > 0)  await broadcastToRoom(params.roomId)

        return await toast.getDataWithToasts(request, {
            message: changes > 0 ? 'Updated estimate successfully!' : 'Failed to update estimate!',
            status: changes > 0 ? 'success' : 'error',
        }, null)
    }

    const newEstimation = await createEstimation({
        id: uuidV4(),
        time: Number.parseInt(result.time),
        userId: user.id,
        roundId: round.id,
    });

    if (newEstimation.id) await broadcastToRoom(params.roomId)

    return await toast.getDataWithToasts(request, {
        message: newEstimation.id ? 'Added estimate successfully!' : 'Failed to add estimate!',
        status: newEstimation.id ? 'success' : 'error',
    }, null)
}

export default function Index() {
    const {room, user} = useLoaderData<typeof loader>()
    const [sseMessage, setSSEMessage] = useState<SSEMessageInterface>()
    const [time, setTime] = useState<string>("0")

    useEffect(() => {
        const connectedUsersEventSource = new EventSource(`/room/${room?.id}/sse`);

        connectedUsersEventSource.onmessage = (event) => {
            const data: SSEMessageInterface = JSON.parse(event.data);
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
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="text-2xl">Room: {room?.name}, Round: {sseMessage?.round}</h1>

            { room.usersToRooms.filter(userToRoom => userToRoom.user.id === user.id && userToRoom.role === ROLE_OWNER).length === 1 &&
                <Form method="POST" className="w-full flex justify-between gap-2">
                    <InputWithIcon
                        type="text"
                        name="name"
                        placeholder="New Round"
                        className="input-bordered"
                        icon={<PencilIcon className="h-4 opacity-70"/>}
                    />
                    <Button name="round" type="submit" text="Start" className="btn-outline btn-primary" />
                </Form>
            }

            <div className="w-full grid grid-cols-3 gap-2">
                {sseMessage?.estimations.filter(estimation => estimation.user === user.email).length === 0 &&
                    <Form method="POST" className="card bg-base-300 flex items-center justify-center">
                        <div className="card-body flex flex-col gap-2">
                            <InputWithIcon
                                type="text"
                                name="time"
                                placeholder="0"
                                className="input-bordered"
                                icon={<ClockIcon className="h-4 opacity-70"/>}
                            />
                            <Button name="estimate" type="submit" text="Submit" className="btn-outline btn-primary" />
                        </div>
                    </Form>
                }

                {sseMessage?.estimations.map((estimation, key) =>
                    <div key={key} className="card bg-base-300 flex items-center justify-center">
                        {estimation.user === user.email ?
                            <Form method="POST">
                                <div className="card-body flex flex-col gap-2">
                                    <InputWithIcon
                                        type="text"
                                        name="time"
                                        placeholder="0"
                                        className="input-bordered"
                                        icon={<ClockIcon className="h-4 opacity-70"/>}
                                        onChange={e => setTime(e.target.value)}
                                        value={time}
                                    />
                                    <Button name="estimate" type="submit" text="Submit" className="btn-outline btn-primary" />
                                </div>
                            </Form>
                            : <div className="card-body">
                                {estimation.estimation}
                            </div>
                        }
                    </div>
                )}
            </div>

            <div className="absolute bottom-8 right-8 card bg-base-300 w-96 shadow-xl">
                <div className="card-body flex flex-col gap-2">
                    <h3 className="font-bold">Placed estimation:</h3>
                    {!sseMessage ? <span className="loading loading-dots loading-md"></span>
                        : <ul>
                            {sseMessage.estimations.map((estimation, key) =>
                                <li key={key}>{estimation.user}</li>
                            )}
                        </ul>}
                </div>
            </div>
        </div>
    );
}