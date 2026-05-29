"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTicketStore } from "@/store/ticket-store";
import { useSocketStore } from "@/store/socket-store";
import { updateTicketSchema, type UpdateTicketInput } from "@/lib/schemas/ticket";
import { cn } from "@/lib/cn";
import { useAgentStore } from "@/store/agent-store";

const panelMotion = {
    initial: { x: 60, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 60, opacity: 0 },
};

type TicketDrawerProps = {
    ticketId: string | null;
    onClose: () => void;
};

export function TicketDrawer({ ticketId, onClose }: TicketDrawerProps) {
    const tickets = useTicketStore((state) => state.tickets);
    const unlockTicket = useTicketStore((state) => state.unlockTicket);
    const updateTicket = useTicketStore((state) => state.updateTicket);
    const socket = useSocketStore((state) => state.socket);
    const currentAgent = useAgentStore((state) => state.currentAgent);

    const ticket = useMemo(
        () => tickets.find((item) => item.id === ticketId),
        [tickets, ticketId]
    );

    const form = useForm<UpdateTicketInput>({
        resolver: zodResolver(updateTicketSchema),
        defaultValues: {
            status: ticket?.status ?? "open",
            summary: ticket?.summary ?? "",
            internalNote: "",
        },
    });

    useEffect(() => {
        if (!ticket || !ticketId) {
            return;
        }

        if (!ticket.lock && currentAgent) {
            socket?.emit("lock_ticket", {
                ticketId,
                agentId: currentAgent.id,
                agentName: currentAgent.name,
            });
            toast.message(`Requesting lock for Ticket #${ticketId}`);
        }
    }, [currentAgent, socket, ticket, ticketId]);

    useEffect(() => {
        form.reset({
            status: ticket?.status ?? "open",
            summary: ticket?.summary ?? "",
            internalNote: "",
        });
    }, [form, ticket]);

    if (!ticket) {
        return null;
    }

    const handleUnlock = () => {
        if (!currentAgent || ticket.lock?.lockedById !== currentAgent.id) {
            return;
        }
        unlockTicket(ticket.id);
        socket?.emit("unlock_ticket", {
            ticketId: ticket.id,
            agentId: currentAgent.id,
        });
    };

    const onSubmit = (values: UpdateTicketInput) => {
        if (!currentAgent || ticket.lock?.lockedById !== currentAgent.id) {
            toast.error("Ticket is locked by another agent.");
            return;
        }
        updateTicket(ticket.id, {
            status: values.status,
            summary: values.summary,
            lastUpdated: new Date().toISOString(),
        });

        socket?.emit("update_ticket", {
            ...ticket,
            status: values.status,
            summary: values.summary,
            lastUpdated: new Date().toISOString(),
        });

        toast.success("Changes synchronized successfully");
        handleUnlock();
        onClose();
    };

    const lockedByAnotherAgent =
        ticket.lock && ticket.lock.lockedById !== currentAgent?.id;

    return (
        <Dialog.Root
            open={Boolean(ticketId)}
            onOpenChange={(open) => {
                if (!open) {
                    handleUnlock();
                    onClose();
                }
            }}
        >
            <AnimatePresence>
                {ticketId && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40 bg-black/40"
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                {...panelMotion}
                                transition={{ duration: 0.3 }}
                                className="fixed right-0 top-0 z-50 flex h-full w-full max-w-162.5 flex-col border-l border-border bg-surface shadow-(--shadow)"
                            >
                                <Dialog.Title className="sr-only">
                                    Ticket details
                                </Dialog.Title>
                                <Dialog.Description className="sr-only">
                                    Review and update ticket details. Save to unlock.
                                </Dialog.Description>
                                <header className="flex items-start justify-between border-b border-border px-6 py-5">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                            Ticket #{ticket.id}
                                        </p>
                                        <h3 className="mt-2 text-2xl font-semibold text-foreground">
                                            {ticket.issue}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted">
                                            {ticket.summary}
                                        </p>
                                        {lockedByAnotherAgent && (
                                            <p className="mt-3 text-sm font-semibold text-warning">
                                                Locked by {ticket.lock?.lockedByName}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:text-foreground"
                                        onClick={() => {
                                            handleUnlock();
                                            onClose();
                                        }}
                                        aria-label="Close ticket drawer"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </header>

                                <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
                                    <section className="grid gap-4 rounded-2xl border border-border bg-surface-alt p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                            Customer Details
                                        </p>
                                        <div className="grid gap-2 text-sm text-foreground">
                                            <p>
                                                <span className="font-semibold">Customer:</span> {ticket.customer}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Assigned Agent:</span> {ticket.assignedAgent}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Status:</span> {ticket.status}
                                            </p>
                                        </div>
                                    </section>

                                    <section className="space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                            Issue Description
                                        </p>
                                        <p className="text-sm text-foreground">
                                            {ticket.details.description}
                                        </p>
                                    </section>

                                    <section className="grid gap-4 lg:grid-cols-2">
                                        <div className="rounded-2xl border border-border bg-surface-alt p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                                Timeline
                                            </p>
                                            <ul className="mt-3 space-y-2 text-sm text-foreground">
                                                {ticket.details.timeline.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="rounded-2xl border border-border bg-surface-alt p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                                Activity Log
                                            </p>
                                            <ul className="mt-3 space-y-2 text-sm text-foreground">
                                                {ticket.details.activityLog.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-border bg-surface-alt p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                            Internal Notes
                                        </p>
                                        <ul className="mt-3 space-y-2 text-sm text-foreground">
                                            {ticket.details.internalNotes.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section className="rounded-2xl border border-border bg-surface-alt p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                            Resolution Notes
                                        </p>
                                        <ul className="mt-3 space-y-2 text-sm text-foreground">
                                            {ticket.details.resolutionNotes.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </section>

                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-4 rounded-2xl border border-border bg-surface-alt p-4"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                            Update Ticket
                                        </p>
                                        <div className="grid gap-3">
                                            <label className="text-xs font-semibold text-muted">
                                                Status
                                                <select
                                                    className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
                                                    {...form.register("status")}
                                                    disabled={lockedByAnotherAgent}
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="on_hold">On Hold</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                            </label>
                                            <label className="text-xs font-semibold text-muted">
                                                Update Summary
                                                <textarea
                                                    className="mt-2 min-h-22.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
                                                    {...form.register("summary")}
                                                    disabled={lockedByAnotherAgent}
                                                />
                                            </label>
                                            <label className="text-xs font-semibold text-muted">
                                                Internal Note
                                                <textarea
                                                    className={cn(
                                                        "mt-2 min-h-22.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground",
                                                        form.formState.errors.internalNote &&
                                                        "border-danger text-danger"
                                                    )}
                                                    {...form.register("internalNote")}
                                                    disabled={lockedByAnotherAgent}
                                                />
                                            </label>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
                                            disabled={lockedByAnotherAgent}
                                        >
                                            Save & Unlock
                                        </button>
                                    </form>
                                </div>

                                <footer className="flex items-center justify-between border-t border-border px-6 py-4">
                                    <p className="text-xs text-muted">
                                        Changes sync instantly across all agents.
                                    </p>
                                    <button
                                        onClick={() => {
                                            handleUnlock();
                                            onClose();
                                        }}
                                        className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted transition hover:text-foreground"
                                    >
                                        Close
                                    </button>
                                </footer>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
