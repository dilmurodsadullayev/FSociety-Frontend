
import React, { memo } from "react";

import {
    ArrowRight,
    Eye,
    MessageCircle,
    Star,
} from "lucide-react";

import {
    getProblemCardStatusConfig,
    PROBLEM_CARD_STYLES,
} from "./problemCardConfig";

import {
    cleanText,
    safeNumber,
} from "./problemCardHelpers";

// =========================================================
// FSOCIETY — PROBLEM CARD FOOTER
//
// - Views
// - Solutions
// - Stars
// - Status-aware CTA
// - Responsive wrapping
// - Light / Dark Mode
//
// Parent card handles navigation.
// =========================================================

// =========================================================
// STATISTICS CONFIG
// =========================================================

const STAT_CONFIG = [
    {
        key: "views",
        label: "Ko‘rishlar",
        Icon: Eye,
        color: "text-cyan-600 dark:text-cyan-400",
    },
    {
        key: "responseCount",
        label: "Yechimlar",
        Icon: MessageCircle,
        color: "text-indigo-600 dark:text-indigo-400",
    },
    {
        key: "stars",
        label: "Star",
        Icon: Star,
        color: "text-amber-600 dark:text-amber-400",
    },
];

// =========================================================
// STAT BADGE
// =========================================================

const StatBadge = memo(({
    Icon,
    label,
    value,
    color,
}) => {
    const amount = Math.floor(
        safeNumber(value)
    );

    const formatted = amount.toLocaleString(
        "uz-UZ"
    );

    return (
        <span
            title={`${label}: ${formatted}`}

            className={`
                ${PROBLEM_CARD_STYLES.metaBadge}

                min-h-8
                shrink-0

                px-2.5
                py-1.5

                tabular-nums
            `}
        >
            <Icon
                size={14}
                strokeWidth={1.9}
                aria-hidden="true"

                className={`
                    shrink-0
                    ${color}
                `}
            />

            <span className="sr-only">
                {label}:{" "}
            </span>

            <span className="font-bold">
                {formatted}
            </span>
        </span>
    );
});

// =========================================================
// CARD FOOTER
// =========================================================

const ProblemCardFooter = ({
    stats = null,

    ctaText = "",
    hasValidId = false,

    status = "pending",
    isSolved = false,

    statusConfig = null,

    // Legacy props
    views = 0,
    star = 0,
    responseCount = 0,
}) => {
    // =====================================================
    // NORMALIZED VALUES
    // =====================================================

    const values = {
        views: stats?.views ?? views,

        responseCount:
            stats?.responseCount ??
            responseCount,

        stars: stats?.stars ?? star,
    };

    const config =
        statusConfig?.action
            ? statusConfig
            : getProblemCardStatusConfig(
                status,
                isSolved
            );

    // =====================================================
    // ACTION TEXT
    // =====================================================

    const defaultText =
        config.key === "rejected"
            ? "Tafsilotni ko‘rish"
            : config.key === "solved"
                ? "Yechimni ko‘rish"
                : "Muammoni ko‘rish";

    const enabled = Boolean(hasValidId);

    const actionText = enabled
        ? cleanText(ctaText, defaultText)
        : "ID mavjud emas";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <footer
            className="
                mt-auto

                w-full
                min-w-0

                border-t
                border-slate-200

                pt-4

                dark:border-white/[0.09]
            "
        >
            <div
                className="
                    flex
                    w-full
                    min-w-0

                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                "
            >
                {/* ==================================
                    STATISTICS
                ================================== */}

                <div
                    role="group"
                    aria-label="Muammo statistikasi"

                    className="
                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        gap-1.5

                        sm:gap-2
                    "
                >
                    {STAT_CONFIG.map((item) => (
                        <StatBadge
                            key={item.key}

                            Icon={item.Icon}
                            label={item.label}

                            value={
                                values[item.key]
                            }

                            color={item.color}
                        />
                    ))}
                </div>

                {/* ==================================
                    CTA

                    Visual only.
                    Parent Link handles navigation.
                ================================== */}

                <span
                    className={`
                        inline-flex

                        min-h-10
                        min-w-0

                        w-full

                        items-center
                        justify-center
                        gap-2

                        rounded-xl
                        border

                        px-4
                        py-2

                        font-display
                        text-[11px]
                        font-black
                        leading-5

                        transition-colors
                        duration-200

                        sm:w-auto
                        sm:rounded-2xl

                        ${
                            enabled
                                ? config.action
                                : `
                                    border-slate-200
                                    bg-slate-100
                                    text-slate-400

                                    dark:border-white/[0.08]
                                    dark:bg-white/[0.035]
                                    dark:text-gray-500
                                `
                        }
                    `}
                >
                    <span
                        className="
                            min-w-0
                            text-center
                        "
                    >
                        {actionText}
                    </span>

                    {enabled && (
                        <ArrowRight
                            size={15}
                            strokeWidth={2}
                            aria-hidden="true"

                            className="
                                shrink-0

                                transition-transform
                                duration-200

                                group-hover:translate-x-1

                                motion-reduce:transform-none
                            "
                        />
                    )}
                </span>
            </div>
        </footer>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProblemCardFooter);
