import {Params} from "@remix-run/react";
import {User} from "~/db/schema/schema";
import {toast} from "~/.server/toast";
import {findNewestRoundByRoomIdWithEstimations} from "~/db/queries/roundQueries";
import {getAndValidateFormData} from "~/utils/formData";
import {estimationSchema} from "~/validators/estimationSchema";
import {createEstimation, updateEstimation} from "~/db/queries/estimationQueries";
import {broadcastToRoom} from "~/.server/room/roomSSE";
import {v4 as uuidV4} from "uuid";

export async function addEstimationAction(request: Request, formData: FormData, params: Params<string>, user: User) {
    if (!params.roomId) return await toast.getDataWithToasts(request, {message: 'Failed to add estimate!', status: 'error'}, null)

    const round = await findNewestRoundByRoomIdWithEstimations(params.roomId)
    if (!round) return await toast.getDataWithToasts(request, {message: 'Failed to add estimate!', status: 'error'}, null)

    const result = await getAndValidateFormData(formData, request, estimationSchema)
    if (result.init) return result

    const estimation = round.estimations.filter(estimation => estimation?.user?.id === user.id)
    
    if (estimation[0]) {
        estimation[0].time = result.estimate
        const changes = await updateEstimation(estimation[0])

        if (changes > 0)  await broadcastToRoom(params.roomId)

        return await toast.getDataWithToasts(request, {
            message: changes > 0 ? 'Updated estimate successfully!' : 'Failed to update estimate!',
            status: changes > 0 ? 'success' : 'error',
        }, null)
    }

    const newEstimation = await createEstimation({
        id: uuidV4(),
        time: result.estimate,
        userId: user.id,
        roundId: round.id,
    });

    if (newEstimation.id) await broadcastToRoom(params.roomId)

    return await toast.getDataWithToasts(request, {
        message: newEstimation.id ? 'Added estimate successfully!' : 'Failed to add estimate!',
        status: newEstimation.id ? 'success' : 'error',
    }, null)
}