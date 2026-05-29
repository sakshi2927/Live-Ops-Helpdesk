"use client";

import { navigationItems } from "@/constants/navigation";
import { cn } from "@/lib/cn";
import { useAgentStore } from "@/store/agent-store";

export function Sidebar() {
    const currentAgent = useAgentStore((state) => state.currentAgent);

    return (
        <aside className="hidden w-[280px] flex-col border-r border-border bg-surface px-6 py-8 lg:flex">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    RapidDispatch
                </p>
                <h1 className="text-2xl font-semibold text-foreground">
                    Live Ops Helpdesk
                </h1>
            </div>

            <nav className="mt-10 flex flex-1 flex-col gap-2">
                {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === 0;
                    return (
                        <button
                            key={item.label}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                                isActive
                                    ? "bg-surface-strong text-foreground shadow-sm"
                                    : "text-muted hover:bg-surface-alt hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="rounded-2xl border border-border bg-surface-alt p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Current Agent
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                    {currentAgent?.name ?? "Unassigned"}
                </p>
                <p className="text-sm text-muted">
                    {currentAgent?.role ?? "Select an agent"}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-success">
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                    Online
                </div>
            </div>
        </aside>
    );
}
