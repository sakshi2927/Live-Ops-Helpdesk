import type { Ticket } from "@/types/ticket";

const customers = [
    "FedEx",
    "UPS",
    "DHL",
    "Amazon Logistics",
    "Maersk",
    "C.H. Robinson",
    "XPO Logistics",
    "Schneider",
    "J.B. Hunt",
    "Ryder",
];

const issues = [
    "Truck Breakdown",
    "Missed Delivery",
    "Route Delay",
    "Damaged Shipment",
    "Fuel Card Issue",
    "Driver Emergency",
    "Warehouse Delay",
    "Incorrect Invoice",
    "Lost Freight",
    "Customs Hold",
    "Temperature Excursion",
    "Trailer Swap Needed",
    "Dock Overcapacity",
    "Late POD Upload",
    "Carrier No-Show",
];

const agents = [
    "Sarah Johnson",
    "Mike Alvarez",
    "Priya Patel",
    "Jonas Berg",
    "Rachel Kim",
    "Lucas Romano",
    "Anita Desai",
    "Tariq Mahmoud",
    "Leila Hassan",
];

const priorities: Ticket["priority"][] = [
    "critical",
    "high",
    "medium",
    "low",
];

const statuses: Ticket["status"][] = [
    "open",
    "in_progress",
    "on_hold",
    "resolved",
];

const now = new Date();

export const mockTickets: Ticket[] = Array.from({ length: 52 }, (_, index) => {
    const createdAt = new Date(now.getTime() - (index + 3) * 1000 * 60 * 45);
    const lastUpdated = new Date(now.getTime() - index * 1000 * 60 * 12);
    const priority = priorities[index % priorities.length];
    const status = statuses[index % statuses.length];
    const issue = issues[index % issues.length];
    const customer = customers[index % customers.length];
    const assignedAgent = agents[index % agents.length];
    const id = `${100 + index}`;

    return {
        id,
        priority,
        customer,
        issue,
        assignedAgent,
        status,
        lastUpdated: lastUpdated.toISOString(),
        createdAt: createdAt.toISOString(),
        summary: `${issue} reported by ${customer}.`,
        details: {
            description: `${customer} reported ${issue.toLowerCase()} impacting a high-priority freight lane. Immediate coordination required with dispatch and carrier operations.`,
            timeline: [
                "Inbound call logged",
                "Carrier notified",
                "Operations escalation started",
            ],
            internalNotes: [
                "Verify driver ETA with ELD data.",
                "Check nearest repair partner availability.",
            ],
            resolutionNotes: ["Pending resolution and customer approval."],
            activityLog: [
                "Ticket created via voice intake.",
                "Auto-assigned based on lane coverage.",
            ],
        },
    };
});
