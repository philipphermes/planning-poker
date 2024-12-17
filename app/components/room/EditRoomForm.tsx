import {Form} from "@remix-run/react";
import {InputWithIcon} from "~/components/form/Input";
import {Button} from "~/components/form/Button";
import {PencilIcon} from "@heroicons/react/24/outline";
import {useState} from "react";

export default function EditRoomForm({room}: {room?: string}) {
    const [roomName, setRoomName] = useState(room);

    if (!room) return null;

    return (
        <Form method="POST" className="w-full flex justify-between gap-2">
            <InputWithIcon
                type="text"
                name="name"
                placeholder="Name"
                icon={<PencilIcon className="h-4 opacity-70"/>}
                value={roomName}
                className="input-ghost"
                onChange={e => setRoomName(e.target.value)}
            />
            <Button text="Save" name="save" type="submit" className="w-fit btn-primary btn-outline"/>
            <Button text="Delete" name="delete" type="submit" className="w-fit btn-ghost btn-outline"/>
        </Form>
    )
}