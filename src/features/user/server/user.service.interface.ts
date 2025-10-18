import {Socket} from 'socket.io';
import {UserDto} from "@/features/user/shared/user.types";
import {UserUpdateImageInput, UserUpdateNameInput} from "@/features/user/shared/user.validations";

export interface IUserService {
    getOneByEmail(email: string): Promise<UserDto | null>;

    getManyExcept(id: string): Promise<UserDto[]>;

    updateName(user: UserUpdateNameInput): Promise<UserDto>;

    updateImage(user: UserUpdateImageInput): Promise<UserDto>;

    deleteByUserId(userId: string): Promise<void>;

    getOneBySocket(socket: Socket): Promise<UserDto | null>;

    getCurrentUser(): Promise<UserDto | null>;
}