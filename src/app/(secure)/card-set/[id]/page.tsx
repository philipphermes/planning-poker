'use server';

import {CardSetForm} from "@/components/card-set/card-set-form";
import {redirect} from "next/navigation";
import {CardSetList} from "@/components/card-set/card-set-list";
import {getUserService} from "@/features/user/server";
import {getCardSetService} from "@/features/card-set/server";

export default async function CardPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const userService = getUserService();
    const cardSetService = getCardSetService();

    const user = await userService.getCurrentUser();
    if (!user?.id) {
        redirect('/auth/login')
    }

    const cardSet = await cardSetService.getOneByIdAndOwnerId(id, user.id);
    const cardSets = await cardSetService.getManyByOwnerId(user.id)

    if (!cardSet) {
        redirect('/card-set')
    }

    return (<div className="flex flex-1 flex-col gap-4 p-4">
        <CardSetForm cardSet={cardSet ?? undefined}></CardSetForm>
        <CardSetList cardSets={cardSets}/>
    </div>)
}