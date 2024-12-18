import {cards} from "~/db/schema/schema";
import {findCardsByRoomId} from "~/db/queries/cardsQueries";
import {SSEEstimation, SSEMessage} from "~/types/SSEMessage";

export type Cards = typeof cards.$inferInsert;

export type CardButtonInputProp = {
    card: Awaited<ReturnType<typeof findCardsByRoomId>>[0];
    value: number;
    setValue: (value: number) => void;
}

export type CardProp = {
    card: Awaited<ReturnType<typeof findCardsByRoomId>>[0];
    value: number;
    setValue: (value: number) => void;
    sseMessage: SSEMessage;
    estimation: SSEEstimation;
    inputName: string;
}