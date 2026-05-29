"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useMemo } from "react";
import { useTicketStore } from "@/store/ticket-store";

export default function AnalyticsPage() {
    const tickets = useTicketStore((state) => state.tickets);

    const data = useMemo(() => {
        const byPriority = ["critical", "high", "medium", "low"].map(
            (priority) => ({
                name: priority,
                value: tickets.filter((ticket) => ticket.priority === priority)
                    .length,
            })
        );

        const byStatus = ["open", "in_progress", "on_hold", "resolved"].map(
            (status) => ({
                name: status,
                value: tickets.filter((ticket) => ticket.status === status).length,
            })
        );

        const resolutionTimes = tickets.map((ticket) => {
            const start = new Date(ticket.createdAt).getTime();
            const end = new Date(ticket.lastUpdated).getTime();
            const hours = Math.max(1, Math.round((end - start) / 36e5));
            return { name: `#${ticket.id}`, hours };
        });

        return { byPriority, byStatus, resolutionTimes };
    }, [tickets]);

    const colors = ["#ef4444", "#f97316", "#facc15", "#34d399"];

    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-border bg-surface p-6">
                <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
                <p className="mt-2 text-sm text-muted">
                    Operational KPIs, resolution trends, and lock impact analysis.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Tickets by Priority
                    </p>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.byPriority}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                >
                                    {data.byPriority.map((entry, index) => (
                                        <Cell
                                            key={entry.name}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Tickets by Status
                    </p>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.byStatus}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
                                <XAxis dataKey="name" stroke="#8b97ab" />
                                <YAxis stroke="#8b97ab" />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4bb0ff" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Resolution Time (Hours)
                </p>
                <div className="mt-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.resolutionTimes}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
                            <XAxis dataKey="name" stroke="#8b97ab" hide />
                            <YAxis stroke="#8b97ab" />
                            <Tooltip />
                            <Line type="monotone" dataKey="hours" stroke="#4bb0ff" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
