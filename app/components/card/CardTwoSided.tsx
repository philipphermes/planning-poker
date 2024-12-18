import {CardBody, CardWrapper} from "~/components/card/Card";
import {Avatar} from "~/components/avatar/Avatar";

export function CardTwoSided({value, email, visible}: {value: number, email: string, visible: boolean}  ) {
    return (
        <div className="group [perspective:1000px] drop-shadow-xl">
            <div
                className={`relative w-full aspect-square transition-all duration-500 [transform-style:preserve-3d] ${visible ? "[transform:rotateY(180deg)]" : ""}`}>
                {/* Front side */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                    <CardWrapper extraClasses="aspect-square w-full">
                        <CardBody extraClasses="justify-center items-center">
                            <Avatar email={email} extraClasses="absolute top-4 left-4"/>
                        </CardBody>
                    </CardWrapper>
                </div>

                {/* Back side */}
                <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <CardWrapper extraClasses="aspect-square w-full">
                        <CardBody extraClasses="justify-center items-center">
                            <span className="text-4xl">{value}</span>
                            <Avatar email={email} extraClasses="absolute top-4 right-4"/>
                        </CardBody>
                    </CardWrapper>
                </div>
            </div>
        </div>
    )
}