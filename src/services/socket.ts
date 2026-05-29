import { io, Socket } from "socket.io-client";
import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "@/types/socket-events";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket() {
    if (!socket) {
        socket = io(
            process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000",
            {
                autoConnect: false,
                transports: ["websocket"],
                withCredentials: true,
            }
        );
    }

    return socket;
}

export function connectSocket() {
    const activeSocket = getSocket();
    if (!activeSocket.connected) {
        activeSocket.connect();
    }
    return activeSocket;
}

export function disconnectSocket() {
    if (socket && socket.connected) {
        socket.disconnect();
    }
}
