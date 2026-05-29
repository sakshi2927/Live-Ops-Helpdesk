import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { LiveTicketBoard } from "@/components/dashboard/live-ticket-board";
import { OnlineAgentsWidget } from "@/components/dashboard/online-agents-widget";
import { PresencePanel } from "@/components/presence/presence-panel";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
    return (
        <div className="grid gap-6">
            <MetricsCards />
            <div className="w-full">
                <LiveTicketBoard />
                <div className="grid gap-6">
                    {/* <OnlineAgentsWidget />
                    <PresencePanel />
                    <RecentActivity /> */}
                </div>
            </div>
        </div>
    );
}
