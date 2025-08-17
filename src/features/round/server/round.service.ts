import {IRoundService} from "@/features/round/server/round.service.interface";
import {RoundEntityManager} from "@/features/round/server/round.entity-manager";
import {RoundInput} from "@/features/round/shared/round.validations";
import {RoundDto} from "@/features/round/shared/round.types";
import {Transaction} from "@/lib/server/db/types";
import {RoundRepository} from "@/features/round/server/round.repository";

export class RoundService implements IRoundService {
    private roundRepository: RoundRepository;
    private roundEntityManager: RoundEntityManager;

    constructor(
        roundRepository: RoundRepository,
        roundEntityManager: RoundEntityManager,
    ) {
        this.roundRepository = roundRepository;
        this.roundEntityManager = roundEntityManager;
    }

    async create(input: RoundInput): Promise<RoundDto> {
        const createdRound = await this.roundEntityManager.create(input.name, input.roomId);

        return {
            id: createdRound.id,
            name: createdRound.name,
            roomId: createdRound.roomId,
            status: createdRound.status,
        }
    }

    async update(input: RoundInput): Promise<RoundDto> {
        if (!input.id) {
            throw Error('Id required');
        }

        const updatedRound = await this.roundEntityManager.update(input.id);

        return {
            id: updatedRound.id,
            name: updatedRound.name,
            roomId: updatedRound.roomId,
            status: updatedRound.status,
        }
    }

    async deleteByRoomIdTransaction(roomId: string, tx: Transaction): Promise<void> {
        await this.roundEntityManager.deleteByRoomIdTransaction(roomId, tx);
    }

    async getCurrentByRoomIdAndUserId(roomId: string, userId: string): Promise<RoundDto | null> {
        const currentRound = await this.roundRepository.findCurrentByRoomIdAndUserId(roomId, userId);

        if (!currentRound) {
            return null;
        }

        return {
            id: currentRound.id,
            name: currentRound.name,
            roomId: currentRound.roomId,
            status: currentRound.status,
        }
    }

    async getOneByIdAndUserId(roundId: string, userId: string): Promise<RoundDto | null> {
        const round = await this.roundRepository.findOneByIdAndUserId(roundId, userId);

        if (!round) {
            return null;
        }

        return {
            id: round.id,
            name: round.name,
            roomId: round.roomId,
            status: round.status,
        }
    }

    async getOneIdAndOwnerId(input: RoundInput): Promise<RoundDto | null> {
        if (!input.id) {
            return null;
        }

        const round = await this.roundRepository.findOneIdAndOwnerId(input.id, input.ownerId);

        if (!round) {
            return null;
        }

        return {
            id: round.id,
            name: round.name,
            roomId: round.roomId,
            status: round.status,
        }
    }
}