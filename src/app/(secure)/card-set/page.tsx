import {getCardSetService} from "@/features/card-set/server";
import {getUserService} from "@/features/user/server";
import {redirect} from "next/navigation";
import {CardSetForm} from "@/components/card-set/card-set-form";
import {CardSetList} from "@/components/card-set/card-set-list";
import {Metadata} from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Card Sets",
    description: "Manage your card sets.",
};

export default async function CardPage() {
    const cardSetService = getCardSetService();
    const userService = getUserService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        redirect('/auth/login')
    }

    const cardSets = await cardSetService.getManyByOwnerId(user.id)

    return (<div className="flex flex-col h-full max-h-[calc(100dvh-64px)] gap-4 p-4">
        <CardSetForm></CardSetForm>
        <CardSetList cardSets={cardSets}/>
    </div>)
}