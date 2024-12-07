import {Round} from "~/models/Round";
import {v4 as uuidV4} from "uuid";
import {InsertRound, SelectRound} from "../schema/schema";

export function toRound(round: SelectRound): Round {
    const roundTransfer = new Round(
        round.name,
        round.id,
    );

    return roundTransfer
}

export function toInsertRound(round: Round): InsertRound {
    return {
        id: uuidV4(),
        name: round.name,
        roomId: round.room.id
    }
}