'use server';

import {getUserService} from "@/features/user/server";
import {revalidatePath} from "next/cache";
import {logger} from "@/lib/server/logger";
import {createActionResponse} from "@/lib/server/utils";
import {getCardSetService} from "@/features/card-set/server";
import {
    CardSetFormInput,
    deleteCardSetSchema,
    persistCardSetSchema
} from "@/features/card-set/shared/card-set.validations";

export async function persistCardSetAction(data: CardSetFormInput) {
    const userService = getUserService();
    const cardSetService = getCardSetService();

    try {
        const user = await userService.getCurrentUser();
        if (!user?.id) return createActionResponse(
            'Failed to persist card set. Please try again.',
            false,
        );

        const validated = persistCardSetSchema.parse({
            id: data.id,
            name: data.name,
            cards: data.cards.map(card => card.value),
            ownerId: user.id,
        });

        let persistedCardSet;
        if (validated.id) persistedCardSet = await cardSetService.update({id: validated.id, ...validated});
        else persistedCardSet = await cardSetService.create(validated);

        revalidatePath('/card-set')
        if (persistedCardSet) revalidatePath(`/card-set/${persistedCardSet.id}`);

        return createActionResponse(
            'Successfully saved card set.',
            true,
            persistedCardSet,
        );
    } catch (error) {
        logger.error(error instanceof Error ? error.message : 'Failed to persist card set.');
        return createActionResponse(
            'Failed to persist card set. Please try again.',
            false,
        );
    }
}

export async function deleteCardSetAction(id: string) {
    const userService = getUserService();
    const cardSetService = getCardSetService();

    try {
        const user = await userService.getCurrentUser();
        if (!user?.id) return createActionResponse(
            'Failed to delete card set. Please try again.',
            false,
        );

        const validated = deleteCardSetSchema.parse({
            id: id,
            ownerId: user.id,
        });

        await cardSetService.deleteByIdAndOwnerId(validated);

        revalidatePath('/card-set');
        revalidatePath(`/card-set/${id}`);

        return createActionResponse(
            'Successfully deleted card set.',
            true,
        );
    } catch (error) {
        logger.error(error instanceof Error ? error.message : 'Failed to delete card set.');
        return createActionResponse(
            'Failed to delete card set. Please try again.',
            false,
        );
    }
}