import {UserDto} from "@/features/user/shared/user.types";

export interface CardSetDto {
    id: string;
    name: string;
    cards: string[];
    owner?: UserDto;
}

export type CardSetCreate = {
    name: string;
    cards: string[];
    ownerId: string;
}

export type CardSetUpdate = {
    id: string;
    name: string;
    cards: string[];
    ownerId: string;
}