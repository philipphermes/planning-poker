import {and, eq} from "drizzle-orm";
import {AbstractRepository} from "@/lib/server/db/abstract.repository";
import {estimates} from "@/lib/server/db/schema";

export class EstimateRepository extends AbstractRepository {
    async findOneByUserIdAndRoundId(userId: string, roundId: string) {
        return this.safeExecute('findOneByUserIdAndRoundId', async () => {
            return this.db.query.estimates.findFirst({
                where: and(
                    eq(estimates.userId, userId),
                    eq(estimates.roundId, roundId),
                ),
            });
        });
    }

    async findManyByRoundId(roundId: string) {
        return this.safeExecute('findManyByRoundId', async () => {
            return this.db.query.estimates.findMany({
                where: eq(estimates.roundId, roundId),
                with: {
                    user: true,
                }
            });
        });
    }
}