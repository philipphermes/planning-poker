import {Form} from "@remix-run/react";

export default function NewRoomForm() {
    return (
        <div className="card bg-base-300 rounded-box p-4">
            <Form method="post" className="space-y-6">
                <label className="form-control w-full">
                    <span className="sr-only">Room name</span>
                    <div className="label">
                        <span className="label-text">Room name</span>
                    </div>
                    <input type="text" name="name" placeholder="Type here"
                           className="input input-bordered w-full"/>
                </label>
                <button type="submit" className="btn btn-outline btn-accent w-full">Create new room</button>
            </Form>
        </div>
    )
}