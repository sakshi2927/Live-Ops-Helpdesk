import { z } from "zod";

export const createTicketSchema = z.object({
    customer: z.string().min(2, "Customer is required."),
    issue: z.string().min(3, "Issue summary is required."),
    priority: z.enum(["critical", "high", "medium", "low"]),
    assignedAgent: z.string().min(2, "Assign an agent."),
    description: z.string().min(10, "Provide a detailed description."),
});

export const updateTicketSchema = z.object({
    status: z.enum(["open", "in_progress", "on_hold", "resolved"]),
    summary: z.string().min(5, "Provide an update summary."),
    internalNote: z.string().min(5, "Internal note is required."),
});

export const resolutionSchema = z.object({
    resolutionNotes: z.string().min(10, "Resolution notes are required."),
    customerNotified: z.boolean(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type ResolutionInput = z.infer<typeof resolutionSchema>;
