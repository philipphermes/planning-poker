import {ActionFunctionArgs} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {userRoomSchema} from "~/validators/userRoomSchema";
import {deleteUserToRoom} from "~/db/queries/userToRoomQueries";
import {getAndValidateFormData} from "~/utils/formData";
import {getDataWithToast} from "~/utils/toast";

export async function action({request}: ActionFunctionArgs) {
    await getCurrentUser(request);

    const result = await getAndValidateFormData(await request.formData(), request, userRoomSchema)
    if (result.init) return result

    const changes = await deleteUserToRoom({
        roomId: result.data.roomId,
        userId: result.data.userId
    });

    if (!changes) return await getDataWithToast(request, 'Failed to remove user!', false, null)

    return await getDataWithToast(request, 'Removed user successfully!', true, null)
}