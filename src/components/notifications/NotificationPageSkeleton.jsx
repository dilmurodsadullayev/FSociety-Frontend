// src/components/notifications/NotificationPageSkeleton.jsx

import React, { memo } from "react";
import { Loader2 } from "lucide-react";

import {
    NotificationLoadingState,
} from "./NotificationPagination";

// =========================================================
// CONSTANTS
// =========================================================

const SKELETON_STATS = [
    "total",
    "unread",
    "read",
];

const SKELETON_FILTERS = [0, 1, 2];

// =========================================================
// PULSE SKELETON BLOCK
//
// Projects / Problems style.
//
// Light / Dark Mode:
// - Light: slate
// - Dark: transparent white
//
// Reduced Motion support included.
// =========================================================

const Pulse = memo(function Pulse({
    className = "",
}) {
    return (
        <span
            aria-hidden="true"
            className={`
                block animate-pulse
                rounded-lg bg-slate-200/90
                motion-reduce:animate-none
                dark:bg-white/[0.07]
                ${className}
            `}
        />
    );
});

// =========================================================
// NOTIFICATION PAGE SKELETON
//
// 1. Statistics loading
// 2. Toolbar loading
// 3. Connection status loading
// 4. Notification card loading
//
// Reuses existing NotificationLoadingState.
// =========================================================

const NotificationPageSkeleton = ({
    count = 6,
}) => {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Bildirishnomalar yuklanmoqda"
            aria-busy="true"
            className="min-w-0"
        >
            <span className="sr-only">
                Bildirishnomalar va ularning
                statistikasi yuklanmoqda.
            </span>

            {/* =====================================
                STATISTICS SKELETON
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    mb-7 grid min-w-0
                    grid-cols-1 gap-4
                    sm:grid-cols-3
                "
            >
                {SKELETON_STATS.map((key) => (
                    <div
                        key={key}
                        className="
                            min-w-0 rounded-3xl border
                            border-slate-200

                            bg-white/90 p-5 shadow-sm

                            dark:border-white/[0.07]
                            dark:bg-[#0d121a]/85
                            dark:shadow-none
                        "
                    >
                        <div
                            className="
                                flex items-center
                                justify-between gap-3
                            "
                        >
                            <Pulse
                                className="
                                    h-3 w-20 max-w-full
                                "
                            />

                            <Pulse
                                className="
                                    h-9 w-9 shrink-0
                                    rounded-xl
                                "
                            />
                        </div>

                        <Pulse
                            className="
                                mt-4 h-9 w-24
                                max-w-full
                            "
                        />

                        <Pulse
                            className="
                                mt-3 h-3 w-32
                                max-w-full
                            "
                        />
                    </div>
                ))}
            </div>

            {/* =====================================
                TOOLBAR SKELETON
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    mb-7 flex min-w-0
                    flex-col gap-4

                    rounded-3xl border
                    border-slate-200

                    bg-white/90 p-4 shadow-sm

                    dark:border-white/[0.07]
                    dark:bg-[#0d121a]/85
                    dark:shadow-none

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                {/* FILTER BUTTONS */}

                <div
                    className="
                        grid min-w-0 grid-cols-3
                        gap-2 rounded-2xl

                        bg-slate-100/90 p-1.5
                        dark:bg-black/20
                    "
                >
                    {SKELETON_FILTERS.map((index) => (
                        <Pulse
                            key={index}
                            className={`
                                h-9 max-w-full rounded-xl

                                ${
                                    index === 0
                                        ? "w-20 sm:w-28"
                                        : "w-16 sm:w-24"
                                }
                            `}
                        />
                    ))}
                </div>

                {/* WEBSOCKET + ACTION BUTTON */}

                <div
                    className="
                        flex flex-wrap
                        items-center gap-2
                    "
                >
                    <Pulse
                        className="
                            h-10 w-36 max-w-full
                            rounded-xl
                        "
                    />

                    <Pulse
                        className="
                            h-10 w-32 max-w-full
                            rounded-xl
                        "
                    />
                </div>
            </div>

            {/* =====================================
                NOTIFICATION LOADING HEADER
            ====================================== */}

            <div
                className="
                    mb-4 flex items-center
                    gap-2 text-xs font-semibold

                    text-slate-600
                    dark:text-slate-400
                "
            >
                <Loader2
                    size={15}
                    aria-hidden="true"
                    className="
                        animate-spin
                        motion-reduce:animate-none
                    "
                />

                Bildirishnomalar yuklanmoqda...
            </div>

            {/* =====================================
                NOTIFICATION CARD SKELETON

                Existing component is reused.
                No duplicate card skeleton logic.
            ====================================== */}

            <NotificationLoadingState
                count={
                    Math.min(
                        Number(count) || 6,
                        6
                    )
                }
            />
        </div>
    );
};

export default memo(NotificationPageSkeleton);