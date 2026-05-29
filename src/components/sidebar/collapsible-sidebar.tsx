"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pin, PinOff, X } from "lucide-react";
import { navigationItems } from "@/constants/navigation";
import { cn } from "@/lib/cn";
import { useTicketStore } from "@/store/ticket-store";
import { usePresenceStore } from "@/store/presence-store";
import { useAgentStore } from "@/store/agent-store";

const collapsedWidth = 96;
const expandedWidth = 280;

type CollapsibleSidebarProps = {
    mobileOpen: boolean;
    onMobileOpenChange: (open: boolean) => void;
};

export function CollapsibleSidebar({
    mobileOpen,
    onMobileOpenChange,
}: CollapsibleSidebarProps) {
    const pathname = usePathname();
    const tickets = useTicketStore((state) => state.tickets);
    const onlineAgents = usePresenceStore((state) => state.onlineAgents);
    const currentAgent = useAgentStore((state) => state.currentAgent);
    const [pinned, setPinned] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const stored = window.localStorage.getItem("sidebarPinned");
        setPinned(stored === "true");
    }, []);

    useEffect(() => {
        window.localStorage.setItem("sidebarPinned", String(pinned));
    }, [pinned]);

    const expanded = pinned || hovered;

    const activeCount = tickets.filter((ticket) => ticket.status !== "resolved").length;
    const lockedCount = tickets.filter((ticket) => ticket.lock).length;
    const resolvedCount = tickets.filter((ticket) => ticket.status === "resolved").length;
    const agentsCount = onlineAgents.length;

    const badgeMap = {
        active: activeCount,
        locked: lockedCount,
        resolved: resolvedCount,
        agents: agentsCount,
    } as const;

    const isActiveRoute = (href: string) =>
        href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname?.startsWith(href);

    const renderNav = (isMobile: boolean) => (
        <div className="flex h-full flex-col">
            <div className={cn("flex items-center justify-between pt-6", expanded ? "px-4" : "px-3")}>
                <div className={cn("flex items-center", expanded ? "gap-3" : "gap-0")}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-xs font-semibold text-accent">
                        RD
                    </div>
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-1"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                                    Rapid Dispatch
                                </p>
                                <p className="text-base font-semibold text-foreground">
                                    Live Ops Helpdesk
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {isMobile ? (
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted"
                        onClick={() => onMobileOpenChange(false)}
                        aria-label="Close sidebar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted"
                        onClick={() => setPinned((value) => !value)}
                        aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
                    >
                        {pinned ? (
                            <PinOff className="h-4 w-4" />
                        ) : (
                            <Pin className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>

            <Tooltip.Provider delayDuration={200}>
                <nav className={cn("mt-8 flex flex-1 flex-col gap-1", expanded ? "px-3" : "px-2")}>
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActiveRoute(item.href);
                        const badgeValue = item.badgeKey ? badgeMap[item.badgeKey] : null;

                        const content = (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition",
                                    expanded ? "gap-3 px-3" : "justify-center px-2",
                                    active
                                        ? "bg-surface-strong text-foreground shadow-sm"
                                        : "text-muted hover:bg-surface-alt hover:text-foreground"
                                )}
                            >
                                {active && (
                                    <span className="absolute left-0 top-2.5 h-6 w-1 rounded-r-full bg-accent" />
                                )}
                                <Icon className="h-4 w-4" />
                                <AnimatePresence>
                                    {expanded && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -6 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="flex-1"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {badgeValue !== null && (
                                    <span
                                        className={cn(
                                            "text-[11px] font-semibold",
                                            expanded
                                                ? "rounded-full bg-surface-strong px-2 py-0.5 text-foreground"
                                                : "absolute right-2 h-2 w-2 rounded-full bg-accent"
                                        )}
                                    >
                                        {expanded ? badgeValue : ""}
                                    </span>
                                )}
                            </Link>
                        );

                        if (expanded) {
                            return content;
                        }

                        return (
                            <Tooltip.Root key={item.href}>
                                <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        side="right"
                                        className="rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground shadow-lg"
                                    >
                                        {item.label}
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        );
                    })}
                </nav>
            </Tooltip.Provider>

            <div className={cn("pb-6", expanded ? "px-4" : "px-3")}>
                <div className="rounded-2xl border border-border bg-surface-alt p-4">
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="space-y-2"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                    Current Agent
                                </p>
                                <p className="text-sm font-semibold text-foreground">
                                    {currentAgent?.name ?? "Unassigned"}
                                </p>
                                <p className="text-xs text-muted">
                                    {currentAgent?.role ?? "Select an agent"}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!expanded && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                            {currentAgent?.name
                                ? currentAgent.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                                : "--"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <motion.aside
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                animate={{ width: expanded ? expandedWidth : collapsedWidth }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
                style={{ willChange: "width" }}
                className="hidden h-screen flex-col border-r border-border bg-surface lg:flex"
            >
                {renderNav(false)}
            </motion.aside>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 lg:hidden"
                        onClick={() => onMobileOpenChange(false)}
                    >
                        <motion.aside
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ duration: 0.25 }}
                            className="h-full w-[280px] border-r border-border bg-surface"
                            onClick={(event) => event.stopPropagation()}
                        >
                            {renderNav(true)}
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
