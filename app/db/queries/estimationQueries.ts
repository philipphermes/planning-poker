import {db} from "../db.server";
import {estimations} from "../schema/schema";
import {v4 as uuidV4} from "uuid";
import {eq} from "drizzle-orm";
import {Estimations} from "~/types/Estimations";

export async function createEstimation(estimation: Estimations) {
    estimation.id = uuidV4()
    estimation.createdAt = new Date().valueOf()

    const estimationData = await db
        .insert(estimations)
        .values(estimation)
        .returning()
        .onConflictDoNothing();

    return estimationData[0] ?? estimation;
}

export async function updateEstimation(estimation: Estimations): Promise<number> {
    const result = await db
        .update(estimations)
        .set({value: estimation.value})
        .where(eq(estimations.id, estimation.id))

    return result.changes
}

export async function deleteEstimations(roundId: string) {
    const result = await db
        .delete(estimations)
        .where(eq(estimations.roundId, roundId));

    return result.changes;
}