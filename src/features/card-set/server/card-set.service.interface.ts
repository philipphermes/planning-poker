import {Transaction} from "@/lib/server/db/types";
import {CardSetCreate, CardSetDto, CardSetUpdate} from "@/features/card-set/shared/card-set.types";
import {DeleteCardSetInput} from "@/features/card-set/shared/card-set.validations";

export interface ICardSetService {
    getManyByOwnerId(userId: string): Promise<CardSetDto[]>;

    getOneByIdAndOwnerId(cardSetId: string, ownerId: string): Promise<CardSetDto | null>;

    create(input: CardSetCreate): Promise<CardSetDto>;

    update(input: CardSetUpdate): Promise<CardSetDto>;

    deleteByIdAndOwnerId(input: DeleteCardSetInput): Promise<void>;

    deleteByOwnerId(ownerId: string, tx: Transaction): Promise<void>;
}