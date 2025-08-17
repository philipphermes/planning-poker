import {getDB} from "@/lib/server/db";
import {RoomRepository} from "@/features/room/server/room.repository";
import {RoomEntityManager} from "@/features/room/server/room.entity-manager";
import {getRoundService} from "@/features/round/server";
import {getEstimateService} from "@/features/estimate/server";
import {RoomService} from "@/features/room/server/room.service";
import {getRoomParticipantService} from "@/features/room-participant/server";
import {IRoomService} from "@/features/room/server/room.service.interface";

let roomService: IRoomService;

export function getRoomService() {
    if (roomService) {
        return roomService;
    }

    const db = getDB();
    const roomRepository = new RoomRepository(db);
    const roomEntityManager = new RoomEntityManager(db);

    roomService = new RoomService(
        db,
        roomRepository,
        roomEntityManager,
        getRoomParticipantService(),
        getRoundService(),
        getEstimateService(),
    );

    return roomService;
}