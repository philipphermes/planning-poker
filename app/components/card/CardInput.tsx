import {CardBody, CardWrapper} from "~/components/card/Card";

export function CardInput({name, value}: {name: string, value?: number}) {
    return (
        <CardWrapper extraClasses="aspect-square w-full">
            <CardBody extraClasses="p-2 justify-center items-center">
                <input
                    type="text"
                    name={name}
                    placeholder="/"
                    pattern="^\d*$"
                    defaultValue={value}
                    className="text-2xl input input-ghost w-full text-center"
                />
            </CardBody>
        </CardWrapper>
    )
}