import {and, eq} from "drizzle-orm";
import {rooms} from "@/lib/server/db/schema";
import {AbstractEntityManager} from "@/lib/server/db/abstract.entity-manager";
import {InsertRoom, SelectRoom} from "@/features/room/shared/room.types";
import {Transaction} from "@/lib/server/db/types";

export class RoomEntityManager extends AbstractEntityManager {
    async create(data: InsertRoom) {
        return this.safeExecute('create', async () => {
            return this.db.transaction(async (tx) => {
                const [room] = await tx.insert(rooms).values(data).returning();
                return room;
            });
        });
    }

    async update(data: SelectRoom) {
        return this.safeExecute('update', async () => {
            return this.db.transaction(async (tx) => {
                const [updatedRoom] = await tx.update(rooms)
                    .set({
                        name: data.name,
                        cardSetId: data.cardSetId
                    })
                    .where(and(
                        eq(rooms.id, data.id),
                        eq(rooms.ownerId, data.ownerId),
                    ))
                    .returning();

                return updatedRoom;
            });
        });
    }

    async deleteByOwnerId(ownerId: string) {
        return this.safeExecute('deleteByOwnerId', async () => {
            return this.db.transaction(async (tx) => {
                await tx.delete(rooms).where(eq(rooms.ownerId, ownerId));
            });
        });
    }

    async deleteByIdAndOwnerIdTransaction(id: string, ownerId: string, tx: Transaction) {
        await tx.delete(rooms).where(and(
            eq(rooms.id, id),
            eq(rooms.ownerId, ownerId)
        ));
    }
}