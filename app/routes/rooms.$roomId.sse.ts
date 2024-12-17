import {data, LoaderFunctionArgs} from "@remix-run/node";
import {addClient, broadcastToRoom, removeClient} from "~/.server/room/roomSSE";
import {findRoomById} from "~/db/queries/roomQueries";
import {getCurrentUser} from "~/.server/auth/user";

export async function loader({request, params}: LoaderFunctionArgs) {
    const roomId = params.roomId

    if (!roomId) return data({}, {status: 500})

    const user = await getCurrentUser(request);
    const room = await findRoomById(roomId)

    if (!room) return data({}, {status: 500})

    return new Response(
        new ReadableStream({
            start(controller) {
                addClient(room, user, controller);
                broadcastToRoom(roomId)

                const abort = () => {
                    removeClient(room, user);
                    controller.close();
                };

                request.signal.addEventListener("abort", abort);
            },
        }),
        {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        }
    );
}