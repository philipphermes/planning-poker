import {FormStrategy} from "remix-auth-form";
import * as argon2 from "argon2";
import {Authenticator} from "remix-auth";
import {redirect} from "@remix-run/node";
import {SESSION_KEY_USER, sessionStorage} from "./session";
import {userLoginSchema} from "~/validators/userLoginSchema";
import {findOneUserByEmail} from "~/db/queries/userQueries";
import {User} from "~/db/schema/schema";
import {toast} from "~/.server/toast";
import {getAndValidateFormData} from "~/utils/formData";

export const authenticator = new Authenticator<User>();
export const STRATEGY_FORM_EMAIL_PASSWORD = "STRATEGY_FORM_EMAIL_PASSWORD"

const MESSAGE_ERROR_INVALID_CREDENTIALS = "Invalid credentials!"
const MESSAGE_ERROR_UNAUTHORIZED = "Unauthorized"
const MESSAGE_LOGGED_IN = "Logged in successfully!"
const MESSAGE_LOGGED_OUT = "Logged out successfully!"

authenticator.use(
    new FormStrategy(async ({form}) => {
        const data = Object.fromEntries(form)
        const result = userLoginSchema.safeParse(data);

        if (!result.success) {
            throw new Error(result.error.toString())
        }

        const user = await findOneUserByEmail(result.data.email);
        if (!user) throw new Error(MESSAGE_ERROR_INVALID_CREDENTIALS)

        const isPasswordValid = await argon2.verify(user.password, result.data.password);
        if (!isPasswordValid) throw new Error(MESSAGE_ERROR_INVALID_CREDENTIALS)

        user.password = '';

        return user
    }),
    STRATEGY_FORM_EMAIL_PASSWORD
);

export async function getCurrentUser(request: Request, redirectOnFailure: boolean = true): Promise<User> {
    const session = await sessionStorage.getSession(request.headers.get("cookie"))
    const user = session.get(SESSION_KEY_USER)

    if (user) return user
    if (redirectOnFailure) throw redirect("/auth/login")

    throw Error(MESSAGE_ERROR_UNAUTHORIZED)
}

export async function loginUser(request: Request) {
    const result = await getAndValidateFormData(await request.clone().formData(), request, userLoginSchema)
    if (result.init) return result

    let user: User;

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


export async function logoutUser(request: Request, redirectUrl: string = '/') {
    const session = await toast.persist(request, {message: MESSAGE_LOGGED_OUT, status: 'success'})
    session.set(SESSION_KEY_USER, null);

    throw redirect(redirectUrl, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}