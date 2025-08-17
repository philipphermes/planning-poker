import {and, eq, inArray} from "drizzle-orm";
import {roomParticipants, RoomParticipantsStatus} from "@/lib/server/db/schema";
import {Transaction} from "@/lib/server/db/types";
import {AbstractEntityManager} from "@/lib/server/db/abstract.entity-manager";

export class RoomParticipantEntityManager extends AbstractEntityManager {
    async create(roomId: string, userIds: string[]) {
        return this.safeExecute('create', async () => {
            return this.db.transaction(async (tx) => {
                return tx.insert(roomParticipants).values(userIds.map((userId: string) => ({
                    userId: userId,
                    roomId: roomId,
                })));
            });
        });
    }

    async updateStatus(userId: string, roomId: string, status: RoomParticipantsStatus) {
        return this.safeExecute('updateStatus', async () => {
            return this.db.transaction(async (tx) => {
                return tx.update(roomParticipants)
                    .set({
                        status: status,
                    })
                    .where(and(
                        eq(roomParticipants.userId, userId),
                        eq(roomParticipants.roomId, roomId),
                    ))
            });
        });
    }

    async deleteByRoomIdAndUserIds(roomId: string, userIds: string[]) {
        return this.safeExecute('deleteByRoomIdAndUserIds', async () => {
            return this.db.transaction(async (tx) => {
                await tx.delete(roomParticipants).where(and(
                    eq(roomParticipants.roomId, roomId),
                    inArray(roomParticipants.userId, userIds)
                ));
            });
        });
    }

    async deleteByUserId(userId: string, tx: Transaction) {
        await tx.delete(roomParticipants).where(
            eq(roomParticipants.userId, userId)
        );
    }

    async deleteByRoomIdTransaction(roomId: string, tx: Transaction) {
        await tx.delete(roomParticipants).where(
            eq(roomParticipants.roomId, roomId)
        );
    }
}