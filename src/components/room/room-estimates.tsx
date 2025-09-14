import {RoundDto} from "@/features/round/shared/round.types";
import {RoundEstimatesCard} from "@/components/round/round-estimates-card";

export function RoomEstimates({round}: {round: RoundDto}) {
    return (<div className="md:min-h-min py-4">
        <div className='flex flex-wrap gap-4'>
            {round.estimates?.map(estimate => (
                <RoundEstimatesCard estimate={estimate} key={estimate.roundId + estimate.userId} />
            ))}
        </div>
    </div>)
}