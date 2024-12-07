import {ActionFunctionArgs, data} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";
import {sessionStorage} from "~/.server/session";
import {addToastMessages} from "~/.server/toasts";
import {deleteUserToRoom} from "~/db/queries/roomQueries";
import {Toast} from "~/models/Toast";
import {userRoomSchema} from "~/validators/userRoomSchema";

export async function action({request}: ActionFunctionArgs) {
    await getCurrentUser(request);

    const formData = Object.fromEntries(await request.formData())
    const result = userRoomSchema.safeParse(formData);

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

    const changes = await deleteUserToRoom(result.data.roomId, result.data.userId)

    if (!changes) {
        return data(null)
    }

    const session = await addToastMessages(request, [new Toast('Removed user successfully!', true)])

    return data(null, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    })
}