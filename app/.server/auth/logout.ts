import {toast} from "~/.server/toast/toast";
import {SESSION_KEY_USER, sessionStorage} from "~/.server/session";
import {redirect} from "@remix-run/node";
import {MESSAGE_LOGGED_OUT} from "~/.server/auth/auth";

export async function logoutUser(request: Request, redirectUrl: string = '/auth') {
    const session = await toast.persist(request, {message: MESSAGE_LOGGED_OUT, status: 'success'})
    session.set(SESSION_KEY_USER, null);

    throw redirect(redirectUrl, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}