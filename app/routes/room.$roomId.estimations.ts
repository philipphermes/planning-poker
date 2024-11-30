import { data, LoaderFunctionArgs } from "@remix-run/node";
import {addClient, removeClient} from "~/.server/estimations";
import {getCurrentUser} from "~/.server/auth";
import {findRoomById} from "~/db/queries/roomQueries";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const roomId = params.roomId

    if (!roomId) {
        return data({}, { status: 500 })
    }

    const user = await getCurrentUser(request);
    const room = await findRoomById(roomId)

    if (!room) {
        return data({}, { status: 500 })
    }

    return new Response(
        new ReadableStream({
            start(controller) {
                addClient(room, user, controller);

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