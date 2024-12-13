import {CardBody, CardWrapper} from "~/components/card/Card";
import {Form} from "@remix-run/react";

export function CardForm({value, active, extraClasses}: {value: number; active: boolean, extraClasses?: string}) {
    return (
        <CardWrapper extraClasses={`aspect-square w-full ${extraClasses || ''}`}>
            <Form method="POST">
                <button type="submit" name="estimate" value={value} className={`w-full aspect-square cursor-pointer ${active ? "text-primary font-bold" : ""}`}>
                    <CardBody isHoverable extraClasses="justify-center items-center">
                        <span className="text-2xl">{value}</span>
                    </CardBody>
                </button>
            </Form>
        </CardWrapper>
    )
}