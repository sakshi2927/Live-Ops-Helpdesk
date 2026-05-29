import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Agent } from "@/types/agent";

type AgentStore = {
    currentAgent: Agent | null;
    setAgent: (agent: Agent) => void;
    clearAgent: () => void;
};

export const useAgentStore = create<AgentStore>()(
    persist(
        (set) => ({
            currentAgent: null,
            setAgent: (agent) => {
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                        "currentAgent",
                        JSON.stringify(agent)
                    );
                }
                set({ currentAgent: agent });
            },
            clearAgent: () => {
                if (typeof window !== "undefined") {
                    window.localStorage.removeItem("currentAgent");
                }
                set({ currentAgent: null });
            },
        }),
        {
            name: "agentStore",
        }
    )
);
