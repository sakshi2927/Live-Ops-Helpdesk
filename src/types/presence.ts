export type AgentStatus = "online" | "idle" | "offline";

export type AgentPresence = {
    id: string;
    name: string;
    role: string;
    status: AgentStatus;
    activity: string;
    avatarUrl?: string;
};
