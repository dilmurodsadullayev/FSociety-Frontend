
import React from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    MessageSquareText,
} from "lucide-react";

// =========================================================
// FSOCIETY — FEEDBACK STAT CARD
//
// Features:
// - Dark / Light Mode
// - Responsive
// - Loading skeleton
// - Reduced motion support
// - Safe stat values
// - Accessible loading status
//
// No Redux or API calls.
// =========================================================

// =========================================================
// SKELETON
// =========================================================

const FeedbackStatSkeleton = () => {
    return (
        <div
            role="status"
            aria-label="Statistika yuklanmoqda"

            className="
                flex
                min-w-0
                items-start
                justify-between
                gap-3
            "
        >
            <div
                aria-hidden="true"

                className="
                    min-w-0
                    flex-1
                    space-y-3
                "
            >
                <div
                    className="
                        h-2.5
                        w-20
                        max-w-full

                        animate-pulse
                        rounded-full

                        bg-slate-200

                        dark:bg-white/[0.07]

                        motion-reduce:animate-none
                    "
                />

                <div
                    className="
                        h-8
                        w-16

                        animate-pulse
                        rounded-lg

                        bg-slate-200

                        dark:bg-white/[0.07]

                        motion-reduce:animate-none
                    "
                />

                <div
                    className="
                        h-2.5
                        w-28
                        max-w-full

                        animate-pulse
                        rounded-full

                        bg-slate-200

                        dark:bg-white/[0.07]

                        motion-reduce:animate-none
                    "
                />
            </div>

            <div
                aria-hidden="true"

                className="
                    h-10
                    w-10
                    shrink-0

                    animate-pulse
                    rounded-xl

                    bg-slate-200

                    dark:bg-white/[0.07]

                    motion-reduce:animate-none
                "
            />
        </div>
    );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const FeedbackStatCard = ({
    title = "",

    value = 0,

    Icon = MessageSquareText,

    description = "",

    isLoading = false,
}) => {
    // =====================================================
    // ACCESSIBILITY / ANIMATION
    // =====================================================

    const shouldReduceMotion =
        useReducedMotion();

    const loading = Boolean(isLoading);

    // =====================================================
    // SAFE DISPLAY VALUE
    // =====================================================

    const displayValue = value ?? 0;

    // =====================================================
    // ANIMATION
    // =====================================================

    const hoverAnimation =
        loading || shouldReduceMotion
            ? undefined
            : { y: -3 };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <motion.div
            whileHover={hoverAnimation}

            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}

            aria-busy={loading}

            className="
                group/stat

                relative

                flex
                h-full
                w-full
                min-w-0

                flex-col

                overflow-hidden

                rounded-2xl
                border
                border-slate-200

                bg-white

                p-4

                shadow-[0_4px_18px_rgba(15,23,42,0.035)]

                transition-colors

                hover:border-indigo-400/30

                sm:p-5

                dark:border-white/[0.07]
                dark:bg-white/[0.025]
                dark:shadow-none

                dark:hover:border-indigo-400/20
                dark:hover:bg-white/[0.035]
            "
        >
            {/* ======================================
                DECORATIVE GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-10
                    -top-10

                    h-28
                    w-28

                    rounded-full

                    bg-indigo-500/[0.06]

                    blur-3xl

                    dark:bg-indigo-500/[0.07]
                "
            />

            {/* ======================================
                CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    flex-1
                "
            >
                {loading ? (
                    <FeedbackStatSkeleton />
                ) : (
                    <div
                        className="
                            flex
                            min-w-0

                            items-start
                            justify-between
                            gap-3
                        "
                    >
                        {/* ==========================
                            STAT INFO
                        ========================== */}

                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >
                            {/* LABEL */}

                            <p
                                className="
                                    break-words

                                    font-display
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.10em]

                                    text-slate-500

                                    dark:text-gray-400
                                "
                            >
                                {title}
                            </p>

                            {/* VALUE */}

                            <h3
                                className="
                                    mt-2

                                    break-words
                                    [overflow-wrap:anywhere]

                                    font-display
                                    text-[26px]
                                    font-black
                                    leading-tight
                                    tracking-tight
                                    tabular-nums

                                    text-slate-900

                                    sm:text-[28px]

                                    dark:text-white
                                "
                            >
                                {displayValue}
                            </h3>

                            {/* DESCRIPTION */}

                            {description && (
                                <p
                                    className="
                                        mt-1.5

                                        break-words

                                        text-[11px]
                                        font-medium
                                        leading-5

                                        text-slate-600

                                        dark:text-gray-400
                                    "
                                >
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* ==========================
                            ICON
                        ========================== */}

                        <div
                            className="
                                grid
                                h-10
                                w-10
                                shrink-0

                                place-items-center

                                rounded-xl
                                border
                                border-indigo-400/20

                                bg-indigo-500/[0.07]

                                text-indigo-700

                                transition-colors

                                group-hover/stat:bg-indigo-500/[0.12]

                                dark:border-indigo-400/15
                                dark:bg-indigo-400/[0.07]
                                dark:text-indigo-300

                                dark:group-hover/stat:bg-indigo-400/[0.11]
                            "
                        >
                            <Icon
                                size={19}
                                strokeWidth={1.9}

                                aria-hidden="true"
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackStatCard
);
