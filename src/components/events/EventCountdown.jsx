
// src/components/events/EventCountdown.jsx

import React, {
    memo,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    CalendarClock,
    CheckCircle2,
    Clock3,
} from "lucide-react";

// =========================================================
// FSOCIETY — UNIVERSAL EVENT COUNTDOWN
// =========================================================
//
// Location:
// src/components/events/EventCountdown.jsx
//
// Used by:
// - SeasonalGiftCard
// - Future Event Detail pages
// - Holiday countdowns
//
// Props:
//
// targetTime:
//   Event opening datetime.
//
// serverTime:
//   Backend's current datetime (optional).
//
// receivedAtMs:
//   Date.now() at which backend status was
//   received. Used to estimate clock offset.
//
// onExpire:
//   Callback fired once when countdown ends.
//
// IMPORTANT:
//
// Countdown does not grant rewards.
//
// When it expires, a parent component may
// refresh backend eligibility using GET.
//
// Only Django determines whether a gift
// is actually claimable.
//
// =========================================================


// =========================================================
// DATE HELPERS
// =========================================================

const parseTimestamp = (value) => {
    if (
        value instanceof Date
    ) {
        const timestamp = value.getTime();

        return Number.isFinite(timestamp)
            ? timestamp
            : null;
    }

    if (
        typeof value === "number"
    ) {
        return Number.isFinite(value)
            ? value
            : null;
    }

    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
        return null;
    }

    const timestamp = Date.parse(value);

    return Number.isFinite(timestamp)
        ? timestamp
        : null;
};

const padNumber = (value) =>
    String(value).padStart(2, "0");


// =========================================================
// SERVER CLOCK OFFSET
// =========================================================
//
// Example:
//
// Browser clock:
//  20:00:00
//
// Server clock:
//  20:00:05
//
// Offset:
//  +5000 milliseconds
//
// The countdown uses an estimate of
// server time instead of trusting the
// browser clock completely.
//
// =========================================================

const getServerClockOffset = (
    serverTime,
    receivedAtMs
) => {
    const serverTimestamp =
        parseTimestamp(serverTime);

    const receivedTimestamp =
        Number(receivedAtMs);

    if (
        serverTimestamp === null ||
        !Number.isFinite(
            receivedTimestamp
        ) ||
        receivedTimestamp <= 0
    ) {
        return 0;
    }

    return (
        serverTimestamp -
        receivedTimestamp
    );
};


// =========================================================
// MONOTONIC CLOCK
// =========================================================
//
// A monotonic clock avoids jumps if the
// operating system's clock changes while
// the countdown is already running.
//
// It also handles inactive browser tabs
// better than decrementing by 1 second.
//
// =========================================================

const getMonotonicTime = () => {
    if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
    ) {
        return performance.now();
    }

    return Date.now();
};


// =========================================================
// COUNTDOWN CALCULATION
// =========================================================

