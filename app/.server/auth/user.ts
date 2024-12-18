import {SESSION_KEY_USER, sessionStorage} from "~/.server/session";
import {redirect} from "@remix-run/node";
import {MESSAGE_ERROR_UNAUTHORIZED} from "~/.server/auth/auth";
import {Users} from "~/types/Users";

export async function getCurrentUser(request: Request, redirectOnFailure: boolean = true): Promise<Users> {
    const session = await sessionStorage.getSession(request.headers.get("cookie"))
    const user = session.get(SESSION_KEY_USER)

    if (user) return user
    if (redirectOnFailure) throw redirect("/auth")

    throw Error(MESSAGE_ERROR_UNAUTHORIZED)
}