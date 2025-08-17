'use client';

import {Fragment} from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {usePathname} from 'next/navigation';
import Link from "next/link";

export function BreadCrumb() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');

        const name = decodeURIComponent(segment);

        const isLast = index === segments.length - 1;

        if (isLast) {
            return (
                <Fragment key={index}>
                    <BreadcrumbSeparator/>
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                </Fragment>
            );
        }

        return (
            <Fragment key={index}>
                <BreadcrumbSeparator/>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href={href}>{name}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Fragment>
        );
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
