import {Transaction} from "@/lib/server/db/types";
import {RoundDto} from "@/features/round/shared/round.types";
import {SubmitEstimateInput} from "@/features/estimate/shared/estimate.validations";
import {EstimateDto} from "@/features/estimate/shared/estimate.types";

export interface IEstimateService {
    submit(input: SubmitEstimateInput): Promise<EstimateDto>;

    getManyByRoundId(round: RoundDto): Promise<EstimateDto[]>;

    getOneByUserIdAndRoundId(userId: string, roundId: string): Promise<EstimateDto | null>;

    deleteByUserId(userId: string, tx: Transaction): Promise<void>;

    deleteByRoomIdTransaction(roomId: string, tx: Transaction): Promise<void>;
}