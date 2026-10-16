
import React, {
    useEffect,
    useState,
} from "react";

import {
    Clock3,
    Coins,
    Zap,
} from "lucide-react";

import {
    getDeadlineData,
    safeNumber,
    toBoolean,
} from "./problemCardHelpers";

// =========================================================
// FSOCIETY — PROBLEM CARD PRIORITY
//
// Responsibilities:
// - Urgent status
// - FCoin bounty
// - Deadline countdown
//
// Features:
// - Light / Dark Mode
// - Responsive badges
// - Accessible labels
// - Safe backend values
// - Deadline auto-refresh
// - Timer cleanup
//
// No API requests.
// No Redux.
// =========================================================

// =========================================================
// URGENT BADGE
// =========================================================

const UrgentBadge = React.memo(() => {
    return (
        <span
            title="Tezkor muammo"

            className="
                inline-flex
                min-h-8

                items-center
                justify-center
                gap-1.5

                rounded-xl
                border
                border-orange-300/70

                bg-orange-50

                px-3
                py-1.5

                font-display
                text-[10px]
                font-black

                text-orange-800

                dark:border-orange-400/25
                dark:bg-orange-400/[0.09]
                dark:text-orange-300
            "
        >
            <Zap
                size={13}
                strokeWidth={2}
                aria-hidden="true"

                className="
                    shrink-0
                    fill-orange-500/20
                "
            />

            Tezkor
        </span>
    );
});

// =========================================================
// FCOIN BOUNTY BADGE
// =========================================================

const BountyBadge = React.memo(({
    coins = 0,
}) => {
    const amount = safeNumber(coins);

    if (amount <= 0) {
        return null;
    }

    return (
        <span
            title={`Mukofot: ${amount} FCoin`}

            className="
                inline-flex
                min-h-8

                items-center
                justify-center
                gap-1.5

                rounded-xl
                border
                border-amber-300/70

                bg-amber-50

                px-3
                py-1.5

                font-display
                text-[10px]
                font-black

                text-amber-800

                dark:border-amber-400/25
                dark:bg-amber-400/[0.09]
                dark:text-amber-300
            "
        >
            <Coins
                size={14}
                strokeWidth={1.9}
                aria-hidden="true"

                className="shrink-0"
            />

            <span className="tabular-nums">
                {amount.toLocaleString("uz-UZ")}
            </span>

            <span>FCoin</span>
        </span>
    );
});

// =========================================================
// DEADLINE BADGE
// =========================================================

const DeadlineBadge = React.memo(({
    deadlineData,
}) => {
    if (!deadlineData) {
        return null;
    }

    const expired =
        Boolean(deadlineData.expired);

    const label =
        deadlineData.text ||
        "Muddat noma'lum";

    return (
        <span
            title={`Deadline: ${label}`}

            className={`
                inline-flex
                min-h-8
                max-w-full

                items-center
                justify-center
                gap-1.5

                rounded-xl
                border

                px-3
                py-1.5

                font-display
                text-[10px]
                font-black

                ${
                    expired
                        ? `
                            border-rose-300/70
                            bg-rose-50
                            text-rose-800

                            dark:border-rose-400/25
                            dark:bg-rose-400/[0.09]
                            dark:text-rose-300
                        `
                        : `
                            border-indigo-300/70
                            bg-indigo-50
                            text-indigo-800

                            dark:border-indigo-400/25
                            dark:bg-indigo-400/[0.09]
                            dark:text-indigo-300
                        `
                }
            `}
        >
            <Clock3
                size={13}
                strokeWidth={1.9}
                aria-hidden="true"

                className="shrink-0"
            />

            <span className="break-words">
                {label}
            </span>
        </span>
    );
});

// =========================================================
// MAIN PRIORITY COMPONENT
// =========================================================

const ProblemCardPriority = ({
    // Normalized priority from helper
    priority = null,

    // Optional legacy props
    isUrgent = false,
    deadline = null,
    offeredCoins = 0,
}) => {
    // =====================================================
    // NORMALIZED VALUES
    // =====================================================

    const urgent = toBoolean(
        priority?.urgent ??
        isUrgent
    );

    const coins = safeNumber(
        priority?.offeredCoins ??
        offeredCoins
    );

    const rawDeadline =
        priority?.deadline ??
        deadline;

    // =====================================================
    // CLOCK
    //
    // Only update periodically if a valid deadline
    // exists.
    // =====================================================

    const [
        currentTime,
        setCurrentTime,
    ] = useState(() => Date.now());

    // =====================================================
    // DEADLINE VALIDATION
    // =====================================================

    const parsedDeadline = rawDeadline
        ? new Date(rawDeadline)
        : null;

    const hasValidDeadline =
        Boolean(parsedDeadline) &&
        !Number.isNaN(
            parsedDeadline.getTime()
        );

    const deadlineTimestamp =
        hasValidDeadline
            ? parsedDeadline.getTime()
            : null;

    // =====================================================
    // REFRESH CLOCK
    //
    // The deadline label is recalculated every
    // 60 seconds while this component is mounted.
    // =====================================================

    useEffect(() => {
        if (deadlineTimestamp == null) {
            return undefined;
        }

        // Update immediately if deadline changed.
        setCurrentTime(Date.now());

        const intervalId = window.setInterval(
            () => {
                setCurrentTime(Date.now());
            },
            60 * 1000
        );

        return () => {
            window.clearInterval(intervalId);
        };
    }, [deadlineTimestamp]);

    // =====================================================
    // DEADLINE DATA
    // =====================================================

    const deadlineData =
        deadlineTimestamp != null
            ? getDeadlineData(
                deadlineTimestamp,
                currentTime
            )
            : (
                priority?.deadlineData ??
                null
            );

    // =====================================================
    // VISIBILITY
    // =====================================================

    const hasContent =
        urgent ||
        coins > 0 ||
        Boolean(deadlineData);

    // =====================================================
    // EMPTY
    // =====================================================

    if (!hasContent) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-label="Muammo ustuvorligi va mukofoti"

            className="
                mb-5

                flex
                w-full
                min-w-0

                flex-wrap
                items-center
                gap-2
            "
        >
            {/* ======================================
                URGENT
            ====================================== */}

            {urgent && (
                <UrgentBadge />
            )}

            {/* ======================================
                FCOIN
            ====================================== */}

            {coins > 0 && (
                <BountyBadge coins={coins} />
            )}

            {/* ======================================
                DEADLINE
            ====================================== */}

            {deadlineData && (
                <DeadlineBadge
                    deadlineData={deadlineData}
                />
            )}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemCardPriority);
