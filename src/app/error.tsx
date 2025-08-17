'use client'

import type {Metadata} from "next";
import "./globals.css";
import * as React from "react";
import {Button} from "@/components/ui/button";

export const metadata: Metadata = {
    title: "An Error accured",
    description: "",
};

export default function GlobalError({reset}: { error: Error & { digest?: string }; reset: () => void }) {
    return (<div className='w-full h-dvh flex flex-col justify-center items-center gap-4'>
        <h2 className='text-lg'>Something went wrong!</h2>
        <Button onClick={() => reset()}>Try again</Button>
    </div>);
}