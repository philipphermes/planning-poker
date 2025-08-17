import {SocketService} from "@/features/socket/server/socket.service";
import {ConnectionSocketHandler} from "@/features/socket/server/handlers/connection.socket-handler";
import {ISocketService} from "@/features/socket/server/socket.service.interface";
import {getUserService} from "@/features/user/server";
import {getRoomParticipantService} from "@/features/room-participant/server";
import {getEstimateService} from "@/features/estimate/server";
import {getRoomService} from "@/features/room/server";
import {getRoundService} from "@/features/round/server";
import {DisconnectingSocketHandler} from "@/features/socket/server/handlers/disconnecting.socket-handler";
import {NewRoundSocketHandler} from "@/features/socket/server/handlers/new-round.socket-handler";
import {RevealSocketHandler} from "@/features/socket/server/handlers/reveal.socket-handler";
import {SubmitEstimateSocketHandler} from "@/features/socket/server/handlers/submit-estimate.socket-handler";
import {SocketHandlerInterface} from "@/features/socket/server/handlers/abstract.socket-handler";

let socketService: ISocketService;

export function getSocketService() {
    if (socketService) {
        return socketService;
    }

    socketService = new SocketService(
        getHandlers(),
    );

    return socketService;
}

function getHandlers(): SocketHandlerInterface[] {
    const userService = getUserService();
    const roomParticipantService = getRoomParticipantService();
    const estimateService = getEstimateService();
    const roomService = getRoomService();
    const roundService = getRoundService();

    const connectionSocketHandler = new ConnectionSocketHandler(
        userService,
        roomParticipantService,
        estimateService,
        roomService,
        roundService,
    );

    const disconnectionSocketHandler = new DisconnectingSocketHandler(
        userService,
        roomParticipantService,
    );

    const newRoundSocketHandler = new NewRoundSocketHandler(
        userService,
        roomService,
        roundService,
    );

    const revealSocketHandler = new RevealSocketHandler(
        userService,
        roomService,
        roundService,
        estimateService,
    );

    const submitEstimateSocketHandler = new SubmitEstimateSocketHandler(
        userService,
        roomService,
        roundService,
        estimateService,
    );

    return [
        connectionSocketHandler,
        disconnectionSocketHandler,
        newRoundSocketHandler,
        revealSocketHandler,
        submitEstimateSocketHandler,
    ];
}