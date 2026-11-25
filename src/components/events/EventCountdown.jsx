
 // src/components/events/EventCountdown.jsx

import React, { memo, useMemo } from "react";

import {
    CalendarClock,
    Clock3,
    CheckCircle2,
} from "lucide-react";

import useEventCountdown from "../../hooks/events/useEventCountdown";

// =========================================================
// FSOCIETY — UNIVERSAL EVENT COUNTDOWN
// =========================================================
//
// Location:
// src/components/events/EventCountdown.jsx
//
// Features:
// - Universal holiday countdown
// - Server clock synchronization
// - Dark / Light mode
// - Mobile responsive
// - Accessible labels
// - Reduced-motion friendly
// - Compact / Card variants
// - Expiration callback
//
// Used by:
// - New Year
// - Navro'z
// - Ramadan
// - Daily Gift
// - Seasonal Gift
//
// IMPORTANT:
//
// Reaching zero never automatically claims
// a reward.
//
// The optional onExpire callback should only
// refresh the event's backend status.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const TIME_UNITS = Object.freeze([
    {
        key: "days",
        label: "Kun",
    },
    {
        key: "hours",
        label: "Soat",
    },
    {
        key: "minutes",
        label: "Daqiqa",
    },
    {
        key: "seconds",
        label: "Soniya",
    },
]);

// =========================================================
// HELPERS
// =========================================================

const formatNumber = (value) => {
    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return "00";
    }

    return String(
        Math.floor(number)
    ).padStart(2, "0");
};

const getAccessibleTime = (parts) => {
    const labels = {
        days: "kun",
        hours: "soat",
        minutes: "daqiqa",
        seconds: "soniya",
    };

    return parts
        .map(({ key, value }) =>
            `${value} ${labels[key]}`
        )
        .join(", ");
};

// =========================================================
// TIME CELL
// =========================================================

const TimeCell = memo(function TimeCell({
    value,
    label,
    compact = false,
}) {
    return (
        <div
            className={[
                "flex",
                "min-w-0",
                "flex-col",
                "items-center",
                "justify-center",

                "rounded-xl",
                "border",

                "border-slate-200/80",
                "bg-white/70",

                "dark:border-white/10",
                "dark:bg-slate-900/60",

                "shadow-sm",
                "backdrop-blur-sm",

                compact
                    ? "gap-0.5 px-1.5 py-2"
                    : "gap-1 px-2 py-3 sm:py-4",
            ].join(" ")}
        >
            <span
                className={[
                    "font-bold",
                    "tracking-tight",
                    "tabular-nums",
                    "leading-none",

                    "text-slate-900",
                    "dark:text-white",

                    compact
                        ? "text-lg sm:text-xl"
                        : "text-2xl sm:text-3xl",
                ].join(" ")}
            >
                {formatNumber(value)}
            </span>

            <span
                className={[
                    "font-medium",
                    "text-slate-500",
                    "dark:text-slate-400",

                    compact
                        ? "text-[10px]"
                        : "text-[11px] sm:text-xs",
                ].join(" ")}
            >
                {label}
            </span>
        </div>
    );
});

// =========================================================
// EVENT COUNTDOWN
// =========================================================

