import type {Metadata} from "next";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import * as React from "react";
import {ThemeProvider} from "next-themes";
import SessionProvider from "@/components/auth/session-provider";

export const metadata: Metadata = {
  title: "Planning Poker",
  description: "A collaborative tool for agile teams to estimate effort for user stories or tasks.",
  applicationName: "Planning Poker",
  keywords: ["planning", "poker", "agile", "scrum", "estimation", "team", "collaboration"],
  icons: [
      {
          url: "/images/logo.png",
          sizes: "any",
          type: "image/png",
      },
      {
          url: "/images/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
      },
  ],
  openGraph: {
      type: "website",
      url: "https://github.com/philipphermes/planning-poker",
      title: "Planning Poker",
      description: "A collaborative tool for agile teams to estimate effort for user stories or tasks.",
      images: [{
          url: "/images/logo.png",
      }],
  },
  twitter: {
      card: "summary_large_image",
      title: "Planning Poker",
      description: "A collaborative tool for agile teams to estimate effort for user stories or tasks.",
      images: ["/images/logo.png"],
  },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster/>
            </ThemeProvider>
        </SessionProvider>
        </body>
        </html>
    );
}