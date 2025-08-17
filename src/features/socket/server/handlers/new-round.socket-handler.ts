import {AbstractSocketHandler} from "@/features/socket/server/handlers/abstract.socket-handler";
import {Server, Socket} from "socket.io";
import {logger} from "@/lib/server/logger";
import {IUserService} from "@/features/user/server/user.service.interface";
import {IRoomService} from "@/features/room/server/room.service.interface";
import {IRoundService} from "@/features/round/server/round.service.interface";
import {RoundFormInput, roundInputSchema} from "@/features/round/shared/round.validations";

export class NewRoundSocketHandler extends AbstractSocketHandler<RoundFormInput> {
    private userService: IUserService;
    private roomService: IRoomService;
    private roundService: IRoundService;

    constructor(
        userService: IUserService,
        roomService: IRoomService,
        roundService: IRoundService,
    ) {
        super();

        this.userService = userService;
        this.roomService = roomService;
        this.roundService = roundService;
    }

    protected get event(): string {
        return "new-round";
    }

    protected async listener(socket: Socket, io: Server, data?: RoundFormInput) {
        if (!data) {
            return;
        }

        try {
            const user = await this.userService.getOneBySocket(socket);
            if (!user?.id) {
                return;
            }

            const validatedData = roundInputSchema.parse({
                ownerId: user.id,
                ...data
            });

            const isOwner = await this.roomService.isRoomOwner(user.id, validatedData.roomId);
            if (!isOwner) {
                return;
            }

            const round = await this.roundService.create(validatedData);

            io.to(validatedData.roomId).emit('round', round);
            io.to(validatedData.roomId).emit('estimates', []);
            io.to(validatedData.roomId).emit('estimate', null);
        } catch (error) {
            logger.error(`Socket new round creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return;
        }
    }
}