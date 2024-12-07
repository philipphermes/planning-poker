export class SSEMessage {
    round: string;
    estimations: SSEEstimation[];

    constructor(round: string, estimations?: SSEEstimation[]) {
        this.round = round;
        this.estimations = estimations ?? []
    }
}

export class SSEEstimation {
    user: string;
    estimation?: number;

    constructor(user: string, estimation?: number) {
        this.user = user;
        this.estimation = estimation;
    }
}

export interface SSEMessageInterface {
    round: string;
    estimations: SSEEstimationInterface[];
}

export interface SSEEstimationInterface {
    user: string;
    estimation?: number;
}