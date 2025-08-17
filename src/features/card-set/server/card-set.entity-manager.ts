import {and, eq} from 'drizzle-orm';
import {AbstractEntityManager} from "@/lib/server/db/abstract.entity-manager";
import {cardSets} from "@/lib/server/db/schema";
import {Transaction} from "@/lib/server/db/types";
import {CardSetCreate, CardSetUpdate} from "@/features/card-set/shared/card-set.types";

export class CardSetEntityManager extends AbstractEntityManager {
    async create(cardSet: CardSetCreate) {
        return this.safeExecute('create', async () => {
            return this.db.transaction(async (tx) => {
                const [newCardSet] = await tx.insert(cardSets).values(cardSet).returning();
                return newCardSet;
            });
        });
    }

    async update(cardsSet: CardSetUpdate) {
        return this.safeExecute('update', async () => {
            return this.db.transaction(async (tx) => {
                const [updatedCardSet] = await tx
                    .update(cardSets)
                    .set({
                        name: cardsSet.name,
                        cards: cardsSet.cards,
                    })
                    .where(and(
                        eq(cardSets.id, cardsSet.id),
                        eq(cardSets.ownerId, cardsSet.ownerId))
                    )
                    .returning();
                return updatedCardSet;
            });
        });
    }

    async deleteByIdAndOwnerId(id: string, ownerId: string) {
        return this.safeExecute('deleteByIdAndOwnerId', async () => {
            return this.db.transaction(async (tx) => {
                await tx.delete(cardSets).where(and(eq(cardSets.id, id), eq(cardSets.ownerId, ownerId)));
            });
        });
    }

    async deleteByOwnerId(ownerId: string, tx: Transaction) {
        await tx.delete(cardSets).where(eq(cardSets.ownerId, ownerId));
    }
}
