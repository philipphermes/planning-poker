import {MagnifyingGlassIcon, PencilIcon} from "@heroicons/react/24/outline";
import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {data, Form, redirect, useFetcher, useLoaderData} from "@remix-run/react";
import {useEffect, useState} from "react";
import {getCurrentUser} from "~/.server/auth";
import {deleteRoom, findRoomById, updateRoom} from "~/db/queries/roomQueries";
import {roomSchema} from "~/validators/roomSchema";
import {User} from "~/db/schema/schema";
import {getAndValidateFormData} from "~/utils/formData";
import {getDataWithToast, redirectWithToast} from "~/utils/toast";
import {InputWithIcon} from "~/components/Input";
import {Button} from "~/components/Button";

const DEBOUNCE_DELAY = 500;

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

    if (formData.has('delete')) {
        return await deleteRoomAction(params.roomId, request)
    }

    if (formData.has('save')) {
        return await saveRoomAction(params.roomId, request, formData)
    }

    return await getDataWithToast(request, 'Invalid action', false, null)
}

async function deleteRoomAction(roomId: string, request: Request) {
    const changes = await deleteRoom(roomId)

    if (!changes) return await getDataWithToast(request, 'Failed deleting room!', false, null)

    await redirectWithToast(request, 'Deleted room successfully!', true, '/')
}

async function saveRoomAction(roomId: string, request: Request, formData: FormData) {
    const result = await getAndValidateFormData(formData, request, roomSchema)
    if (result.init) return result

    const changes = await updateRoom({
        id: roomId,
        name: result.name
    })

    if (!changes) return await getDataWithToast(request, 'Failed update room!', false, null)

    return await getDataWithToast(request, 'Updated room successfully!', true, null)
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
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        const handler = setTimeout(() => {
            userFetcher.load(`/user/search?q=${trimmedQuery}&r=${room?.id}`);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, room?.id]);

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
                <InputWithIcon
                    type="text"
                    name="name"
                    placeholder="Name"
                    icon={<PencilIcon className="h-4 opacity-70"/>}
                    value={roomName}
                    className="input-ghost"
                    onChange={e => setRoomName(e.target.value)}
                />
                <Button text="Save" name="save" type="submit" className="w-fit btn-primary btn-outline" />
                <Button text="Delete" name="delete" type="submit" className="w-fit btn-ghost btn-outline" />
            </Form>

            <InputWithIcon
                type="text"
                name="search"
                placeholder="Search Users..."
                value={query}
                className="input-bordered"
                onChange={(e) => setQuery(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-4 opacity-70"/>}
            />

            <div className="flex w-full flex-col border-opacity-50">
                {room?.usersToRooms.map((usersToRooms) => (
                    <div key={usersToRooms.user.id}>
                        <div className="divider"></div>
                        <div
                            className="card bg-base-300 rounded-box p-4 grid grid-cols-2 place-items-center justify-items-end gap-4">
                            <h3 className="text-lg w-full">{usersToRooms.user.email}</h3>
                            {usersToRooms.user.id !== user.id
                                ? <button onClick={() => removeUserFromRoom(usersToRooms.user.id)}
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