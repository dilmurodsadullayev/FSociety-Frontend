
import React, { memo } from "react";

import homeStyles from "./homeStyles";

// =========================================================
// FSOCIETY — HOME HERO STAT
//
// Props:
// - Icon
// - label
// - value
// - accentClass
// - title
//
// Reusable for:
// - Trending problems
// - FCoin
// - Platform status
// =========================================================

const HomeHeroStat = ({
    Icon,
    label,
    value,
    accentClass = "",
    title,
}) => {
    return (
        <div
            title={title}
            className={`
                flex
                min-w-0
                items-center
                gap-3

                rounded-2xl
                border

                px-3.5
                py-3

                transition-colors
                duration-200

                ${homeStyles.surface}

                motion-reduce:transition-none
            `}
        >
            {/* ======================================
                ICON
            ====================================== */}

            <div
                className={`
                    grid
                    h-9
                    w-9

                    shrink-0

                    place-items-center

                    rounded-xl

                    border
                    border-[#e2e8f2]

                    bg-white

                    dark:border-white/[0.08]
                    dark:bg-white/[0.04]

                    ${accentClass}
                `}
            >
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                )}
            </div>

            {/* ======================================
                TEXT
            ====================================== */}

            <div className="min-w-0 flex-1">
                <p
                    className={`
                        truncate

                        text-[9px]
                        font-black

                        uppercase
                        tracking-[0.14em]

                        ${homeStyles.eyebrow}
                    `}
                >
                    {label}
                </p>

                <p
                    className="
                        mt-0.5
                        truncate

                        text-sm
                        font-black
                        tabular-nums

                        text-slate-800

                        dark:text-slate-100
                    "
                >
                    {value}
                </p>
            </div>
        </div>
    );
};

export default memo(HomeHeroStat);
