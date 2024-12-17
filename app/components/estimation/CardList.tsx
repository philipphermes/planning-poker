import {Form} from "@remix-run/react";
import {useState} from "react";

const cards = [
    0,
    2,
    4,
    6,
    8,
    10,
    12,
    14,
    16,
    20,
    24,
    28,
    32,
    36,
    40
] //TODO get times from owner config (maybe room settings or have a default in profile and can be changed on room settings)

export type CardListProps = {
    value: number,
    setValue: (value: number) => void,
}

export function CardList({value, setValue}: CardListProps): JSX.Element {
    return (<Form method="POST" className="w-full max-h-96 md:max-h-none overflow-y-auto md:overflow-y-hidden grid grid-cols-2 md:grid-cols-8 gap-4">
        {cards.map((time, key) =>
            <button
                type="submit"
                onClick={() => setValue(time)}
                value={time}
                key={key}
                className={
                    'card bg-base-300 justify-self-center flex items-center justify-center w-full aspect-square cursor-pointer '
                    + `${value === time ? 'text-primary font-bold' : ''}`
                }
            >
                <div className="card-body flex justify-center items-center hover:scale-150 transition-all duration-100 ease-in-out">
                    <span className="text-2xl">{time}</span>
                </div>
                <input type="hidden" name="estimate" value={value} />
            </button>
        )}
    </Form>)
}