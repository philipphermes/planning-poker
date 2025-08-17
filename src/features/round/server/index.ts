import {RoundRepository} from "@/features/round/server/round.repository";
import {RoundEntityManager} from "@/features/round/server/round.entity-manager";
import {IRoundService} from "@/features/round/server/round.service.interface";
import {RoundService} from "@/features/round/server/round.service";
import {getDB} from "@/lib/server/db";

let roundService: IRoundService;

export function getRoundService() {
    if (roundService) {
        return roundService;
    }

    const db = getDB();
    const roundRepository = new RoundRepository(db);
    const roundEntityManager = new RoundEntityManager(db);

    roundService = new RoundService(
        roundRepository,
        roundEntityManager,
    );

    return roundService;
}