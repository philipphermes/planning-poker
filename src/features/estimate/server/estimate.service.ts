import {EstimateEntityManager} from "@/features/estimate/server/estimate.entity-manager";
import {EstimateRepository} from "@/features/estimate/server/estimate.repository";
import {Transaction} from "@/lib/server/db/types";
import {RoundDto} from "@/features/round/shared/round.types";
import {SubmitEstimateInput} from "@/features/estimate/shared/estimate.validations";
import {EstimateDto} from "@/features/estimate/shared/estimate.types";
import {IEstimateService} from "@/features/estimate/server/estimate.service.interface";

export class EstimateService implements IEstimateService {
    private estimateRepository: EstimateRepository;
    private estimateEntityManager: EstimateEntityManager;

    constructor(
        estimateRepository: EstimateRepository,
        estimateEntityManager: EstimateEntityManager,
    ) {
        this.estimateRepository = estimateRepository;
        this.estimateEntityManager = estimateEntityManager;
    }

    async submit(input: SubmitEstimateInput): Promise<EstimateDto> {
        const estimate = await this.estimateRepository.findOneByUserIdAndRoundId(input.userId, input.roundId);

        if (estimate) {
            return await this.estimateEntityManager.updateValue(input);
        }

        return await this.estimateEntityManager.create(input);
    }

    async getManyByRoundId(round: RoundDto): Promise<EstimateDto[]> {
        if (!round.id) return [];

        const estimates = await this.estimateRepository.findManyByRoundId(round.id);

        return estimates.map(estimate => {
            return {
                userId: estimate.userId,
                roundId: estimate.roundId,
                value: round.status === 'completed' ? estimate.value : null,
                user: {
                    id: estimate.user.id,
                    email: estimate.user.email,
                    name: estimate.user.name,
                    image: estimate.user.image,
                }
            }
        });
    }

    async getOneByUserIdAndRoundId(userId: string, roundId: string): Promise<EstimateDto | null> {
        const estimate = await this.estimateRepository.findOneByUserIdAndRoundId(userId, roundId);

        if (!estimate) {
            return null;
        }

        return {
            userId: estimate.userId,
            roundId: estimate.roundId,
            value: estimate.value,
        };
    }

    async deleteByUserId(userId: string, tx: Transaction): Promise<void> {
        await this.estimateEntityManager.deleteByUserId(userId, tx);
    }

    async deleteByRoomIdTransaction(roomId: string, tx: Transaction): Promise<void> {
        await this.estimateEntityManager.deleteByRoomIdTransaction(roomId, tx);
    }
}