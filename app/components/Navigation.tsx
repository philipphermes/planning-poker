import {Bars3BottomLeftIcon} from "@heroicons/react/24/outline";
import {Link} from "@remix-run/react";

export type NavigationConfig = {
    title: string;
    links: NavigationLink[];
}

export type NavigationLink = {
    url: string;
    title: string;
    prefetch: PrefetchBehavior;
}

/**
 * @see node_modules\@remix-run\react\dist\components.d.ts
 */
type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

export default function Navigation({title, links}: NavigationConfig) {
    return (
        <div className="navbar sticky bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <Bars3BottomLeftIcon className="h-5"/>
                    </div>
                    <ul className="menu menu-sm sm:menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {links.map((link, key) => (
                            <li key={key}><Link prefetch={link.prefetch} to={link.url}>{link.title}</Link></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <Link prefetch="intent" to="/" className="btn btn-ghost text-xl">{title}</Link>
            </div>
            <div className="navbar-end">
            </div>
        </div>
    )
}