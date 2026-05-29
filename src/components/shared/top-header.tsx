"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, ChevronDown, Menu, Search, Wifi, WifiOff } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSocketStore } from "@/store/socket-store";
import { cn } from "@/lib/cn";
import { useAgentStore } from "@/store/agent-store";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

type TopHeaderProps = {
    title?: string;
    onMenuClick?: () => void;
};

const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/tickets/active": "Active Tickets",
    "/tickets/locked": "Locked Tickets",
    "/tickets/resolved": "Resolved Tickets",
    "/analytics": "Analytics",
    "/agents": "Agents Online",
    "/fleet": "Fleet Overview",
};

export function TopHeader({ title, onMenuClick }: TopHeaderProps) {
    const connectionStatus = useSocketStore((state) => state.connectionStatus);
    const isConnected = connectionStatus === "connected";
    const currentAgent = useAgentStore((state) => state.currentAgent);
    const clearAgent = useAgentStore((state) => state.clearAgent);
    const pathname = usePathname();
    const resolvedTitle = title ?? titles[pathname ?? ""] ?? "Dashboard";

    const initials = currentAgent
        ? currentAgent.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "--";

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/80 px-6 py-4 backdrop-blur lg:px-8">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-alt text-muted transition hover:text-foreground lg:hidden"
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-4 w-4" />
                    </button>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                        Operations Center
                    </p>
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                    {resolvedTitle}
                </h2>
                <Breadcrumbs />
            </div>

            <div className="hidden flex-1 justify-center px-8 lg:flex">
                <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-border bg-surface-alt px-4 py-2 text-sm text-muted">
                    <Search className="h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search tickets, customers, lanes"
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                        aria-label="Search tickets"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                        isConnected
                            ? "border-success/40 text-success"
                            : "border-warning/40 text-warning"
                    )}
                >
                    {isConnected ? (
                        <Wifi className="h-3.5 w-3.5" />
                    ) : (
                        <WifiOff className="h-3.5 w-3.5" />
                    )}
                    {isConnected ? "Connected" : "Reconnecting"}
                </div>
                <button
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-alt text-muted transition hover:text-foreground"
                    aria-label="Notifications"
                >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
                </button>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="flex items-center gap-3 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-left">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                                {initials}
                            </div>
                            <div className="hidden text-sm lg:block">
                                <p className="font-semibold text-foreground">
                                    {currentAgent?.name ?? "Select Agent"}
                                </p>
                                <p className="text-xs text-muted">
                                    {currentAgent?.role ?? ""}
                                </p>
                            </div>
                            <ChevronDown className="hidden h-4 w-4 text-muted lg:block" />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            sideOffset={8}
                            className="min-w-[180px] rounded-xl border border-border bg-surface p-2 shadow-lg"
                        >
                            <DropdownMenu.Item
                                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-alt"
                                onSelect={() => clearAgent()}
                            >
                                Switch Agent
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-alt"
                                onSelect={() => clearAgent()}
                            >
                                Logout
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </header>
    );
}
