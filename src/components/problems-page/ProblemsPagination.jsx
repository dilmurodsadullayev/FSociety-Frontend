
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
// - Selection-color active page
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

    return Math.min(
        Number.MAX_SAFE_INTEGER,
        Math.floor(number)
    );
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

    backdrop-blur-md

    transition-all
    duration-200

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-cyan-500
    focus-visible:ring-offset-2
    focus-visible:ring-offset-white

    disabled:cursor-not-allowed
    disabled:opacity-40

    dark:focus-visible:ring-offset-[#080e19]
`;


const NORMAL_BUTTON_CLASS = `
    border-slate-200

    bg-white/95
    text-slate-600

    shadow-sm

    hover:border-cyan-400/50
    hover:bg-cyan-50
    hover:text-cyan-700

    active:scale-95

    dark:border-white/[0.12]

    dark:bg-[#0b1422]/85
    dark:text-gray-300

    dark:shadow-none

    dark:hover:border-cyan-400/40
    dark:hover:bg-[#10253a]/95
    dark:hover:text-cyan-300
`;


// =========================================================
// ACTIVE BUTTON CLASS
//
// FSOCIETY ACTIVE PAGE COLOR:
//
// - #FBBF24
// - Tailwind amber-400
//
// - Amber selection-style background
// - Dark readable page number
// - Golden border
// - Soft amber glow
// - Visible in front of the winter background
// =========================================================

const ACTIVE_BUTTON_CLASS = `
    relative
    z-10

    border-[#FBBF24]

    bg-[#FBBF24]
    text-slate-950

    font-black

    shadow-lg
    shadow-amber-400/30

    ring-1
    ring-amber-200/70

    backdrop-blur-md

    hover:border-amber-200
    hover:bg-amber-300
    hover:shadow-xl
    hover:shadow-amber-400/40

    active:scale-95

    dark:border-[#FBBF24]

    dark:bg-[#FBBF24]
    dark:text-slate-950

    dark:shadow-lg
    dark:shadow-amber-400/25

    dark:ring-amber-200/50

    dark:hover:border-amber-200
    dark:hover:bg-amber-300
    dark:hover:shadow-amber-300/35
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

            title={
                isCurrent
                    ? `${page}-sahifa`
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
                strokeWidth={2.3}
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
                        relative

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
                                border-[#FBBF24]

                                bg-[#FBBF24]
                                text-slate-950

                                px-3

                                font-mono
                                text-xs
                                font-black
                                tabular-nums

                                shadow-md
                                shadow-amber-400/25

                                backdrop-blur-md

                                dark:border-[#FBBF24]
                                dark:bg-[#FBBF24]
                                dark:text-slate-950
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

                                            text-slate-500

                                            dark:text-gray-300
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

                    text-slate-600

                    dark:text-gray-300
                "
            >
                Sahifa{" "}

                <strong
                    className="
                        rounded-md

                        border
                        border-[#FBBF24]

                        bg-[#FBBF24]

                        px-1.5
                        py-0.5

                        font-black

                        text-slate-950

                        shadow-sm
                        shadow-amber-400/20

                        dark:border-[#FBBF24]
                        dark:bg-[#FBBF24]
                        dark:text-slate-950
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
