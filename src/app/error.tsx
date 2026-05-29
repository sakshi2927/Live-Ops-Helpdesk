"use client";

import { useEffect } from "react";

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-app text-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Live Ops Helpdesk
            </p>
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
            <p className="max-w-md text-center text-sm text-muted">
                The operations center hit an unexpected issue. Retry to restore live
                updates.
            </p>
            <button
                onClick={() => reset()}
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
            >
                Retry Dashboard
            </button>
        </div>
    );
}
