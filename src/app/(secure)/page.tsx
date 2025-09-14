import Link from "next/link";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Your planning poker dashboard.",
};

export default async function HomePage() {
    return (<div className="flex flex-1 flex-col gap-4 p-4">
        <div className="bg-muted/50 flex flex-col justify-center items-center rounded-xl h-full p-4 gap-4">
            <h1 className='text-xl bold'>Welcome to Planning Poker!</h1>
            <p>
                Start <Link href='/room' className='underline cursor-pointer'>here</Link> to create or join a room.
            </p>
        </div>
    </div>);
}
