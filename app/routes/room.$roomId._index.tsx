import { data, Form, Params, redirect, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { getCurrentUser } from "~/.server/auth";
import { findRoomById } from "~/db/queries/roomQueries";
import { useEffect, useState } from "react";
import { Estimation } from "~/models/Estimation";
import { ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import { roundSchema } from "~/validators/roundSchema";
import { Toast } from "~/models/Toast";
import { addToastMessages } from "~/.server/toasts";
import { sessionStorage } from "~/.server/session";
import { createRound, findNewestRoundByRoomIdWithEstimations } from "~/db/queries/roundQueries";
import { Round } from "~/models/Round";
import { Room } from "~/models/Room";
import { SSEMessage } from "~/models/SSEMessage";
import { broadcastToRoom } from "~/.server/roomSSE";
import { estimationSchema } from "~/validators/estimationSchema";
import { createEstimation, updateEstimation } from "~/db/queries/estimationQueries";
import { User } from "~/models/User";

//TODO the pages need refactoring :D

export const meta: MetaFunction = () => {
    return [
        { title: "Room" },
        { name: "description", content: "" },
    ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);

    if (!params.roomId) {
        throw redirect('/')
    }

    const room = await findRoomById(params.roomId)

    return data({ user, room });
}

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await getCurrentUser(request)
    if (!params.roomId) {
        throw redirect('/')
    }

    const formData = await request.formData();

    if (formData.has('round')) {
        const session = await newRoundAction(request, formData, params)
        return data(null, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
        })
    }

    if (formData.has('estimate')) {
        const session = await addEstimationAction(request, formData, params, user)
        return data(null, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
        })
    }

    return data(null)
}

async function newRoundAction(request: Request, formData: FormData, params: Params<string>) {
    const fromEntries = Object.fromEntries(formData)
    const result = roundSchema.safeParse(fromEntries);

    if (!result.success) {
        const errors: Toast[] = result.error?.errors.map(error => {
            return new Toast(error.message, false)
        })

        return await addToastMessages(request, errors)
    }

    const round = new Round(result.data.name)
    round.room = new Room('', null, params.roomId)

    const room = await createRound(round)

    if (!room.id) {
        return await addToastMessages(request, [new Toast('Failed start new round!', false)])
    }

    await broadcastToRoom(params.roomId)
    return await addToastMessages(request, [new Toast('Started new round successfully!', true)])
}

async function addEstimationAction(request: Request, formData: FormData, params: Params<string>, user: User) {
    const fromEntries = Object.fromEntries(formData)
    const result = estimationSchema.safeParse(fromEntries);
    const round = await findNewestRoundByRoomIdWithEstimations(params.roomId)

    if (!round) {
        return await addToastMessages(request, [new Toast('Failed to add estimate!', false)])
    }

    if (!result.success) {
        const errors: Toast[] = result.error?.errors.map(error => {
            return new Toast(error.message, false)
        })

        return await addToastMessages(request, errors)
    }

    const estimation = round.estimations.map(estimation => estimation.user.id === user.id && estimation)

    if (estimation[0]) {
        estimation[0].time = Number.parseInt(result.data.time)
        const changes = await updateEstimation(estimation[0])
        console.log(changes)

        if (changes === 0) {
            return await addToastMessages(request, [new Toast('Failed to update estimate!', false)])
        }

        await broadcastToRoom(params.roomId)
        return await addToastMessages(request, [new Toast('Updated estimate successfully!', true)])
    }

    const newEstimation = await createEstimation(new Estimation(
        result.data.time,
        undefined,
        user,
        round
    ))

    if (!newEstimation.id) {
        return await addToastMessages(request, [new Toast('Failed to add estimate!', false)])
    }

    await broadcastToRoom(params.roomId)
    return await addToastMessages(request, [new Toast('Added estimate successfully!', true)])
}

export default function Index() {
    const { room, user } = useLoaderData<typeof loader>()
    const [sseMessage, setSSEMessage] = useState<SSEMessage | null>(null);
    const [time, setTime] = useState<string>("0")

    //TODO retries if con failed
    useEffect(() => {
        const connectedUsersEventSource = new EventSource(`/room/${room?.id}/sse`);

        connectedUsersEventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            setSSEMessage(data)
            const estimations = data.estimations.map(estimation => estimation.user === user.email && estimation)
            if (estimations[0]) {
                setTime(estimations[0].estimation?.toString())
            }
        };
        connectedUsersEventSource.onerror = () => {
            connectedUsersEventSource.close();
        };

        return () => connectedUsersEventSource.close();
    }, []);

    return (
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="text-2xl">Room: {room?.name}, Round: {sseMessage?.round}</h1>

            <Form method="POST" className="w-full flex justify-between gap-2">
                <label className="w-full input input-bordered flex items-center">
                    <input type="text" name="name" className="w-full" placeholder="New Round" />
                    <PencilIcon className="h-4 opacity-70" />
                </label>
                <button name="round" type="submit" className="w-fit btn btn-outline btn-primary">Start</button>
            </Form>

            <div className="w-full grid grid-cols-3">
                {sseMessage?.estimations.map(estimation => estimation.user === user.email).length === 0 &&
                    <Form method="POST" className="card bg-base-300 flex items-center justify-center">
                        <div className="card-body flex flex-col gap-2">
                            <label className="w-full input input-bordered flex items-center">
                                <input type="text" name="time" className="w-full" placeholder="0" />
                                <ClockIcon className="h-4 opacity-70" />
                            </label>
                            <button name="estimate" type="submit" className="w-full btn btn-outline btn-primary">Submit</button>
                        </div>
                    </Form>
                }

                {sseMessage?.estimations.map((estimation, key) =>
                    <div key={key} className="card bg-base-300 flex items-center justify-center">
                        {estimation.user === user.email ?
                            <Form method="POST" className="card bg-base-300 flex items-center justify-center">
                                <div className="card-body flex flex-col gap-2">
                                    <label className="w-full input input-bordered flex items-center">
                                        <input type="text" name="time" className="w-full" placeholder="0" onChange={e => setTime(e.target.value)} value={time} />
                                        <ClockIcon className="h-4 opacity-70" />
                                    </label>
                                    <button name="estimate" type="submit" className="w-full btn btn-outline btn-primary">Submit</button>
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