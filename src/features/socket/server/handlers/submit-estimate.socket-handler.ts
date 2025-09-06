import {AbstractSocketHandler} from "@/features/socket/server/handlers/abstract.socket-handler";
import {Server, Socket} from "socket.io";
import {logger} from "@/lib/server/logger";
import {IUserService} from "@/features/user/server/user.service.interface";
import {IRoomService} from "@/features/room/server/room.service.interface";
import {IRoundService} from "@/features/round/server/round.service.interface";
import {IEstimateService} from "@/features/estimate/server/estimate.service.interface";
import {SubmitEstimateFormInput, submitEstimateSchema} from "@/features/estimate/shared/estimate.validations";

export class SubmitEstimateSocketHandler extends AbstractSocketHandler<SubmitEstimateFormInput> {
    private userService: IUserService;
    private roomService: IRoomService;
    private roundService: IRoundService;
    private estimateService: IEstimateService;

    constructor(
        userService: IUserService,
        roomService: IRoomService,
        roundService: IRoundService,
        estimateService: IEstimateService,
    ) {
        super();

        this.userService = userService;
        this.roomService = roomService;
        this.roundService = roundService;
        this.estimateService = estimateService;
    }

    protected get event(): string {
        return "submit-estimate";
    }

    protected async listener(socket: Socket, io: Server, data?: SubmitEstimateFormInput) {
        if (!data) {
            return;
        }

        try {
            const user = await this.userService.getOneBySocket(socket);
            if (!user?.id) {
                return;
            }

            const validatedData = submitEstimateSchema.parse({
                userId: user.id,
                ...data,
            });

            const round = await this.roundService.getOneByIdAndUserId(validatedData.roundId, validatedData.userId);
            if (!round) {
                return;
            }

            const estimate = await this.estimateService.submit(validatedData)
            io.to(socket.id).emit('estimate', estimate);

            const estimates = await this.estimateService.getManyByRoundId(round);
            io.to(round.roomId).emit('estimates', estimates);
        } catch (error) {
            logger.error(`Socket estimate submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return;
        }
    }
}