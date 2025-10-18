import {IRoundService} from "@/features/round/server/round.service.interface";
import {LibSQLDatabase} from "drizzle-orm/libsql";
import {safeExecute} from "@/lib/server/db";
import {RoomRepository} from "@/features/room/server/room.repository";
import {RoomEntityManager} from "@/features/room/server/room.entity-manager";
import {RoomDto} from "@/features/room/shared/room.types";
import {CreateRoomInput, DeleteRoomInput, UpdateRoomInput} from "@/features/room/shared/room.validations";
import {Transaction} from "@/lib/server/db/types";
import {NotFoundError} from "@/lib/shared/errors";
import * as schema from "@/lib/server/db/schema";
import {IRoomService} from "@/features/room/server/room.service.interface";
import {IEstimateService} from "@/features/estimate/server/estimate.service.interface";
import {IRoomParticipantService} from "@/features/room-participant/server/room-participant.service.interface";

export class RoomService implements IRoomService {
    private db: LibSQLDatabase<typeof schema>
    private roomRepository: RoomRepository;
    private roomEntityManager: RoomEntityManager;
    private roomParticipantService: IRoomParticipantService;
    private roundService: IRoundService;
    private estimateService: IEstimateService;

    constructor(
        db: LibSQLDatabase<typeof schema>,
        roomRepository: RoomRepository,
        roomEntityManager: RoomEntityManager,
        roomParticipantService: IRoomParticipantService,
        roundService: IRoundService,
        estimateService: IEstimateService,
    ) {
        this.db = db;
        this.roomRepository = roomRepository;
        this.roomEntityManager = roomEntityManager;
        this.roomParticipantService = roomParticipantService;
        this.roundService = roundService;
        this.estimateService = estimateService;
    }

    async create(input: CreateRoomInput): Promise<RoomDto> {
        const room = await this.roomEntityManager.create(input);

        const userIds = input.userIds;
        userIds.push(input.ownerId);

        await this.roomParticipantService.update(room.id, userIds)

        return room;
    }

    async update(input: UpdateRoomInput) {
        const room = await this.roomEntityManager.update(input);

        const userIds = input.userIds;
        userIds.push(input.ownerId);

        await this.roomParticipantService.update(room.id, input.userIds);

        return room;
    }

    async delete(input: DeleteRoomInput, tx?: Transaction) {
        const room = await this.roomRepository.findOneByIdAndOwnerId(input.id, input.ownerId);

        if (!room) {
            throw new NotFoundError('Room');
        }

        const deleteCallback = async (tx: Transaction) => {
            await this.estimateService.deleteByRoomIdTransaction(room.id, tx);
            await this.roundService.deleteByRoomIdTransaction(room.id, tx);
            await this.roomParticipantService.deleteByRoomIdTransaction(room.id, tx);
            await this.roomEntityManager.deleteByIdAndOwnerIdTransaction(room.id, room.ownerId, tx);
        }

        if (tx) {
            await deleteCallback(tx)
        } else {
            await safeExecute('delete', async () => {
                await this.db.transaction(async (tx) => deleteCallback(tx));
            })
        }
    }

    async deleteByOwnerId(ownerId: string, tx: Transaction) {
        const rooms = await this.getManyByOwnerId(ownerId);

        for (const room of rooms) {
            await this.delete({id: room.id, ownerId: ownerId}, tx);
        }
    }

    async getManyByOwnerId(ownerId: string): Promise<RoomDto[]> {
        const rooms = await this.roomRepository.findManyByOwnerId(ownerId);

        return rooms.map(room => {
            return {
                id: room.id,
                name: room.name,
                ownerId: room.ownerId,
                cardSetId: room.cardSetId,
                owner: {
                    id: room.owner.id,
                    email: room.owner.email,
                    name: room.owner.name,
                    image: room.owner.image,
                },
                cardSet: {
                    id: room.cardSet.id,
                    name: room.cardSet.name,
                    cards: room.cardSet.cards,
                },
                participants: room.roomParticipants.map(participant => {
                    return {
                        id: participant.user.id,
                        email: participant.user.email,
                        name: participant.user.name,
                        image: participant.user.image,
                    }
                })
            }
        });
    }

