
import React, { memo } from "react";

import {
    AlertCircle,
    CheckCircle2,
    FolderKanban,
    Star,
} from "lucide-react";

import FCoinIcon from "../../../assests/coin/fcoin.png";

// =========================================================
// STAT CARD COLORS
// =========================================================

const STAT_TONES = Object.freeze({
    yellow: `
        border-amber-200
        bg-amber-50
        text-amber-700

        dark:border-amber-400/20
        dark:bg-amber-500/10
        dark:text-amber-300
    `,

    red: `
        border-red-200
        bg-red-50
        text-red-700

        dark:border-red-400/20
        dark:bg-red-500/10
        dark:text-red-300
    `,

    blue: `
        border-sky-200
        bg-sky-50
        text-sky-700

        dark:border-sky-400/20
        dark:bg-sky-500/10
        dark:text-sky-300
    `,

    purple: `
        border-purple-200
        bg-purple-50
        text-purple-700

        dark:border-purple-400/20
        dark:bg-purple-500/10
        dark:text-purple-300
    `,
});

// =========================================================
// FULL NUMBER FORMATTER
//
// Examples:
//
// 1000                 -> 1 000
// 1250000              -> 1 250 000
// 1250.75              -> 1 250.75
// "12345678901234567890" -> 12 345 678 901 234 567 890
//
// BigInt is not used.
//
// Decimal/integer strings are formatted without
// converting them to Number, preserving precision.
// =========================================================

const formatStatValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "0";
    }

    const text = String(value).trim();

    if (!text) {
        return "0";
    }

    // =====================================================
    // NORMAL INTEGER OR DECIMAL
    //
    // Supported:
    //
    // "1000"
    // "-1000"
    // "+1000"
    // "1250.75"
    // "0.123456789"
    //
    // No Number() or BigInt() conversion.
    // =====================================================

    const isNormalNumber = /^[+-]?\d+(?:\.\d+)?$/.test(
        text
    );

    if (isNormalNumber) {
        const isNegative = text.startsWith("-");

        const unsigned = text.replace(/^[+-]/, "");

        const [integerPart, decimalPart] =
            unsigned.split(".");

        // Preserve arbitrarily large integer values.
        const formattedInteger = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            " "
        );

        const formattedValue =
            decimalPart !== undefined
                ? `${formattedInteger}.${decimalPart}`
                : formattedInteger;

        return isNegative
            ? `-${formattedValue}`
            : formattedValue;
    }

    // =====================================================
    // EXPONENTIAL AND OTHER NUMERIC FORMATS
    //
    // Example: 1e+6
    // =====================================================

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return text;
    }

    // Avoid silently displaying an unsafe integer
    // as though its original precision were known.
    if (
        Number.isInteger(number) &&
        !Number.isSafeInteger(number)
    ) {
        return text;
    }

    return new Intl.NumberFormat("en-US", {
        useGrouping: true,
        maximumFractionDigits: 12,
    })
        .format(number)
        .replace(/,/g, " ");
};

// =========================================================
// REUSABLE STAT CARD
//
// Props:
//
// - Icon: Lucide icon component
// - image: optional image path
// - label: statistic label
// - value: number or string
// - tone: color variation
//
// Features:
//
// - Light / Dark Mode
// - Responsive design
// - Full number display
// - Accessible labels
// - No horizontal overflow
// =========================================================

const StatCard = memo(function StatCard({
    Icon,
    image,
    label,
    value,
    tone = "yellow",
}) {
    const displayed = formatStatValue(value);

    const toneClass =
        STAT_TONES[tone] || STAT_TONES.yellow;

    return (
        <div
            className="
                group relative min-w-0
                overflow-hidden

                border-b border-r
                border-slate-200

                bg-slate-50/65
                p-3 text-center

                transition-colors
                duration-200

                hover:bg-slate-100/80

                dark:border-white/[0.07]
                dark:bg-white/[0.015]
                dark:hover:bg-white/[0.04]

                sm:p-4
            "
        >
            {/* =====================================
                STATISTIC ICON
            ====================================== */}

            <span
                aria-hidden="true"
                className={`
                    mx-auto mb-2

                    flex h-10 w-10
                    items-center justify-center

                    rounded-xl border

                    ${toneClass}
                `}
            >
                {image ? (
                    <img
                        src={image}
                        alt=""
                        className="
                            h-6 w-6
                            object-contain
                        "
                    />
                ) : Icon ? (
                    <Icon
                        size={20}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                ) : null}
            </span>

            {/* =====================================
                STATISTIC LABEL
            ====================================== */}

            <p
                className="
                    font-mono
                    text-[10px]

                    font-semibold
                    uppercase

                    tracking-[0.07em]

                    text-slate-500
                    dark:text-slate-400
                "
            >
                {label}
            </p>

            {/* =====================================
                STATISTIC VALUE
            ====================================== */}

            <p
                title={`${label}: ${displayed}`}
                className="
                    mt-1
                    min-w-0

                    break-all

                    font-mono
                    text-xl

                    font-black
                    tabular-nums

                    text-slate-900
                    dark:text-white

                    sm:text-2xl
                "
            >
                {displayed}
            </p>
        </div>
    );
});

// =========================================================
// PROFILE HERO STATS
//
// Original five statistics:
//
// 1. Rating
// 2. FCoin
// 3. Problems
// 4. Solutions
// 5. Projects
//
// All values come from the existing profile view model.
//
// Existing field names are preserved:
// - rating
// - fcoin
// - problemCount
// - solutionCount
// - projectsCount
// =========================================================

const ProfileHeroStats = ({
    currentUser,
}) => {
    const user = currentUser || {};

    return (
        <div
            role="group"
            aria-label="Profil statistikasi"
            className="
                grid
                grid-cols-2

                overflow-hidden

                border-t
                border-slate-200

                dark:border-white/[0.07]

                md:grid-cols-5
            "
        >
            {/* =====================================
                RATING
            ====================================== */}

            <StatCard
                Icon={Star}
                label="Reyting"
                value={user.rating}
                tone="yellow"
            />

            {/* =====================================
                FCOIN
            ====================================== */}

            <StatCard
                image={FCoinIcon}
                label="F Coin"
                value={user.fcoin}
                tone="yellow"
            />

            {/* =====================================
                PROBLEMS
            ====================================== */}

            <StatCard
                Icon={AlertCircle}
                label="Muammolar"
                value={user.problemCount}
                tone="red"
            />

            {/* =====================================
                SOLUTIONS
            ====================================== */}

            <StatCard
                Icon={CheckCircle2}
                label="Yechimlar"
                value={user.solutionCount}
                tone="blue"
            />

            {/* =====================================
                PROJECTS
            ====================================== */}

            <StatCard
                Icon={FolderKanban}
                label="Loyihalar"
                value={user.projectsCount}
                tone="purple"
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileHeroStats);
