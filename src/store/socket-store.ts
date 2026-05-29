import { create } from "zustand";
import type { Socket } from "socket.io-client";
import type {
    ClientToServerEvents,
    ServerToClientEvents,
    SocketStatus,
} from "@/types/socket-events";

type SocketStore = {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    connectionStatus: SocketStatus;
    setSocket: (
        socket: Socket<ServerToClientEvents, ClientToServerEvents>
    ) => void;
    setStatus: (status: SocketStatus) => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
    socket: null,
    connectionStatus: "disconnected",
    setSocket: (socket) => set({ socket }),
    setStatus: (status) => set({ connectionStatus: status }),
}));
