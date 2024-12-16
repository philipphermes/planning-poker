import {EstimationForm} from "~/components/estimation/EstimationForm";
import {SSEMessage} from "~/models/SSEMessage";
import {getCurrentUser} from "~/.server/auth";
import {Input} from "~/components/Input";

export type PlacedEstimationListProps = {
    sseMessage?: SSEMessage;
    user: Awaited<ReturnType<typeof getCurrentUser>>;
    value?: Input['value'];
    onChange?: Input['onChange'];
}

export function EstimationList({sseMessage, user, value, onChange}: PlacedEstimationListProps) {
    return (<div className="w-full grid grid-cols-3 gap-2">
        {sseMessage?.estimations.filter(estimation => estimation.user === user.email).length === 0 &&
            <div className="card bg-base-300 flex items-center justify-center">
                <EstimationForm/>
            </div>
        }

        {sseMessage?.estimations.map((estimation, key) =>
            <div key={key} className="card bg-base-300 flex items-center justify-center">
                {estimation.user === user.email ?
                    <EstimationForm value={value} onChange={onChange}/>
                    : <div className="card-body">
                        {estimation.estimation}
                    </div>
                }
            </div>
        )}
    </div>)
}