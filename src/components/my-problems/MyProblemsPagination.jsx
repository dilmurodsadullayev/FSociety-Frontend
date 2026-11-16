
// src/components/my-problems/MyProblemsPagination.jsx

import React, { memo, useMemo } from "react";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Loader2,
    MoreHorizontal,
} from "lucide-react";

// =========================================================
// FSOCIETY — MY PROBLEMS PAGINATION
// =========================================================
//
// Existing props:
//
// - currentPage
// - totalPages
// - items
// - onPageChange(page)
// - isLoading
// - className
//
// Features:
//
// - Light / Dark Mode
// - Responsive 320px+
// - First / Previous / Next / Last
// - Dynamic page numbers
// - Ellipsis support
// - Loading state
// - Duplicate navigation prevention
// - Accessibility
// - FSociety developer style
// - Amber active page
// - Glassmorphism navigation panel
//
// Active page color:
// #FBBF24 — Amber 400
//
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const getSafeInteger = (
    value,
    fallback = 0
) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.max(0, Math.trunc(number));
};

// =========================================================
// NORMALIZE PAGE
// =========================================================

const normalizePage = (
    value,
    totalPages
) => {
    const number = getSafeInteger(value, 1);

    return Math.max(
        1,
        Math.min(number, totalPages)
    );
};

// =========================================================
// FALLBACK PAGE ITEMS
//
// - First page
// - Last page
// - Current page
// - Previous / Next neighbors
// - Ellipsis
// =========================================================

const getFallbackItems = (
    currentPage,
    totalPages
) => {
    if (totalPages <= 7) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    const visiblePages = new Set([
        1,
        totalPages,
        currentPage - 1,
        currentPage,
        currentPage + 1,
    ]);

    if (currentPage <= 3) {
        [2, 3, 4].forEach((page) => {
            visiblePages.add(page);
        });
    }

    if (currentPage >= totalPages - 2) {
        [
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
        ].forEach((page) => {
            visiblePages.add(page);
        });
    }

    const pages = [...visiblePages]
        .filter(
            (page) =>
                page >= 1 &&
                page <= totalPages
        )
        .sort((a, b) => a - b);

    const result = [];

    pages.forEach((page, index) => {
        const previous = pages[index - 1];

        if (
            index > 0 &&
            page - previous > 1
        ) {
            if (page - previous === 2) {
                result.push(previous + 1);
            } else {
                result.push(
                    `ellipsis-${index}`
                );
            }
        }

        result.push(page);
    });

    return result;
};

// =========================================================
// SHARED BUTTON STYLES
// =========================================================

const BUTTON_BASE = [
    "inline-flex",
    "h-10",
    "min-w-10",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-xl",
    "border",
    "font-mono",
    "text-xs",
    "font-bold",
    "tabular-nums",
    "transition-all",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-amber-400/70",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-white",
    "disabled:cursor-not-allowed",
    "disabled:opacity-40",
    "motion-reduce:transition-none",
    "dark:focus-visible:ring-offset-[#0b1220]",
].join(" ");

// =========================================================
// NORMAL BUTTON
//
// Inactive page numbers and navigation controls.
// =========================================================

const NORMAL_BUTTON = [
    BUTTON_BASE,

    "border-slate-200/90",
    "bg-white/75",
    "text-slate-600",

    "shadow-[0_2px_8px_rgba(15,23,42,0.035)]",

    "hover:-translate-y-0.5",
    "hover:border-indigo-300",
    "hover:bg-indigo-50",
    "hover:text-indigo-700",

    "active:translate-y-0",

    "dark:border-white/[0.09]",
    "dark:bg-white/[0.035]",
    "dark:text-slate-300",

    "dark:hover:border-indigo-400/30",
    "dark:hover:bg-indigo-400/10",
    "dark:hover:text-indigo-200",
].join(" ");

// =========================================================
// ACTIVE BUTTON
//
// Yellow background, dark text, amber glow.
//
// Inline style is also applied to protect the active
// color from conflicting CSS utility classes.
// =========================================================

