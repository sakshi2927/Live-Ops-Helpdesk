"use client";

import { useMemo } from "react";
import { BarChart3, Lock, ShieldCheck, Ticket } from "lucide-react";
import { useTicketStore } from "@/store/ticket-store";

export function MetricsCards() {
    const tickets = useTicketStore((state) => state.tickets);

    const metrics = useMemo(() => {
        const activeTickets = tickets.filter((ticket) => ticket.status !== "resolved")
            .length;
        const lockedTickets = tickets.filter((ticket) => ticket.lock).length;
        const resolutionRate = Math.round(
            (tickets.filter((ticket) => ticket.status === "resolved").length /
                tickets.length) *
            100
        );

        return [
            {
                label: "Active Tickets",
                value: activeTickets,
                icon: Ticket,
            },
            {
                label: "Locked Tickets",
                value: lockedTickets,
                icon: Lock,
            },
            {
                label: "Online Agents",
                value: 12,
                icon: ShieldCheck,
            },
            {
                label: "Resolution Rate",
                value: `${resolutionRate}%`,
                icon: BarChart3,
            },
        ];
    }, [tickets]);

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                    <div
                        key={metric.label}
                        className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                {metric.label}
                            </p>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-accent">
                                <Icon className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-6 text-3xl font-semibold text-foreground">
                            {metric.value}
                        </p>
                        <p className="mt-2 text-sm text-muted">
                            Updated in real time
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
