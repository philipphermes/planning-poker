import {and, eq} from 'drizzle-orm';
import {AbstractRepository} from "@/lib/server/db/abstract.repository";
import {cardSets} from "@/lib/server/db/schema";

export class CardSetRepository extends AbstractRepository {
    async findManyByOwnerId(ownerId: string) {
        return this.safeExecute('findManyByOwnerId', async () => {
            return this.db.select().from(cardSets).where(eq(cardSets.ownerId, ownerId));
        });
    }

    async findOneByIdAndOwnerId(id: string, ownerId: string) {
        return this.safeExecute('findOneByIdAndOwnerId', async () => {
            const result = await this.db.select().from(cardSets).where(and(
                eq(cardSets.id, id),
                eq(cardSets.ownerId, ownerId)
            ));

            return result[0] || null;
        });
    }
}