const ACTIVE_BUTTON = [
    BUTTON_BASE,

    "relative",
    "z-10",

    "!border-[#FBBF24]",
    "!bg-[#FBBF24]",
    "!text-slate-950",

    "font-black",

    "shadow-[0_5px_18px_rgba(251,191,36,0.25)]",

    "ring-1",
    "ring-amber-300/60",

    "dark:!border-[#FBBF24]",
    "dark:!bg-[#FBBF24]",
    "dark:!text-slate-950",

    "dark:shadow-[0_0_22px_rgba(251,191,36,0.24)]",
].join(" ");

// =========================================================
// ACTIVE BUTTON INLINE STYLE
// =========================================================

const ACTIVE_BUTTON_STYLE = {
    backgroundColor: "#FBBF24",
    borderColor: "#FBBF24",
    color: "#020617",
    opacity: 1,
    boxShadow: "0 5px 18px rgba(251, 191, 36, 0.25)",
};

// =========================================================
// NAVIGATION ICON BUTTON
// =========================================================

const NavigationButton = ({
    type,
    label,
    onClick,
    disabled,
    children,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            aria-label={label}
            className={`
                ${NORMAL_BUTTON}

                h-10
                w-10

                sm:h-10
                sm:w-10
            `}
        >
            {children}
        </button>
    );
};

// =========================================================
// COMPONENT
// =========================================================

