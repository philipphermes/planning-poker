import {LoginForm} from "@/components/auth/login-form";
import {getUserService} from "@/features/user/server";
import {redirect} from "next/navigation";
import {Metadata} from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account.",
};

export default async function LoginPage() {
    const userService = getUserService();
    const user = await userService.getCurrentUser();
    if (user) {
        redirect('/')
    }

    const allowedDomains = process.env.NEXTAUTH_ALLOWED_DOMAINS !== '' ? process.env.NEXTAUTH_ALLOWED_DOMAINS?.split(',') ?? [] : [];

    return (
        <div className="mx-auto max-w-md p-6 my-auto h-dvh flex flex-col justify-center">
            <LoginForm allowedDomains={allowedDomains}/>
        </div>
    )
}
