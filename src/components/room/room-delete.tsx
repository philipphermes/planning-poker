'use client'

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Trash} from "lucide-react";
import {toast} from "sonner";
import {deleteRoomAction} from "@/features/room/server/room.actions";

export function RoomDelete({id}: { id: string }) {
    async function handleDelete() {
        const response = await deleteRoomAction(id);
        if (response.success) {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    }

    return (<AlertDialog>
        <AlertDialogTrigger asChild>
            <Trash className='text-destructive'/>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone.
                    All your data will be permanently removed.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>)
}