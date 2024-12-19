import {CardBody, CardWrapper} from "~/components/card/Card";
import {Avatar} from "~/components/avatar/Avatar";

export function CardTwoSided({value, email, visible, extraClasses}: {value: number, email: string, visible: boolean, extraClasses?: string}  ) {
    return (
        <div className="group [perspective:1000px] drop-shadow-xl">
            <div
                className={`relative w-full aspect-square transition-all duration-500 [transform-style:preserve-3d] ${visible ? "[transform:rotateY(180deg)]" : ""}`}>
                {/* Front side */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                    <CardWrapper extraClasses={`aspect-square w-full ${extraClasses || ''}`}>
                        <CardBody extraClasses="justify-center items-center">
                            <Avatar email={email} extraClasses="absolute top-2 left-2 md:top-4 md:left-4"/>
                        </CardBody>
                    </CardWrapper>
                </div>

                {/* Back side */}
                <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <CardWrapper extraClasses={`aspect-square w-full ${extraClasses || ''}`}>
                        <CardBody extraClasses="justify-center items-center">
                            <span className="text-4xl">{value}</span>
                            <Avatar email={email} extraClasses="absolute top-2 right-2 md:top-4 md:right-4"/>
                        </CardBody>
                    </CardWrapper>
                </div>
            </div>
        </div>
    )
}