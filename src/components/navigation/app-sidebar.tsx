'use client'

import {
    House,
    Settings2,
} from "lucide-react"

import {NavMain} from "@/components/navigation/nav-main"
import {NavUser} from "@/components/navigation/nav-user"
import {NavLogo} from "@/components/navigation/nav-logo"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useSession} from "next-auth/react";
import {ComponentProps} from "react";
import {UserDto} from "@/features/user/shared/user.types";

const data = {
    navMain: [
        {
            title: "Rooms",
            icon: House,
            isActive: true,
            items: [
                {
                    title: "Join",
                    url: "/room/join",
                },
                {
                    title: "Manage",
                    url: "/room",
                },
            ],
        },
        {
            title: "Settings",
            icon: Settings2,
            items: [
                {
                    title: "Card Sets",
                    url: "/card-set",
                },
            ],
        },
    ],
}

export function AppSidebar({...props}: ComponentProps<typeof Sidebar>) {
    const {data: session} = useSession();

    const user: UserDto | undefined = session?.user ? {
        id: null,
        name: session.user.name ?? null,
        email: session.user.email ?? '',
        image: session.user.image ?? null,
    } : undefined;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavLogo/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
