import {JWT} from "next-auth/jwt";
import {DefaultUser, User} from "next-auth";
import {isValidEmail} from "@/features/auth/shared/auth.validate-email";

export const signInCallback = async ({user}: { user: User }) => {
    if (!user.email) {
        return false;
    }

    return isValidEmail(user.email);
};

export const jwtCallback = async ({token, trigger, session}: {
    token: JWT,
    trigger?: "signIn" | "signUp" | "update",
    session?: DefaultUser
}) => {
    if (trigger === 'update') {
        if (session?.name) token.name = session.name;
        if (session?.image) token.picture = session.image;
    }

    return token;
}