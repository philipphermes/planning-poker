import { Room } from "./Room";

export class User {
    id?: string;
    email: string;
    password?: string;
    rooms: Room[];
    role?: string;

    constructor(email: string, id?: string, password?: string, rooms?: Room[], role?: string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.rooms = rooms ?? [];
        this.role = role;
    }

    toSafeUser(): this {
        this.password = undefined
        return this
    }
}