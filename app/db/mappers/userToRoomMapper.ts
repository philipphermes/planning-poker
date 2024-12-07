import {SelectedUsersToRooms} from "../schema/schema";
import {UserToRoom} from "~/models/UserToRoom";
import {toRoom} from "~/db/mappers/roomMapper";
import {toUser} from "~/db/mappers/userMapper";

export function toUserToRoom(userToRoom: SelectedUsersToRooms): UserToRoom {
    return new UserToRoom(
        toUser(userToRoom.user),
        toRoom(userToRoom.room),
        userToRoom.role,
    )
}