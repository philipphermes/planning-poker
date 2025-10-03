import 'dotenv/config';
import {createServer} from "node:http";
import next, {NextApiRequest} from "next";
import {Server, Socket} from "socket.io";
import {logger} from "@/lib/server/logger";
import {getUserService} from "@/features/user/server";
import {getSocketService} from "@/features/socket/server";
import {getToken} from "next-auth/jwt";
import {parse} from "cookie";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "localhost";
const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const userService = getUserService();
    const socketService = getSocketService();

    const httpServer = createServer(handler);
    const io = new Server(httpServer);
    socketService.setIoInstance(io);

    io.use(async (socket: Socket, next) => {
        const cookies = parse(socket.request.headers.cookie || '');
        const mockReq = {
            headers: {
                cookie: socket.request.headers.cookie,
            },
            cookies: cookies,
        } as NextApiRequest;

        const token = await getToken({
            req: mockReq,
            secret: process.env.NEXTAUTH_SECRET!,
        })

        if (!token?.email) {
            return next(new Error("Unauthorized"));
        }

        const user = await userService.getOneByEmail(token?.email);
        if (!user) {
            return next(new Error("Unauthorized"));
        }

        socket.data.user = user;
        return next();
    })

    socketService.connect(io);

    httpServer
        .once("error", (err) => {
            logger.error(`Server startup failed: ${err.message}`);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});