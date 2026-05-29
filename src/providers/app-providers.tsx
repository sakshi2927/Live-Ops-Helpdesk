"use client";

import { Toaster } from "sonner";
import { SocketProvider } from "@/providers/socket-provider";

type AppProvidersProps = {
    children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <SocketProvider>
            {children}
            <Toaster
                position="top-right"
                theme="system"
                richColors
                closeButton
            />
        </SocketProvider>
    );
}
