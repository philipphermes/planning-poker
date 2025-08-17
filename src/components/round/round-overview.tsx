import {RoundCardSet} from "@/components/round/round-card-set";
import {RoomDto} from "@/features/room/shared/room.types";
import {RoundDto} from "@/features/round/shared/round.types";

export function RoundOverview({room, round}: { room: RoomDto, round?: RoundDto }) {
    if (!round) {
        return null;
    }

    return (<div className="bg-muted/50 min-h-[100vh] rounded-xl md:min-h-min p-4 space-y-4">
        <h2 className='text-xl'>{round.name}</h2>
        <RoundCardSet room={room} round={round}/>
    </div>)
}