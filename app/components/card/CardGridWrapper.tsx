import {ReactNode} from "react";
import {Form} from "@remix-run/react";

export type CardWrapperProps = {
    isForm?: boolean;
    cols: number;
    children?: ReactNode[];
}

export function CardGridWrapper({isForm, cols, children}: CardWrapperProps) {
    const className = `w-full max-h-96 md:max-h-none overflow-visible grid grid-cols-2 md:grid-cols-${cols} gap-4`

    if (isForm) return (<Form method="POST" className={className}>{children}</Form>)

    return (<div className={className}>{children}</div>)
}