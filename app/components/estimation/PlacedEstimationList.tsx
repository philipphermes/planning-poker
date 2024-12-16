import {SSEMessage} from "~/models/SSEMessage";

export type PlacedEstimationListProps = {
    sseMessage?: SSEMessage;
}

export function PlacedEstimationList({sseMessage}: PlacedEstimationListProps) {
    return (<div className="absolute bottom-8 right-8 card bg-base-300 w-96 shadow-xl">
        <div className="card-body flex flex-col gap-2">
            <h3 className="font-bold">Placed estimation:</h3>
            {!sseMessage ? <span className="loading loading-dots loading-md"></span>
                : <ul>
                    {sseMessage.estimations.map((estimation, key) =>
                        <li key={key}>{estimation.user}</li>
                    )}
                </ul>}
        </div>
    </div>)
}