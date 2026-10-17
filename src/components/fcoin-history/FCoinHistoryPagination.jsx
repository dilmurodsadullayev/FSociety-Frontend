// src/components/fcoin-history/FCoinHistoryPagination.jsx

import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react";

import {
    formatFullCoinNumber,
} from "./coinHistoryHelpers";

// =========================================================
// SHARED HELPERS
// =========================================================

const safeInteger = (value, fallback, minimum = 0) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.max(minimum, Math.trunc(number));
};

const PAGE_TRANSITION = {
    duration: 0.2,
    ease: "easeOut",
};

// =========================================================
// PAGE BUTTON
// =========================================================

const PageButton = memo(function PageButton({
    page,
    currentPage,
    disabled = false,
    onClick,
    reduceMotion = false,
}) {
    const isActive = page === currentPage;

    const isDisabled =
        Boolean(disabled) ||
        isActive ||
        typeof onClick !== "function";

    const handleClick = () => {
        if (!isDisabled) {
            onClick(page);
        }
    };

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            aria-current={isActive ? "page" : undefined}
            aria-label={`${page}-sahifa`}
            whileHover={
                reduceMotion || isDisabled
                    ? undefined
                    : { y: -2 }
            }
            whileTap={
                reduceMotion || isDisabled
                    ? undefined
                    : { scale: 0.96 }
            }
            transition={PAGE_TRANSITION}
            className={`
                inline-flex
                h-10
                min-w-10
                shrink-0
                items-center
                justify-center

                rounded-xl
                border
                px-3

                font-mono
                text-xs
                font-black
                tabular-nums

                transition-colors
                duration-200

                ${
                    isActive
                        ? `
                            border-indigo-300
                            bg-indigo-100
                            text-indigo-800

                            shadow-[0_4px_18px_rgba(99,102,241,0.12)]

                            dark:border-indigo-400/30
                            dark:bg-indigo-500/15
                            dark:text-indigo-200

                            dark:shadow-[0_0_24px_rgba(99,102,241,0.10)]
                        `
                        : `
                            border-slate-200
                            bg-white/80
                            text-slate-600

                            hover:border-indigo-300
                            hover:bg-indigo-50
                            hover:text-indigo-700

                            dark:border-white/[0.07]
                            dark:bg-white/[0.025]
                            dark:text-gray-400

                            dark:hover:border-white/[0.15]
                            dark:hover:bg-white/[0.05]
                            dark:hover:text-white
                        `
                }

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500/60
                focus-visible:ring-offset-2

                dark:focus-visible:ring-offset-[#0d1117]

                disabled:cursor-not-allowed
            `}
        >
            {formatFullCoinNumber(page)}
        </motion.button>
    );
});

// =========================================================
// ELLIPSIS
// =========================================================

const Ellipsis = memo(function Ellipsis() {
    return (
        <span
            aria-hidden="true"
            className="
                inline-flex
                h-10
                w-8
                shrink-0
                items-center
                justify-center

                text-slate-400
                dark:text-gray-600
            "
        >
            <MoreHorizontal size={17} />
        </span>
    );
});

// =========================================================
// NAVIGATION BUTTON
// =========================================================

const NavigationButton = memo(function NavigationButton({
    direction,
    disabled = false,
    onClick,
    reduceMotion = false,
}) {
    const isPrevious = direction === "previous";

    const Icon = isPrevious
        ? ChevronLeft
        : ChevronRight;

    const label = isPrevious
        ? "Oldingi"
        : "Keyingi";

    const isDisabled =
        Boolean(disabled) ||
        typeof onClick !== "function";

    const handleClick = () => {
        if (!isDisabled) {
            onClick();
        }
    };

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            aria-label={`${label} sahifa`}
            whileHover={
                reduceMotion || isDisabled
                    ? undefined
                    : { y: -2 }
            }
            whileTap={
                reduceMotion || isDisabled
                    ? undefined
                    : { scale: 0.97 }
            }
            transition={PAGE_TRANSITION}
            className="
                inline-flex
                h-10
                min-w-10
                shrink-0
                items-center
                justify-center
                gap-1.5

                rounded-xl
                border
                border-slate-200
                bg-white/80

                px-3

                text-xs
                font-black
                text-slate-600

                transition-colors
                duration-200

                hover:border-indigo-300
                hover:bg-indigo-50
                hover:text-indigo-700

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500/60
                focus-visible:ring-offset-2

                disabled:cursor-not-allowed
                disabled:opacity-35

                dark:border-white/[0.07]
                dark:bg-white/[0.025]
                dark:text-gray-400

                dark:hover:border-indigo-400/20
                dark:hover:bg-indigo-500/[0.07]
                dark:hover:text-indigo-200

                dark:focus-visible:ring-offset-[#0d1117]

                sm:px-4
            "
        >
            {isPrevious && (
                <Icon
                    size={16}
                    aria-hidden="true"
                />
            )}

            <span className="hidden sm:inline">
                {label}
            </span>

            {!isPrevious && (
                <Icon
                    size={16}
                    aria-hidden="true"
                />
            )}
        </motion.button>
    );
});

// =========================================================
// FCOIN HISTORY PAGINATION
//
// Existing props:
// - currentPage
// - totalPages
// - paginationPages
// - canGoPrevious
// - canGoNext
// - isLoading
// - onPageChange
// - onPrevious
// - onNext
//
// All existing callbacks are preserved.
// =========================================================

