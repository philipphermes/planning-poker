import {ActionFunctionArgs} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {userRoomSchema} from "~/validators/userRoomSchema";
import {deleteUserToRoom} from "~/db/queries/userToRoomQueries";
import {getAndValidateFormData} from "~/utils/formData";
import {toast} from "~/.server/toast";

export async function action({request}: ActionFunctionArgs) {
    await getCurrentUser(request);

    const result = await getAndValidateFormData(await request.formData(), request, userRoomSchema)
    if (result.init) return result

    const changes = await deleteUserToRoom({
        roomId: result.data.roomId,
        userId: result.data.userId
    });

    if (!changes) return await toast.getDataWithToasts(request, {message: 'Failed to remove user!', status: 'error'}, null)

    return await toast.getDataWithToasts(request, {message: 'Removed user successfully!', status: 'success'}, null)
}