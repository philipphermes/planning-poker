import { Room } from "./Room";

export class User {
    id?: string;
    email: string;
    password?: string;
    rooms: Room[];

    constructor(email: string, id?: string, password?: string, rooms?: Room[]) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.rooms = rooms ?? [];
    }

    toSafeUser(): this {
        this.password = undefined
        return this
    }
}