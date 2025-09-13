'use client';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {signOut} from "next-auth/react";
import {deleteUserAction} from "@/features/user/server/user.action";

export function AccountDelete() {
    const handleDeleteAccount = async () => {
        const response = await deleteUserAction();
        if (response.success) {
            toast.success(response.message);
            await signOut()
        } else {
            toast.error(response.message);
        }
    };

    return (<div className='flex flex-col gap-4'>
        <h2 className="text-2xl text-destructive">Delete Account</h2>
        <p className="text-sm text-muted-foreground">
            Deleting your account is permanent after the grace period. All your data will be removed.
        </p>
        <AlertDialog>
            <AlertDialogTrigger asChild className='cursor-pointer'>
                <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will mark your account for deletion.
                        All your data will be permanently removed after the grace period.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='cursor-pointer' onClick={handleDeleteAccount}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>)
}