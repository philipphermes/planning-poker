import {and, eq, getTableColumns, isNotNull, or} from "drizzle-orm";
import {AbstractRepository} from "@/lib/server/db/abstract.repository";
import {roomParticipants, rooms, rounds} from "@/lib/server/db/schema";

export class RoundRepository extends AbstractRepository {
    async findCurrentByRoomIdAndUserId(roomId: string, userId: string) {
        return this.safeExecute('findCurrentByRoomIdAndUserId', async () => {
            const [round] = await this.db.select(getTableColumns(rounds))
                .from(rounds)
                .innerJoin(rooms, eq(rounds.roomId, rooms.id))
                .leftJoin(
                    roomParticipants,
                    and(
                        eq(roomParticipants.roomId, rooms.id),
                        eq(roomParticipants.userId, userId)
                    )
                )
                .where(
                    and(
                        eq(rounds.status, 'active'),
                        eq(rounds.roomId, roomId),
                        or(
                            eq(rooms.ownerId, userId),
                            isNotNull(roomParticipants.userId)
                        )
                    )
                )
                .limit(1);

            return round;
        });
    }

    async findOneByIdAndUserId(roundId: string, userId: string) {
        return this.safeExecute('findOneByIdAndUserId', async () => {
            const [round] = await this.db.select(getTableColumns(rounds))
                .from(rounds)
                .innerJoin(rooms, eq(rounds.roomId, rooms.id))
                .leftJoin(
                    roomParticipants,
                    and(
                        eq(roomParticipants.roomId, rooms.id),
                        eq(roomParticipants.userId, userId)
                    )
                )
                .where(
                    and(
                        eq(rounds.id, roundId),
                        or(
                            eq(rooms.ownerId, userId),
                            isNotNull(roomParticipants.userId)
                        )
                    )
                )
                .limit(1);

            return round;
        });
    }

    async findOneIdAndOwnerId(roundId: string, ownerId: string) {
        return this.safeExecute('findOneIdAndOwnerId', async () => {
            const [round] = await this.db.select(getTableColumns(rounds))
                .from(rounds)
                .innerJoin(rooms, eq(rounds.roomId, rooms.id))
                .where(
                    and(
                        eq(rounds.id, roundId),
                        eq(rooms.ownerId, ownerId),
                    )
                )
                .limit(1);

            return round;
        });
    }
}