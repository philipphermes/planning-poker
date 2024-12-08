import {addToastMessages} from "~/.server/toasts";
import {Toast} from "~/models/Toast";
import {data} from "@remix-run/node";
import {sessionStorage} from "~/.server/session";
import {redirect} from "@remix-run/react";

export async function getDataWithToast<T>(request: Request, message: string, success: boolean, value: T) {
    const session = await addToastMessages(request, [new Toast(message, success)])
    return data(value, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    })
}

export async function redirectWithToast(request: Request, message: string, success: boolean, route: string) {
    const session = await addToastMessages(request, [new Toast(message, success)])

    throw redirect(route, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}