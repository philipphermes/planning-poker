import {AbstractSocketHandler} from "@/features/socket/server/handlers/abstract.socket-handler";
import {Server, Socket} from "socket.io";
import {logger} from "@/lib/server/logger";
import {IRoomParticipantService} from "@/features/room-participant/server/room-participant.service.interface";
import {IUserService} from "@/features/user/server/user.service.interface";
import {socketConnectionSchema} from "@/features/socket/shared/socket.validations";

export class DisconnectingSocketHandler extends AbstractSocketHandler<undefined> {
    private userService: IUserService;
    private roomParticipantService: IRoomParticipantService;

    constructor(
        userService: IUserService,
        roomParticipantService: IRoomParticipantService,
    ) {
        super();

        this.userService = userService;
        this.roomParticipantService = roomParticipantService;
    }

    protected get event(): string {
        return "disconnecting";
    }

    protected listener(socket: Socket, io: Server, _data: undefined): Promise<void> {
        const rooms = [...socket.rooms].filter((room) => room !== socket.id);
        return this.disconnect(socket, io, rooms);
    }

    private async disconnect(socket: Socket, io: Server, rooms: string[]) {
        try {
            const user = await this.userService.getOneBySocket(socket);
            if (!user?.id) {
                return;
            }

            for (const room of rooms) {
                const validated = socketConnectionSchema.parse({
                    userId: user.id,
                    roomId: room,
                });

                await this.roomParticipantService.updateStatus(validated, 'inactive')
                const roomParticipants = await this.roomParticipantService.getManyByRoomId(room);

                io.to(validated.roomId).emit('participants', roomParticipants);
            }
        } catch (error) {
            logger.error(`Socket disconnection handler failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return;
        }
    }
}