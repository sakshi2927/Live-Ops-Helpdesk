import {
    Activity,
    BarChart3,
    CircleDot,
    FileText,
    Layers,
    Lock,
    Truck,
} from "lucide-react";

export type NavigationItem = {
    label: string;
    href: string;
    icon: typeof Layers;
    badgeKey?: "active" | "locked" | "resolved" | "agents";
};

export const navigationItems: NavigationItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: Layers },
    {
        label: "Active Tickets",
        href: "/tickets/active",
        icon: Activity,
        badgeKey: "active",
    },
    {
        label: "Locked Tickets",
        href: "/tickets/locked",
        icon: Lock,
        badgeKey: "locked",
    },
    {
        label: "Resolved Tickets",
        href: "/tickets/resolved",
        icon: FileText,
        badgeKey: "resolved",
    },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    {
        label: "Agents Online",
        href: "/agents",
        icon: CircleDot,
        badgeKey: "agents",
    },
    { label: "Fleet Overview", href: "/fleet", icon: Truck },
];
