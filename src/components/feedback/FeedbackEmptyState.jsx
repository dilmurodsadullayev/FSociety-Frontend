
import React from "react";

import {
    MessageSquareText,
} from "lucide-react";

// =========================================================
// FSOCIETY — FEEDBACK EMPTY STATE
//
// Features:
// - Dark / Light Mode
// - Responsive
// - Long text handling
// - Optional action button
// - Accessible information
//
// Props:
// - title
// - description
// - Icon
// - actionLabel
// - onAction
// =========================================================

const FeedbackEmptyState = ({
    title = "Feedback topilmadi",

    description = "Hozircha ma’lumot mavjud emas.",

    Icon = MessageSquareText,

    actionLabel = "",

    onAction,
}) => {
    // =====================================================
    // ACTION AVAILABILITY
    // =====================================================

    const showAction =
        Boolean(actionLabel) &&
        typeof onAction === "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative

                flex
                w-full
                min-w-0

                flex-col
                items-center
                justify-center

                overflow-hidden

                rounded-3xl
                border
                border-dashed
                border-slate-300

                bg-white/70

                px-4
                py-10

                text-center

                sm:px-6
                sm:py-14

                dark:border-white/[0.09]
                dark:bg-white/[0.018]
            "
        >
            {/* ======================================
                BACKGROUND ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-0

                    h-32
                    w-40

                    -translate-x-1/2

                    rounded-full

                    bg-indigo-500/[0.05]

                    blur-[65px]

                    dark:bg-indigo-400/[0.06]
                "
            />

            {/* ======================================
                EMPTY ICON
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    grid
                    h-14
                    w-14
                    shrink-0

                    place-items-center

                    rounded-2xl
                    border
                    border-indigo-400/20

                    bg-indigo-500/[0.07]

                    text-indigo-700

                    dark:border-indigo-400/[0.16]
                    dark:bg-indigo-400/[0.06]
                    dark:text-indigo-300
                "
            >
                <Icon
                    size={25}
                    strokeWidth={1.8}

                    aria-hidden="true"
                />
            </div>

            {/* ======================================
                TITLE
            ====================================== */}

            <h3
                className="
                    relative
                    z-10

                    mt-4

                    max-w-xl

                    break-words
                    [overflow-wrap:anywhere]

                    font-display
                    text-[14px]
                    font-bold
                    leading-6

                    text-slate-900

                    sm:text-[15px]

                    dark:text-gray-100
                "
            >
                {title}
            </h3>

            {/* ======================================
                DESCRIPTION
            ====================================== */}

            {description && (
                <p
                    className="
                        relative
                        z-10

                        mx-auto
                        mt-2

                        max-w-md

                        break-words

                        text-[12px]
                        font-medium
                        leading-6

                        text-slate-600

                        dark:text-gray-400
                    "
                >
                    {description}
                </p>
            )}

            {/* ======================================
                OPTIONAL ACTION
            ====================================== */}

            {showAction && (
                <button
                    type="button"

                    onClick={onAction}

                    className="
                        relative
                        z-10

                        mt-5

                        inline-flex
                        min-h-10

                        items-center
                        justify-center

                        rounded-xl
                        border
                        border-indigo-500

                        bg-indigo-600

                        px-4
                        py-2.5

                        text-[12px]
                        font-bold

                        text-white

                        transition-colors

                        hover:bg-indigo-700

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500
                        focus-visible:ring-offset-2

                        dark:focus-visible:ring-offset-[#0b1018]
                    "
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackEmptyState
);
