import {RoomParticipantRepository} from "@/features/room-participant/server/room-participant.repository";
import {RoomParticipantEntityManager} from "@/features/room-participant/server/room-participant.entity-manager";
import {RoomParticipantsStatus} from "@/lib/server/db/schema";
import {UserActiveDto} from "@/features/room-participant/shared/room-participant.types";
import {Transaction} from "@/lib/server/db/types";
import {SocketConnection} from "@/features/socket/shared/socket.validations";
import {IRoomParticipantService} from "@/features/room-participant/server/room-participant.service.interface";

export class RoomParticipantService implements IRoomParticipantService {
    private roomParticipantRepository: RoomParticipantRepository;
    private roomParticipantEntityManager: RoomParticipantEntityManager;

    constructor(
        roomParticipantRepository: RoomParticipantRepository,
        roomParticipantEntityManager: RoomParticipantEntityManager,
    ) {
        this.roomParticipantRepository = roomParticipantRepository;
        this.roomParticipantEntityManager = roomParticipantEntityManager;
    }

    async updateStatus(input: SocketConnection, status: RoomParticipantsStatus): Promise<void> {
        await this.roomParticipantEntityManager.updateStatus(input.userId, input.roomId, status);
    }

    async update(roomId: string, userIds: string[]): Promise<void> {
        const roomParticipants = await this.roomParticipantRepository.findManyByRoomId(roomId);

        const existingUserIds = new Set(roomParticipants.map(p => p.userId));
        const incomingUserIds = new Set(userIds);

        const usersToAdd = userIds.filter((userId: string) => !existingUserIds.has(userId));
        const usersToRemove = roomParticipants.filter(p => !incomingUserIds.has(p.userId)).map(p => p.userId);

        if (usersToRemove.length > 0) {
            await this.roomParticipantEntityManager.deleteByRoomIdAndUserIds(roomId, usersToRemove);
        }

        if (usersToAdd.length > 0) {
            await this.roomParticipantEntityManager.create(roomId, usersToAdd);
        }
    }

    async deleteByUserId(userId: string, tx: Transaction): Promise<void> {
        await this.roomParticipantEntityManager.deleteByUserId(userId, tx);
    }

    async deleteByRoomIdTransaction(roomId: string, tx: Transaction): Promise<void> {
        await this.roomParticipantEntityManager.deleteByRoomIdTransaction(roomId, tx);
    }

    async getManyByRoomId(roomId: string): Promise<UserActiveDto[]> {
        const roomParticipants = await this.roomParticipantRepository.findManyByRoomId(roomId);

        const userActiveDtos: UserActiveDto[] = [];

        roomParticipants.forEach((roomParticipant) => {
            userActiveDtos.push({
                id: roomParticipant.user.id,
                email: roomParticipant.user.email,
                name: roomParticipant.user.name,
                image: roomParticipant.user.image,
                status: roomParticipant.status,
            });
        })

        return userActiveDtos;
    }
}