"use client";

import { useMemo, useState } from "react";
import { TicketTable } from "@/components/tickets/ticket-table";
import { useTicketStore } from "@/store/ticket-store";

export default function ActiveTicketsPage() {
    const tickets = useTicketStore((state) => state.tickets);
    const [query, setQuery] = useState("");
    const [priority, setPriority] = useState("all");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("recent");

    const filtered = useMemo(() => {
        const base = tickets.filter((ticket) => ticket.status !== "resolved");

        const searched = base.filter((ticket) => {
            const target = `${ticket.id} ${ticket.customer} ${ticket.issue} ${ticket.assignedAgent}`.toLowerCase();
            return target.includes(query.toLowerCase());
        });

        const filteredPriority =
            priority === "all"
                ? searched
                : searched.filter((ticket) => ticket.priority === priority);

        const filteredStatus =
            status === "all"
                ? filteredPriority
                : filteredPriority.filter((ticket) => ticket.status === status);

        const sorted = [...filteredStatus].sort((a, b) => {
            if (sort === "recent") {
                return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
            }
            return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        });

        return sorted;
    }, [tickets, query, priority, status, sort]);

    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-border bg-surface p-6">
                <h1 className="text-2xl font-semibold text-foreground">Active Tickets</h1>
                <p className="mt-2 text-sm text-muted">
                    Monitor live dispatch issues and coordinate real-time responses.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-4">
                    <input
                        className="rounded-xl border border-border bg-surface-alt px-4 py-2 text-sm text-foreground"
                        placeholder="Search tickets, customers, agents"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <select
                        className="rounded-xl border border-border bg-surface-alt px-4 py-2 text-sm text-foreground"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                    >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <select
                        className="rounded-xl border border-border bg-surface-alt px-4 py-2 text-sm text-foreground"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="on_hold">On Hold</option>
                    </select>
                    <select
                        className="rounded-xl border border-border bg-surface-alt px-4 py-2 text-sm text-foreground"
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </header>

            <TicketTable tickets={filtered} />
        </div>
    );
}
