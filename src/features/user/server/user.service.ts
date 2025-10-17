import {Socket} from "socket.io";
import {IUserService} from "@/features/user/server/user.service.interface";
import {UserRepository} from "@/features/user/server/user.repository";
import {UserEntityManager} from "@/features/user/server/user.entity-manager";
import {IEstimateService} from "@/features/estimate/server/estimate.service.interface";
import {IRoomParticipantService} from "@/features/room-participant/server/room-participant.service.interface";
import {IRoomService} from "@/features/room/server/room.service.interface";
import {ICardSetService} from "@/features/card-set/server/card-set.service.interface";
import {UserUpdateImageInput, UserUpdateNameInput} from "@/features/user/shared/user.validations";
import {UserDto} from "@/features/user/shared/user.types";
import {LibSQLDatabase} from "drizzle-orm/libsql";
import * as schema from "@/lib/server/db/schema";
import {safeExecute} from "@/lib/server/db";
import {getServerSession} from "next-auth";
import {getAuthConfig} from "@/features/auth/server/auth.config";

export class UserService implements IUserService {
    private db: LibSQLDatabase<typeof schema>
    private userRepository: UserRepository;
    private userEntityManager: UserEntityManager;
    private estimateService: IEstimateService;
    private roomParticipantService: IRoomParticipantService;
    private roomService: IRoomService;
    private cardSetService: ICardSetService;

    constructor(
        db: LibSQLDatabase<typeof schema>,
        userRepository: UserRepository,
        userEntityManager: UserEntityManager,
        estimateService: IEstimateService,
        roomParticipantService: IRoomParticipantService,
        roomService: IRoomService,
        cardSetService: ICardSetService,
    ) {
        this.db = db;
        this.userRepository = userRepository;
        this.userEntityManager = userEntityManager;
        this.estimateService = estimateService;
        this.roomParticipantService = roomParticipantService;
        this.roomService = roomService;
        this.cardSetService = cardSetService;
    }

    async updateName(user: UserUpdateNameInput): Promise<UserDto> {
        return await this.userEntityManager.updateName(user);
    }

    async updateImage(user: UserUpdateImageInput): Promise<UserDto> {
        return await this.userEntityManager.updateImage(user);
    }

    async deleteByUserId(userId: string): Promise<void> {
        await safeExecute('delete', async () => {
            await this.db.transaction(async (tx) => {
                await this.estimateService.deleteByUserId(userId, tx);
                await this.roomParticipantService.deleteByUserId(userId, tx);
                await this.roomService.deleteByOwnerId(userId, tx);
                await this.cardSetService.deleteByOwnerId(userId, tx);
                await this.userEntityManager.deleteByUserId(userId, tx);
            });
        })
    }

    async getOneByEmail(email: string): Promise<UserDto | null> {
        const user = await this.userRepository.findOneByEmail(email);

        if (!user) {
            return null;
        }

        return user;
    }

    async getManyExcept(id: string): Promise<UserDto[]> {
        return await this.userRepository.findManyExcept(id);
    }

    /**
     * Specifications:
     * - tries to retrieve user by user saved on socket
     * - disconnects the socket if user was not found
     *
     * @param socket
     */
    async getOneBySocket(socket: Socket): Promise<UserDto | null> {
        const socketUser = socket.data.user;
        if (!socketUser?.email) {
            socket.disconnect(true);
            return null;
        }

        const user = await this.userRepository.findOneByEmail(socketUser.email);

        if (!user) {
            socket.disconnect(true);
            return null;
        }

        return user;
    }

    async getCurrentUser() {
        const session = await getServerSession(getAuthConfig());

        if (!session?.user?.email) {
            return null;
        }

        return this.getOneByEmail(session.user.email);
    }
}