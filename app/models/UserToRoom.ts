import { Room } from "./Room";
import {User} from "~/models/User";

export class UserToRoom {
    user: User;
    room: Room;
    role: string;

    constructor(user: User, room: Room, role: string) {
        this.user = user;
        this.room = room;
        this.role = role;
    }
}