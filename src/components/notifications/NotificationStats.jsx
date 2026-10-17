// src/components/notifications/NotificationStats.jsx

import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    Bell,
    BellRing,
    CheckCheck,
} from "lucide-react";

// =========================================================
// STATS CONFIGURATION
// =========================================================

const STATS = Object.freeze([
    {
        key: "total",
        label: "Jami",
        hint: "barcha xabarlar",

        Icon: Bell,

        border:
            "border-slate-200 dark:border-white/[0.07]",

        icon:
            "bg-slate-100 text-slate-600 " +
            "dark:bg-white/[0.05] dark:text-slate-300",

        value:
            "text-slate-900 dark:text-white",

        glow:
            "bg-slate-400/[0.07] " +
            "dark:bg-slate-300/[0.035]",
    },
    {
        key: "unread",
        label: "Yangi",
        hint: "o‘qilmagan xabarlar",

        Icon: BellRing,

        border:
            "border-indigo-200 dark:border-indigo-400/20",

        icon:
            "bg-indigo-100 text-indigo-700 " +
            "dark:bg-indigo-400/10 dark:text-indigo-300",

        value:
            "text-indigo-700 dark:text-indigo-200",

        glow:
            "bg-indigo-500/[0.08] " +
            "dark:bg-indigo-500/[0.09]",
    },
    {
        key: "read",
        label: "O‘qilgan",
        hint: "ko‘rib chiqilgan",

        Icon: CheckCheck,

        border:
            "border-emerald-200 dark:border-emerald-400/20",

        icon:
            "bg-emerald-100 text-emerald-700 " +
            "dark:bg-emerald-400/10 dark:text-emerald-300",

        value:
            "text-emerald-700 dark:text-emerald-200",

        glow:
            "bg-emerald-500/[0.07] " +
            "dark:bg-emerald-500/[0.08]",
    },
]);

// =========================================================
// FULL NUMBER FORMATTER
// =========================================================

const countFormatter = new Intl.NumberFormat(
    "en-US",
    {
        maximumFractionDigits: 0,
    }
);

const formatCount = (value) => {
    const parsed = Number(value);

    const safe = Number.isFinite(parsed)
        ? Math.max(0, Math.trunc(parsed))
        : 0;

    return countFormatter
        .format(safe)
        .replace(/,/g, " ");
};

// =========================================================
// REUSABLE STAT CARD
// =========================================================

const StatCard = memo(function StatCard({
    config,
    value,
}) {
    const {
        label,
        hint,
        Icon,
        border,
        icon,
        glow,
        value: valueClass,
    } = config;

    const displayedValue = formatCount(value);

    return (
        <div
            className={`
                group relative min-w-0 overflow-hidden
                rounded-3xl border

                bg-white/90 p-5

                shadow-[0_14px_45px_rgba(15,23,42,0.06)]

                backdrop-blur-xl
                transition-colors

                hover:bg-white

                dark:bg-[#0d121a]/85
                dark:shadow-[0_18px_50px_rgba(0,0,0,0.22)]
                dark:hover:bg-[#111824]/90

                ${border}
            `}
        >
            {/* =====================================
                AMBIENT GLOW
            ====================================== */}

            <div
                aria-hidden="true"
                className={`
                    pointer-events-none absolute
                    -right-9 -top-9

                    h-28 w-28 rounded-full
                    blur-2xl

                    ${glow}
                `}
            />

            {/* =====================================
                CARD HEADER
            ====================================== */}

            <div
                className="
                    relative flex items-center
                    justify-between gap-3
                "
            >
                <span
                    className="
                        font-mono text-[10px]
                        font-bold uppercase
                        tracking-[0.16em]

                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </span>

                <span
                    aria-hidden="true"
                    className={`
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-xl

                        ${icon}
                    `}
                >
                    <Icon size={17} />
                </span>
            </div>

            {/* =====================================
                VALUE
            ====================================== */}

            <p
                title={displayedValue}
                className={`
                    relative mt-2 break-all
                    font-mono text-3xl font-black
                    tracking-tight tabular-nums

                    sm:text-4xl

                    ${valueClass}
                `}
            >
                {displayedValue}
            </p>

            {/* =====================================
                DESCRIPTION
            ====================================== */}

            <p
                className="
                    relative mt-1 text-xs
                    font-medium

                    text-slate-500
                    dark:text-slate-400
                "
            >
                {hint}
            </p>
        </div>
    );
});

// =========================================================
// NOTIFICATION STATS
//
// Data sources:
// - totalCount
// - unreadCount
// - readCount
//
// The parent passes the values from
// useNotificationsPage.
//
// No additional Redux subscriptions or API requests.
// =========================================================

const NotificationStats = ({
    total = 0,
    unread = 0,
    read = 0,
}) => {
    const reduceMotion = useReducedMotion();

    const values = {
        total,
        unread,
        read,
    };

    return (
        <motion.section
            aria-label="Bildirishnomalar statistikasi"
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
                delay: reduceMotion ? 0 : 0.12,
            }}
            className="
                mb-7 grid min-w-0
                grid-cols-1 gap-4

                sm:grid-cols-3
            "
        >
            {STATS.map((config) => (
                <StatCard
                    key={config.key}
                    config={config}
                    value={values[config.key]}
                />
            ))}
        </motion.section>
    );
};

export default memo(NotificationStats);