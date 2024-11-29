import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { data, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "~/.server/auth";
import { findRoomById } from "~/db/queries/roomQueries";
import { User } from "~/models/User";

export const meta: MetaFunction = () => {
    return [
        { title: "Edit Room" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    const user = await getCurrentUser(request);

    if (!params.roomId) {
        throw redirect('/')
    }

    const room = await findRoomById(params.roomId)

    return data({ user, room });
}

export default function Index() {
    const { room } = useLoaderData<typeof loader>()

    const fetcher = useFetcher<User[]>();
    const [query, setQuery] = useState("");
    const users = fetcher.data || []

    useEffect(() => {
        if (query) {
            fetcher.load(`/user/search?query=${query}`);
        }
    }, [query]);

    return (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h1>Room: {room?.name}</h1>
            <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="Search" onChange={(e) => setQuery(e.target.value)} value={query} />
                <MagnifyingGlassIcon className="h-4 opacity-70" />
            </label>

            {fetcher.state === "loading" ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li className="text-white" key={user.id}>{user.email}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}