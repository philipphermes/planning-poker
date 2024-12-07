import {ActionFunctionArgs, data, LoaderFunctionArgs, type MetaFunction} from "@remix-run/node";
import {Form, Link, redirect, useLoaderData} from "@remix-run/react";
import {getCurrentUser} from "~/.server/auth";
import {sessionStorage} from "~/.server/session";
import {addToastMessages} from "~/.server/toasts";
import {createRoom, findRoomsByUserId} from "~/db/queries/roomQueries";
import {Room} from "~/models/Room";
import {Toast} from "~/models/Toast";
import {roomSchema} from "~/validators/roomSchema";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export async function loader({request}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);
    const userToRooms = await findRoomsByUserId(user.id)

    return data({user, userToRooms});
}

export async function action({request}: ActionFunctionArgs) {
    const user = await getCurrentUser(request);

    if (!user) {
        throw redirect('/login')
    }

    const formData = Object.fromEntries(await request.formData())
    const result = roomSchema.safeParse(formData);

    if (!result.success) {
        const errors: Toast[] = result.error?.errors.map(error => {
            return new Toast(error.message, false)
        })

        const session = await addToastMessages(request, errors)

        return data(null, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
        })
    }

    const room = await createRoom(new Room(result.data.name, null, undefined, [user]))

    if (!room.id) {
        const session = await addToastMessages(request, [new Toast('Failed to create new room!', false)])
        return data(null, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
        })
    }

    const session = await addToastMessages(request, [new Toast('Room was created successfully!', true)])
    return data(null, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    })
}

export default function Index() {
    const {userToRooms} = useLoaderData<typeof loader>()

    return (
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex w-full flex-col border-opacity-50">
                {userToRooms.map(userToRoom => (
                    <div key={userToRoom.room.id}>
                        <div className="card bg-base-300 rounded-box p-4 grid grid-cols-2 place-items-center gap-4">
                            <h3 className="col-span-2 text-lg">{userToRoom.room.name}</h3>
                            {
                                userToRoom.role === 'owner'
                                && <Link to={`/room/${userToRoom.room.id}/edit`} prefetch="intent"
                                         className="btn btn-outline w-full btn-secondary">Edit</Link>
                            }
                            <Link to={`/room/${userToRoom.room.id}`} prefetch="intent"
                                  className="btn w-full btn-primary">Open</Link>
                        </div>
                        <div className="divider"></div>
                    </div>
                ))}
                <div className="card bg-base-300 rounded-box p-4">
                    <Form method="post" className="space-y-6">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Room name</span>
                            </div>
                            <input type="text" name="name" placeholder="Type here"
                                   className="input input-bordered w-full"/>
                        </label>
                        <button type="submit" className="btn btn-outline btn-accent w-full">Create new room</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}