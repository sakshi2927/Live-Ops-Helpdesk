"use client";

import { memo, useEffect, useState } from "react";
import { Lock, Pencil } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/utils/date";
import type { Ticket } from "@/types/ticket";
import { TICKET_GRID } from "./ticket-table";
import { useAgentStore } from "@/store/agent-store";

const priorityStyles: Record<Ticket["priority"], string> = {
    critical:
        "bg-red-500/15 text-red-400 border border-red-500/30",
    high:
        "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    medium:
        "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    low:
        "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
};

const statusStyles: Record<string, string> = {
    open: "bg-blue-500/15 text-blue-400",
    in_progress: "bg-orange-500/15 text-orange-400",
    on_hold: "bg-yellow-500/15 text-yellow-400",
    resolved: "bg-emerald-500/15 text-emerald-400",
};

type TicketRowProps = {
    ticket: Ticket;
    onOpen: (ticketId: string) => void;
};

export const TicketRow = memo(function TicketRow({
    ticket,
    onOpen,
}: TicketRowProps) {
    const [relativeTime, setRelativeTime] = useState("-");
    const currentAgent = useAgentStore((state) => state.currentAgent);

    const lockedByAnotherAgent =
        ticket.lock &&
        ticket.lock.lockedById !== currentAgent?.id;

    const lockedByMe =
        ticket.lock &&
        ticket.lock.lockedById === currentAgent?.id;

    useEffect(() => {
        setRelativeTime(formatRelativeTime(ticket.lastUpdated));
    }, [ticket.lastUpdated]);

    return (
        <div
            className={cn(
                "relative",
                `grid ${TICKET_GRID} items-center gap-4 rounded-2xl border px-4 py-4 transition-all`,
                lockedByAnotherAgent
                    ? "border-red-500/30 bg-red-500/5"
                    : lockedByMe
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border bg-surface hover:border-accent/30 hover:bg-surface-alt"
            )}
        >
            {lockedByAnotherAgent && (
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-red-500" />
            )}

            {lockedByMe && (
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-emerald-500" />
            )}

            {/* Ticket ID */}
            <div className="font-semibold text-foreground">
                #{ticket.id}
            </div>

            {/* Priority */}
            <div>
                <span
                    className={cn(
                        "inline-flex min-w-[100px] justify-center rounded-full px-3 py-1 text-xs font-semibold",
                        priorityStyles[ticket.priority]
                    )}
                >
                    {ticket.priority.toUpperCase()}
                </span>
            </div>

            {/* Customer */}
            <div
                className="truncate font-medium text-foreground"
                title={ticket.customer}
            >
                {ticket.customer}
            </div>

            {/* Details */}
            <div className="min-w-0">
                <p
                    className="truncate font-medium text-foreground"
                    title={ticket.issue}
                >
                    {ticket.issue}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-muted">
                        {ticket.assignedAgent}
                    </span>

                    <span className="text-muted">•</span>

                    <span className="text-muted">
                        {relativeTime}
                    </span>

                    {ticket.lock && (
                        <>
                            <span className="text-muted">•</span>

                            {lockedByMe ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-400">
                                    <Pencil className="h-3 w-3" />
                                    You are editing
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-red-400">
                                    <Lock className="h-3 w-3" />
                                    Locked by {ticket.lock.lockedByName}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Status */}
            <div>
                <span
                    className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize",
                        statusStyles[ticket.status]
                    )}
                >
                    {ticket.status.replace("_", " ")}
                </span>
            </div>

            {/* Action */}
            <div>
                <button
                    onClick={() => onOpen(ticket.id)}
                    disabled={!!lockedByAnotherAgent}
                    className={cn(
                        "w-full rounded-xl border px-4 py-2 text-sm font-semibold transition",
                        lockedByAnotherAgent
                            ? "cursor-not-allowed border-red-500/20 bg-red-500/10 text-red-400"
                            : lockedByMe
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : "border-accent/30 text-accent hover:bg-accent/10"
                    )}
                >
                    {lockedByAnotherAgent ? (
                        <>
                            <Lock className="mr-2 inline h-4 w-4" />
                            Locked
                        </>
                    ) : lockedByMe ? (
                        <>
                            <Pencil className="mr-2 inline h-4 w-4" />
                            Editing
                        </>
                    ) : (
                        "Open Ticket"
                    )}
                </button>
            </div>
        </div>
    );
});