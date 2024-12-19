import {Links, Meta, Outlet, Scripts, ScrollRestoration} from "@remix-run/react";
import type {LinksFunction, LoaderFunctionArgs} from "@remix-run/node";
import "./tailwind.css";
import Toasts from "./components/toast/Toasts";
import {toast} from "~/.server/toast/toast";
import {NavigationConfig} from "~/components/Navigation";

export const links: LinksFunction = () => [];

const navigationConfig: NavigationConfig = {
    title: 'Planning Poker',
    links: [
        {
            url: "/auth/logout",
            title: "Logout",
            prefetch: "none"
        }
    ]
}

export async function loader({request}: LoaderFunctionArgs) {
    const {toasts} = (await toast.retrieve(request))

    return toast.getDataWithToasts(request, [], toasts)
}

export default function App() {
    return (
        <html lang="en" className="bg-base-100">
            <head>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Planning Poker</title>
                <Meta/>
                <Links/>
            </head>
            <body>
                <Outlet context={navigationConfig}/>
                <Toasts time={5000} fps={30}/>
                <ScrollRestoration/>
                <Scripts/>
            </body>
        </html>
    );
}