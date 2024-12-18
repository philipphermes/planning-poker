import {Params} from "@remix-run/react";
import {toast} from "~/.server/toast";
import {getAndValidateFormData} from "~/utils/formData";
import {roundSchema} from "~/validators/roundSchema";
import {createRound, findNewestRoundByRoomIdWithEstimations, setRoundVisible} from "~/db/queries/roundQueries";
import {v4 as uuidV4} from "uuid";
import {broadcastToRoom} from "~/.server/room/roomSSE";

export async function newRoundAction(request: Request, formData: FormData, params: Params<string>) {
    if (!params.roomId) return await toast.getDataWithToasts(request, {message: 'Failed start new round!', status: 'error'}, null)

    const result = await getAndValidateFormData(formData, request, roundSchema)
    if (result.init) return result

    const room = await createRound({
        id: uuidV4(),
        name: result.name,
        visible: false,
        roomId: params.roomId,
    })

    if (room.id) await broadcastToRoom(params.roomId)

    return await toast.getDataWithToasts(request, {
        message: room.id ? 'Started new round successfully!' : 'Failed start new round!',
        status: room.id ? 'success' : 'error',
    }, null)
}

export async function flipAction(request: Request, params: Params<string>) {
    if (!params.roomId) return await toast.getDataWithToasts(request, {message: 'Failed flip cards!', status: 'error'}, null)

    const round = await findNewestRoundByRoomIdWithEstimations(params.roomId)

    if (!round?.id) return await toast.getDataWithToasts(request, {message: 'Failed flip cards!', status: 'error'}, null)

    const changes = await setRoundVisible(round.id, !round.visible)
    if (changes) await broadcastToRoom(params.roomId)

    return await toast.getDataWithToasts(request, [], null)
}