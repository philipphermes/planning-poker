import { createCookieSessionStorage } from "@remix-run/node";

export const SESSION_KEY_USER = 'user'

export const SESSION_KEY_TOASTS = 'toasts'

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secrets: [process.env.SECRET ?? ""],
        secure: process.env.NODE_ENV === "production",
    },
});

export const { getSession, commitSession, destroySession } = sessionStorage;