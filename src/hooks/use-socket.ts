"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { connectSocket } from "@/services/socket";
import { useSocketStore } from "@/store/socket-store";
import { useTicketStore } from "@/store/ticket-store";
import { usePresenceStore } from "@/store/presence-store";
import { useAgentStore } from "@/store/agent-store";

export function useSocket() {
    const setSocket = useSocketStore((state) => state.setSocket);
    const setStatus = useSocketStore((state) => state.setStatus);
    const setActiveTicket = useTicketStore((state) => state.setActiveTicket);
    const lockTicket = useTicketStore((state) => state.lockTicket);
    const unlockTicket = useTicketStore((state) => state.unlockTicket);
    const updateTicket = useTicketStore((state) => state.updateTicket);
    const addTicket = useTicketStore((state) => state.addTicket);
    const setAgents = usePresenceStore((state) => state.setAgents);
    const updateAgent = usePresenceStore((state) => state.updateAgent);
    const removeAgent = usePresenceStore((state) => state.removeAgent);
    const currentAgent = useAgentStore((state) => state.currentAgent);

    useEffect(() => {
        if (!currentAgent) {
            return;
        }

        const socket = connectSocket();
        setSocket(socket);

        const emitOnline = () => {
            socket.emit("join_dashboard", {
                agentId: currentAgent.id,
                agentName: currentAgent.name,
                role: currentAgent.role,
            });
            socket.emit("agent_online", {
                agentId: currentAgent.id,
                agentName: currentAgent.name,
                role: currentAgent.role,
            });
        };

        socket.on("connect", () => {
            setStatus("connected");
            emitOnline();
            toast.success("Connection restored", {
                description: "Real-time updates resumed.",
            });
        });

        socket.on("disconnect", () => {
            setStatus("reconnecting");
            toast.error("Connection lost", {
                description: "Reconnecting. Unsaved changes may not synchronize.",
            });
        });

        socket.on("ticket_created", (ticket) => {
            addTicket(ticket);
            toast.message("Ticket created", {
                description: `Ticket #${ticket.id} was added to the queue.`,
            });
        });

        socket.on("ticket_updated", (ticket) => {
            updateTicket(ticket.id, ticket);
            toast.message("Ticket synchronized", {
                description: `Ticket #${ticket.id} updated in real time.`,
            });
        });

        socket.on("ticket_locked", (payload) => {
            lockTicket(payload.ticketId, payload.agentId, payload.agentName);
        });

        socket.on("ticket_unlocked", (payload) => {
            unlockTicket(payload.ticketId);
        });

        socket.on("ticket_lock_denied", (payload) => {
            setActiveTicket(null);
            toast.error("Ticket locked", {
                description: `Locked by ${payload.lockedByName}.`,
            });
        });

        socket.on("agent_joined", (agent) => {
            updateAgent(agent);
        });

        socket.on("agent_left", (agentId) => {
            removeAgent(agentId);
        });

        socket.on("presence_update", (agents) => {
            setAgents(agents);
        });

        socket.on("connect_error", () => {
            setStatus("reconnecting");
        });

        const handleUnload = () => {
            socket.emit("agent_offline", { agentId: currentAgent.id });
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
            socket.emit("agent_offline", { agentId: currentAgent.id });
            socket.removeAllListeners();
            socket.close();
        };
    }, [
        addTicket,
        lockTicket,
        removeAgent,
        setAgents,
        setSocket,
        setStatus,
        setActiveTicket,
        unlockTicket,
        updateAgent,
        updateTicket,
        currentAgent,
    ]);
}
