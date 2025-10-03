import {getAuthConfig} from "@/features/auth/server/auth.config";
import NextAuth from "next-auth";
import {NextRequest} from "next/server";

let handler: (req: NextRequest, context: any) => any;

const lazyInitAuth = (req: NextRequest, context: any) => {
    if (!handler) {
        const authConfig = getAuthConfig();
        handler = NextAuth(authConfig);
    }

    return handler(req, context);
}

export async function POST(req: NextRequest, context: any) {
    return lazyInitAuth(req, context);
}

export async function GET(req: NextRequest, context: any) {
    return lazyInitAuth(req, context);
}
