import {ActionFunctionArgs, data, LoaderFunctionArgs} from "@remix-run/node";
import {Form, Link, redirect, useOutletContext} from "@remix-run/react";
import {InputWithLabel} from "~/components/form/Input";
import {Button} from "~/components/form/Button";
import {authUrls} from "~/routes/auth";
import {getCurrentUser} from "~/.server/auth/user";
import {loginUser} from "~/.server/auth/login";

export async function loader({request}: LoaderFunctionArgs) {
    try {
        await getCurrentUser(request, false);
    } catch (e) {
        return data(null);
    }

    return redirect('/');
}

export async function action({request}: ActionFunctionArgs) {
    return await loginUser(request)
}

export default function Auth_index() {
    const urls = useOutletContext<typeof authUrls>();

    return (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-2xl font-bold leading-9 tracking-tight">
                Sign in to your account
            </h2>

            <div className="mt-10 w-full">
                <Form method="post" className="space-y-6">
                    <InputWithLabel type="email" name="email" placeholder="Type here" label="Email" className='input-bordered' />
                    <InputWithLabel type="password" name="password" placeholder="********" label="Password" className='input-bordered' />
                    <Button text="Sign In" type="submit" className="w-full btn-primary btn-outline" />
                </Form>
            </div>

            <span>
                No account? Sign up <Link prefetch="intent" to={urls.register} className="link link-secondary">here</Link>
            </span>
        </div>
    );
}