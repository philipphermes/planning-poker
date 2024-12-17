import {Outlet} from '@remix-run/react';
import {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        {title: "Auth"},
        {name: "description", content: "Auth"},
    ];
};

export const authUrls = {
    'login': '/auth',
    'register': '/auth/register'
}

export default function Auth() {
    return (
        <main className="min-h-dvh max-w-2xl mx-10 md:mx-auto flex items-center">
            <Outlet context={authUrls} />
        </main>
    );
}
