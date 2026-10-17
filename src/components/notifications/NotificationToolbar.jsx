// src/components/notifications/NotificationToolbar.jsx

import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    AlertTriangle,
    CheckCheck,
    Wifi,
    WifiOff,
} from "lucide-react";

import {
    NOTIFICATION_FILTERS,
} from "../../utils/notificationUtils";

// =========================================================
// FULL NUMBER FORMATTER
// =========================================================

const formatCount = (value) => {
    const number = Number(value);

    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
    })
        .format(
            Number.isFinite(number)
                ? Math.max(0, number)
                : 0
        )
        .replace(/,/g, " ");
};

// =========================================================
// NOTIFICATION TOOLBAR
//
// RESPONSIBILITIES:
//
// - All / Unread / Read filters
// - Filter counts
// - Real-time connection status
// - Mark all as read
// - WebSocket errors
// - Light / Dark Mode
// - Responsive UI
// - Reduced Motion
//
// Business logic remains inside useNotificationsPage.
// =========================================================

const NotificationToolbar = ({
    filter = "all",
    getFilterCount,
    handleFilterChange,

    wsConnected = false,
    wsError = null,

    unreadCount = 0,
    markAllAsReadAction,
}) => {
    const reduceMotion = useReducedMotion();

    const canFilter =
        typeof handleFilterChange === "function";

    const canMarkAll =
        Number(unreadCount) > 0 &&
        typeof markAllAsReadAction === "function";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <motion.section
            aria-label="Bildirishnomalarni boshqarish"
            initial={
                reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 18,
                    }
            }
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: reduceMotion ? 0 : 0.42,
                delay: reduceMotion ? 0 : 0.18,
            }}
            className="
                mb-7 min-w-0 rounded-3xl
                border border-slate-200

                bg-white/90 p-4
                shadow-[0_16px_55px_rgba(15,23,42,0.06)]
                backdrop-blur-xl

                dark:border-white/[0.07]
                dark:bg-[#0d121a]/85
                dark:shadow-[0_18px_50px_rgba(0,0,0,0.22)]
            "
        >
            <div
                className="
                    flex min-w-0 flex-col gap-4

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                {/* =====================================
                    NOTIFICATION FILTERS
                ====================================== */}

                <div
                    role="group"
                    aria-label="Bildirishnoma filtrlari"
                    className="
                        grid min-w-0 grid-cols-3
                        gap-1 rounded-2xl

                        border border-slate-200
                        bg-slate-100/80 p-1.5

                        dark:border-white/[0.07]
                        dark:bg-black/20
                    "
                >
                    {NOTIFICATION_FILTERS.map((item) => {
                        const Icon = item.Icon;

                        const active =
                            filter === item.key;

                        const count =
                            typeof getFilterCount === "function"
                                ? getFilterCount(item.key)
                                : 0;

                        return (
                            <button
                                key={item.key}
                                type="button"
                                aria-pressed={active}
                                aria-label={
                                    `${item.label}: ${formatCount(count)}`
                                }
                                disabled={!canFilter}
                                onClick={() => {
                                    if (
                                        canFilter &&
                                        !active
                                    ) {
                                        handleFilterChange(
                                            item.key
                                        );
                                    }
                                }}
                                className={`
                                    flex min-w-0 items-center
                                    justify-center gap-1.5
                                    rounded-xl px-2 py-2.5

                                    text-[11px] font-bold
                                    transition-colors

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500/60

                                    disabled:cursor-not-allowed
                                    disabled:opacity-60

                                    sm:px-3 sm:text-xs

                                    ${
                                        active
                                            ? `
                                                bg-indigo-600
                                                text-white
                                                shadow-md
                                                shadow-indigo-600/15
                                            `
                                            : `
                                                text-slate-600
                                                hover:bg-white
                                                hover:text-indigo-700

                                                dark:text-slate-400
                                                dark:hover:bg-white/[0.06]
                                                dark:hover:text-slate-100
                                            `
                                    }
                                `}
                            >
                                <Icon
                                    size={14}
                                    className="shrink-0"
                                    aria-hidden="true"
                                />

                                <span
                                    className="
                                        hidden min-w-0 truncate
                                        sm:inline
                                    "
                                >
                                    {item.label}
                                </span>

                                <span
                                    className="
                                        shrink-0 font-mono
                                        text-[10px] tabular-nums
                                        opacity-80
                                    "
                                >
                                    ({formatCount(count)})
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* =====================================
                    WEBSOCKET + BULK ACTIONS
                ====================================== */}

                <div
                    className="
                        flex min-w-0 flex-wrap
                        items-center gap-2
                    "
                >
                    {/* CONNECTION STATUS */}

                    <div
                        role="status"
                        className={`
                            inline-flex max-w-full
                            items-center gap-2

                            rounded-xl border
                            px-3 py-2.5

                            font-mono text-[10px]
                            font-bold uppercase
                            tracking-[0.08em]

                            ${
                                wsConnected
                                    ? `
                                        border-emerald-200
                                        bg-emerald-50
                                        text-emerald-700

                                        dark:border-emerald-400/20
                                        dark:bg-emerald-500/[0.06]
                                        dark:text-emerald-300
                                    `
                                    : `
                                        border-amber-200
                                        bg-amber-50
                                        text-amber-700

                                        dark:border-amber-400/20
                                        dark:bg-amber-500/[0.06]
                                        dark:text-amber-300
                                    `
                            }
                        `}
                    >
                        {wsConnected ? (
                            <Wifi
                                size={14}
                                className="shrink-0"
                                aria-hidden="true"
                            />
                        ) : (
                            <WifiOff
                                size={14}
                                className="shrink-0"
                                aria-hidden="true"
                            />
                        )}

                        <span>
                            {wsConnected
                                ? "Real-time faol"
                                : "Ulanish kutilmoqda"}
                        </span>
                    </div>

                    {/* MARK ALL AS READ */}

                    {Number(unreadCount) > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsReadAction}
                            disabled={!canMarkAll}
                            aria-label="
                                Barcha bildirishnomalarni o‘qilgan deb belgilash
                            "
                            className="
                                inline-flex min-h-10
                                items-center justify-center
                                gap-2

                                rounded-xl border
                                border-purple-200
                                bg-purple-50
                                px-3 py-2.5

                                text-[11px] font-bold
                                text-purple-700

                                transition-colors
                                hover:bg-purple-100

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-purple-500/50

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:border-purple-400/20
                                dark:bg-purple-500/[0.07]
                                dark:text-purple-300
                                dark:hover:bg-purple-500/[0.13]
                            "
                        >
                            <CheckCheck
                                size={15}
                                className="shrink-0"
                                aria-hidden="true"
                            />

                            Hammasi o‘qildi
                        </button>
                    )}
                </div>
            </div>

            {/* =========================================
                WEBSOCKET ERROR

                Existing cards remain visible.
            ========================================== */}

            {wsError && (
                <div
                    role="alert"
                    className="
                        mt-3 flex min-w-0 items-start
                        gap-2 rounded-xl

                        border border-red-200
                        bg-red-50 px-4 py-3

                        text-xs font-semibold
                        leading-5 text-red-700

                        dark:border-red-400/20
                        dark:bg-red-500/[0.06]
                        dark:text-red-300
                    "
                >
                    <AlertTriangle
                        size={15}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                    />

                    <span className="min-w-0 break-words">
                        {typeof wsError === "string"
                            ? wsError
                            : wsError?.message ||
                              "Real-time ulanishda xatolik yuz berdi."}
                    </span>
                </div>
            )}
        </motion.section>
    );
};

export default memo(NotificationToolbar);