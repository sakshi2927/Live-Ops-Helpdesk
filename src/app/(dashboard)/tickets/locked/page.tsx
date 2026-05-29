"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { useTicketStore } from "@/store/ticket-store";
import { formatRelativeTime } from "@/utils/date";

function RelativeTime({ iso }: { iso: string }) {
    const [value, setValue] = useState("-");

    useEffect(() => {
        setValue(formatRelativeTime(iso));
    }, [iso]);

    return <span suppressHydrationWarning>{value}</span>;
}

export default function LockedTicketsPage() {
    const tickets = useTicketStore((state) => state.tickets);

    const lockedTickets = useMemo(
        () => tickets.filter((ticket) => ticket.lock),
        [tickets]
    );

    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Locked Tickets
                        </h1>
                        <p className="mt-2 text-sm text-muted">
                            Resolve collisions quickly and release locks when done.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-border bg-surface-alt px-4 py-2 text-sm">
                        <Lock className="h-4 w-4 text-warning" />
                        <span className="font-semibold text-foreground">
                            Currently Locked: {lockedTickets.length}
                        </span>
                    </div>
                </div>
            </header>

            <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="grid grid-cols-[120px_180px_160px_120px_120px] gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    <span>Ticket</span>
                    <span>Locked By</span>
                    <span>Lock Time</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>
                <div className="mt-4 space-y-3">
                    {lockedTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="grid grid-cols-[120px_180px_160px_120px_120px] items-center gap-4 rounded-xl border border-border bg-surface-alt px-4 py-3"
                        >
                            <span className="font-semibold text-foreground">
                                #{ticket.id}
                            </span>
                            <span className="text-sm text-foreground">
                                {ticket.lock?.lockedByName}
                            </span>
                            <span className="text-sm text-muted">
                                {ticket.lock?.lockedAt ? (
                                    <RelativeTime iso={ticket.lock.lockedAt} />
                                ) : (
                                    "-"
                                )}
                            </span>
                            <span className="text-sm text-muted">
                                {ticket.status.replace("_", " ")}
                            </span>
                            <span className="text-xs font-semibold text-muted">
                                View ticket
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
