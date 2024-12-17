import {Form} from "@remix-run/react";
import {InputWithLabel} from "~/components/form/Input";
import {Button} from "~/components/form/Button";

export default function NewRoomForm() {
    return (
        <div className="card bg-base-300 rounded-box p-4">
            <Form method="post" className="space-y-6">
                <InputWithLabel
                    type="text"
                    name="name"
                    placeholder="Type here"
                    label="Room name"
                    className="input-bordered"
                />
                <Button type="submit" text="Create new room" className="btn-outline btn-accent w-full" />
            </Form>
        </div>
    )
}