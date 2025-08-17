import {and, eq, inArray} from "drizzle-orm";
import {AbstractEntityManager} from "@/lib/server/db/abstract.entity-manager";
import {estimates, rounds} from "@/lib/server/db/schema";
import {Transaction} from "@/lib/server/db/types";
import {InsertEstimate} from "@/features/estimate/shared/estimate.types";

export class EstimateEntityManager extends AbstractEntityManager {
    async create(data: InsertEstimate) {
        return this.safeExecute('create', async () => {
            return this.db.transaction(async (tx) => {
                const [estimate] = await tx.insert(estimates).values(data).returning();
                return estimate;
            });
        });
    }

    async updateValue(data: InsertEstimate) {
        return this.safeExecute('updateValue', async () => {
            return this.db.transaction(async (tx) => {
                const [updatedEstimate] = await tx.update(estimates)
                    .set({
                        value: data.value,
                    })
                    .where(and(
                        eq(estimates.userId, data.userId),
                        eq(estimates.roundId, data.roundId),
                    ))
                    .returning();

                return updatedEstimate;
            });
        });
    }

    async deleteByUserId(userId: string, tx: Transaction) {
        return tx.delete(estimates).where(eq(estimates.userId, userId));
    }

    async deleteByRoomIdTransaction(roomId: string, tx: Transaction) {
        const roundsInRoomSubquery = tx
            .select({id: rounds.id})
            .from(rounds)
            .where(eq(rounds.roomId, roomId));

        return tx.delete(estimates).where(inArray(estimates.roundId, roundsInRoomSubquery));
    }
}