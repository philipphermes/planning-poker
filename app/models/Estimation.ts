import { Round } from "./Round";
import { User } from "./User";

export class Estimation {
    id: string;
    user: User;
    round: Round;
    time: number;

    constructor(id: string, user: User, round: Round, time: number) {
        this.id = id;
        this.user = user;
        this.round = round;
        this.time = time;
    }
}