const getCountdown = (
    targetTimestamp,
    currentTimestamp
) => {
    if (targetTimestamp === null) {
        return null;
    }

    const remainingMs =
        Math.max(
            0,
            targetTimestamp -
                currentTimestamp
        );

    // Math.ceil prevents showing 00 seconds
    // before the target time actually arrives.

    const totalSeconds = Math.ceil(
        remainingMs / 1000
    );

    const days = Math.floor(
        totalSeconds / 86400
    );

    const hours = Math.floor(
        (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds =
        totalSeconds % 60;

    return {
        remainingMs,
        days,
        hours,
        minutes,
        seconds,
        expired:
            remainingMs === 0,
    };
};


// =========================================================
// COUNTDOWN UNIT
// =========================================================

const CountdownUnit = memo(
    function CountdownUnit({
        value,
        label,
    }) {
        return (
            <div
                className="
                    flex min-w-0
                    flex-col items-center
                    justify-center
                    rounded-xl
                    border
                    border-violet-200/70
                    bg-white/80
                    px-1.5 py-3
                    dark:border-white/10
                    dark:bg-white/[0.045]
                "
            >
                <span
                    className="
                        text-xl font-black
                        tabular-nums
                        tracking-tight
                        text-slate-900
                        sm:text-2xl
                        dark:text-white
                    "
                >
                    {padNumber(value)}
                </span>

                <span
                    className="
                        mt-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </span>
            </div>
        );
    }
);


// =========================================================
// MAIN COMPONENT
// =========================================================

function EventCountdown({
    targetTime,
    serverTime = null,
    receivedAtMs = null,
    onExpire,
    className = "",
}) {
    // =====================================================
    // TARGET TIME
    // =====================================================

    const targetTimestamp = useMemo(
        () => parseTimestamp(targetTime),
        [targetTime]
    );

    // =====================================================
    // CLOCK OFFSET
    // =====================================================

    const serverOffset = useMemo(
        () =>
            getServerClockOffset(
                serverTime,
                receivedAtMs
            ),
        [
            serverTime,
            receivedAtMs,
        ]
    );

    // =====================================================
    // CURRENT TIME
    // =====================================================

    const [currentTime, setCurrentTime] =
        useState(
            () =>
                Date.now() +
                serverOffset
        );

    // =====================================================
    // CALLBACK REF
    // =====================================================
    //
    // Avoid restarting the timer whenever
    // the parent recreates onExpire.
    //
    // =====================================================

    const onExpireRef =
        useRef(onExpire);

    useEffect(() => {
        onExpireRef.current =
            onExpire;
    }, [onExpire]);

    // =====================================================
    // EXPIRATION GUARD
    // =====================================================
    //
    // Each target timestamp triggers at most
    // one expiration callback per mount.
    //
    // This prevents repeated status API GETs
    // when the timer reaches zero.
    //
    // =====================================================

    const expiredTargetRef = useRef(null);

    // =====================================================
    // LIVE CLOCK EFFECT
    // =====================================================

    useEffect(() => {
        // Anchor the clock using Date.now()
        // and a monotonic time source.

        const anchorWallTime =
            Date.now() +
            serverOffset;

        const anchorMonotonicTime =
            getMonotonicTime();

        const calculateNow = () =>
            anchorWallTime +
            (
                getMonotonicTime() -
                anchorMonotonicTime
            );

        const updateClock = () => {
            setCurrentTime(
                calculateNow()
            );
        };

        // Update immediately on prop changes.

        updateClock();

        // No timer needed when the target
        // date is invalid or already passed.

        if (
            targetTimestamp === null ||
            targetTimestamp <= anchorWallTime
        ) {
            return undefined;
        }

        const intervalId =
            window.setInterval(
                updateClock,
                1000
            );

        // Recalculate when user returns
        // to a previously inactive tab.

        const handleVisibilityChange = () => {
            if (
                document.visibilityState ===
                "visible"
            ) {
                updateClock();
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            window.clearInterval(
                intervalId
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [
        targetTimestamp,
        serverOffset,
    ]);

    // =====================================================
    // COUNTDOWN VALUES
    // =====================================================

    const countdown = useMemo(
        () =>
            getCountdown(
                targetTimestamp,
                currentTime
            ),
        [
            targetTimestamp,
            currentTime,
        ]
    );

    const isExpired =
        countdown?.expired === true;

    // =====================================================
    // ON EXPIRE
    // =====================================================
    //
    // The callback can perform a GET status
    // request through the parent component.
    //
    // It must not submit a claim POST.
    //
    // =====================================================

    useEffect(() => {
        if (
            targetTimestamp === null ||
            !isExpired
        ) {
            return;
        }

        const targetKey =
            String(targetTimestamp);

        if (
            expiredTargetRef.current ===
            targetKey
        ) {
            return;
        }

        expiredTargetRef.current =
            targetKey;

        if (
            typeof onExpireRef.current ===
            "function"
        ) {
            onExpireRef.current();
        }
    }, [
        targetTimestamp,
        isExpired,
    ]);

    // =====================================================
    // INVALID DATE
    // =====================================================

    if (!countdown) {
        return (
            <div
                className={`
                    flex items-start gap-2
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    p-3 text-sm
                    text-slate-500
                    dark:border-white/10
                    dark:bg-white/[0.035]
                    dark:text-slate-400
                    ${className}
                `}
            >
                <CalendarClock
                    size={17}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                />

                <span>
                    Bayram sovg‘asining ochilish
                    sanasi hali belgilanmagan.
                </span>
            </div>
        );
    }

    // =====================================================
    // COUNTDOWN COMPLETED
    // =====================================================

    if (isExpired) {
        return (
            <div
                role="status"
                className={`
                    flex items-start gap-2
                    rounded-xl
                    border border-emerald-500/20
                    bg-emerald-500/10
                    p-3
                    text-sm leading-6
                    text-emerald-800
                    dark:text-emerald-200
                    ${className}
                `}
            >
                <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                />

                <div>
                    <p className="font-bold">
                        Belgilangan vaqt yetdi!
                    </p>

                    <p className="mt-0.5 text-xs">
                        Sovg‘a ochish huquqi
                        server orqali tekshiriladi.
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // ACTIVE COUNTDOWN
    // =====================================================

    const units = [
        {
            key: "days",
            label: "Kun",
            value: countdown.days,
        },
        {
            key: "hours",
            label: "Soat",
            value: countdown.hours,
        },
        {
            key: "minutes",
            label: "Daqiqa",
            value: countdown.minutes,
        },
        {
            key: "seconds",
            label: "Soniya",
            value: countdown.seconds,
        },
    ];

    return (
        <div
            role="timer"
            aria-label="Bayram sovg‘asi ochilishigacha qolgan vaqt"
            aria-live="off"
            className={className}
        >
            <div
                className="
                    mb-3
                    flex items-center gap-2
                    text-xs font-bold
                    text-violet-700
                    dark:text-violet-300
                "
            >
                <Clock3
                    size={15}
                    aria-hidden="true"
                />

                Sovg‘a ochilishigacha
            </div>

            <div
                className="
                    grid grid-cols-4
                    gap-2 sm:gap-3
                "
            >
                {units.map(
                    (unit) => (
                        <CountdownUnit
                            key={unit.key}
                            value={unit.value}
                            label={unit.label}
                        />
                    )
                )}
            </div>
        </div>
    );
}


// =========================================================
// EXPORT
// =========================================================

export default memo(EventCountdown);
