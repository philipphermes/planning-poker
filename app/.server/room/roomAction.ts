import {deleteRoom, updateRoom} from "~/db/queries/roomQueries";
import {toast} from "~/.server/toast";
import {getAndValidateFormData, getAndValidateParsedData, parseFormDataToNestedMap} from "~/utils/formData";
import {roomSchema} from "~/validators/roomSchema";
import {cardsSchema} from "~/validators/cardSchema";
import {createCard, deleteCard, updateCard} from "~/db/queries/cardsQueries";
import {v4 as uuidV4} from "uuid";
import {aw} from "vitest/dist/chunks/reporters.D7Jzd9GS";

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

export async function saveRoomCardsAction(roomId: string, request: Request, formData: FormData) {
    const data = parseFormDataToNestedMap(formData);
    const result = await getAndValidateParsedData(data, request, cardsSchema)
    if (result.init) return result

    console.log(result)

    result.cards.forEach(async (value: string, id: string) => {
        if (id === 'new' && value !== '') {
            await createCard({
                id: uuidV4(),
                time: Number.parseInt(value),
                roomId: roomId,
            })
        } else if (value !== '') {
            await updateCard({
                id: id,
                time: Number.parseInt(value),
                roomId: roomId,
            })
        } else if (id !== 'new') {
            await deleteCard(id)
        }
    })

    return await toast.getDataWithToasts(request, {message: 'Updated cards successfully!', status: 'success'}, null)
}