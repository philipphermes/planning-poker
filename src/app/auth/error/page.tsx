import * as React from "react";
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Login Error",
    description: "There was an error during login.",
};

interface ErrorPageProps {
    searchParams: Promise<{ error?: string }>;
}

export default async function ErrorPage({searchParams}: ErrorPageProps) {
    const params = await searchParams;
    const error = params.error;

    return (<div className='w-full h-dvh flex flex-col justify-center items-center gap-4'>
        <h1 className='text-xl font-bold'>{error}</h1>
        <p className="text-lg">Something went wrong</p>
        <Link className={buttonVariants()} href="/auth/login">Back to Login</Link>
    </div>);
}