import { formatDistanceToNowStrict } from "date-fns";

export function formatRelativeTime(isoDate: string) {
    return formatDistanceToNowStrict(new Date(isoDate), {
        addSuffix: true,
    });
}
