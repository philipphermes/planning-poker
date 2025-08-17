import {estimates} from "../../src/lib/server/db/schema";
import {EstimateDto} from "../../src/features/estimate/shared/estimate.types";
import {getDB} from "../../src/lib/server/db";

export async function haveEstimate(data: {
    roundId: string,
    userId: string,
    value: string,
}): Promise<EstimateDto> {
    const database = getDB();
    const [estimate] = await database.insert(estimates).values(data).returning();

    return estimate;
}