export type SSEMessage = {
    round: string;
    visible: boolean;
    estimations: SSEEstimation[];
}

export type SSEEstimation = {
    user: string;
    estimation: string | null;
}