const EventCountdown = memo(
    function EventCountdown({
        targetTime = null,

        serverTime = null,
        receivedAtMs = null,

        enabled = true,
        intervalMs = 1000,

        onExpire,

        title = "Tadbir boshlanishigacha",

        expiredText = "Belgilangan vaqt yetib keldi",

        invalidText = "Tadbir vaqti belgilanmagan",

        variant = "card",

        showIcon = true,
        showSeconds = true,

        className = "",
    }) {
        // =================================================
        // COUNTDOWN HOOK
        // =================================================

        const countdown = useEventCountdown({
            targetTime,
            serverTime,
            receivedAtMs,
            enabled,
            intervalMs,
            onExpire,
        });

        const {
            isValid,
            isExpired,

            days,
            hours,
            minutes,
            seconds,
        } = countdown;

        // =================================================
        // PRESENTATION
        // =================================================

        const compact =
            variant === "compact";

        const timeParts = useMemo(() => {
            const values = {
                days,
                hours,
                minutes,
                seconds,
            };

            return TIME_UNITS
                .filter(
                    ({ key }) =>
                        showSeconds ||
                        key !== "seconds"
                )
                .map(({ key, label }) => ({
                    key,
                    label,
                    value: values[key],
                }));
        }, [
            days,
            hours,
            minutes,
            seconds,
            showSeconds,
        ]);

        const accessibleTime = useMemo(
            () => getAccessibleTime(timeParts),
            [timeParts]
        );

        // =================================================
        // WRAPPER STYLES
        // =================================================

        const wrapperClasses = [
            "w-full",
            "min-w-0",

            compact
                ? "max-w-sm"
                : "max-w-lg",

            !compact
                ? [
                    "rounded-2xl",
                    "border",
                    "border-slate-200/80",
                    "bg-white/75",
                    "p-3",
                    "shadow-lg",
                    "shadow-slate-900/5",

                    "dark:border-white/10",
                    "dark:bg-slate-950/65",
                    "dark:shadow-black/20",

                    "backdrop-blur-xl",

                    "sm:p-5",
                ].join(" ")
                : "",

            className,
        ]
            .filter(Boolean)
            .join(" ");

        // =================================================
        // INVALID DATE
        // =================================================

        if (!isValid) {
            return (
                <div
                    className={wrapperClasses}
                    role="status"
                >
                    <div
                        className="
                            flex items-center
                            justify-center gap-2
                            py-3 text-center
                            text-sm font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        <CalendarClock
                            size={18}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span>{invalidText}</span>
                    </div>
                </div>
            );
        }

        // =================================================
        // EXPIRED
        // =================================================

        if (isExpired) {
            return (
                <div
                    className={wrapperClasses}
                    role="status"
                >
                    <div
                        className="
                            flex items-center
                            justify-center gap-2
                            py-3 text-center
                            text-sm font-semibold
                            text-emerald-700
                            dark:text-emerald-300
                        "
                    >
                        <CheckCircle2
                            size={19}
                            strokeWidth={2}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        <span>{expiredText}</span>
                    </div>
                </div>
            );
        }

        // =================================================
        // ACTIVE COUNTDOWN
        // =================================================

        return (
            <section
                className={wrapperClasses}
                aria-label={title}
            >
                {/* =====================================
                    HEADER
                ===================================== */}

                {title && (
                    <div
                        className={[
                            "flex items-center",
                            "justify-center",
                            "gap-2",
                            "text-center",

                            compact
                                ? "mb-2"
                                : "mb-4",
                        ].join(" ")}
                    >
                        {showIcon && (
                            <Clock3
                                size={compact ? 15 : 18}
                                strokeWidth={1.8}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-sky-600
                                    dark:text-sky-400
                                "
                            />
                        )}

                        <h3
                            className={[
                                "font-semibold",
                                "text-slate-700",
                                "dark:text-slate-200",

                                compact
                                    ? "text-xs"
                                    : "text-sm sm:text-base",
                            ].join(" ")}
                        >
                            {title}
                        </h3>
                    </div>
                )}

                {/* =====================================
                    COUNTDOWN GRID
                ===================================== */}

                <div
                    role="timer"
                    aria-live="off"
                    aria-label={accessibleTime}
                >
                    <div
                        aria-hidden="true"
                        className={[
                            "grid",
                            "min-w-0",
                            "gap-1.5",
                            "sm:gap-3",

                            showSeconds
                                ? "grid-cols-4"
                                : "grid-cols-3",
                        ].join(" ")}
                    >
                        {timeParts.map((part) => (
                            <TimeCell
                                key={part.key}
                                value={part.value}
                                label={part.label}
                                compact={compact}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }
);

// =========================================================
// EXPORT
// =========================================================

export default EventCountdown;