const FCoinHistoryPagination = ({
    currentPage = 1,
    totalPages = 0,
    paginationPages = [],
    canGoPrevious = false,
    canGoNext = false,
    isLoading = false,
    onPageChange,
    onPrevious,
    onNext,
}) => {
    const reduceMotion = useReducedMotion();

    // =====================================================
    // SAFE PAGINATION DATA
    // =====================================================

    const safeTotalPages = safeInteger(
        totalPages,
        0,
        0
    );

    const requestedCurrentPage = safeInteger(
        currentPage,
        1,
        1
    );

    const safeCurrentPage =
        safeTotalPages > 0
            ? Math.min(
                requestedCurrentPage,
                safeTotalPages
            )
            : 1;

    const pages = Array.isArray(paginationPages)
        ? paginationPages
        : [];

    const loading = Boolean(isLoading);

    // =====================================================
    // NAVIGATION GUARDS
    // =====================================================

    const previousDisabled =
        loading ||
        !canGoPrevious ||
        safeCurrentPage <= 1;

    const nextDisabled =
        loading ||
        !canGoNext ||
        safeCurrentPage >= safeTotalPages;

    const handlePageChange = (page) => {
        if (
            loading ||
            typeof onPageChange !== "function"
        ) {
            return;
        }

        const requestedPage = Number(page);

        if (
            !Number.isInteger(requestedPage) ||
            requestedPage < 1 ||
            requestedPage > safeTotalPages ||
            requestedPage === safeCurrentPage
        ) {
            return;
        }

        onPageChange(requestedPage);
    };

    // =====================================================
    // MOBILE PAGE PROGRESS
    // =====================================================

    const progressPercentage =
        safeTotalPages > 0
            ? Math.min(
                100,
                Math.max(
                    0,
                    (safeCurrentPage / safeTotalPages) * 100
                )
            )
            : 0;

    // =====================================================
    // NO PAGINATION
    // =====================================================

    if (safeTotalPages <= 1) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <nav
            aria-label="FCoin tranzaksiyalar sahifalari"
            aria-busy={loading}
            className="
                relative
                mt-6
                min-w-0
                overflow-hidden

                rounded-[24px]
                border
                border-slate-200/90

                bg-white/85
                p-3

                shadow-[0_15px_45px_rgba(15,23,42,0.06)]

                backdrop-blur-xl

                dark:border-white/[0.06]
                dark:bg-[#0d1117]/85
                dark:shadow-[0_15px_50px_rgba(0,0,0,0.22)]

                sm:p-4
            "
        >
            {/* Decorative top line */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-indigo-400/35
                    to-transparent
                "
            />

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-2

                    sm:gap-3
                "
            >
                {/* PREVIOUS BUTTON */}
                <NavigationButton
                    direction="previous"
                    disabled={previousDisabled}
                    onClick={onPrevious}
                    reduceMotion={reduceMotion}
                />

                {/* DESKTOP PAGE NUMBERS */}
                <div
                    className="
                        hidden
                        min-w-0
                        items-center
                        justify-center
                        gap-1.5

                        md:flex
                    "
                >
                    {pages.map((page, index) => {
                        if (typeof page === "string") {
                            return (
                                <Ellipsis
                                    key={`${page}-${index}`}
                                />
                            );
                        }

                        const pageNumber = Number(page);

                        if (
                            !Number.isInteger(pageNumber) ||
                            pageNumber < 1 ||
                            pageNumber > safeTotalPages
                        ) {
                            return null;
                        }

                        return (
                            <PageButton
                                key={pageNumber}
                                page={pageNumber}
                                currentPage={safeCurrentPage}
                                disabled={loading}
                                onClick={handlePageChange}
                                reduceMotion={reduceMotion}
                            />
                        );
                    })}
                </div>

                {/* MOBILE CURRENT PAGE */}
                <div
                    className="
                        flex
                        min-w-0
                        flex-1
                        items-center
                        justify-center

                        md:hidden
                    "
                >
                    <div
                        className="
                            min-w-0
                            max-w-full

                            rounded-xl
                            border
                            border-indigo-200

                            bg-indigo-50

                            px-3
                            py-2

                            text-center

                            dark:border-indigo-400/[0.15]
                            dark:bg-indigo-500/[0.06]

                            sm:px-4
                        "
                    >
                        <p
                            className="
                                font-mono
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.14em]

                                text-slate-500
                                dark:text-gray-400
                            "
                        >
                            Page
                        </p>

                        <p
                            className="
                                mt-0.5
                                break-all
                                font-mono
                                text-xs
                                font-black
                                tabular-nums

                                text-indigo-700
                                dark:text-indigo-200
                            "
                        >
                            {formatFullCoinNumber(safeCurrentPage)}
                            {" / "}
                            {formatFullCoinNumber(safeTotalPages)}
                        </p>
                    </div>
                </div>

                {/* NEXT BUTTON */}
                <NavigationButton
                    direction="next"
                    disabled={nextDisabled}
                    onClick={onNext}
                    reduceMotion={reduceMotion}
                />
            </div>

            {/* MOBILE PROGRESS BAR */}
            <div
                aria-hidden="true"
                className="
                    mt-3
                    h-1
                    overflow-hidden

                    rounded-full
                    bg-slate-200/80

                    dark:bg-white/[0.05]

                    md:hidden
                "
            >
                <motion.div
                    initial={false}
                    animate={{
                        width: `${progressPercentage}%`,
                    }}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : {
                                duration: 0.25,
                                ease: "easeOut",
                            }
                    }
                    className="
                        h-full

                        rounded-full

                        bg-gradient-to-r
                        from-indigo-500
                        to-cyan-400
                    "
                />
            </div>
        </nav>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(FCoinHistoryPagination);