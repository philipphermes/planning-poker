import {AuthOptions} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import {jwtCallback, sendVerificationRequest, signInCallback} from "@/features/auth/server/auth.callbacks";
import {getDB} from "@/lib/server/db";

const isProduction = process.env.NODE_ENV === "production";

const secret = process.env.NEXTAUTH_SECRET!;
const maxAge = Number.parseInt(process.env.NEXTAUTH_MAX_AGE ?? "3600"); // 1h default
const updateAge = Number.parseInt(process.env.NEXTAUTH_SESSION_UPDATE_AGE ?? "1800"); // 30m default
const emailMaxAge = Number.parseInt(process.env.NEXTAUTH_EMAIL_MAX_AGE ?? "3600")  // 1h default

const emailServerHost = process.env.EMAIL_SERVER_HOST!;
const emailServerPort = Number.parseInt(process.env.EMAIL_SERVER_PORT!);
const emailFrom = process.env.EMAIL_FROM!;
const emailServerUser = process.env.EMAIL_SERVER_USER;
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD;

const emailServer = {
    host: emailServerHost,
    port: emailServerPort,
    auth: undefined as undefined | { user: string; pass: string },
};

if (emailServerUser && emailServerPassword) {
    emailServer.auth = {
        user: emailServerUser,
        pass: emailServerPassword
    }
}

export const getAuthConfig = (): AuthOptions => ({
    adapter: DrizzleAdapter(getDB()),
    secret: secret,
    debug: !isProduction,
    useSecureCookies: isProduction,
    providers: [
        EmailProvider({
            server: emailServer,
            from: emailFrom,
            maxAge: emailMaxAge,
            sendVerificationRequest: (params) => sendVerificationRequest(params),
        }),
    ],
    theme: {
        buttonText: '#fafafa',
        brandColor: '#343434',
    },
    session: {
        strategy: 'jwt',
        maxAge: maxAge,
        updateAge: updateAge,
    },
    jwt: {
        maxAge: maxAge,
    },
    pages: {
        signIn: "/auth/login",
        verifyRequest: "/auth/verify",
        error: "/auth/error",
    },
    callbacks: {
        signIn: (data) => signInCallback(data),
        jwt: (data) => jwtCallback(data),
    },
})