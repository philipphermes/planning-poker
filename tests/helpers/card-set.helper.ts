import {cardSets} from "../../src/lib/server/db/schema";
import {CardSetDto} from "../../src/features/card-set/shared/card-set.types";
import {getDB} from "../../src/lib/server/db";

export async function haveCardSet({userId, name, cards}: {
    userId: string,
    name?: string,
    cards?: string[],
}): Promise<CardSetDto> {
    const database = getDB();
    const data = {
        name: name ?? 'card_set_' + new Date().getTime(),
        cards: cards ?? ['1', '2', '3'],
        ownerId: userId,
    };

    const [cardSet] = await database.insert(cardSets).values(data).returning();
    return cardSet;
}