import {ConflictError} from '@/lib/shared/errors';
import {CardSetEntityManager} from "@/features/card-set/server/card-set.entity-manager";
import {CardSetRepository} from "@/features/card-set/server/card-set.repository";
import {Transaction} from "@/lib/server/db/types";
import {CardSetCreate, CardSetDto, CardSetUpdate} from "@/features/card-set/shared/card-set.types";
import {DeleteCardSetInput} from "@/features/card-set/shared/card-set.validations";
import {ICardSetService} from "@/features/card-set/server/card-set.service.interface";
import {IRoomService} from "@/features/room/server/room.service.interface";

export class CardSetService implements ICardSetService {
    private cardSetRepository: CardSetRepository;
    private cardSetEntityManager: CardSetEntityManager;
    private roomService: IRoomService;

    constructor(
        cardSetRepository: CardSetRepository,
        cardSetEntityManager: CardSetEntityManager,
        roomService: IRoomService,
    ) {
        this.cardSetRepository = cardSetRepository;
        this.cardSetEntityManager = cardSetEntityManager;
        this.roomService = roomService;
    }

    async getManyByOwnerId(userId: string): Promise<CardSetDto[]> {
        const cardSets = await this.cardSetRepository.findManyByOwnerId(userId);

        return cardSets.map(cardSet => {
            return {
                id: cardSet.id,
                name: cardSet.name,
                cards: cardSet.cards,
            }
        })
    }

    async getOneByIdAndOwnerId(cardSetId: string, ownerId: string): Promise<CardSetDto | null> {
        const cardSet = await this.cardSetRepository.findOneByIdAndOwnerId(cardSetId, ownerId);

        if (!cardSet) {
            return null;
        }

        return {
            id: cardSet.id,
            name: cardSet.name,
            cards: cardSet.cards,
        }
    }

    async create(input: CardSetCreate): Promise<CardSetDto> {
        const cardSet = await this.cardSetEntityManager.create(input);

        return {
            id: cardSet.id,
            name: cardSet.name,
            cards: cardSet.cards,
        }
    }

    async update(input: CardSetUpdate): Promise<CardSetDto> {
        const cardSet = await this.cardSetEntityManager.update(input);

        return {
            id: cardSet.id,
            name: cardSet.name,
            cards: cardSet.cards,
        }
    }

    async deleteByIdAndOwnerId(input: DeleteCardSetInput) {
        const roomsHaveCardSet = await this.roomService.isCardSetInRoom(input.id);

        if (roomsHaveCardSet) {
            throw new ConflictError('Cannot delete card set as it is being used by one or more rooms');
        }

        return this.cardSetEntityManager.deleteByIdAndOwnerId(input.id, input.ownerId);
    }

    async deleteByOwnerId(ownerId: string, tx: Transaction) {
        await this.cardSetEntityManager.deleteByOwnerId(ownerId, tx);
    }
}