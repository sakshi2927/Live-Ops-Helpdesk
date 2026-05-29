import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
});

const ibmPlexMono = IBM_Plex_Mono({
    weight: ["400", "500"],
    subsets: ["latin"],
    variable: "--font-plex-mono",
});

export const metadata: Metadata = {
    title: "Live Ops Helpdesk | RapidDispatch",
    description:
        "Real-time collaborative helpdesk for RapidDispatch Freight & Logistics.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${sora.variable} ${ibmPlexMono.variable} h-full antialiased`}
        >
            <body className="min-h-full bg-app text-foreground">
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
