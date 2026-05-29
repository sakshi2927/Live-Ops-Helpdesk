"use client";

import { useEffect, useMemo, useState } from "react";
import { useTicketStore } from "@/store/ticket-store";
import { formatRelativeTime } from "@/utils/date";

export function RecentActivity() {
    const tickets = useTicketStore((state) => state.tickets);

    const activityBase = useMemo(
        () =>
            tickets
                .slice(0, 6)
                .map((ticket) => ({
                    id: ticket.id,
                    issue: ticket.issue,
                    agent: ticket.assignedAgent,
                    lastUpdated: ticket.lastUpdated,
                })),
        [tickets]
    );

    const [activity, setActivity] = useState(
        activityBase.map((item) => ({ ...item, time: "-" }))
    );

    useEffect(() => {
        setActivity(
            activityBase.map((item) => ({
                ...item,
                time: formatRelativeTime(item.lastUpdated),
            }))
        );
    }, [activityBase]);

    return (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Recent Activity
            </p>
            <div className="mt-4 space-y-4">
                {activity.map((item) => (
                    <div key={item.id} className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Ticket #{item.id}
                            </p>
                            <p className="text-xs text-muted">
                                {item.issue} - {item.agent}
                            </p>
                        </div>
                        <span className="text-xs text-muted" suppressHydrationWarning>
                            {item.time}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
