import type { Ticket } from "@/types/ticket";
import type { AgentPresence } from "@/types/presence";

export type SocketStatus = "connected" | "reconnecting" | "disconnected";

export type TicketLockPayload = {
    ticketId: string;
    agentId: string;
    agentName: string;
};

export type TicketLockDeniedPayload = {
    ticketId: string;
    lockedById: string;
    lockedByName: string;
};

export type JoinDashboardPayload = {
    agentId: string;
    agentName: string;
    role: string;
};

export interface ClientToServerEvents {
    join_dashboard: (payload: JoinDashboardPayload) => void;
    agent_online: (payload: { agentId: string; agentName: string; role: string }) => void;
    agent_offline: (payload: { agentId: string }) => void;
    lock_ticket: (payload: TicketLockPayload) => void;
    unlock_ticket: (payload: { ticketId: string; agentId?: string }) => void;
    create_ticket: (ticket: Ticket) => void;
    update_ticket: (ticket: Ticket) => void;
    presence_update: (agents: AgentPresence[]) => void;
    typing: (payload: { ticketId: string; agentId: string }) => void;
}

export interface ServerToClientEvents {
    ticket_created: (ticket: Ticket) => void;
    ticket_updated: (ticket: Ticket) => void;
    ticket_locked: (payload: TicketLockPayload) => void;
    ticket_unlocked: (payload: { ticketId: string }) => void;
    ticket_lock_denied: (payload: TicketLockDeniedPayload) => void;
    agent_joined: (agent: AgentPresence) => void;
    agent_left: (agentId: string) => void;
    presence_update: (agents: AgentPresence[]) => void;
    connect: () => void;
    disconnect: () => void;
}
