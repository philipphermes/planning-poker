import { Round } from "./Round";
import { User } from "./User";

export class Estimation {
    id?: string;
    time: number | null;
    user?: User;
    round?: Round;

    constructor(time: number | null, id?: string, user?: User, round?: Round) {
        this.id = id;
        this.user = user;
        this.round = round;
        this.time = time;
    }
}