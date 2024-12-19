import {Bars3Icon} from "@heroicons/react/24/outline";
import {Link} from "@remix-run/react";

export function Navbar() {
    return (
        <div className="navbar sticky z-10 bg-base-100">
            <div className="navbar-start">
                <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
                    <Bars3Icon className="h-6"/>
                </label>
            </div>
            <div className="navbar-center">
                <Link to="/" className="btn btn-ghost text-xl">Planning Poker</Link>
            </div>
            <div className="navbar-end">
                <Link to="/auth/logout" className="btn btn-ghost">Logout</Link>
            </div>
        </div>
    )
}