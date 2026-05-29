import type { AgentPresence } from "@/types/presence";

export const mockAgents: AgentPresence[] = [
    {
        id: "agent-rapid-001",
        name: "Sarah Johnson",
        role: "Senior Dispatch Specialist",
        status: "online",
        activity: "Editing Ticket #105",
    },
    {
        id: "agent-rapid-002",
        name: "Mike Alvarez",
        role: "Fleet Operations",
        status: "online",
        activity: "Viewing Dashboard",
    },
    {
        id: "agent-rapid-003",
        name: "Priya Patel",
        role: "Customer Escalations",
        status: "online",
        activity: "Resolving Ticket #118",
    },
    {
        id: "agent-rapid-004",
        name: "Jonas Berg",
        role: "Carrier Relations",
        status: "idle",
        activity: "Reviewing analytics",
    },
    {
        id: "agent-rapid-005",
        name: "Rachel Kim",
        role: "Billing Ops",
        status: "online",
        activity: "Investigating Invoice #442",
    },
];
