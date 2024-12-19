import {Link} from "@remix-run/react";
import {findUsersToRoomsByUserId} from "~/db/queries/userToRoomQueries";
import {ReactNode} from "react";
import {Navbar} from "~/components/navigation/Navbar";

export function Drawer({usersToRooms, children}: {usersToRooms: Awaited<ReturnType<typeof findUsersToRoomsByUserId>>, children: ReactNode}) {
    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle"/>
            {/* Content */}
            <div className="drawer-content min-h-dvh">
                <Navbar />
                <div className="h-full w-full md:max-w-5xl mx-auto">
                    {children}
                </div>
            </div>
            {/* Drawer */}
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 pt-20">
                    <li>
                        <Link to="/rooms">
                            <h1 className="text-4xl">Rooms</h1>
                        </Link>
                    </li>
                    <li>
                        <div className="divider p-2"/>
                    </li>
                    {usersToRooms.map(
                        (userToRoom, key) => <li key={key}><Link className="text-lg" to={userToRoom.roomId}>{userToRoom.room.name}</Link></li>
                    )}
                </ul>
            </div>
        </div>
    )
}