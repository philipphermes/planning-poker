import type {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {data, Form, Link, redirect} from "@remix-run/react";
import {getCurrentUser, loginUser} from "~/.server/auth";
import {InputWithLabel} from "~/components/Input";
import {Button} from "~/components/Button";

export async function action({request}: ActionFunctionArgs) {
    return await loginUser(request)
}

export async function loader({request}: LoaderFunctionArgs) {
    try {
        await getCurrentUser(request, false)
    } catch (error) {
        return data(null)
    }

    throw redirect("/")
}

export default function Login() {
    return (
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-2xl font-bold leading-9 tracking-tight">
                Sign in to your account
            </h2>

            <div className="mt-10 w-full">
                <Form method="post" className="space-y-6">
                    <InputWithLabel type="email" name="email" placeholder="Type here" label="Email" />
                    <InputWithLabel type="password" name="password" placeholder="********" label="Password" />
                    <Button text="Sign In" type="submit" className="w-full btn-primary btn-outline" />
                </Form>
            </div>

            <span>
                No account? Sign up <Link prefetch="intent" to="/register" className="link link-secondary">here</Link>
            </span>
        </div>
    );
}