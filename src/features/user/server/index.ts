import {getDB} from "@/lib/server/db";
import {UserService} from "@/features/user/server/user.service";
import {UserRepository} from "@/features/user/server/user.repository";
import {UserEntityManager} from "@/features/user/server/user.entity-manager";
import {IUserService} from "@/features/user/server/user.service.interface";
import {getEstimateService} from "@/features/estimate/server";
import {getRoomParticipantService} from "@/features/room-participant/server";
import {getRoomService} from "@/features/room/server";
import {getCardSetService} from "@/features/card-set/server";

let userService: IUserService;

export const getUserService = () => {
    if (userService) {
        return userService;
    }

    const db = getDB();
    const userRepository = new UserRepository(db);
    const userEntityManager = new UserEntityManager(db);

    userService = new UserService(
        db,
        userRepository,
        userEntityManager,
        getEstimateService(),
        getRoomParticipantService(),
        getRoomService(),
        getCardSetService(),
    );

    return userService;
}