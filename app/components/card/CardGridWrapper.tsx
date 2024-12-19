import {ReactNode} from "react";
import {Form} from "@remix-run/react";

export type CardWrapperProps = {
    isForm?: boolean;
    children?: ReactNode;
    extraClasses?: string;
}

export function CardGridWrapper({isForm, children, extraClasses}: CardWrapperProps) {
    const className = `w-full grid ${extraClasses || ''}`

    if (isForm) return (<Form method="POST" className={className}>{children}</Form>)

    return (<div className={className}>{children}</div>)
}