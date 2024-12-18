import {Form} from "@remix-run/react";
import {findCardsByRoomId} from "~/db/queries/cardsQueries";

export type CardListProps = {
    value: number,
    setValue: (value: number) => void,
    cards: Awaited<ReturnType<typeof findCardsByRoomId>>
}

export function CardList({value, setValue, cards}: CardListProps): JSX.Element {
    return (<Form method="POST" className="w-full max-h-96 md:max-h-none overflow-y-auto md:overflow-y-hidden grid grid-cols-2 md:grid-cols-8 gap-4">
        {cards.map(card =>
            <button
                type="submit"
                onClick={() => setValue(card.time)}
                value={card.time}
                key={card.id}
                className={
                    'card bg-base-300 justify-self-center flex items-center justify-center w-full aspect-square cursor-pointer '
                    + `${value === card.time ? 'text-primary font-bold' : ''}`
                }
            >
                <div className="card-body flex justify-center items-center hover:scale-150 transition-all duration-100 ease-in-out">
                    <span className="text-2xl">{card.time}</span>
                </div>
                <input type="hidden" name="estimate" value={value} />
            </button>
        )}
    </Form>)
}