'use client';

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useSession} from "next-auth/react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {UserUpdateFormInput, userUpdateFromSchema} from "@/features/user/shared/user.validations";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateUserAction} from "@/features/user/server/user.action";
import {toast} from "sonner";
import {UserDto} from "@/features/user/shared/user.types";

type UserFormProps = {
    user: UserDto;
}

export function AccountForm({user}: UserFormProps) {
    const {update} = useSession();

    const form = useForm<z.infer<typeof userUpdateFromSchema>>({
        resolver: zodResolver(userUpdateFromSchema),
        defaultValues: {
            name: '',
        },
        values: {
            name: user.name ?? '',
        }
    })

    async function onSubmit(data: UserUpdateFormInput) {
        const response = await updateUserAction(data);

        if (response.success) {
            await update({name: response.data?.name, image: response.data?.image});
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    }

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="user@example.com" value={user.email} readOnly={true}/>
                </FormControl>
                <FormDescription>
                    This can not be modified
                </FormDescription>
            </FormItem>

            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="max mustermann" {...field} />
                        </FormControl>
                        <FormDescription>
                            Your display name
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <Button type="submit" className='cursor-pointer'>Update Profile</Button>
        </form>
    </Form>)
}