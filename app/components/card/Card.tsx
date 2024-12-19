import {ReactNode} from "react";

export function CardWrapper({ children, extraClasses }: { children: ReactNode; extraClasses?: string }) {
    return (
        <div className={`card ${extraClasses || ''}`}>
            {children}
        </div>
    );
}

export function CardBody({ children, isHoverable, extraClasses }: { children: ReactNode; isHoverable?: boolean; extraClasses?: string }) {
    return (
        <div className={`card-body flex ${isHoverable ? 'hover:scale-150 transition-all duration-100 ease-in-out' : ''} ${extraClasses || ''}`}>
            {children}
        </div>
    );
}

export function CardSkeleton({extraClasses}: { extraClasses?: string }) {
    return (
        <div className={`card skeleton ${extraClasses || ''}`}>
        </div>
    )
}

export function Card({value, extraClasses}: {value?: string, extraClasses?: string}) {
    return (
        <CardWrapper extraClasses={`aspect-square w-full ${extraClasses || ''}`}>
            <CardBody extraClasses="p-2 justify-center items-center">
                <span className="text-2xl text-center">{value}</span>
            </CardBody>
        </CardWrapper>
    )
}