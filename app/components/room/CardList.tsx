import {Form} from "@remix-run/react";
import {Button} from "~/components/form/Button";
import {findCardsByRoomId} from "~/db/queries/cardsQueries";

export function CardList({cards}: {cards: Awaited<ReturnType<typeof findCardsByRoomId>>}) {
    return (<Form method="POST" className="flex flex-col gap-4">
        <div
            className="w-full max-h-96 md:max-h-none overflow-y-auto md:overflow-y-hidden grid grid-cols-2 md:grid-cols-6 gap-2">
            {cards.map(card =>
                <div key={card.id}
                     className="card bg-base-300 justify-self-center flex items-center justify-center w-full aspect-square cursor-pointer">
                    <div className="card-body flex justify-center items-center p-2">
                        <input type="text" name={`cards[${card.id}]`} placeholder="/" pattern="^\d*$" defaultValue={card.time} className="text-2xl input input-ghost w-full text-center"/>
                    </div>
                </div>
            )}

            <div key="new" className="card bg-base-300 justify-self-center flex items-center justify-center w-full aspect-square cursor-pointer">
                <div className="card-body flex justify-center items-center p-2">
                    <input type="text" name={`cards[new]`} placeholder="/" pattern="^\d*$" className="text-2xl input input-ghost w-full text-center"/>
                </div>
            </div>
        </div>
        <Button text="Save" type="submit" name="updateCards" className="btn-accent"/>
    </Form>)
}