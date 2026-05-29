"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Crumb = {
    label: string;
    href?: string;
};

const crumbMap: Record<string, Crumb[]> = {
    "/dashboard": [{ label: "Dashboard" }],
    "/tickets/active": [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Active Tickets" },
    ],
    "/tickets/locked": [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Locked Tickets" },
    ],
    "/tickets/resolved": [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Resolved Tickets" },
    ],
    "/analytics": [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics" },
    ],
    "/agents": [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Agents Online" },
    ],
    "/fleet": [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Fleet Overview" },
    ],
};

function resolveCrumbs(pathname: string | null) {
    if (!pathname) {
        return crumbMap["/dashboard"];
    }

    return (
        crumbMap[pathname] ??
        crumbMap[
        Object.keys(crumbMap).find((key) => pathname.startsWith(key)) ??
        "/dashboard"
        ]
    );
}

export function Breadcrumbs() {
    const pathname = usePathname();
    const crumbs = resolveCrumbs(pathname);

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-muted">
                {crumbs.map((crumb, index) => (
                    <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                        {crumb.href ? (
                            <Link
                                href={crumb.href}
                                className="font-semibold text-muted transition hover:text-foreground"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="font-semibold text-foreground">
                                {crumb.label}
                            </span>
                        )}
                        {index < crumbs.length - 1 && (
                            <span className="text-muted/60">/</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
