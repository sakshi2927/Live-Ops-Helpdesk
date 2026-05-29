"use client";

import { usePresenceStore } from "@/store/presence-store";

export default function AgentsOnlinePage() {
    const agents = usePresenceStore((state) => state.onlineAgents);

    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-border bg-surface p-6">
                <h1 className="text-2xl font-semibold text-foreground">Agents Online</h1>
                <p className="mt-2 text-sm text-muted">
                    Live presence across dispatch, operations, and escalation teams.
                </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {agents.map((agent) => (
                    <div
                        key={agent.id}
                        className="rounded-2xl border border-border bg-surface p-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                                {agent.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </div>
                            <div>
                                <p className="text-base font-semibold text-foreground">
                                    {agent.name}
                                </p>
                                <p className="text-xs text-muted">{agent.role}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-muted">
                            {agent.activity}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-success">
                            <span className="h-2 w-2 rounded-full bg-success" />
                            {agent.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
