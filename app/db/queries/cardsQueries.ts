import {cards} from "~/db/schema/schema";
import {db} from "~/db/db.server";
import {eq, sql} from "drizzle-orm";
import {Cards} from "~/types/Cards";

export async function findCardsByRoomId(roomId: string) {
    return await db.query.cards.findMany({
            where: eq(cards.roomId, roomId),
            orderBy: sql`CASE 
                WHEN ${cards.value} GLOB '[0-9]*' THEN CAST(${cards.value} AS INTEGER)
                WHEN ${cards.value} = 'XS' THEN 1
                WHEN ${cards.value} = 'S' THEN 2
                WHEN ${cards.value} = 'M' THEN 3
                WHEN ${cards.value} = 'L' THEN 4
                WHEN ${cards.value} = 'XL' THEN 5
                WHEN ${cards.value} = 'XXL' THEN 6
                WHEN ${cards.value} = 'XXXL' THEN 7
                ELSE ${cards.value}
            END`,
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

export async function updateCard(card: Cards) {
    const result = await db
        .update(cards)
        .set({value: card.value})
        .where(eq(cards.id, card.id))

    return result.changes
}

export async function deleteCard(cardId: string) {
    const result = await db
        .delete(cards)
        .where(eq(cards.id, cardId));

    return result.changes;
}

export async function deleteCards(roomId: string) {
    const result = await db
        .delete(cards)
        .where(eq(cards.roomId, roomId));

    return result.changes;
}