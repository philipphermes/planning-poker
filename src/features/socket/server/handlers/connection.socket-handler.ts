import {
    AbstractSocketHandler,
    SocketHandlerInterface
} from "@/features/socket/server/handlers/abstract.socket-handler";
import {Server, Socket} from "socket.io";
import {logger} from "@/lib/server/logger";
import {IUserService} from "@/features/user/server/user.service.interface";
import {IRoomParticipantService} from "@/features/room-participant/server/room-participant.service.interface";
import {IRoomService} from "@/features/room/server/room.service.interface";
import {IEstimateService} from "@/features/estimate/server/estimate.service.interface";
import {IRoundService} from "@/features/round/server/round.service.interface";
import {socketConnectionSchema} from "@/features/socket/shared/socket.validations";

export class ConnectionSocketHandler extends AbstractSocketHandler<string> implements SocketHandlerInterface{
    private userService: IUserService;
    private roomParticipantService: IRoomParticipantService;
    private estimateService: IEstimateService;
    private roomService: IRoomService;
    private roundService: IRoundService;

    constructor(
        userService: IUserService,
        roomParticipantService: IRoomParticipantService,
        estimateService: IEstimateService,
        roomService: IRoomService,
        roundService: IRoundService,
    ) {
        super();

        this.userService = userService;
        this.roomParticipantService = roomParticipantService;
        this.estimateService = estimateService;
        this.roomService = roomService;
        this.roundService = roundService;
    }

    protected get event(): string {
        return "join";
    }

    protected async listener(socket: Socket, io: Server, data?: string) {
        if (!data) {
            return;
        }

        try {
            const user = await this.userService.getOneBySocket(socket);
            if (!user?.id) {
                return;
            }

            const validated = socketConnectionSchema.parse({
                userId: user.id,
                roomId: data,
            })

            const hasAccess = await this.roomService.hasUserAccess(validated.userId, validated.roomId);
            if (!hasAccess) {
                return;
            }

            socket.join(validated.roomId);

            await this.roomParticipantService.updateStatus(validated, 'active')

            const roomParticipants = await this.roomParticipantService.getManyByRoomId(validated.roomId);
            const round = await this.roundService.getCurrentByRoomIdAndUserId(validated.roomId, user.id)

            io.to(validated.roomId).emit('participants', roomParticipants);

            if (round?.id) {
                const estimates = await this.estimateService.getManyByRoundId(round);
                const estimate = await this.estimateService.getOneByUserIdAndRoundId(validated.userId, round.id);

                io.to(validated.roomId).emit('round', round);
                io.to(validated.roomId).emit('estimates', estimates);
                io.to(socket.id).emit('estimate', estimate);
            }
        } catch (error) {
            logger.error(`Socket connection handler failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return;
        }
    }
}