import {CardBody, CardWrapper} from "~/components/card/Card";

export function CardInput({name, value, extraClasses}: {name: string, value?: string, extraClasses?: string}) {
    return (
        <CardWrapper extraClasses={`aspect-square w-full ${extraClasses || ''}`}>
            <CardBody extraClasses="p-2 justify-center items-center">
                <input
                    type="text"
                    name={name}
                    placeholder="/"
                    defaultValue={value}
                    className="text-2xl input input-ghost w-full text-center"
                />
            </CardBody>
        </CardWrapper>
    )
}