"use client";

import { usePresenceStore } from "@/store/presence-store";
import { cn } from "@/lib/cn";

const statusStyles = {
    online: "bg-success",
    idle: "bg-warning",
    offline: "bg-muted",
};

export function PresencePanel() {
    const agents = usePresenceStore((state) => state.onlineAgents);

    return (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Presence Panel
                </p>
                <span className="text-sm font-semibold text-foreground">
                    {agents.length} online
                </span>
            </div>

            <div className="mt-5 space-y-4">
                {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-surface-strong" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">
                                {agent.name}
                            </p>
                            <p className="text-xs text-muted">{agent.activity}</p>
                        </div>
                        <span
                            className={cn(
                                "h-2.5 w-2.5 rounded-full",
                                statusStyles[agent.status]
                            )}
                            aria-label={agent.status}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
