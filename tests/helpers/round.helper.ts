import {rounds, RoundStatus} from "../../src/lib/server/db/schema";
import {RoundDto} from "../../src/features/round/shared/round.types";
import {getDB} from "../../src/lib/server/db";

export async function haveRound(data: {
    roomId: string,
    name: string,
    status: RoundStatus,
}): Promise<RoundDto> {
    const database = getDB();
    const [round] = await database.insert(rounds).values(data).returning();

    return round;
}