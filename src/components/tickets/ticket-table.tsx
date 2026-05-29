"use client";

import { useMemo, useState } from "react";
import { TicketRow } from "@/components/tickets/ticket-row";
import { TicketDrawer } from "@/components/tickets/ticket-drawer";
import { useTicketStore } from "@/store/ticket-store";
import type { Ticket } from "@/types/ticket";

const columns = [
    "Ticket",
    "Priority",
    "Customer",
    "Details",
    "Status",
    "Actions",
];

export const TICKET_GRID =
    "grid-cols-[90px_120px_180px_1fr_140px_120px]";

type TicketTableProps = {
    tickets?: Ticket[];
};

export function TicketTable({ tickets }: TicketTableProps) {
    const storeTickets = useTicketStore((state) => state.tickets);
    const rows = tickets ?? storeTickets;
    const activeTicketId = useTicketStore((state) => state.activeTicketId);
    const setActiveTicket = useTicketStore((state) => state.setActiveTicket);

    const [page, setPage] = useState(1);

    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const visibleTickets = useMemo(
        () => rows.slice(startIndex, endIndex),
        [rows, startIndex, endIndex]
    );

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface-alt/50 p-4">
                {/* Header */}
                <div
                    className={`grid ${TICKET_GRID} gap-4 border-b border-border pb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted`}
                >
                    {columns.map((column) => (
                        <div key={column}>{column}</div>
                    ))}
                </div>

                {/* Rows */}
                <div className="mt-4 space-y-3">
                    {visibleTickets.map((ticket) => (
                        <TicketRow
                            key={ticket.id}
                            ticket={ticket}
                            onOpen={setActiveTicket}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-muted">
                    Showing {Math.min(startIndex + 1, rows.length)}-
                    {Math.min(endIndex, rows.length)} of {rows.length}
                </span>

                <div className="flex items-center gap-3">
                    <button
                        className="rounded-xl border border-border px-4 py-2 disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        className="rounded-xl border border-border px-4 py-2 disabled:opacity-50"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            <TicketDrawer
                ticketId={activeTicketId}
                onClose={() => setActiveTicket(null)}
            />
        </div>
    );
}