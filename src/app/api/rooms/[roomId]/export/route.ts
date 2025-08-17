import {createErrorResponse, handleApiError} from "@/lib/server/utils";
import {NextResponse} from "next/server";
import {getRoomService} from "@/features/room/server";
import {deleteRoomSchema} from "@/features/room/shared/room.validations";
import {getUserService} from "@/features/user/server";

export async function GET(req: Request, {params}: { params: Promise<{ roomId: string }> }) {
    const userService = getUserService();
    const roomService = getRoomService();

    try {
        const user = await userService.getCurrentUser();

        if (!user?.id) {
            return createErrorResponse('Unauthorized', 401);
        }

        const {roomId} = await params;

        const validated = deleteRoomSchema.parse({
            id: roomId,
            ownerId: user.id,
        });

        const room = await roomService.getOneByIdAndOwnerIdForExport(validated.id, validated.ownerId);
        if (!room) {
            return createErrorResponse('Not found', 404);
        }

        const users = new Map();

        room.rounds?.forEach(round => {
            round?.estimates?.forEach(estimate => {
                users.set(estimate?.user?.name ?? estimate?.user?.email, estimate.user);
            });
        });

        const userIdentifiers = Array.from(users.keys());
        const header = ['round', ...userIdentifiers];

        const rows = room?.rounds?.map(round => {
            const row: Record<string, string> = {round: round.name};
            userIdentifiers.forEach(userIdentifier => {
                row[userIdentifier] = '/';
            });

            round?.estimates?.forEach(estimate => {
                const identifier = estimate?.user?.name ?? estimate?.user?.email;

                if (identifier) {
                    row[identifier] = estimate.value ?? '/';
                }
            });

            return row;
        });

        if (!rows) {
            return createErrorResponse('Failed generating csv file', 500);
        }

        const csv = [
            header.join(';'),
            ...rows.map(row =>
                header.map(h => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(';')
            )
        ].join('\n');

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="room-estimates.csv"',
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}