import {FormStrategy} from "remix-auth-form";
import * as argon2 from "argon2";
import {Authenticator} from "remix-auth";
import {userLoginSchema} from "~/validators/userLoginSchema";
import {findOneUserByEmail} from "~/db/queries/userQueries";
import {User} from "~/db/schema/schema";

export const authenticator = new Authenticator<User>();

export const STRATEGY_FORM_EMAIL_PASSWORD = "STRATEGY_FORM_EMAIL_PASSWORD"
export const MESSAGE_ERROR_INVALID_CREDENTIALS = "Invalid credentials!"
export const MESSAGE_ERROR_UNAUTHORIZED = "Unauthorized"
export const MESSAGE_LOGGED_IN = "Logged in successfully!"
export const MESSAGE_LOGGED_OUT = "Logged out successfully!"

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