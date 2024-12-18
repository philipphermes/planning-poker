import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {addUserToRoom} from "~/db/queries/userToRoomQueries";
import {getAndValidateFormData} from "~/utils/formData";
import {userRoomSchema} from "~/validators/userRoomSchema";
import {toast} from "~/.server/toast/toast";
import {data, redirect} from "@remix-run/react";
import {getCurrentUser} from "~/.server/auth/user";

export async function loader({request}: LoaderFunctionArgs) {
    if (request.method !== "POST") {
        return redirect('/rooms')
    }

    return data(null)
}

export async function action({request}: ActionFunctionArgs) {
    await getCurrentUser(request);

    const result = await getAndValidateFormData(await request.formData(), request, userRoomSchema)
    if (result.init) return result

    const changes = await addUserToRoom({
        roomId: result.roomId,
        userId: result.userId,
    });

    if (!changes) return await toast.getDataWithToasts(request, {message: 'Failed to add user!', status: 'error'}, null)

    return await toast.getDataWithToasts(request, {message: 'Added user successfully!', status: 'success'}, null)
}