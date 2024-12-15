import {ActionFunctionArgs, data, LoaderFunctionArgs, type MetaFunction} from "@remix-run/node";
import {redirect, useLoaderData} from "@remix-run/react";
import {getCurrentUser} from "~/.server/auth";
import {createRoom} from "~/db/queries/roomQueries";
import {roomSchema} from "~/validators/roomSchema";
import {findUsersToRoomsByUserId} from "~/db/queries/userToRoomQueries";
import {v4 as uuidV4} from "uuid";
import {RoomList} from "~/components/room/RoomList";
import {getAndValidateFormData} from "~/utils/formData";
import {toast} from "~/.server/toast";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export async function loader({request}: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);
    const userToRooms = await findUsersToRoomsByUserId(user.id)

    return data({user, userToRooms});
}

export async function action({request}: ActionFunctionArgs) {
    const user = await getCurrentUser(request);
    if (!user) throw redirect('/login')

    const result = await getAndValidateFormData(await request.formData(), request, roomSchema)
    if (result.init) return result

    const room = await createRoom({id: uuidV4(), name: result.name}, user.id)

    return await toast.getDataWithToasts(request, {
        message: room.id ? 'Room was created successfully!' : 'Failed to create new room!',
        status: room.id ? 'success' : 'error',
    }, null)
}

export default function Index() {
    const {userToRooms} = useLoaderData<typeof loader>()

    return (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <RoomList usersToRooms={userToRooms}/>
        </div>
    );
}