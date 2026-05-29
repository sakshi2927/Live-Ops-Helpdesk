import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

type LockBadgeProps = {
    label: string;
    muted?: boolean;
};

export function LockBadge({ label, muted }: LockBadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold",
                muted
                    ? "border-border bg-surface-alt text-muted"
                    : "border-warning/40 bg-warning/10 text-warning"
            )}
            title={label}
        >
            <Lock className="h-3 w-3" />
            {label}
        </div>
    );
}
