export type TicketPriority = "critical" | "high" | "medium" | "low";
export type TicketStatus = "open" | "in_progress" | "on_hold" | "resolved";

export type TicketLock = {
    lockedById: string;
    lockedByName: string;
    lockedAt: string;
};

export type TicketDetails = {
    description: string;
    timeline: string[];
    internalNotes: string[];
    resolutionNotes: string[];
    activityLog: string[];
};

export type Ticket = {
    id: string;
    priority: TicketPriority;
    customer: string;
    issue: string;
    assignedAgent: string;
    status: TicketStatus;
    lastUpdated: string;
    createdAt: string;
    summary: string;
    lock?: TicketLock;
    details: TicketDetails;
};