function MyProblemsPagination({
    currentPage = 1,
    totalPages = 0,
    items = [],
    onPageChange,
    isLoading = false,
    className = "",
}) {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const safeTotalPages = getSafeInteger(
        totalPages
    );

    const safeCurrentPage =
        safeTotalPages > 0
            ? normalizePage(
                currentPage,
                safeTotalPages
            )
            : 1;

    const canNavigate =
        typeof onPageChange === "function" &&
        !isLoading;

    const hasPrevious =
        safeCurrentPage > 1;

    const hasNext =
        safeCurrentPage < safeTotalPages;

    // =====================================================
    // PAGE ITEMS
    // =====================================================

    const pageItems = useMemo(() => {
        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return getFallbackItems(
                safeCurrentPage,
                safeTotalPages
            );
        }

        return items;
    }, [
        items,
        safeCurrentPage,
        safeTotalPages,
    ]);

    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleNavigate = (targetPage) => {
        if (
            !canNavigate ||
            safeTotalPages <= 1
        ) {
            return;
        }

        const nextPage = normalizePage(
            targetPage,
            safeTotalPages
        );

        if (
            nextPage === safeCurrentPage
        ) {
            return;
        }

        onPageChange(nextPage);
    };

    // =====================================================
    // HIDE SINGLE PAGE
    // =====================================================

    if (safeTotalPages <= 1) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <nav
            aria-label="Muammolar sahifalari"
            aria-busy={isLoading}
            className={`
                relative

                mt-8

                w-full
                min-w-0
                max-w-full

                overflow-hidden

                rounded-2xl
                border

                border-slate-200/90
                bg-white/[0.88]

                px-3
                py-4

                shadow-[0_12px_40px_rgba(15,23,42,0.065)]

                backdrop-blur-2xl

                dark:border-white/[0.085]
                dark:bg-[#0b1220]/[0.88]

                dark:shadow-[0_18px_55px_rgba(0,0,0,0.30)]

                sm:rounded-3xl
                sm:px-5
                sm:py-5

                ${className}
            `}
        >
            {/* ==========================================
                BACKGROUND DETAIL

                Subtle internal light.
                Does not cover pagination controls.
            =========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-0
                    z-0

                    bg-gradient-to-br

                    from-indigo-50/40
                    via-transparent
                    to-cyan-50/25

                    dark:from-indigo-400/[0.035]
                    dark:via-transparent
                    dark:to-cyan-400/[0.025]
                "
            />

            {/* ==========================================
                TOP ACCENT
            =========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-x-6
                    top-0

                    z-10

                    h-px

                    bg-gradient-to-r

                    from-transparent
                    via-indigo-400/50
                    to-transparent

                    dark:via-indigo-400/35
                "
            />

            {/* ==========================================
                HEADER
            =========================================== */}

            <div
                className="
                    relative
                    z-10

                    mb-4

                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    justify-between

                    gap-3
                "
            >
                {/* LEFT — TITLE */}

                <div className="min-w-0">
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        {/* STATUS INDICATOR */}

                        <span
                            aria-hidden="true"
                            className="
                                relative

                                h-2
                                w-2

                                shrink-0

                                rounded-full

                                bg-indigo-500

                                shadow-[0_0_10px_rgba(99,102,241,0.45)]

                                dark:bg-indigo-400
                            "
                        />

                        <p
                            className="
                                truncate

                                font-mono
                                text-[9px]
                                font-bold
                                uppercase

                                tracking-[0.14em]

                                text-slate-400

                                dark:text-slate-500
                            "
                        >
                            FSOCIETY / NAVIGATION
                        </p>
                    </div>

                    <p
                        className="
                            mt-1.5

                            text-[12px]
                            font-bold

                            text-slate-800

                            dark:text-slate-100

                            sm:text-[13px]
                        "
                    >
                        Sahifalar bo‘yicha navigatsiya
                    </p>
                </div>

                {/* RIGHT — PAGE STATUS */}

                <div
                    className="
                        inline-flex

                        min-h-8

                        shrink-0

                        items-center
                        gap-2

                        rounded-xl

                        border
                        border-slate-200/90

                        bg-white/75

                        px-3
                        py-1.5

                        dark:border-white/[0.08]
                        dark:bg-white/[0.035]
                    "
                >
                    <span
                        className="
                            font-mono
                            text-[9px]
                            font-semibold
                            uppercase

                            tracking-wider

                            text-slate-400

                            dark:text-slate-500
                        "
                    >
                        PAGE
                    </span>

                    <span
                        className="
                            font-mono
                            text-xs
                            font-black
                            tabular-nums

                            text-slate-900

                            dark:text-slate-100
                        "
                    >
                        {safeCurrentPage}
                    </span>

                    <span
                        aria-hidden="true"
                        className="
                            text-slate-300
                            dark:text-slate-600
                        "
                    >
                        /
                    </span>

                    <span
                        className="
                            font-mono
                            text-xs
                            font-bold
                            tabular-nums

                            text-slate-500

                            dark:text-slate-400
                        "
                    >
                        {safeTotalPages}
                    </span>
                </div>
            </div>

            {/* ==========================================
                DIVIDER
            =========================================== */}

            <div
                aria-hidden="true"
                className="
                    relative
                    z-10

                    mb-4

                    h-px

                    bg-gradient-to-r

                    from-transparent
                    via-slate-200
                    to-transparent

                    dark:via-white/[0.07]
                "
            />

            {/* ==========================================
                CONTROLS
            =========================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0

                    items-center
                    justify-between

                    gap-1.5

                    sm:justify-center
                    sm:gap-2
                "
            >
                {/* ======================================
                    FIRST PAGE
                ======================================= */}

                <NavigationButton
                    label="Birinchi sahifa"
                    onClick={() =>
                        handleNavigate(1)
                    }
                    disabled={
                        !canNavigate ||
                        !hasPrevious
                    }
                >
                    <ChevronsLeft
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </NavigationButton>

                {/* ======================================
                    PREVIOUS PAGE
                ======================================= */}

                <NavigationButton
                    label="Oldingi sahifa"
                    onClick={() =>
                        handleNavigate(
                            safeCurrentPage - 1
                        )
                    }
                    disabled={
                        !canNavigate ||
                        !hasPrevious
                    }
                >
                    <ChevronLeft
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </NavigationButton>

                {/* ======================================
                    PAGE NUMBERS
                ======================================= */}

                <div
                    className="
                        flex

                        min-w-0

                        flex-1
                        items-center
                        justify-center

                        gap-1

                        sm:flex-none
                        sm:gap-1.5
                    "
                >
                    {pageItems.map((item, index) => {
                        const numericPage = Number(item);

                        const isPageNumber =
                            item !== null &&
                            item !== undefined &&
                            item !== "" &&
                            Number.isInteger(numericPage) &&
                            numericPage >= 1 &&
                            numericPage <= safeTotalPages;

                        // =================================
                        // ELLIPSIS
                        // =================================

                        if (!isPageNumber) {
                            return (
                                <span
                                    key={`dots-${index}`}
                                    aria-hidden="true"
                                    className="
                                        hidden

                                        h-10
                                        w-7

                                        shrink-0

                                        items-center
                                        justify-center

                                        text-slate-400

                                        dark:text-slate-500

                                        sm:inline-flex
                                    "
                                >
                                    <MoreHorizontal
                                        size={17}
                                    />
                                </span>
                            );
                        }

                        const page = numericPage;

                        const isActive =
                            page === safeCurrentPage;

                        // =================================
                        // PAGE BUTTON
                        // =================================

                        return (
                            <button
                                key={`page-${page}-${index}`}
                                type="button"
                                onClick={() =>
                                    handleNavigate(page)
                                }
                                disabled={
                                    !canNavigate ||
                                    isActive
                                }
                                style={
                                    isActive
                                        ? ACTIVE_BUTTON_STYLE
                                        : undefined
                                }
                                aria-label={`${page}-sahifa`}
                                aria-current={
                                    isActive
                                        ? "page"
                                        : undefined
                                }
                                className={`
                                    ${
                                        isActive
                                            ? ACTIVE_BUTTON
                                            : NORMAL_BUTTON
                                    }

                                    ${
                                        isActive
                                            ? "inline-flex"
                                            : "hidden sm:inline-flex"
                                    }

                                    min-w-10

                                    sm:min-w-10
                                `}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* ======================================
                    NEXT PAGE
                ======================================= */}

                <NavigationButton
                    label="Keyingi sahifa"
                    onClick={() =>
                        handleNavigate(
                            safeCurrentPage + 1
                        )
                    }
                    disabled={
                        !canNavigate ||
                        !hasNext
                    }
                >
                    <ChevronRight
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </NavigationButton>

                {/* ======================================
                    LAST PAGE
                ======================================= */}

                <NavigationButton
                    label="Oxirgi sahifa"
                    onClick={() =>
                        handleNavigate(
                            safeTotalPages
                        )
                    }
                    disabled={
                        !canNavigate ||
                        !hasNext
                    }
                >
                    <ChevronsRight
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </NavigationButton>
            </div>

            {/* ==========================================
                MOBILE PAGE INDICATOR
            =========================================== */}

            <div
                className="
                    relative
                    z-10

                    mt-4

                    flex
                    items-center
                    justify-center

                    gap-2

                    sm:hidden
                "
            >
                <span
                    className="
                        font-mono
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wider

                        text-slate-400

                        dark:text-slate-500
                    "
                >
                    Current page
                </span>

                <span
                    className="
                        inline-flex

                        min-w-8
                        h-7

                        items-center
                        justify-center

                        rounded-lg

                        bg-[#FBBF24]

                        px-2

                        font-mono
                        text-[11px]
                        font-black
                        tabular-nums

                        text-slate-950

                        shadow-[0_3px_12px_rgba(251,191,36,0.22)]
                    "
                >
                    {safeCurrentPage}
                </span>

                <span
                    className="
                        font-mono
                        text-[10px]
                        font-semibold

                        text-slate-400

                        dark:text-slate-500
                    "
                >
                    OF {safeTotalPages}
                </span>
            </div>

            {/* ==========================================
                LOADING INDICATOR
            =========================================== */}

            {isLoading && (
                <div
                    role="status"
                    aria-live="polite"
                    className="
                        relative
                        z-10

                        mt-4

                        flex
                        items-center
                        justify-center

                        gap-2

                        border-t
                        border-slate-200/70

                        pt-3

                        text-[10px]
                        font-semibold

                        text-indigo-600

                        dark:border-white/[0.06]
                        dark:text-indigo-300
                    "
                >
                    <Loader2
                        size={13}
                        className="
                            animate-spin

                            motion-reduce:animate-none
                        "
                        aria-hidden="true"
                    />

                    Sahifalar yuklanmoqda...
                </div>
            )}

            {/* ==========================================
                BOTTOM ACCENT
            =========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-x-8
                    bottom-0

                    h-px

                    bg-gradient-to-r

                    from-transparent
                    via-slate-300/50
                    to-transparent

                    dark:via-white/[0.06]
                "
            />
        </nav>
    );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(MyProblemsPagination);
