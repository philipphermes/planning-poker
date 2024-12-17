import {deleteRoom, updateRoom} from "~/db/queries/roomQueries";
import {toast} from "~/.server/toast";
import {getAndValidateFormData} from "~/utils/formData";
import {roomSchema} from "~/validators/roomSchema";

export async function deleteRoomAction(roomId: string, request: Request) {
    const changes = await deleteRoom(roomId)

    if (!changes) return await toast.getDataWithToasts(request, {message: 'Failed deleting room!', status: 'error'}, null)

    await toast.throwRedirectWithToasts(request, {message: 'Deleted room successfully!', status: 'success'}, '/')
}

export async function saveRoomAction(roomId: string, request: Request, formData: FormData) {
    const result = await getAndValidateFormData(formData, request, roomSchema)
    if (result.init) return result

    const changes = await updateRoom({id: roomId, name: result.name})
    if (!changes) return await toast.getDataWithToasts(request, {message: 'Failed update room!', status: 'error'}, null)

    return await toast.getDataWithToasts(request, {message: 'Updated room successfully!', status: 'success'}, null)
}