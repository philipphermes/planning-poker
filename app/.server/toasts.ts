import {Session} from "@remix-run/node";
import {SESSION_KEY_TOASTS, sessionStorage} from "./session";
import {Toast} from "~/models/Toast";

export async function addToastMessages(request: Request, messages: Toast[]) {
    const session = await sessionStorage.getSession(request.headers.get("cookie"))
    session.set(SESSION_KEY_TOASTS, messages);

    return session;
}

export async function getToastMessages(request: Request): Promise<{ toasts: Toast[], session: Session }> {
    const session = await sessionStorage.getSession(request.headers.get("cookie"))
    const toasts = session.get(SESSION_KEY_TOASTS) ?? [];

    session.set(SESSION_KEY_TOASTS, []);

    return {
        toasts,
        session
    }
}