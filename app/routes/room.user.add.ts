import {ActionFunctionArgs} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {addUserToRoom} from "~/db/queries/userToRoomQueries";
import {getAndValidateFormData} from "~/utils/formData";
import {getDataWithToast} from "~/utils/toast";
import {userRoomSchema} from "~/validators/userRoomSchema";

export async function action({request}: ActionFunctionArgs) {
    await getCurrentUser(request);

    const result = await getAndValidateFormData(await request.formData(), request, userRoomSchema)
    if (result.init) return result

    const changes = await addUserToRoom({
        roomId: result.data.roomId,
        userId: result.data.userId,
    });

    if (!changes) return await getDataWithToast(request, 'Failed to add user!', false, null)

    return await getDataWithToast(request, 'Added user successfully!', true, null)
}