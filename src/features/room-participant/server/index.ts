import {IRoomParticipantService} from "@/features/room-participant/server/room-participant.service.interface";
import {getDB} from "@/lib/server/db";
import {RoomParticipantRepository} from "@/features/room-participant/server/room-participant.repository";
import {RoomParticipantEntityManager} from "@/features/room-participant/server/room-participant.entity-manager";
import {RoomParticipantService} from "@/features/room-participant/server/room-participant.service";

let roomParticipantService: IRoomParticipantService;

export function getRoomParticipantService() {
    if (roomParticipantService) {
        return roomParticipantService;
    }

    const db = getDB();
    const roomParticipantRepository = new RoomParticipantRepository(db);
    const roomParticipantEntityManager = new RoomParticipantEntityManager(db);

    roomParticipantService = new RoomParticipantService(
        roomParticipantRepository,
        roomParticipantEntityManager,
    );

    return roomParticipantService;
}