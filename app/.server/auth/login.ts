import {getAndValidateFormData} from "~/utils/formData";
import {userLoginSchema} from "~/validators/userLoginSchema";
import {toast} from "~/.server/toast/toast";
import {SESSION_KEY_USER, sessionStorage} from "~/.server/session";
import {redirect} from "@remix-run/node";
import {
    authenticator,
    MESSAGE_ERROR_INVALID_CREDENTIALS,
    MESSAGE_LOGGED_IN,
    STRATEGY_FORM_EMAIL_PASSWORD
} from "~/.server/auth/auth";
import {Users} from "~/types/Users";

export async function loginUser(request: Request) {
    const result = await getAndValidateFormData(await request.clone().formData(), request, userLoginSchema)
    if (result.init) return result

    let user: Users;

    try {
        user = await authenticator.authenticate(STRATEGY_FORM_EMAIL_PASSWORD, request)
    } catch (error) {
        return await toast.getDataWithToasts(request, {
            message: MESSAGE_ERROR_INVALID_CREDENTIALS,
            status: 'error',
        }, null)
    }

    const session = await toast.persist(request, {message: MESSAGE_LOGGED_IN, status: 'success'})
    session.set(SESSION_KEY_USER, user);

    throw redirect("/", {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}
