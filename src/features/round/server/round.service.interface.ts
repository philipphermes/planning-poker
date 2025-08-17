import {RoundInput} from "@/features/round/shared/round.validations";
import {RoundDto} from "@/features/round/shared/round.types";
import {Transaction} from "@/lib/server/db/types";

export interface IRoundService {
    create(input: RoundInput): Promise<RoundDto>;

    update(input: RoundInput): Promise<RoundDto>;

    deleteByRoomIdTransaction(roomId: string, tx: Transaction): Promise<void>;

    getCurrentByRoomIdAndUserId(roomId: string, userId: string): Promise<RoundDto | null>;

    getOneByIdAndUserId(roundId: string, userId: string): Promise<RoundDto | null>;

    getOneIdAndOwnerId(input: RoundInput): Promise<RoundDto | null>;
}