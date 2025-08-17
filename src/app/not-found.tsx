import type {Metadata} from "next";
import "./globals.css";
import * as React from "react";
import {ThemeProvider} from "next-themes";

export const metadata: Metadata = {
    title: "An Error accured",
    description: "",
};

export default function NotFound() {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className='w-full h-dvh flex flex-col justify-center items-center gap-4'>
                <h1 className='text-xl font-bold'>404 | Page Not Found</h1>
                <p className="text-lg">Sorry, we couldn&apos;t find what you&apos;re looking for.</p>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}