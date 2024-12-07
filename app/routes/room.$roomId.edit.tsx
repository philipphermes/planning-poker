import {MagnifyingGlassIcon, PencilIcon} from "@heroicons/react/24/outline";
import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {data, Form, redirect, useFetcher, useLoaderData} from "@remix-run/react";
import {useEffect, useState} from "react";
import {getCurrentUser} from "~/.server/auth";
import {sessionStorage} from "~/.server/session";
import {addToastMessages} from "~/.server/toasts";
import {deleteRoom, findRoomById, updateRoom} from "~/db/queries/roomQueries";
import {Toast} from "~/models/Toast";
import {User} from "~/models/User";
import {roomSchema} from "~/validators/roomSchema";

export const meta: MetaFunction = () => {
    return [
        {title: "Edit Room"},
        {name: "description", content: "Welcome to Remix!"},
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

export async function action({request, params}: ActionFunctionArgs) {
    await getCurrentUser(request)
    if (!params.roomId) {
        throw redirect('/')
    }

    const formData = await request.formData()
    let session

    if (formData.has('delete')) {
        session = await deleteRoomAction(params.roomId, request)
    }

    if (formData.has('save')) {
        session = await saveRoomAction(params.roomId, request, formData)
    }

    return data(null, session ? {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    } : undefined)
}

async function deleteRoomAction(roomId: string, request: Request) {
    const changes = await deleteRoom(roomId)

    if (!changes) {
        return await addToastMessages(request, [new Toast('Failed deleting room!', false)])
    }

    const session = await addToastMessages(request, [new Toast('Deleted room successfully!', true)])

    throw redirect('/', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    })
}

async function saveRoomAction(roomId: string, request: Request, formData: FormData) {
    const fromEntries = Object.fromEntries(formData)
    const result = roomSchema.safeParse(fromEntries);

    if (!result.success) {
        const errors: Toast[] = result.error?.errors.map(error => {
            return new Toast(error.message, false)
        })

        return await addToastMessages(request, errors)
    }

    const changes = await updateRoom(roomId, result.data.name)

    if (!changes) {
        return await addToastMessages(request, [new Toast('Failed update room!', false)])
    }

    return await addToastMessages(request, [new Toast('Updated room successfully!', true)])
}

export default function Index() {
    const {user, room} = useLoaderData<typeof loader>()

    const userFetcher = useFetcher<User[]>();
    const addUserFetcher = useFetcher();
    const removeUserFetcher = useFetcher();

    const [query, setQuery] = useState("");
    const [roomName, setRoomName] = useState(room?.name);

    const users = userFetcher.data || []

    useEffect(() => {
        if (query) {
            userFetcher.load(`/user/search?q=${query}&r=${room?.id}`);
        }
    }, [query]);

    function addUserToRoom(userId: string) {
        addUserFetcher.submit({
            userId: userId,
            roomId: room?.id ?? null,
        }, {
            method: 'POST',
            action: '/room/user/add'
        })
    }

    function removeUserFromRoom(userId: string) {
        removeUserFetcher.submit({
            userId: userId,
            roomId: room?.id ?? null,
        }, {
            method: 'POST',
            action: '/room/user/remove'
        })
    }

    return (
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <Form method="POST" className="w-full flex justify-between gap-2">
                <label className="w-full input input-ghost flex items-center">
                    <input type="text" name="name" value={roomName} onChange={e => setRoomName(e.target.value)}
                           className="w-full" placeholder="Name"/>
                    <PencilIcon className="h-4 opacity-70"/>
                </label>
                <button name="save" type="submit" className="w-fit btn btn-outline btn-primary">Save</button>
                <button name="delete" type="submit" className="w-fit btn btn-outline btn-ghost">Delete</button>
            </Form>

            <label className="w-full input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="Search Users..."
                       onChange={(e) => setQuery(e.target.value)} value={query}/>
                <MagnifyingGlassIcon className="h-4 opacity-70"/>
            </label>

            <div className="flex w-full flex-col border-opacity-50">
                {room?.users.map((roomUser) => (
                    <div key={roomUser.id}>
                        <div className="divider"></div>
                        <div
                            className="card bg-base-300 rounded-box p-4 grid grid-cols-2 place-items-center justify-items-end gap-4">
                            <h3 className="text-lg w-full">{roomUser.email}</h3>
                            {roomUser.id !== user.id
                                ? <button onClick={() => removeUserFromRoom(roomUser.id)}
                                          className="btn btn-outline btn-secondary">Remove</button>
                                : <span>Owner</span>
                            }
                        </div>
                    </div>
                ))}
            </div>

            {userFetcher.state === "loading" ? (
                <span className="loading loading-dots loading-md"></span>
            ) : (
                <div className="flex w-full flex-col border-opacity-50">
                    {users.map((searchUser) => (
                        <div key={searchUser.id}>
                            <div className="divider"></div>
                            <div
                                className="card bg-base-300 rounded-box p-4 grid grid-cols-2 place-items-center justify-items-end gap-4">
                                <h3 className="text-lg w-full">{searchUser.email}</h3>
                                <button type="button" onClick={() => addUserToRoom(searchUser.id)}
                                        className="btn btn-outline btn-primary">Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}