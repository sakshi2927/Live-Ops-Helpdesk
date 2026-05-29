"use client";

import { useEffect, useState } from "react";
import { AgentSelection } from "@/components/auth/agent-selection";
import { useAgentStore } from "@/store/agent-store";
import type { Agent } from "@/types/agent";

type AgentGateProps = {
    children: React.ReactNode;
};

export function AgentGate({ children }: AgentGateProps) {
    const currentAgent = useAgentStore((state) => state.currentAgent);
    const setAgent = useAgentStore((state) => state.setAgent);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
        if (!currentAgent && typeof window !== "undefined") {
            const stored = window.localStorage.getItem("currentAgent");
            if (stored) {
                try {
                    setAgent(JSON.parse(stored) as Agent);
                } catch {
                    window.localStorage.removeItem("currentAgent");
                }
            }
        }
    }, [currentAgent, setAgent]);

    if (!hydrated) {
        return null;
    }

    if (!currentAgent) {
        return <AgentSelection />;
    }

    return <>{children}</>;
}
