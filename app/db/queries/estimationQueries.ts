import { db } from "../db.server";
import { estimations } from "../schema/schema";
import { Estimation } from "~/models/Estimation";
import { v4 as uuidV4 } from "uuid";
import { toEstimation } from "../mappers/estimationMapper";
import { eq } from "drizzle-orm";

export async function createEstimation(estimation: Estimation): Promise<Estimation> {
    const estimationData = await db
        .insert(estimations)
        .values({
            id: uuidV4(),
            roundId: estimation.round?.id,
            userId: estimation.user?.id,
            time: estimation.time
        })
        .returning()
        .onConflictDoNothing();

    if (!estimationData[0]) {
        return estimation;
    }

    return toEstimation(estimationData[0])
}

export async function updateEstimation(estimation: Estimation): Promise<number> {
    const result = await db
        .update(estimations)
        .set({
            time: estimation.time
        })
        .where(eq(estimations.id, estimation.id))

    return result.changes
}