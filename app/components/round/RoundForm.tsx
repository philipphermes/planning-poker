import {Form} from "@remix-run/react";
import {InputWithIcon} from "~/components/form/Input";
import {PencilIcon} from "@heroicons/react/24/outline";
import {Button} from "~/components/form/Button";

export function RoundForm() {
    return (<Form method="POST" className="flex justify-between gap-2">
        <InputWithIcon
            type="text"
            name="name"
            placeholder="New Round"
            className="input-bordered"
            icon={<PencilIcon className="h-4 opacity-70"/>}
        />
        <Button name="round" type="submit" text="Start" className="btn-outline btn-primary" />
        <Button name="flip" type="submit" text="Flip Cards" className="btn-outline btn-secondary" />
    </Form>)
}