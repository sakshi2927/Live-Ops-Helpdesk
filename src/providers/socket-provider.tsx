"use client";

import { useSocket } from "@/hooks/use-socket";

type SocketProviderProps = {
    children: React.ReactNode;
};

export function SocketProvider({ children }: SocketProviderProps) {
    useSocket();
    return children;
}
