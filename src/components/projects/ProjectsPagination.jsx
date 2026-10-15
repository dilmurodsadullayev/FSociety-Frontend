
import React from "react";

import {
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROJECTS PAGINATION
//
// Features:
// - Dark / Light Mode
// - Responsive design
// - Previous / Next buttons
// - Numbered page navigation
// - Ellipsis support
// - Loading state
// - Keyboard accessibility
// - Active page indicator
//
// All existing props are preserved.
// =========================================================

const ProjectsPagination = ({
    currentPage = 1,
    totalPages = 0,
    items = [],
    isLoading = false,
    onPageChange,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const total = Math.max(
        0,
        Math.trunc(Number(totalPages) || 0)
    );

    const current = Math.min(
        Math.max(
            1,
            Math.trunc(Number(currentPage) || 1)
        ),
        Math.max(1, total)
    );

    const pageItems = Array.isArray(items) && items.length
        ? items
        : [current];

    const loading = Boolean(isLoading);

    const canNavigate =
        typeof onPageChange === "function";

    // =====================================================
    // HIDE WHEN ONLY ONE PAGE
    // =====================================================

    if (total <= 1) {
        return null;
    }

    // =====================================================
    // NAVIGATION STATUS
    // =====================================================

    const isFirstPage = current <= 1;

    const isLastPage = current >= total;

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (page) => {
        const nextPage = Number(page);

        if (
            !canNavigate ||
            loading ||
            !Number.isInteger(nextPage) ||
            nextPage < 1 ||
            nextPage > total ||
            nextPage === current
        ) {
            return;
        }

        onPageChange(nextPage);
    };

    // =====================================================
    // BASE BUTTON STYLES
    // =====================================================

    const navigationButtonClass = `
        grid
        h-9
        w-9
        shrink-0
        place-items-center

        rounded-xl
        border
        border-[#dce5f0]

        bg-[#f8faff]
        text-slate-600

        transition-colors
        duration-150

        hover:border-indigo-400/40
        hover:bg-indigo-500/[0.07]
        hover:text-indigo-700

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-500

        disabled:cursor-not-allowed
        disabled:opacity-35

        disabled:hover:border-[#dce5f0]
        disabled:hover:bg-[#f8faff]
        disabled:hover:text-slate-600

        dark:border-white/[0.08]
        dark:bg-white/[0.035]
        dark:text-gray-400

        dark:hover:border-cyan-400/25
        dark:hover:bg-cyan-400/[0.06]
        dark:hover:text-cyan-300

        dark:disabled:hover:border-white/[0.08]
        dark:disabled:hover:bg-white/[0.035]
        dark:disabled:hover:text-gray-400
    `;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <nav
            aria-label="Loyihalar sahifalari"
            aria-busy={loading}

            className="
                relative
                mt-8

                flex
                w-full
                min-w-0

                flex-col
                items-center
                justify-between

                gap-4

                rounded-2xl
                border
                border-[#dce5f0]

                bg-white/90

                px-3
                py-4

                shadow-[0_6px_24px_rgba(15,23,42,0.035)]

                sm:flex-row
                sm:gap-5
                sm:px-4
                sm:py-3

                dark:border-white/[0.07]
                dark:bg-[#0d1117]
                dark:shadow-none
            "
        >
            {/* ======================================
                PAGE INFORMATION
            ====================================== */}

            <div
                className="
                    flex
                    shrink-0
                    items-center
                    gap-2

                    self-start

                    sm:self-auto
                "
            >
                {/* INDICATOR */}

                <span
                    aria-hidden="true"

                    className="
                        h-1.5
                        w-1.5

                        rounded-full

                        bg-indigo-500

                        dark:bg-cyan-400
                    "
                />

                {/* PAGE LABEL */}

                <p
                    aria-live="polite"

                    className="
                        font-mono
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.11em]

                        text-slate-500

                        dark:text-gray-500
                    "
                >
                    page://

                    <span
                        className="
                            ml-1

                            font-black

                            text-indigo-700

                            dark:text-cyan-300
                        "
                    >
                        {current}
                    </span>

                    <span
                        className="
                            mx-1.5

                            text-slate-400

                            dark:text-gray-600
                        "
                    >
                        /
                    </span>

                    <span
                        className="
                            text-slate-600

                            dark:text-gray-400
                        "
                    >
                        {total}
                    </span>
                </p>

                {/* LOADING */}

                {loading && (
                    <Loader2
                        size={13}
                        strokeWidth={2}

                        aria-label="Yuklanmoqda"

                        className="
                            animate-spin

                            text-indigo-600

                            dark:text-cyan-300

                            motion-reduce:animate-none
                        "
                    />
                )}
            </div>

            {/* ======================================
                PAGINATION CONTROLS
            ====================================== */}

            <div
                className="
                    w-full
                    min-w-0
                    max-w-full

                    overflow-x-auto

                    pb-1

                    sm:w-auto
                    sm:pb-0
                "
            >
                <div
                    className="
                        mx-auto

                        flex
                        w-max
                        min-w-0

                        items-center
                        justify-center
                        gap-1

                        sm:mx-0
                    "
                >
                    {/* ==============================
                        PREVIOUS PAGE
                    ============================== */}

                    <button
                        type="button"

                        aria-label="Oldingi sahifa"
                        title="Oldingi sahifa"

                        disabled={
                            isFirstPage ||
                            loading ||
                            !canNavigate
                        }

                        onClick={() => {
                            handlePageChange(current - 1);
                        }}

                        className={navigationButtonClass}
                    >
                        <ChevronLeft
                            size={17}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </button>

                    {/* ==============================
                        PAGE NUMBERS
                    ============================== */}

                    {pageItems.map((item, index) => {
                        // ==================================
                        // ELLIPSIS
                        // ==================================

                        if (
                            typeof item !== "number" ||
                            !Number.isInteger(item)
                        ) {
                            return (
                                <span
                                    key={`ellipsis-${String(item)}-${index}`}

                                    aria-hidden="true"

                                    className="
                                        grid
                                        h-9
                                        w-6
                                        shrink-0

                                        place-items-center

                                        font-mono
                                        text-xs
                                        font-bold

                                        text-slate-400

                                        dark:text-gray-600
                                    "
                                >
                                    …
                                </span>
                            );
                        }

                        // ==================================
                        // PAGE BUTTON
                        // ==================================

                        const active =
                            item === current;

                        return (
                            <button
                                key={`page-${item}-${index}`}

                                type="button"

                                aria-label={`${item}-sahifa`}

                                aria-current={
                                    active
                                        ? "page"
                                        : undefined
                                }

                                title={`${item}-sahifa`}

                                disabled={
                                    active ||
                                    loading ||
                                    !canNavigate
                                }

                                onClick={() => {
                                    handlePageChange(item);
                                }}

                                className={`
                                    grid
                                    h-9
                                    min-w-9
                                    shrink-0

                                    place-items-center

                                    rounded-xl
                                    border

                                    px-2

                                    font-mono
                                    text-[11px]
                                    font-black

                                    tabular-nums

                                    transition-colors
                                    duration-150

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500

                                    disabled:cursor-not-allowed

                                    ${
                                        active
                                            ? `
                                                border-indigo-400/35
                                                bg-indigo-500/[0.12]

                                                text-indigo-700

                                                dark:border-cyan-400/30
                                                dark:bg-cyan-400/[0.10]
                                                dark:text-cyan-300
                                            `
                                            : `
                                                border-[#dce5f0]
                                                bg-[#f8faff]

                                                text-slate-600

                                                hover:border-indigo-400/35
                                                hover:bg-indigo-500/[0.07]
                                                hover:text-indigo-700

                                                dark:border-white/[0.08]
                                                dark:bg-white/[0.035]
                                                dark:text-gray-400

                                                dark:hover:border-cyan-400/25
                                                dark:hover:bg-cyan-400/[0.06]
                                                dark:hover:text-cyan-300

                                                disabled:opacity-50
                                            `
                                    }
                                `}
                            >
                                {item}
                            </button>
                        );
                    })}

                    {/* ==============================
                        NEXT PAGE
                    ============================== */}

                    <button
                        type="button"

                        aria-label="Keyingi sahifa"
                        title="Keyingi sahifa"

                        disabled={
                            isLastPage ||
                            loading ||
                            !canNavigate
                        }

                        onClick={() => {
                            handlePageChange(current + 1);
                        }}

                        className={navigationButtonClass}
                    >
                        <ChevronRight
                            size={17}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProjectsPagination);
