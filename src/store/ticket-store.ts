import { create } from "zustand";
import type { Ticket } from "@/types/ticket";
import { mockTickets } from "@/constants/mock-tickets";

type TicketStore = {
    tickets: Ticket[];
    activeTicketId: string | null;
    setActiveTicket: (ticketId: string | null) => void;
    addTicket: (ticket: Ticket) => void;
    updateTicket: (ticketId: string, update: Partial<Ticket>) => void;
    removeTicket: (ticketId: string) => void;
    lockTicket: (ticketId: string, agentId: string, agentName: string) => void;
    unlockTicket: (ticketId: string) => void;
};

export const useTicketStore = create<TicketStore>((set) => ({
    tickets: mockTickets,
    activeTicketId: null,
    setActiveTicket: (ticketId) => set({ activeTicketId: ticketId }),
    addTicket: (ticket) =>
        set((state) => ({ tickets: [ticket, ...state.tickets] })),
    updateTicket: (ticketId, update) =>
        set((state) => ({
            tickets: state.tickets.map((ticket) =>
                ticket.id === ticketId ? { ...ticket, ...update } : ticket
            ),
        })),
    removeTicket: (ticketId) =>
        set((state) => ({
            tickets: state.tickets.filter((ticket) => ticket.id !== ticketId),
        })),
    lockTicket: (ticketId, agentId, agentName) =>
        set((state) => ({
            tickets: state.tickets.map((ticket) =>
                ticket.id === ticketId
                    ? {
                        ...ticket,
                        lock: {
                            lockedById: agentId,
                            lockedByName: agentName,
                            lockedAt: new Date().toISOString(),
                        },
                    }
                    : ticket
            ),
        })),
    unlockTicket: (ticketId) =>
        set((state) => ({
            tickets: state.tickets.map((ticket) =>
                ticket.id === ticketId ? { ...ticket, lock: undefined } : ticket
            ),
        })),
}));
