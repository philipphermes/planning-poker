import {getDB} from "@/lib/server/db";
import {CardSetRepository} from "@/features/card-set/server/card-set.repository";
import {CardSetEntityManager} from "@/features/card-set/server/card-set.entity-manager";
import {CardSetService} from "@/features/card-set/server/card-set.service";
import {getRoomService} from "@/features/room/server";
import {ICardSetService} from "@/features/card-set/server/card-set.service.interface";

let cardSetService: ICardSetService;

export function getCardSetService() {
    if (cardSetService) {
        return cardSetService;
    }

    const db = getDB();
    const cardSetRepository = new CardSetRepository(db);
    const cardSetEntityManager = new CardSetEntityManager(db);

    cardSetService = new CardSetService(
        cardSetRepository,
        cardSetEntityManager,
        getRoomService(),
    );

    return cardSetService;
}