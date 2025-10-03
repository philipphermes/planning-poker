import {redirect} from "next/navigation";
import {getUserService} from "@/features/user/server";
import {Metadata} from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Verify Login",
    description: "Verify your login.",
};

export default async function VerifyPage() {
    const userService = getUserService();
    const user = await userService.getCurrentUser();
    if (user) {
        redirect('/')
    }

    return (
        <div className="mx-auto max-w-md p-6 my-auto h-screen flex flex-col justify-center text-center">
            <p>Check your email for a magic login link.</p>
        </div>
    )
}