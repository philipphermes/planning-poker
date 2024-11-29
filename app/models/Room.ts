import { Round } from "./Round";
import { User } from "./User";

export class Room {
    id: string;
    name: string;
    visible: boolean;
    users: User[];
    rounds: Round[];

    constructor(id: string, name: string, visible: boolean, users?: User[], rounds?: Round[]) {
        this.id = id;
        this.name = name;
        this.visible = visible;
        this.users = users ?? [];
        this.rounds = rounds ?? [];
    }
}