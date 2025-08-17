import {and, eq, inArray, or} from "drizzle-orm";
import {AbstractRepository} from "@/lib/server/db/abstract.repository";
import {roomParticipants, rooms} from "@/lib/server/db/schema";

export class RoomRepository extends AbstractRepository {
    async findManyByOwnerId(ownerId: string) {
        return this.safeExecute('findManyByOwnerId', async () => {
            return this.db.query.rooms.findMany({
                where: eq(rooms.ownerId, ownerId),
                with: {
                    owner: true,
                    cardSet: true,
                    roomParticipants: {
                        with: {
                            user: true,
                        },
                    },
                },
            });
        });
    }

    async findManyByUserId(userId: string) {
        return this.safeExecute('findManyByUserId', async () => {
            const roomParticipantsSubquery = this.getRoomParticipantsSubquery(userId);

            return this.db.query.rooms.findMany({
                where: inArray(rooms.id, roomParticipantsSubquery),
                with: {
                    owner: true,
                    cardSet: true,
                    roomParticipants: {
                        with: {
                            user: true,
                        },
                    },
                },
            });
        });
    }

    async findOneByIdAndUserId(roomId: string, userId: string) {
        return this.safeExecute('findOneByIdAndUserId', async () => {
            const roomParticipantsSubquery = this.getRoomParticipantsSubquery(userId);

            return this.db.query.rooms.findFirst({
                where: and(
                    eq(rooms.id, roomId),
                    or(
                        eq(rooms.ownerId, userId),
                        inArray(rooms.id, roomParticipantsSubquery)
                    ),
                ),
                with: {
                    owner: true,
                    cardSet: true,
                    roomParticipants: {
                        with: {
                            user: true,
                        },
                    },
                },
            });
        });
    }

    async findOneByIdAndOwnerId(roomId: string, ownerId: string) {
        return this.safeExecute('findOneByIdAndOwnerId', async () => {
            return this.db.query.rooms.findFirst({
                where: and(
                    eq(rooms.id, roomId),
                    eq(rooms.ownerId, ownerId),
                ),
            });
        });
    }

    async findOneByIdAndOwnerIdForExport(roomId: string, ownerId: string) {
        return this.safeExecute('findOneByIdAndOwnerIdForExport', async () => {
            return this.db.query.rooms.findFirst({
                where: and(
                    eq(rooms.id, roomId),
                    eq(rooms.ownerId, ownerId),
                ),
                with: {
                    rounds: {
                        with: {
                            estimates: {
                                with: {
                                    user: true,
                                }
                            }
                        }
                    }
                }
            });
        });
    }

    async findIdsByCardSetId(cardSetId: string): Promise<{ id: string }[]> {
        return this.safeExecute('findRoomIdsByCardSet', async () => {
            return this.db.select({id: rooms.id})
                .from(rooms)
                .where(eq(rooms.cardSetId, cardSetId));
        });
    }

    private getRoomParticipantsSubquery(userId: string) {
        return this.db
            .select({id: roomParticipants.roomId})
            .from(roomParticipants)
            .where(eq(roomParticipants.userId, userId))
    }
}