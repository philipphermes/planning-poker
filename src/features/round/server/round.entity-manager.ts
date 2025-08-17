import {and, eq} from "drizzle-orm";
import {rounds} from "@/lib/server/db/schema";
import {Transaction} from "@/lib/server/db/types";
import {AbstractEntityManager} from "@/lib/server/db/abstract.entity-manager";

export class RoundEntityManager extends AbstractEntityManager {
    async create(name: string, roomId: string) {
        return this.safeExecute('create', async () => {
            return this.db.transaction(async (tx) => {
                const [round] = await tx.insert(rounds).values({
                    name,
                    roomId: roomId,
                    status: 'active',
                }).returning();

                return round;
            });
        });
    }

    async update(id: string) {
        return this.safeExecute('update', async () => {
            return this.db.transaction(async (tx) => {
                const [updatedRound] = await tx.update(rounds)
                    .set({
                        status: 'completed',
                    })
                    .where(and(
                        eq(rounds.id, id),
                    ))
                    .returning();

                return updatedRound;
            });
        });
    }

    async deleteByRoomIdTransaction(roomId: string, tx: Transaction) {
        await tx.delete(rounds).where(
            eq(rounds.roomId, roomId)
        );
    }
}