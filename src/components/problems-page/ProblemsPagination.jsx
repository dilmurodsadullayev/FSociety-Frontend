
import React, { useMemo } from "react";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROBLEMS PAGINATION
//
// Features:
// - Light / Dark Mode
// - Mobile and desktop navigation
// - Ellipsis for large page counts
// - Accessible current-page indication
// - Safe pagination values
// - Disabled/loading state support
//
// Existing props preserved:
// - currentPage
// - totalPages
// - count
// - onPageChange
// - disabled
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const DOTS_LEFT = "dots-left";
const DOTS_RIGHT = "dots-right";

// =========================================================
// HELPERS
// =========================================================

const getPositiveInteger = (
    value,
    fallback = 1
) => {
    const number = Number(value);

    if (
        !Number.isSafeInteger(number) ||
        number < 1
    ) {
        return fallback;
    }

    return number;
};

const getSafeCount = (value) => {
    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return 0;
    }

    return Math.floor(number);
};

const createRange = (start, end) => {
    if (end < start) {
        return [];
    }

    return Array.from(
        { length: end - start + 1 },
        (_, index) => start + index
    );
};

// =========================================================
// BUILD PAGINATION ITEMS
//
// Small:
// 1 2 3 4 5
//
// Start:
// 1 2 3 4 5 ... 20
//
// Middle:
// 1 ... 9 10 11 ... 20
//
// End:
// 1 ... 16 17 18 19 20
//
// At most 7 items are generated.
// =========================================================

const buildPaginationItems = (
    currentPage,
    totalPages
) => {
    if (totalPages <= 1) {
        return [];
    }

    if (totalPages <= 7) {
        return createRange(1, totalPages);
    }

    if (currentPage <= 4) {
        return [
            ...createRange(1, 5),
            DOTS_RIGHT,
            totalPages,
        ];
    }

    if (currentPage >= totalPages - 3) {
        return [
            1,
            DOTS_LEFT,
            ...createRange(
                totalPages - 4,
                totalPages
            ),
        ];
    }

    return [
        1,
        DOTS_LEFT,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        DOTS_RIGHT,
        totalPages,
    ];
};

// =========================================================
// SHARED BUTTON CLASSES
// =========================================================

const BASE_BUTTON_CLASS = `
    inline-flex
    h-10
    min-w-10
    shrink-0

    items-center
    justify-center

    rounded-xl
    border

    px-2.5

    font-display
    text-xs
    font-bold
    tabular-nums

    transition-colors
    duration-150

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-cyan-500

    disabled:cursor-not-allowed
    disabled:opacity-40
`;

const NORMAL_BUTTON_CLASS = `
    border-slate-200
    bg-white
    text-slate-600

    hover:border-cyan-400/40
    hover:bg-cyan-500/[0.06]
    hover:text-cyan-700

    dark:border-white/[0.09]
    dark:bg-white/[0.035]
    dark:text-gray-400

    dark:hover:border-cyan-400/25
    dark:hover:bg-cyan-400/[0.07]
    dark:hover:text-cyan-300
`;

const ACTIVE_BUTTON_CLASS = `
    border-cyan-400/50
    bg-cyan-500/[0.10]
    text-cyan-800

    shadow-sm

    dark:border-cyan-400/30
    dark:bg-cyan-400/[0.12]
    dark:text-cyan-300
`;

// =========================================================
// PAGE NUMBER BUTTON
// =========================================================

const PageButton = React.memo(({
    page,
    isCurrent = false,
    disabled = false,
    onPageChange,
}) => {
    return (
        <button
            type="button"

            onClick={() => {
                if (
                    !disabled &&
                    !isCurrent &&
                    typeof onPageChange === "function"
                ) {
                    onPageChange(page);
                }
            }}

            disabled={disabled}

            aria-current={
                isCurrent ? "page" : undefined
            }

            aria-label={
                isCurrent
                    ? `${page}-sahifa, joriy sahifa`
                    : `${page}-sahifaga o‘tish`
            }

            className={`
                ${BASE_BUTTON_CLASS}

                ${
                    isCurrent
                        ? ACTIVE_BUTTON_CLASS
                        : NORMAL_BUTTON_CLASS
                }
            `}
        >
            {page}
        </button>
    );
});

// =========================================================
// ARROW BUTTON
// =========================================================

