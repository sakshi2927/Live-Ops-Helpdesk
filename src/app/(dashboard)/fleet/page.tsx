export default function FleetOverviewPage() {
    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-border bg-surface p-6">
                <h1 className="text-2xl font-semibold text-foreground">Fleet Overview</h1>
                <p className="mt-2 text-sm text-muted">
                    Live logistics operations snapshot across lanes and facilities.
                </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: "Active Deliveries", value: "128" },
                    { label: "Delayed Routes", value: "12" },
                    { label: "Breakdowns", value: "4" },
                    { label: "Drivers Online", value: "86" },
                ].map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-2xl border border-border bg-surface p-5"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            {metric.label}
                        </p>
                        <p className="mt-4 text-3xl font-semibold text-foreground">
                            {metric.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-border bg-surface p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Route Map
                    </p>
                    <div className="mt-4 h-64 rounded-2xl border border-dashed border-border bg-surface-alt/70" />
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Warehouse Health
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-foreground">
                        <li>Atlanta Hub - Stable</li>
                        <li>Dallas Hub - Moderate Load</li>
                        <li>Chicago Hub - High Volume</li>
                        <li>Seattle Hub - Weather Delay</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
