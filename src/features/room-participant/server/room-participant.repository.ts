import {eq} from "drizzle-orm";
import {AbstractRepository} from "@/lib/server/db/abstract.repository";
import {roomParticipants} from "@/lib/server/db/schema";

export class RoomParticipantRepository extends AbstractRepository {
    async findManyByRoomId(roomId: string) {
        return this.safeExecute('findManyByRoomId', async () => {
            return this.db.query.roomParticipants.findMany({
                where: eq(roomParticipants.roomId, roomId),
                with: {
                    user: true,
                }
            });
        });
    }
}