export type SSEMessage = {
    round: string;
    estimations: SSEEstimation[];
}

export type SSEEstimation = {
    user: string;
    estimation: number | null;
}