    async getManyByUserId(userId: string): Promise<RoomDto[]> {
        const rooms = await this.roomRepository.findManyByUserId(userId);

        return rooms.map(room => {
            return {
                id: room.id,
                name: room.name,
                ownerId: room.ownerId,
                cardSetId: room.cardSetId,
                owner: {
                    id: room.owner.id,
                    email: room.owner.email,
                    name: room.owner.name,
                    image: room.owner.image,
                },
                cardSet: {
                    id: room.cardSet.id,
                    name: room.cardSet.name,
                    cards: room.cardSet.cards,
                },
                participants: room.roomParticipants.map(participant => {
                    return {
                        id: participant.user.id,
                        email: participant.user.email,
                        name: participant.user.name,
                        image: participant.user.image,
                    }
                })
            }
        });
    }

    async getOneByIdAndUserId(roomId: string, userId: string): Promise<RoomDto | null> {
        const room = await this.roomRepository.findOneByIdAndUserId(roomId, userId);
        if (!room) {
            return null;
        }

        return {
            id: room.id,
            name: room.name,
            ownerId: room.ownerId,
            cardSetId: room.cardSetId,
            owner: {
                id: room.owner.id,
                email: room.owner.email,
                name: room.owner.name,
                image: room.owner.image,
            },
            cardSet: {
                id: room.cardSet.id,
                name: room.cardSet.name,
                cards: room.cardSet.cards,
            },
            participants: room.roomParticipants.map(participant => {
                return {
                    id: participant.user.id,
                    email: participant.user.email,
                    name: participant.user.name,
                    image: participant.user.image,
                }
            })
        }
    }

    async getOneByIdAndOwnerId(roomId: string, ownerId: string): Promise<RoomDto | null> {
        const room = await this.roomRepository.findOneByIdAndOwnerId(roomId, ownerId);
        if (!room) {
            return null;
        }

        return {
            id: room.id,
            name: room.name,
            ownerId: room.ownerId,
            cardSetId: room.cardSetId,
            owner: {
                id: room.owner.id,
                email: room.owner.email,
                name: room.owner.name,
                image: room.owner.image,
            },
            cardSet: {
                id: room.cardSet.id,
                name: room.cardSet.name,
                cards: room.cardSet.cards,
            },
            participants: room.roomParticipants.map(participant => {
                return {
                    id: participant.user.id,
                    email: participant.user.email,
                    name: participant.user.name,
                    image: participant.user.image,
                }
            })
        }
    }

    async getOneByIdAndOwnerIdForExport(roomId: string, userId: string): Promise<RoomDto | null> {
        const room = await this.roomRepository.findOneByIdAndOwnerIdForExport(roomId, userId);

        if (!room) {
            return null;
        }

        return {
            id: room.id,
            name: room.name,
            ownerId: room.ownerId,
            cardSetId: room.cardSetId,
            rounds: room.rounds.map(round => {
                return {
                    id: round.id,
                    name: round.name,
                    status: round.status,
                    roomId: round.roomId,
                    estimates: round.estimates.map(estimate => {
                        return {
                            roundId: estimate.roundId,
                            userId: estimate.userId,
                            value: estimate.value,
                            user: {
                                id: estimate.user.id,
                                email: estimate.user.email,
                                name: estimate.user.name,
                                image: estimate.user.image,
                            }
                        }
                    }),
                }
            })
        }
    }

    async isCardSetInRoom(cardSetId: string): Promise<boolean> {
        const roomsWithCardSet = await this.roomRepository.findIdsByCardSetId(cardSetId);

        return roomsWithCardSet.length > 0;
    }

    async hasUserAccess(userId: string, roomId: string): Promise<boolean> {
        const room = await this.roomRepository.findOneByIdAndUserId(roomId, userId);
        return room !== undefined && room !== null;
    }

    async isRoomOwner(userId: string, roomId: string): Promise<boolean> {
        const room = await this.roomRepository.findOneByIdAndOwnerId(roomId, userId);
        return room !== undefined && room !== null;
    }
}