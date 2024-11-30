import { Round } from "./Round";
import { User } from "./User";

export const ROLE_MEMBER = 'member'
export const ROLE_OWNER = 'owner'

export class Room {
    id?: string;
    name: string;
    visible: boolean | null;
    users: User[];
    rounds: Round[];

    constructor(name: string, visible: boolean | null, id?: string, users?: User[], rounds?: Round[]) {
        this.id = id;
        this.name = name;
        this.visible = visible;
        this.users = users ?? [];
        this.rounds = rounds ?? [];
    }
}