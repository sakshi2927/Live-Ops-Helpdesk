import { TicketTable } from "@/components/tickets/ticket-table";

export function LiveTicketBoard() {
    return (
        <section className="w-full rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-[220px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">
                        Live Ticket Board
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                        <h3 className="text-2xl font-semibold text-foreground">
                            Active Ops Queue
                        </h3>
                        <span className="h-1 w-10 rounded-full bg-accent/70" />
                    </div>
                    <p className="mt-2 text-sm text-muted">
                        Real-time incidents across RapidDispatch lanes
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="rounded-full border border-border bg-surface-alt px-3 py-1.5 text-xs font-semibold text-muted">
                        Socket sync
                    </div>
                    <div className="rounded-full border border-border bg-surface-alt px-3 py-1.5 text-xs font-semibold text-muted">
                        No polling
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <TicketTable />
            </div>
        </section>
    );
}
