'use client'

import {Bug, Dices, Edit, Rocket, Scale} from "lucide-react"
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
import {NavLinks} from "@/components/navigation/nav-links";

const data = {
    navMain: [
        {
            title: "Join",
            icon: Rocket,
            url: "/room/join",
        },
        {
            title: "Manage",
            icon: Edit,
            url: "/room",
        },
        {
            title: "Card Sets",
            icon: Dices,
            url: "/card-set",
        },
    ],
    navLinks: [
        {
            title: "Report Issue",
            icon: Bug,
            url: "https://github.com/philipphermes/planning-poker/issues",
        },
        {
            title: "Licence",
            icon: Scale,
            url: "https://github.com/philipphermes/planning-poker/blob/main/LICENSE.md",
        }
    ]
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
                <NavLinks items={data.navLinks}/>
                <NavUser user={user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
