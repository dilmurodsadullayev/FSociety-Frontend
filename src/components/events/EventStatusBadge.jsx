
 // src/components/events/EventStatusBadge.jsx

import React, { memo } from "react";

import {
    CalendarClock,
    Radio,
    CheckCircle2,
    Ban,
    CircleHelp,
} from "lucide-react";

// =========================================================
// FSOCIETY — EVENT STATUS BADGE
// =========================================================
//
// Responsibilities:
// - Display backend event status
// - Support dark and light themes
// - Responsive sizing
// - Accessible status label
// - Optional icon and animation
//
// Status is provided by the backend.
//
// This component does not calculate event
// status from the browser clock.
//
// =========================================================


// =========================================================
// STATUS CONFIGURATION
// =========================================================

const STATUS_CONFIG = Object.freeze({
    scheduled: {
        label: "Tez kunda",
        Icon: CalendarClock,

        classes: [
            "border-sky-200",
            "bg-sky-50",
            "text-sky-700",

            "dark:border-sky-500/25",
            "dark:bg-sky-500/10",
            "dark:text-sky-300",
        ].join(" "),

        dotClasses:
            "bg-sky-500 dark:bg-sky-400",
    },

    active: {
        label: "Faol",
        Icon: Radio,

        classes: [
            "border-emerald-200",
            "bg-emerald-50",
            "text-emerald-700",

            "dark:border-emerald-500/25",
            "dark:bg-emerald-500/10",
            "dark:text-emerald-300",
        ].join(" "),

        dotClasses:
            "bg-emerald-500 dark:bg-emerald-400",
    },

    finished: {
        label: "Yakunlangan",
        Icon: CheckCircle2,

        classes: [
            "border-slate-200",
            "bg-slate-100",
            "text-slate-600",

            "dark:border-slate-700",
            "dark:bg-slate-800/60",
            "dark:text-slate-300",
        ].join(" "),

        dotClasses:
            "bg-slate-400 dark:bg-slate-500",
    },

    disabled: {
        label: "Faol emas",
        Icon: Ban,

        classes: [
            "border-rose-200",
            "bg-rose-50",
            "text-rose-700",

            "dark:border-rose-500/25",
            "dark:bg-rose-500/10",
            "dark:text-rose-300",
        ].join(" "),

        dotClasses:
            "bg-rose-500 dark:bg-rose-400",
    },

    unknown: {
        label: "Noma'lum holat",
        Icon: CircleHelp,

        classes: [
            "border-slate-200",
            "bg-white/80",
            "text-slate-600",

            "dark:border-slate-700",
            "dark:bg-slate-900/70",
            "dark:text-slate-400",
        ].join(" "),

        dotClasses:
            "bg-slate-400",
    },
});

// =========================================================
// STATUS ALIASES
// =========================================================
//
// Some APIs use synonyms for lifecycle states.
//
// Unknown statuses deliberately remain unknown
// rather than being treated as active.
//
// =========================================================

const STATUS_ALIASES = Object.freeze({
    scheduled: "scheduled",
    upcoming: "scheduled",

    active: "active",
    ongoing: "active",
    running: "active",

    finished: "finished",
    ended: "finished",
    completed: "finished",

    disabled: "disabled",
    inactive: "disabled",
});

// =========================================================
// STATUS HELPERS
// =========================================================

export const normalizeEventStatus = (value) => {
    if (typeof value !== "string") {
        return "unknown";
    }

    const status = value
        .trim()
        .toLowerCase();

    return STATUS_ALIASES[status] ?? "unknown";
};

export const getEventStatusMeta = (status) => {
    const normalized =
        normalizeEventStatus(status);

    return {
        status: normalized,
        ...STATUS_CONFIG[normalized],
    };
};

// =========================================================
// SIZE CONFIGURATION
// =========================================================

const SIZE_CLASSES = {
    sm: [
        "gap-1.5",
        "px-2.5",
        "py-1",
        "text-[11px]",
    ].join(" "),

    md: [
        "gap-2",
        "px-3",
        "py-1.5",
        "text-xs",
    ].join(" "),
};

// =========================================================
// COMPONENT
// =========================================================

const EventStatusBadge = memo(
    function EventStatusBadge({
        status = "unknown",
        size = "md",
        showIcon = true,
        showDot = false,
        animate = true,
        className = "",
    }) {
        const meta = getEventStatusMeta(status);

        const {
            status: normalizedStatus,
            label,
            Icon,
            classes,
            dotClasses,
        } = meta;

        const sizeClasses =
            SIZE_CLASSES[size] ??
            SIZE_CLASSES.md;

        const isActive =
            normalizedStatus === "active";

        return (
            <span
                className={[
                    "inline-flex",
                    "max-w-full",
                    "items-center",
                    "justify-center",
                    "whitespace-nowrap",
                    "rounded-full",
                    "border",
                    "font-semibold",
                    "leading-none",
                    "shadow-sm",
                    "transition-colors",
                    "duration-200",
                    "motion-reduce:transition-none",

                    sizeClasses,
                    classes,
                    className,
                ]
                    .filter(Boolean)
                    .join(" ")}
                aria-label={`Tadbir holati: ${label}`}
                data-event-status={normalizedStatus}
            >
                {showDot && (
                    <span
                        aria-hidden="true"
                        className={[
                            "relative",
                            "inline-flex",
                            "h-1.5",
                            "w-1.5",
                            "shrink-0",
                            "rounded-full",

                            dotClasses,

                            isActive && animate
                                ? "motion-safe:animate-pulse"
                                : "",
                        ].join(" ")}
                    />
                )}

                {showIcon && (
                    <Icon
                        size={size === "sm" ? 12 : 14}
                        strokeWidth={2}
                        className="shrink-0"
                        aria-hidden="true"
                    />
                )}

                <span>{label}</span>
            </span>
        );
    }
);

// =========================================================
// EXPORT
// =========================================================

export default EventStatusBadge;
