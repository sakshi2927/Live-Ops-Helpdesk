"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useSocketStore } from "@/store/socket-store";

export function ConnectionBanner() {
    const status = useSocketStore((state) => state.connectionStatus);
    const showBanner = status !== "connected";

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-x-0 top-0 z-50 flex items-center justify-center bg-warning text-black"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-3 px-6 py-3 text-sm font-semibold">
                        <AlertTriangle className="h-4 w-4" />
                        Connection lost. Reconnecting... Unsaved changes may not synchronize.
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
