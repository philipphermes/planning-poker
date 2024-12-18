import {SSEMessage} from "~/models/SSEMessage";
import {getEmailInitials} from "~/utils/user";

export type PlacedEstimationListProps = {
    sseMessage?: SSEMessage;
}

export function EstimationList({sseMessage}: PlacedEstimationListProps) {
    return (<div className="w-full max-h-96 md:max-h-none overflow-visible grid grid-cols-2 md:grid-cols-6 gap-4">
        {sseMessage?.estimations.map((estimation, key) =>
            <div key={key} className="card group [perspective:1000px] drop-shadow-xl">
                <div className={`relative w-full aspect-square transition-all duration-500 [transform-style:preserve-3d] ${sseMessage?.visible ? '[transform:rotateY(180deg)]' : ''}`}>
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden] card bg-base-300 justify-self-center flex items-center justify-center w-full h-full">
                        <div className="card-body flex justify-center items-center cursor-default">
                            <div className="avatar placeholder absolute top-4 left-4">
                                <div className="bg-emerald-100 text-base-100 w-10 rounded-full">
                                    <span className="text-xs">{getEmailInitials(estimation.user)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back face */}
                    <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] card bg-base-300 justify-self-center flex items-center justify-center w-full h-full">
                        <div className="card-body flex justify-center items-center cursor-default">
                            <span className="text-4xl">{estimation.estimation}</span>
                            <div className="avatar placeholder absolute top-4 right-4">
                                <div className="bg-emerald-100 text-base-100 w-10 rounded-full">
                                    <span className="text-xs">{getEmailInitials(estimation.user)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )}
    </div>)
}