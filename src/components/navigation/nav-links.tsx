'use client'

import {type LucideIcon} from "lucide-react"
import {
    SidebarGroup, SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

export function NavLinks({items}: {
    items: {
        title: string
        icon?: LucideIcon
        url: string
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Helpful Links</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url} rel='noopener noreferrer' target='_blank' prefetch={false}>
                                {item.icon && <item.icon/>}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
