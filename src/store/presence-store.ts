import { create } from "zustand";
import type { AgentPresence } from "@/types/presence";

type PresenceStore = {
    onlineAgents: AgentPresence[];
    setAgents: (agents: AgentPresence[]) => void;
    updateAgent: (agent: AgentPresence) => void;
    removeAgent: (agentId: string) => void;
};

export const usePresenceStore = create<PresenceStore>((set) => ({
    onlineAgents: [],
    setAgents: (agents) => set({ onlineAgents: agents }),
    updateAgent: (agent) =>
        set((state) => {
            const exists = state.onlineAgents.find((item) => item.id === agent.id);
            if (exists) {
                return {
                    onlineAgents: state.onlineAgents.map((item) =>
                        item.id === agent.id ? agent : item
                    ),
                };
            }
            return { onlineAgents: [agent, ...state.onlineAgents] };
        }),
    removeAgent: (agentId) =>
        set((state) => ({
            onlineAgents: state.onlineAgents.filter((item) => item.id !== agentId),
        })),
}));
