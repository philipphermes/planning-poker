import {cards} from "~/db/schema/schema";
import {db} from "~/db/db.server";
import {eq} from "drizzle-orm";
import {Cards} from "~/types/Cards";

export async function findCardsByRoomId(roomId: string) {
    return await db.query.cards.findMany({
            where: eq(cards.roomId, roomId),
            orderBy: cards.time,
    })
}

export async function createCard(card: Cards) {
    card.createdAt = new Date().valueOf()

    const cardData = await db
        .insert(cards)
        .values(card)
        .returning()
        .onConflictDoNothing();

    return cardData[0] ?? card;
}

export async function updateCard(card: Cards): Promise<number> {
    const result = await db
        .update(cards)
        .set({time: card.time})
        .where(eq(cards.id, card.id))

    return result.changes
}

export async function deleteCard(cardId: string) {
    const result = await db
        .delete(cards)
        .where(eq(cards.id, cardId));

    return result.changes;
}