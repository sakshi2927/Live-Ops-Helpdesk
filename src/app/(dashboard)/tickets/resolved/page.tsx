"use client";

import { useEffect, useMemo, useState } from "react";
import { useTicketStore } from "@/store/ticket-store";
import { formatRelativeTime } from "@/utils/date";

function RelativeTime({ iso }: { iso: string }) {
    const [value, setValue] = useState("-");

    useEffect(() => {
        setValue(formatRelativeTime(iso));
    }, [iso]);

    return <span suppressHydrationWarning>{value}</span>;
}

export default function ResolvedTicketsPage() {
    const tickets = useTicketStore((state) => state.tickets);

    const resolvedTickets = useMemo(
        () => tickets.filter((ticket) => ticket.status === "resolved"),
        [tickets]
    );

    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-border bg-surface p-6">
                <h1 className="text-2xl font-semibold text-foreground">Resolved Tickets</h1>
                <p className="mt-2 text-sm text-muted">
                    Resolution summaries with closing notes and timestamps.
                </p>
            </header>

            <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="grid grid-cols-[110px_180px_160px_minmax(200px,1fr)_140px] gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    <span>Ticket</span>
                    <span>Customer</span>
                    <span>Resolved By</span>
                    <span>Resolution Notes</span>
                    <span>Resolved</span>
                </div>
                <div className="mt-4 space-y-3">
                    {resolvedTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="grid grid-cols-[110px_180px_160px_minmax(200px,1fr)_140px] items-center gap-4 rounded-xl border border-border bg-surface-alt px-4 py-3"
                        >
                            <span className="font-semibold text-foreground">
                                #{ticket.id}
                            </span>
                            <span className="text-sm text-foreground">
                                {ticket.customer}
                            </span>
                            <span className="text-sm text-muted">
                                {ticket.assignedAgent}
                            </span>
                            <span className="text-sm text-muted">
                                {ticket.details.resolutionNotes[0] ?? "Resolved"}
                            </span>
                            <span className="text-sm text-muted">
                                <RelativeTime iso={ticket.lastUpdated} />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
