
import React, { memo } from "react";

import {
    Coins,
    Star,
} from "lucide-react";

import {
    getUserCoins,
    getUserRating,
} from "./userCardHelpers";

import formatCompactNumber
    from "../../../utils/formatCompactNumber";

// =========================================================
// FSOCIETY — USER CARD STATISTICS
//
// Preserved:
// - Rating
// - FCoin balance
// - Existing backend fields
//
// Improved:
// - Compact FCoin values
// - Full FCoin in tooltip
// - Accessible full amount
// - Light / Dark Mode
// - Responsive layout
// =========================================================

const UserCardStats = ({ user }) => {
    // =====================================================
    // RATING
    // =====================================================

    const rating = getUserRating(user);

    // =====================================================
    // FCOIN
    //
    // Real balance remains unchanged.
    // Only visual formatting is applied.
    // =====================================================

    const rawCoins = Number(user?.coins ?? 0);

    const safeCoins =
        Number.isFinite(rawCoins)
            ? Math.max(0, rawCoins)
            : 0;

    const compactCoins =
        formatCompactNumber(safeCoins);

    const fullCoins =
        getUserCoins(user);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                mt-5
                grid
                grid-cols-2
                gap-3
            "
        >
            {/* ======================================
                RATING CARD
            ====================================== */}

            <div
                className="
                    min-w-0

                    rounded-2xl

                    border
                    border-amber-200

                    bg-amber-50/70

                    p-3.5

                    transition-colors
                    duration-200

                    dark:border-amber-400/15
                    dark:bg-amber-400/[0.055]

                    motion-reduce:transition-none
                "
            >
                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2
                    "
                >
                    <Star
                        size={17}
                        fill="currentColor"
                        aria-hidden="true"
                        className="
                            shrink-0
                            text-amber-500

                            dark:text-amber-400
                        "
                    />

                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-bold
                            uppercase

                            text-amber-800

                            dark:text-amber-300
                        "
                    >
                        Rating
                    </span>
                </div>

                {/* RATING VALUE */}

                <p
                    className="
                        mt-3

                        truncate

                        text-xl
                        font-black
                        tabular-nums

                        text-slate-900

                        sm:text-2xl

                        dark:text-white
                    "
                >
                    {rating}
                </p>

                {/* LABEL */}

                <p
                    className="
                        mt-1

                        text-[11px]
                        leading-5

                        text-slate-600

                        dark:text-slate-400
                    "
                >
                    Umumiy reyting
                </p>
            </div>

            {/* ======================================
                FCOIN CARD
            ====================================== */}

            <div
                className="
                    group/coin

                    relative
                    min-w-0

                    rounded-2xl

                    border
                    border-orange-200

                    bg-orange-50/70

                    p-3.5

                    transition-colors
                    duration-200

                    hover:border-orange-300
                    hover:bg-orange-50

                    dark:border-orange-400/15
                    dark:bg-orange-400/[0.055]

                    dark:hover:border-orange-400/30
                    dark:hover:bg-orange-400/[0.08]

                    motion-reduce:transition-none
                "
                title={`To‘liq balans: ${fullCoins} FCoin`}
            >
                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2
                    "
                >
                    <Coins
                        size={17}
                        aria-hidden="true"
                        className="
                            shrink-0

                            text-orange-600

                            dark:text-orange-400
                        "
                    />

                    <span
                        className="
                            font-mono
                            text-[10px]
                            font-bold
                            uppercase

                            text-orange-800

                            dark:text-orange-300
                        "
                    >
                        FCoin
                    </span>
                </div>

                {/* COMPACT FCOIN VALUE */}

                <p
                    className="
                        mt-3

                        min-w-0
                        truncate

                        text-xl
                        font-black
                        tabular-nums
                        tracking-tight

                        text-slate-900

                        sm:text-2xl

                        dark:text-white
                    "
                >
                    <span aria-hidden="true">
                        {compactCoins}
                    </span>

                    {/* Full value for screen readers */}
                    <span className="sr-only">
                        {fullCoins} FCoin
                    </span>
                </p>

                {/* LABEL */}

                <p
                    className="
                        mt-1

                        text-[11px]
                        leading-5

                        text-slate-600

                        dark:text-slate-400
                    "
                >
                    Platforma coini
                </p>
            </div>
        </div>
    );
};

export default memo(UserCardStats);
