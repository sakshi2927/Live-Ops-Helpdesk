"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_AGENTS } from "@/constants/demo-agents";
import { useAgentStore } from "@/store/agent-store";
import { cn } from "@/lib/cn";

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function AgentSelection() {
    const setAgent = useAgentStore((state) => state.setAgent);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-app text-foreground">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
                <div className="rounded-3xl border border-border bg-surface/90 p-10 shadow-[var(--shadow)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">
                        RapidDispatch Live Ops Helpdesk
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold text-foreground">
                        Select an agent profile to enter the system.
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-muted">
                        This is a mock authentication layer for testing real-time
                        collaboration, presence, and ticket locking.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {DEMO_AGENTS.map((agent) => {
                            const initials = getInitials(agent.name);
                            const isSelected = selectedId === agent.id;

                            return (
                                <div
                                    key={agent.id}
                                    className={cn(
                                        "flex items-center justify-between rounded-2xl border border-border bg-surface-alt/70 p-5 transition",
                                        isSelected
                                            ? "border-accent/60 bg-surface"
                                            : "hover:border-accent/30"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold text-foreground">
                                                {agent.name}
                                            </p>
                                            <p className="text-xs text-muted">
                                                {agent.email}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-muted">
                                                {agent.role}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className={cn(
                                            "rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer",
                                            isSelected
                                                ? "border-accent/40 bg-accent/10 text-accent"
                                                : "border-border text-muted hover:text-foreground"
                                        )}
                                        onClick={() => {
                                            setSelectedId(agent.id);
                                            setAgent(agent);
                                            router.push("/dashboard");
                                        }}
                                    >
                                        Enter Dashboard
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
