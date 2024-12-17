import {SSEMessage} from "~/models/SSEMessage";
import {getEmailInitials} from "~/utils/user";

export type PlacedEstimationListProps = {
    sseMessage?: SSEMessage;
}

export function EstimationList({sseMessage}: PlacedEstimationListProps) {
    return (<div className="w-full max-h-96 md:max-h-none overflow-y-auto md:overflow-y-hidden grid grid-cols-2 md:grid-cols-6 gap-4">
        {sseMessage?.estimations.map((estimation, key) =>
            <div key={key} className="card bg-base-300 justify-self-center flex items-center justify-center w-full aspect-square">
                <div className="card-body flex justify-center items-center cursor-default">
                    <span className="text-4xl">{estimation.estimation}</span>
                    <div className="avatar placeholder absolute top-4 right-4">
                        <div className="bg-emerald-100 text-base-100 w-10 rounded-full">
                            <span className="text-xs">{getEmailInitials(estimation.user)}</span>
                        </div>
                    </div>
                </div>
            </div>)}
    </div>)
}