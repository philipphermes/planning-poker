export interface SSEMessageInterface {
    round: string;
    estimations: SSEEstimationInterface[];
}

export interface SSEEstimationInterface {
    user: string;
    estimation: number | null;
}