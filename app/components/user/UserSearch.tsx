import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {InputWithIcon} from "~/components/form/Input";
import {useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import {Users} from "~/types/Users";

export function UserSearch({roomId}: { roomId?: string }) {
    const [query, setQuery] = useState("");

    const userFetcher = useFetcher<Users[]>();
    const addUserFetcher = useFetcher();

    const users = userFetcher.data || []

    useEffect(() => {
        if (!query) return;

        const handler = setTimeout(() => {
            userFetcher.load(`/user/search?q=${query}&r=${roomId}`);
        }, 500);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, roomId]); // dont add userFetcher here courses problems

    function addUserToRoom(userId: string) {
        addUserFetcher.submit({
            userId: userId,
            roomId: roomId ?? null,
        }, {
            method: 'POST',
            action: '/rooms/user/add'
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <InputWithIcon
                type="text"
                name="search"
                placeholder="Search Users..."
                value={query}
                className="input-bordered"
                onChange={(e) => setQuery(e.target.value.trim())}
                icon={<MagnifyingGlassIcon className="h-4 opacity-70"/>}
            />
            {userFetcher.state === "loading" ? (<span className="loading loading-dots loading-md"></span>)
                : (<div className="flex w-full flex-col border-opacity-50 gap-4">
                    {query && users.map((searchUser) => (
                        <div key={searchUser.id}>
                            <div className="card bg-base-100 rounded-box p-4 grid grid-cols-2 place-items-center justify-items-end gap-4">
                                <h3 className="text-lg w-full">{searchUser.email}</h3>
                                <button type="button" onClick={() => addUserToRoom(searchUser.id)}
                                        className="btn btn-outline btn-primary">Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>)
            }
        </div>
    )
}