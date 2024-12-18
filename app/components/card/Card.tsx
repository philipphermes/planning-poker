import {ReactNode} from "react";

export function CardWrapper({ children, extraClasses }: { children: ReactNode; extraClasses?: string }) {
    return (
        <div className={`card bg-base-300 ${extraClasses || ''}`}>
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