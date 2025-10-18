'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {isValidEmail} from "@/features/auth/shared/auth.validate-email";
import * as React from "react";

export function LoginForm({allowedDomains}: { allowedDomains: string[] }) {
    const formSchema = z.object({
        email: z
            .email({message: 'Please provide a valid email address'})
            .refine((email) => isValidEmail(email, allowedDomains), {message: 'Email domain is not allowed'}),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const email = data.email;
        await signIn("email", {
            email,
            callbackUrl: "/",
        })
    }

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                            This email is used to create an account
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <Button type="submit" className="cursor-pointer">Send Code</Button>
        </form>
    </Form>)
}
