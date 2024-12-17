import {Params} from "@remix-run/react";
import {toast} from "~/.server/toast";
import {getAndValidateFormData} from "~/utils/formData";
import {roundSchema} from "~/validators/roundSchema";
import {createRound} from "~/db/queries/roundQueries";
import {v4 as uuidV4} from "uuid";
import {broadcastToRoom} from "~/.server/room/roomSSE";

export async function newRoundAction(request: Request, formData: FormData, params: Params<string>) {
    if (!params.roomId) return await toast.getDataWithToasts(request, {message: 'Failed start new round!', status: 'error'}, null)

    const result = await getAndValidateFormData(formData, request, roundSchema)
    if (result.init) return result

    const room = await createRound({
        id: uuidV4(),
        name: result.name,
        roomId: params.roomId,
    })

    if (room.id) await broadcastToRoom(params.roomId)

    return await toast.getDataWithToasts(request, {
        message: room.id ? 'Started new round successfully!' : 'Failed start new round!',
        status: room.id ? 'success' : 'error',
    }, null)
}