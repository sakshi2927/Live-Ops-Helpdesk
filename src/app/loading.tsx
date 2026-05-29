import { Skeleton } from "@/components/shared/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-app px-8 py-6">
            <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-32" />
                    ))}
                </div>
                <Skeleton className="h-130" />
            </div>
        </div>
    );
}
