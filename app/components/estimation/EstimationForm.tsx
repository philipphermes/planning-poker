import {Input, InputWithIcon} from "~/components/Input";
import {ClockIcon} from "@heroicons/react/24/outline";
import {Button} from "~/components/Button";
import {Form} from "@remix-run/react";

export type EstimationFormProps = {
    value?: Input['value'];
    onChange?: Input['onChange'];
}

export function EstimationForm({value, onChange}: EstimationFormProps) {
    return (<Form method="POST" className="card bg-base-300 flex items-center justify-center">
        <div className="card-body flex flex-col gap-2">
            <InputWithIcon
                type="text"
                name="time"
                placeholder="0"
                className="input-bordered"
                icon={<ClockIcon className="h-4 opacity-70"/>}
                value={value}
                onChange={onChange}

            />
            <Button name="estimate" type="submit" text="Submit" className="btn-outline btn-primary" />
        </div>
    </Form>)
}