const ArrowButton = React.memo(({
    direction,
    disabled = false,
    onClick,
}) => {
    const previous = direction === "previous";

    const Icon = previous
        ? ChevronLeft
        : ChevronRight;

    const label = previous
        ? "Oldingi sahifa"
        : "Keyingi sahifa";

    return (
        <button
            type="button"

            onClick={onClick}
            disabled={disabled}

            aria-label={label}
            title={label}

            className={`
                ${BASE_BUTTON_CLASS}
                ${NORMAL_BUTTON_CLASS}
            `}
        >
            <Icon
                size={18}
                aria-hidden="true"
            />
        </button>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemsPagination = ({
    currentPage = 1,
    totalPages = 1,
    count = 0,

    onPageChange,

    disabled = false,
}) => {
    // =====================================================
    // NORMALIZE VALUES
    // =====================================================

    const safeTotalPages =
        getPositiveInteger(totalPages, 1);

    const requestedPage =
        getPositiveInteger(currentPage, 1);

    const safeCurrentPage = Math.min(
        requestedPage,
        safeTotalPages
    );

    const safeCount = getSafeCount(count);

    const isDisabled =
        Boolean(disabled) ||
        typeof onPageChange !== "function";

    const canGoPrevious =
        !isDisabled &&
        safeCurrentPage > 1;

    const canGoNext =
        !isDisabled &&
        safeCurrentPage < safeTotalPages;

    // =====================================================
    // PAGE ITEMS
    // =====================================================

    const items = useMemo(
        () =>
            buildPaginationItems(
                safeCurrentPage,
                safeTotalPages
            ),
        [
            safeCurrentPage,
            safeTotalPages,
        ]
    );

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (page) => {
        if (isDisabled) {
            return;
        }

        const targetPage =
            getPositiveInteger(
                page,
                safeCurrentPage
            );

        if (
            targetPage === safeCurrentPage ||
            targetPage < 1 ||
            targetPage > safeTotalPages
        ) {
            return;
        }

        onPageChange(targetPage);
    };

    // =====================================================
    // NO RECORDS
    // =====================================================

    if (safeCount <= 0) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                mt-8
                w-full
                min-w-0

                sm:mt-10
                lg:mt-12
            "
        >
            {/* ======================================
                PAGINATION NAVIGATION
            ====================================== */}

            {safeTotalPages > 1 && (
                <nav
                    aria-label="Muammolar sahifalari"

                    aria-busy={
                        Boolean(disabled)
                    }

                    className="
                        mx-auto
                        w-full
                        max-w-3xl
                        min-w-0
                    "
                >
                    {/* ==============================
                        MOBILE NAVIGATION
                    ============================== */}

                    <div
                        className="
                            flex
                            w-full
                            min-w-0

                            items-center
                            justify-between
                            gap-2

                            sm:hidden
                        "
                    >
                        <ArrowButton
                            direction="previous"
                            disabled={!canGoPrevious}

                            onClick={() => {
                                handlePageChange(
                                    safeCurrentPage - 1
                                );
                            }}
                        />

                        <span
                            aria-live="polite"

                            className="
                                inline-flex

                                h-10
                                min-w-0
                                flex-1

                                items-center
                                justify-center

                                rounded-xl

                                border
                                border-cyan-400/30

                                bg-cyan-500/[0.07]

                                px-3

                                font-mono
                                text-xs
                                font-bold
                                tabular-nums

                                text-cyan-800

                                dark:border-cyan-400/20
                                dark:bg-cyan-400/[0.07]
                                dark:text-cyan-300
                            "
                        >
                            {safeCurrentPage}
                            {" / "}
                            {safeTotalPages}
                        </span>

                        <ArrowButton
                            direction="next"
                            disabled={!canGoNext}

                            onClick={() => {
                                handlePageChange(
                                    safeCurrentPage + 1
                                );
                            }}
                        />
                    </div>

                    {/* ==============================
                        DESKTOP NAVIGATION
                    ============================== */}

                    <div
                        className="
                            hidden
                            w-full
                            min-w-0

                            items-center
                            justify-center
                            gap-1.5

                            sm:flex
                        "
                    >
                        {/* PREVIOUS */}

                        <ArrowButton
                            direction="previous"
                            disabled={!canGoPrevious}

                            onClick={() => {
                                handlePageChange(
                                    safeCurrentPage - 1
                                );
                            }}
                        />

                        {/* PAGE NUMBERS */}

                        {items.map((item) => {
                            if (
                                item === DOTS_LEFT ||
                                item === DOTS_RIGHT
                            ) {
                                return (
                                    <span
                                        key={item}

                                        aria-hidden="true"

                                        className="
                                            inline-flex

                                            h-10
                                            min-w-7

                                            items-center
                                            justify-center

                                            font-mono
                                            text-sm
                                            font-bold

                                            text-slate-400

                                            dark:text-gray-500
                                        "
                                    >
                                        ...
                                    </span>
                                );
                            }

                            return (
                                <PageButton
                                    key={item}
                                    page={item}

                                    isCurrent={
                                        item === safeCurrentPage
                                    }

                                    disabled={isDisabled}

                                    onPageChange={
                                        handlePageChange
                                    }
                                />
                            );
                        })}

                        {/* NEXT */}

                        <ArrowButton
                            direction="next"
                            disabled={!canGoNext}

                            onClick={() => {
                                handlePageChange(
                                    safeCurrentPage + 1
                                );
                            }}
                        />
                    </div>
                </nav>
            )}

            {/* ======================================
                PAGE INFORMATION
            ====================================== */}

            <p
                aria-live="polite"

                className="
                    mt-5

                    break-words

                    text-center

                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    tabular-nums

                    text-slate-500

                    dark:text-gray-400
                "
            >
                Sahifa{" "}
                <strong
                    className="
                        font-black

                        text-slate-800

                        dark:text-gray-200
                    "
                >
                    {safeCurrentPage}
                </strong>

                {" / "}

                {safeTotalPages}

                {" · "}

                Jami {safeCount.toLocaleString("uz-UZ")} ta muammo
            </p>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProblemsPagination
);
