import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from "@remix-run/react";
import type {LinksFunction, LoaderFunctionArgs} from "@remix-run/node";
import "./tailwind.css";
import Toasts from "./components/Toasts";
import Navigation, {NavigationLink} from "./components/Navigation";
import {toast} from "~/.server/toast";

export const links: LinksFunction = () => [];

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

export async function loader({request}: LoaderFunctionArgs) {
    const {toasts} = (await toast.retrieve(request))

    return toast.getDataWithToasts(request, [], toasts)
}

export default function App() {
    return (
        <html lang="en" className="scrollbar-thumb-orange-50 scrollbar-corner-pink-500">
            <head>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Planning Poker</title>
                <Meta/>
                <Links/>
            </head>
            <body>
                <Outlet/>
                <Toasts time={5000} fps={30}/>
                <ScrollRestoration/>
                <Scripts/>
                {process.env.NODE_ENV === 'development' && <LiveReload />}
            </body>
        </html>
    );
}