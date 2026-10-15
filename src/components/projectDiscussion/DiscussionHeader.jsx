
import React from "react";

import {
    MessageSquareText,
    RefreshCw,
} from "lucide-react";

// =========================================================
// FSOCIETY — DISCUSSION HEADER
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Comment counter
// - Refresh comments
// - Loading indicator
// - Accessible refresh button
//
// No Redux or direct API calls.
//
// Props:
// - commentsCount
// - isLoading
// - onRefresh
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const formatCommentsCount = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.max(0, Math.floor(number));
};

// =========================================================
// COMPONENT
// =========================================================

const DiscussionHeader = ({
    commentsCount = 0,
    isLoading = false,
    onRefresh,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const count = formatCommentsCount(
        commentsCount
    );

    const loading = Boolean(isLoading);

    const canRefresh =
        !loading &&
        typeof onRefresh === "function";

    // =====================================================
    // HANDLER
    // =====================================================

    const handleRefresh = () => {
        if (!canRefresh) {
            return;
        }

        onRefresh();
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <header
            className="
                flex
                w-full
                min-w-0

                flex-col
                gap-4

                md:flex-row
                md:items-end
                md:justify-between
            "
        >
            {/* ======================================
                LEFT SIDE
            ====================================== */}

            <div className="min-w-0 flex-1">

                {/* ==================================
                    SECTION LABEL
                ================================== */}

                <div
                    className="
                        mb-3

                        inline-flex
                        max-w-full

                        items-center
                        gap-2

                        rounded-full
                        border
                        border-indigo-400/25

                        bg-indigo-500/[0.07]

                        px-3
                        py-1.5

                        font-mono
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.12em]

                        text-indigo-700

                        dark:border-indigo-400/[0.17]
                        dark:bg-indigo-400/[0.07]
                        dark:text-indigo-300
                    "
                >
                    <MessageSquareText
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"

                        className="shrink-0"
                    />

                    <span>
                        Discussion
                    </span>
                </div>

                {/* ==================================
                    TITLE / COUNT
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        gap-3
                    "
                >
                    <h2
                        id="project-discussion-title"

                        className="
                            break-words
                            [overflow-wrap:anywhere]

                            text-[23px]
                            font-black
                            leading-tight
                            tracking-tight

                            text-slate-900

                            sm:text-[28px]
                            lg:text-[30px]

                            dark:text-white
                        "
                    >
                        Loyiha muhokamasi
                    </h2>

                    {/* COMMENT COUNTER */}

                    <span
                        aria-label={`${count} ta sharh`}

                        className="
                            inline-flex
                            h-8
                            min-w-8
                            shrink-0

                            items-center
                            justify-center

                            rounded-full
                            border
                            border-indigo-400/25

                            bg-indigo-500/[0.08]

                            px-2.5

                            font-mono
                            text-[12px]
                            font-black
                            tabular-nums

                            text-indigo-700

                            dark:border-indigo-400/[0.17]
                            dark:bg-indigo-400/[0.08]
                            dark:text-indigo-300
                        "
                    >
                        {count}
                    </span>
                </div>

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <p
                    className="
                        mt-3
                        max-w-2xl

                        text-[12px]
                        font-medium
                        leading-6

                        text-slate-600

                        sm:text-[13px]

                        dark:text-gray-400
                    "
                >
                    Loyiha haqida fikr bildiring, savol
                    bering yoki muhokamaga qo‘shiling.
                </p>
            </div>

            {/* ======================================
                RIGHT — REFRESH BUTTON
            ====================================== */}

            <button
                type="button"

                onClick={handleRefresh}

                disabled={!canRefresh}

                aria-label={
                    loading
                        ? "Sharhlar yangilanmoqda"
                        : "Sharhlarni yangilash"
                }

                aria-busy={loading}

                title="Sharhlarni qayta yuklash"

                className="
                    group/refresh

                    inline-flex
                    min-h-10
                    shrink-0

                    items-center
                    justify-center
                    gap-2

                    self-start

                    rounded-xl
                    border
                    border-[#dce5f0]

                    bg-white

                    px-4
                    py-2.5

                    text-[11px]
                    font-bold

                    text-slate-600

                    shadow-[0_4px_14px_rgba(15,23,42,0.025)]

                    transition-colors
                    duration-150

                    hover:border-indigo-400/40
                    hover:bg-indigo-500/[0.05]
                    hover:text-indigo-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    md:self-auto

                    dark:border-white/[0.09]
                    dark:bg-white/[0.035]
                    dark:text-gray-400
                    dark:shadow-none

                    dark:hover:border-indigo-400/25
                    dark:hover:bg-indigo-400/[0.07]
                    dark:hover:text-indigo-300
                "
            >
                <RefreshCw
                    size={15}
                    strokeWidth={2}

                    aria-hidden="true"

                    className={`
                        shrink-0

                        ${
                            loading
                                ? `
                                    animate-spin
                                    motion-reduce:animate-none
                                `
                                : `
                                    transition-transform
                                    duration-300

                                    group-hover/refresh:rotate-45

                                    motion-reduce:transform-none
                                `
                        }
                    `}
                />

                <span>
                    {loading
                        ? "Yangilanmoqda..."
                        : "Yangilash"}
                </span>
            </button>
        </header>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    DiscussionHeader
);
