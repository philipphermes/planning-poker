import {Separator} from "@/components/ui/separator";
import {AccountDelete} from "@/components/account/account-delete";
import {AccountForm} from "@/components/account/account-form";
import {getUserService} from "@/features/user/server";
import {redirect} from "next/navigation";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Account",
    description: "Manage your account settings.",
};

export default async function AccountPage() {
    const userService = getUserService();
    const user = await userService.getCurrentUser();

    if (!user) {
        redirect('/auth/login');
    }

    return (<div className="flex flex-1 flex-col gap-4 p-4">
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                <div className='max-w-5xl mx-auto p-2 flex flex-col gap-4'>
                    <h2 className='text-2xl'>Edit Account</h2>
                    <Separator/>
                    <AccountForm user={user}/>
                    <Separator className="my-4"/>
                    <AccountDelete/>
                </div>
            </div>
        </div>
    );
}