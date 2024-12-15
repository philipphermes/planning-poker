import {Links, Meta, Outlet, Scripts, ScrollRestoration} from "@remix-run/react";
import type {LinksFunction, LoaderFunctionArgs} from "@remix-run/node";
import "./tailwind.css";
import Toasts from "./components/Toasts";
import Navigation, {NavigationLink} from "./components/Navigation";
import {toast} from "~/.server/toast";

export const links: LinksFunction = () => [];

export default function App() {
    return <Outlet/>;
}

export async function loader({request}: LoaderFunctionArgs) {
    const {toasts} = (await toast.retrieve(request))

    return toast.getDataWithToasts(request, [], toasts)
}

export function Layout({children}: { children: React.ReactNode }) {
    const navigationLinks: NavigationLink[] = [
        {
            url: "/logout",
            title: "Logout",
            prefetch: "none"
        }
    ]

    const navigationBlackList = [
        'login',
        'logout',
        'register',
    ]

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Navigation title="Planning Poker" links={navigationLinks} blackList={navigationBlackList}/>
        <div className="min-h-dvh flex flex-col justify-center items-center">
            {children}
        </div>
        <Toasts time={5000} fps={30}/>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}