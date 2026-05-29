"use client";

import { useState } from "react";
import { AgentGate } from "@/components/auth/agent-gate";
import { ConnectionBanner } from "@/components/shared/connection-banner";
import { CollapsibleSidebar } from "@/components/sidebar/collapsible-sidebar";
import { TopHeader } from "@/components/shared/top-header";

type DashboardShellProps = {
    children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <AgentGate>
            <div className="min-h-screen bg-app text-foreground">
                <ConnectionBanner />
                <div className="flex min-h-screen">
                    <CollapsibleSidebar
                        mobileOpen={mobileOpen}
                        onMobileOpenChange={setMobileOpen}
                    />
                    <div className="flex flex-1 flex-col">
                        <TopHeader onMenuClick={() => setMobileOpen(true)} />
                        <main className="flex-1 px-6 py-6 lg:px-8">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </AgentGate>
    );
}
