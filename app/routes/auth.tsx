import {Outlet, redirect} from '@remix-run/react';
import {data, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {getCurrentUser} from "~/.server/auth";

export const meta: MetaFunction = () => {
    return [
        {title: "Auth"},
        {name: "description", content: "Auth"},
    ];
};

export const authUrls = {
    'login': '/auth/login',
    'register': '/auth/register'
}

export async function loader({request}: LoaderFunctionArgs) {
    try {
        await getCurrentUser(request, false);
    } catch (e) {
        return data(null);
    }

    return redirect('/');
}

export default function Auth() {
    return (
        <main className="min-h-dvh max-w-2xl mx-10 md:mx-auto flex items-center">
            <Outlet context={authUrls} />
        </main>
    );
}
