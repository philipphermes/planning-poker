'use client';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Trash} from "lucide-react";
import {toast} from "sonner";
import {deleteCardSetAction} from "@/features/card-set/server/card-set.actions";

type CardSetDeleteProps = {
    id: string;
}

export function CardSetDelete({id}: CardSetDeleteProps) {
    async function handleDelete() {
        const response = await deleteCardSetAction(id);
        if (response.success) {
            toast.success(response.message)
        } else {
            toast.error(response.message)
        }
    }

    return (<AlertDialog>
        <AlertDialogTrigger asChild className='cursor-pointer'>
            <Trash className='text-destructive'/>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. The card set will be permanently deleted.
                    Note: Card sets that are being used by rooms cannot be deleted.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                <AlertDialogAction className='cursor-pointer' onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>)
}