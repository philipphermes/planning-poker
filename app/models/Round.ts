import { Estimation } from "./Estimation";
import { Room } from "./Room";

export class Round {
    id: string;
    name: string;
    room: Room[];
    estimations: Estimation[];

    constructor(id: string, name: string, room: Room[], estimations?: Estimation[]) {
        this.id = id;
        this.name = name;
        this.room = room;
        this.estimations = estimations ?? [];
    }
}