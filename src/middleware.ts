import {withAuth} from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({token}) => !!token,
    },
    pages: {
        signIn: "/auth/login",
    },
});

export const config = {
    matcher: [
        // Match everything except the following paths
        "/((?!^api/auth|^_next/static|^_next/image|images/|auth/login|auth/verify|auth/error).*)",
    ],
};
