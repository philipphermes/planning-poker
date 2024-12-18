import {ActionFunctionArgs, data, LoaderFunctionArgs} from "@remix-run/node";
import {userRoomSchema} from "~/validators/userRoomSchema";
import {deleteUserToRoom} from "~/db/queries/userToRoomQueries";
import {getAndValidateFormData} from "~/utils/formData";
import {toast} from "~/.server/toast/toast";
import {redirect} from "@remix-run/react";
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

    const changes = await deleteUserToRoom({
        roomId: result.roomId,
        userId: result.userId
    });

    if (!changes) return await toast.getDataWithToasts(request, {message: 'Failed to remove user!', status: 'error'}, null)

    return await toast.getDataWithToasts(request, {message: 'Removed user successfully!', status: 'success'}, null)
}