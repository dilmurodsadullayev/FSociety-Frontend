
import React, { memo, useMemo } from "react";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    getUserPageNumbers,
} from "./usersHelpers";


// =========================================================
// FSOCIETY — USERS PAGINATION
//
// Features:
// - Light / Dark Mode
// - Mobile and desktop navigation
// - Dynamic page numbers
// - Ellipsis support
// - Accessible current-page indication
// - Previous / Next navigation
// - Amber active-page highlighting
//
// Existing props preserved:
// - currentPage
// - totalPages
// - hasPrevious
// - hasNext
// - onPageChange
// - onPrevious
// - onNext
// =========================================================


// =========================================================
// SHARED BUTTON STYLES
// =========================================================

const BASE_BUTTON = `
    grid
    h-10
    min-w-10

    shrink-0

    place-items-center

    rounded-xl
    border

    text-xs
    font-black
    tabular-nums

    transition-all
    duration-200

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-amber-400
    focus-visible:ring-offset-2
    focus-visible:ring-offset-white

    disabled:cursor-not-allowed
    disabled:opacity-35

    active:scale-95

    sm:h-11
    sm:min-w-11

    dark:focus-visible:ring-offset-[#080e19]
`;


// =========================================================
// NORMAL PAGE BUTTON
// =========================================================

const NORMAL_BUTTON = `
    border-slate-200

    bg-white/95
    text-indigo-700

    shadow-sm

    hover:border-indigo-300
    hover:bg-indigo-50
    hover:text-indigo-800

    dark:border-white/10

    dark:bg-[#111827]
    dark:text-indigo-300

    dark:hover:border-indigo-400/40
    dark:hover:bg-white/[0.06]
    dark:hover:text-white
`;


// =========================================================
// ACTIVE PAGE BUTTON
//
// FSOCIETY ACTIVE PAGE COLOR:
//
// #FBBF24 — Amber 400
//
// - Golden background
// - Dark readable number
// - Amber border
// - Soft golden glow
// - Visible in Light / Dark Mode
// =========================================================

const ACTIVE_BUTTON = `
    relative
    z-10

    border-[#FBBF24]

    bg-[#FBBF24]
    text-slate-950

    font-black

    shadow-md
    shadow-amber-400/30

    ring-1
    ring-amber-300/60

    hover:border-amber-200
    hover:bg-amber-300
    hover:shadow-lg
    hover:shadow-amber-400/40

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
// ARROW BUTTON
// =========================================================

const ArrowButton = memo(({
    direction,
    disabled = false,
    onClick,
}) => {
    const isPrevious = direction === "previous";

    const Icon = isPrevious
        ? ChevronLeft
        : ChevronRight;

    const label = isPrevious
        ? "Oldingi sahifa"
        : "Keyingi sahifa";

    return (
        <button
            type="button"

            aria-label={label}
            title={label}

            onClick={onClick}

            disabled={disabled}

            className={`
                ${BASE_BUTTON}
                ${NORMAL_BUTTON}
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
// PAGE NUMBER BUTTON
// =========================================================

const PageButton = memo(({
    page,
    active = false,
    onClick,
}) => {
    return (
        <button
            type="button"

            aria-label={
                active
                    ? `${page}-sahifa, joriy sahifa`
                    : `${page}-sahifaga o‘tish`
            }

            aria-current={
                active ? "page" : undefined
            }

            title={`${page}-sahifa`}

            onClick={onClick}

            className={`
                ${BASE_BUTTON}

                ${
                    active
                        ? ACTIVE_BUTTON
                        : NORMAL_BUTTON
                }
            `}
        >
            {page}
        </button>
    );
});


// =========================================================
// MAIN COMPONENT
// =========================================================

const UsersPagination = ({
    currentPage = 1,
    totalPages = 1,

    hasPrevious = false,
    hasNext = false,

    onPageChange,
    onPrevious,
    onNext,
}) => {

    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const pageNumbers = useMemo(
        () => getUserPageNumbers(
            currentPage,
            totalPages
        ),
        [
            currentPage,
            totalPages,
        ]
    );


    // =====================================================
    // SAFE NAVIGATION STATE
    // =====================================================

    const safeCurrentPage = Math.max(
        1,
        Number(currentPage) || 1
    );

    const safeTotalPages = Math.max(
        1,
        Number(totalPages) || 1
    );

    const canGoPrevious =
        Boolean(hasPrevious) &&
        safeCurrentPage > 1;

    const canGoNext =
        Boolean(hasNext) &&
        safeCurrentPage < safeTotalPages;


    // =====================================================
    // NO PAGINATION
    // =====================================================

    if (safeTotalPages <= 1) {
        return null;
    }


    // =====================================================
    // JSX
    // =====================================================

    return (
        <nav
            aria-label="Foydalanuvchilar sahifalari"

            className="
                relative

                mt-12

                flex
                flex-wrap

                items-center
                justify-center

                gap-2

                sm:mt-16
            "
        >

            {/* ======================================
                PREVIOUS PAGE
            ====================================== */}

            <ArrowButton
                direction="previous"

                disabled={!canGoPrevious}

                onClick={onPrevious}
            />


            {/* ======================================
                PAGE NUMBERS
            ====================================== */}

            <div
                className="
                    flex
                    flex-wrap

                    items-center
                    justify-center

                    gap-1.5
                "
            >

                {pageNumbers.map((page, index) => {

                    {/* ==================================
                        ELLIPSIS
                    ================================== */}

                    if (typeof page !== "number") {
                        return (
                            <span
                                key={`dots-${index}`}

                                aria-hidden="true"

                                className="
                                    grid

                                    h-10
                                    min-w-6

                                    place-items-center

                                    text-xs
                                    font-bold

                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                …
                            </span>
                        );
                    }


                    {/* ==================================
                        CURRENT PAGE
                    ================================== */}

                    const active =
                        page === safeCurrentPage;

                    return (
                        <PageButton
                            key={page}

                            page={page}

                            active={active}

                            onClick={() => {
                                if (
                                    !active &&
                                    typeof onPageChange === "function"
                                ) {
                                    onPageChange(page);
                                }
                            }}
                        />
                    );
                })}

            </div>


            {/* ======================================
                NEXT PAGE
            ====================================== */}

            <ArrowButton
                direction="next"

                disabled={!canGoNext}

                onClick={onNext}
            />

        </nav>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default memo(UsersPagination);
