import {getDB} from "@/lib/server/db";
import {EstimateRepository} from "@/features/estimate/server/estimate.repository";
import {EstimateEntityManager} from "@/features/estimate/server/estimate.entity-manager";
import {EstimateService} from "@/features/estimate/server/estimate.service";
import {IEstimateService} from "@/features/estimate/server/estimate.service.interface";

let estimateService: IEstimateService;

export function getEstimateService() {
    if (estimateService) {
        return estimateService;
    }

    const db = getDB();
    const estimateRepository = new EstimateRepository(db);
    const estimateEntityManager = new EstimateEntityManager(db);

    estimateService = new EstimateService(
        estimateRepository,
        estimateEntityManager
    );

    return estimateService;
}