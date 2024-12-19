import {db} from "../db.server";
import {desc, eq} from "drizzle-orm";
import {estimations, rounds} from "../schema/schema";
import {v4 as uuidV4} from "uuid";
import {Rounds} from "~/types/Rounds";

export async function createRound(round: Rounds) {
    round.id = uuidV4();
    round.createdAt = new Date().valueOf()

    const roundData = await db
        .insert(rounds)
        .values(round)
        .returning()
        .onConflictDoNothing();

    return roundData[0] ?? round;
}

export async function setRoundVisible(roundId: string, visible: boolean) {
    const result = await db
        .update(rounds)
        .set({
            visible: visible,
        })
        .where(eq(rounds.id, roundId))

    return result.changes
}

export async function findNewestRoundByRoomIdWithEstimations(roomId: string) {
    return await db.query.rounds.findFirst({
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
}

export async function findNewestRoundByRoomIdWithUserEstimation(roomId: string, userId: string) {
    return await db.query.rounds.findFirst({
        with: {
            estimations: {
                where: eq(estimations.userId, userId)
            },
        },
        where: eq(rounds.roomId, roomId),
        orderBy: [desc(rounds.createdAt)],
    });
}

export async function findRoundsByRoomId(roomId: string) {
    return await db.query.rounds.findMany({
        where: eq(rounds.roomId, roomId)
    })
}

export async function deleteRound(roundId: string) {
    const result = await db
        .delete(rounds)
        .where(eq(rounds.id, roundId));

    return result.changes;
}