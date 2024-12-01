import { Round } from "~/models/Round";
import { db } from "../db.server";
import { toInsertRound, toRound } from "../mappers/roundMapper";
import { desc, eq } from "drizzle-orm";
import { estimations, rounds } from "../schema/schema";
import { toRoom } from "../mappers/roomMapper";
import { toEstimation } from "../mappers/estimationMapper";

export async function createRound(round: Round): Promise<Round> {
    if (!round.name || !round.room?.id) {
        throw Error('Round name and roomId required')
    }

    const roundData = await db
        .insert(rounds)
        .values(toInsertRound(round))
        .returning()
        .onConflictDoNothing();

    if (!roundData[0]) {
        return round;
    }

    return toRound(roundData[0])
}

export async function findNewestRoundByRoomIdWithEstimations(roomId: string) {
    const round = await db.query.rounds.findFirst({
        with: {
            estimations: {
                with: {
                    user: true
                }
            },
            room: true,
        },
        where: eq(rounds.roomId, roomId),
        orderBy: [desc(rounds.createdAt)],
    });

    return round ? new Round(
        round.name,
        round.id,
        toRoom(round.room),
        round.estimations.map(estimation => toEstimation(estimation, estimation.user))
    ) : null
}