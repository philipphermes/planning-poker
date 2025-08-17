import Link from "next/link";
import Image from "next/image";

export function NavLogo() {
    return (
        <Link href='/'
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex gap-4 p-2 rounded-xl">
            <div
                className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image src='/images/logo.png' alt='logo' width={100} height={100}/>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Planning Poker</span>
            </div>
        </Link>
    )
}
