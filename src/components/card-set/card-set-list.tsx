import Link from "next/link";
import {Edit} from "lucide-react";
import {CardSetDto} from "@/features/card-set/shared/card-set.types";
import {CardSetDelete} from "@/components/card-set/card-set-delete";

type CardSetListProps = {
    cardSets: CardSetDto[]
}

export async function CardSetList({cardSets}: CardSetListProps) {
    return (
        <div className="bg-muted/50 flex flex-col rounded-xl h-full p-4 gap-4 overflow-y-auto">
            {cardSets.map(cardSet => (
                <div key={cardSet.id} className="bg-muted/75 w-full rounded-xl p-4 flex flex-col gap-4">
                    <div className="w-full flex justify-between items-center">
                        <span className='text-lg'>{cardSet.name}</span>
                        <div className='flex items-center gap-4'>
                            <Link href={`/card-set/${cardSet.id}`}><Edit/></Link>
                            <CardSetDelete id={cardSet.id}/>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap'>
                        {cardSet.cards.map(card => (
                            <div key={card}
                                 className="bg-primary p-2 aspect-square h-10 flex justify-center items-center rounded-xl">
                                <span className='text-lg text-primary-foreground'>{card}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}