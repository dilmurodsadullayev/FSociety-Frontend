
import React, { memo, useMemo } from "react";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Layers3,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

// Profile projects are displayed four per page.
// Global Projects pagination is separate.

const DEFAULT_PAGE_SIZE = 4;

const MAX_VISIBLE_PAGES = 7;

// =========================================================
// STYLES
// =========================================================

const NAV_BUTTON_CLASS = `
    inline-flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center

    rounded-xl
    border
    border-slate-200

    bg-white
    text-slate-600

    transition-all
    duration-200

    hover:border-indigo-300
    hover:bg-indigo-50
    hover:text-indigo-700

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50

    active:scale-95

    disabled:cursor-not-allowed
    disabled:opacity-40
    disabled:hover:border-slate-200
    disabled:hover:bg-white

    dark:border-white/[0.08]
    dark:bg-white/[0.035]
    dark:text-slate-400

    dark:hover:border-indigo-400/25
    dark:hover:bg-indigo-500/[0.08]
    dark:hover:text-indigo-300

    dark:disabled:hover:border-white/[0.08]
    dark:disabled:hover:bg-white/[0.035]

    motion-reduce:transform-none
`;

const PAGE_BUTTON_CLASS = `
    inline-flex
    h-10
    min-w-10
    items-center
    justify-center

    rounded-xl
    border

    px-2

    text-xs
    font-black
    tabular-nums

    transition-all
    duration-200

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50

    active:scale-95

    disabled:cursor-not-allowed

    motion-reduce:transform-none
`;

const ACTIVE_PAGE_CLASS = `
    border-indigo-500
    bg-indigo-600

    text-white

    shadow-lg
    shadow-indigo-500/20

    dark:border-indigo-400/50
    dark:bg-indigo-500
    dark:text-white
`;

const INACTIVE_PAGE_CLASS = `
    border-slate-200
    bg-white

    text-slate-600

    hover:border-indigo-300
    hover:bg-indigo-50
    hover:text-indigo-700

    dark:border-white/[0.08]
    dark:bg-white/[0.035]
    dark:text-slate-400

    dark:hover:border-indigo-400/25
    dark:hover:bg-indigo-500/[0.08]
    dark:hover:text-indigo-300
`;

// =========================================================
// SAFE POSITIVE INTEGER
// =========================================================

const toPositiveInteger = (
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

// =========================================================
// SAFE COUNT
// =========================================================

const toSafeCount = (value) => {
    const number = Number(value);

    if (
        !Number.isSafeInteger(number) ||
        number < 0
    ) {
        return 0;
    }

    return number;
};

// =========================================================
// GET PAGINATION ITEMS
//
// Example:
//
// Total pages: 15
// Current page: 8
//
// [1, "...", 7, 8, 9, "...", 15]
//
// Near start:
//
// [1, 2, 3, 4, 5, "...", 15]
//
// Near end:
//
// [1, "...", 11, 12, 13, 14, 15]
//
// Ellipsis values use unique string keys.
// =========================================================

const getPaginationItems = (
    currentPage,
    totalPages
) => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    // =====================================================
    // NEAR FIRST PAGE
    // =====================================================

    if (currentPage <= 4) {
        return [
            1,
            2,
            3,
            4,
            5,
            "right-ellipsis",
            totalPages,
        ];
    }

    // =====================================================
    // NEAR LAST PAGE
    // =====================================================

    if (currentPage >= totalPages - 3) {
        return [
            1,
            "left-ellipsis",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    // =====================================================
    // MIDDLE PAGES
    // =====================================================

    return [
        1,
        "left-ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "right-ellipsis",
        totalPages,
    ];
};

// =========================================================
// PROFILE PROJECTS PAGINATION
//
// Props:
//
// page:
//   Current page, starting from 1.
//
// totalCount:
//   Total matching projects from backend.
//
// pageSize:
//   Number of projects per page.
//   Default: 4.
//
// isLoading:
//   Redux project_isLoading.
//
// onPageChange:
//   Callback receiving the next page number.
//
// className:
//   Optional additional wrapper classes.
//
// Example:
//
// <ProfileProjectsPagination
//     page={projectPage}
//     totalCount={projectCount}
//     pageSize={4}
//     isLoading={project_isLoading}
//     onPageChange={handlePageChange}
// />
//
// Important:
//
// No API requests are performed here.
// No Redux dispatch occurs here.
//
// The parent handles:
// - Server requests
// - Skeleton loading
// - Search
// - Current page state
// =========================================================

const ProfileProjectsPagination = ({
    page = 1,
    totalCount = 0,
    pageSize = DEFAULT_PAGE_SIZE,
    isLoading = false,
    onPageChange,
    className = "",
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const safeCount = toSafeCount(
        totalCount
    );

    const safePageSize = toPositiveInteger(
        pageSize,
        DEFAULT_PAGE_SIZE
    );

    // =====================================================
    // TOTAL PAGES
    // =====================================================

    const totalPages = Math.ceil(
        safeCount / safePageSize
    );

    // =====================================================
    // CURRENT PAGE
    //
    // Clamp invalid/outdated page values.
    // =====================================================

    const currentPage = Math.min(
        Math.max(
            1,
            toPositiveInteger(page, 1)
        ),
        Math.max(1, totalPages)
    );

    // =====================================================
    // PAGE NAVIGATION PERMISSION
    // =====================================================

    const canNavigate =
        !isLoading &&
        typeof onPageChange === "function";

    const hasPreviousPage =
        currentPage > 1;

    const hasNextPage =
        currentPage < totalPages;

    // =====================================================
    // VISIBLE ITEM RANGE
    //
    // Example:
    //
    // count: 11
    // page: 2
    // pageSize: 4
    //
    // from = 5
    // to = 8
    // =====================================================

    const from = safeCount > 0
        ? (currentPage - 1) * safePageSize + 1
        : 0;

    const to = Math.min(
        currentPage * safePageSize,
        safeCount
    );

    // =====================================================
    // PAGE NUMBERS + ELLIPSIS
    // =====================================================

    const paginationItems = useMemo(
        () =>
            getPaginationItems(
                currentPage,
                totalPages
            ),
        [
            currentPage,
            totalPages,
        ]
    );

    // =====================================================
    // CHANGE PAGE
    //
    // Prevent:
    // - Requests during loading
    // - Navigation to current page
    // - Invalid page numbers
    // - Going outside valid page range
    // =====================================================

    const handlePageChange = (nextPage) => {
        if (!canNavigate) {
            return;
        }

        const parsedPage = Number(nextPage);

        if (
            !Number.isSafeInteger(parsedPage) ||
            parsedPage < 1 ||
            parsedPage > totalPages ||
            parsedPage === currentPage
        ) {
            return;
        }

        onPageChange(parsedPage);
    };

    // =====================================================
    // NAVIGATION STATE
    // =====================================================

    const previousDisabled =
        !canNavigate ||
        !hasPreviousPage;

    const nextDisabled =
        !canNavigate ||
        !hasNextPage;

    // =====================================================
    // VISIBILITY
    //
    // No pagination when the list has:
    // - 0 projects
    // - 1 page only
    // =====================================================

    if (totalPages <= 1) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <nav
            aria-label="Profil loyihalari sahifalari"
            aria-busy={isLoading}
            className={`
                relative
                mt-7
                w-full
                min-w-0

                overflow-hidden

                rounded-2xl
                border

                border-slate-200
                bg-white/90

                px-3
                py-4

                shadow-sm
                backdrop-blur-xl

                dark:border-white/[0.07]
                dark:bg-[#0d131d]/90
                dark:shadow-none

                sm:px-5

                ${className}
            `}
        >
            {/* =============================================
                DECORATIVE ACCENT
            ============================================== */}

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
                    via-indigo-500/40
                    to-transparent
                "
            />

            {/* =============================================
                PAGINATION CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    flex
                    min-w-0

                    flex-col
                    items-center
                    justify-between

                    gap-4

                    lg:flex-row
                "
            >
                {/* =========================================
                    LEFT: RESULTS INFORMATION
                ========================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        justify-center
                        gap-3

                        lg:justify-start
                    "
                >
                    {/* ICON */}

                    <div
                        aria-hidden="true"
                        className="
                            hidden
                            h-9
                            w-9
                            shrink-0

                            items-center
                            justify-center

                            rounded-xl
                            border

                            border-indigo-200
                            bg-indigo-50

                            text-indigo-600

                            dark:border-indigo-400/15
                            dark:bg-indigo-500/[0.07]
                            dark:text-indigo-300

                            sm:flex
                        "
                    >
                        <Layers3 size={16} />
                    </div>

                    {/* RESULT RANGE */}

                    <div
                        className="
                            min-w-0
                            text-center

                            lg:text-left
                        "
                    >
                        <p
                            className="
                                text-xs
                                font-bold

                                text-slate-700
                                dark:text-slate-300
                            "
                        >
                            <span
                                className="
                                    font-black
                                    tabular-nums

                                    text-indigo-700
                                    dark:text-indigo-300
                                "
                            >
                                {from}–{to}
                            </span>

                            <span
                                className="
                                    mx-1.5

                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                /
                            </span>

                            <span
                                className="
                                    font-black
                                    tabular-nums

                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {safeCount}
                            </span>

                            <span
                                className="
                                    ml-1.5

                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                loyiha
                            </span>
                        </p>

                        <p
                            className="
                                mt-0.5
                                hidden

                                text-[10px]
                                font-medium

                                text-slate-500
                                dark:text-slate-500

                                sm:block
                            "
                        >
                            Har sahifada {safePageSize} ta loyiha
                        </p>
                    </div>
                </div>

                {/* =========================================
                    RIGHT: PAGE CONTROLS
                ========================================== */}

                <div
                    className="
                        flex
                        w-full
                        min-w-0

                        items-center
                        justify-center
                        gap-1.5

                        sm:gap-2

                        lg:w-auto
                        lg:justify-end
                    "
                >
                    {/* =====================================
                        FIRST PAGE
                        Desktop / Tablet
                    ====================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            handlePageChange(1)
                        }
                        disabled={previousDisabled}
                        aria-label="Birinchi sahifa"
                        title="Birinchi sahifa"
                        className={`
                            ${NAV_BUTTON_CLASS}
                            hidden
                            sm:inline-flex
                        `}
                    >
                        <ChevronsLeft
                            size={17}
                            aria-hidden="true"
                        />
                    </button>

                    {/* =====================================
                        PREVIOUS PAGE
                    ====================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            handlePageChange(
                                currentPage - 1
                            )
                        }
                        disabled={previousDisabled}
                        aria-label="Oldingi sahifa"
                        title="Oldingi sahifa"
                        className={NAV_BUTTON_CLASS}
                    >
                        <ChevronLeft
                            size={18}
                            aria-hidden="true"
                        />
                    </button>

                    {/* =====================================
                        MOBILE PAGE INDICATOR

                        The full numeric list is hidden
                        on small screens to avoid overflow.
                    ====================================== */}

                    <div
                        aria-label={`Sahifa ${currentPage} / ${totalPages}`}
                        className="
                            flex
                            h-10
                            min-w-24

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border

                            border-indigo-200
                            bg-indigo-50

                            px-3

                            text-xs
                            font-black
                            tabular-nums

                            text-indigo-700

                            dark:border-indigo-400/20
                            dark:bg-indigo-500/[0.07]
                            dark:text-indigo-300

                            sm:hidden
                        "
                    >
                        <span>{currentPage}</span>

                        <span
                            className="
                                text-indigo-400/60
                                dark:text-indigo-300/40
                            "
                        >
                            /
                        </span>

                        <span>{totalPages}</span>
                    </div>

                    {/* =====================================
                        TABLET / DESKTOP PAGE BUTTONS
                    ====================================== */}

                    <div
                        className="
                            hidden

                            items-center
                            gap-1.5

                            sm:flex
                        "
                    >
                        {paginationItems.map(
                            (item) => {
                                // =========================
                                // ELLIPSIS
                                // =========================

                                if (
                                    typeof item === "string"
                                ) {
                                    return (
                                        <span
                                            key={item}
                                            aria-hidden="true"
                                            className="
                                                inline-flex
                                                h-10
                                                min-w-5

                                                items-center
                                                justify-center

                                                text-sm
                                                font-black

                                                text-slate-400
                                                dark:text-slate-600
                                            "
                                        >
                                            …
                                        </span>
                                    );
                                }

                                // =========================
                                // NUMBERED PAGE
                                // =========================

                                const isActive =
                                    item === currentPage;

                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() =>
                                            handlePageChange(
                                                item
                                            )
                                        }
                                        disabled={
                                            !canNavigate ||
                                            isActive
                                        }
                                        aria-label={`${item}-sahifa`}
                                        aria-current={
                                            isActive
                                                ? "page"
                                                : undefined
                                        }
                                        title={`${item}-sahifa`}
                                        className={`
                                            ${PAGE_BUTTON_CLASS}

                                            ${
                                                isActive
                                                    ? ACTIVE_PAGE_CLASS
                                                    : INACTIVE_PAGE_CLASS
                                            }
                                        `}
                                    >
                                        {item}
                                    </button>
                                );
                            }
                        )}
                    </div>

                    {/* =====================================
                        NEXT PAGE
                    ====================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            handlePageChange(
                                currentPage + 1
                            )
                        }
                        disabled={nextDisabled}
                        aria-label="Keyingi sahifa"
                        title="Keyingi sahifa"
                        className={NAV_BUTTON_CLASS}
                    >
                        <ChevronRight
                            size={18}
                            aria-hidden="true"
                        />
                    </button>

                    {/* =====================================
                        LAST PAGE
                        Desktop / Tablet
                    ====================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            handlePageChange(
                                totalPages
                            )
                        }
                        disabled={nextDisabled}
                        aria-label="Oxirgi sahifa"
                        title="Oxirgi sahifa"
                        className={`
                            ${NAV_BUTTON_CLASS}
                            hidden
                            sm:inline-flex
                        `}
                    >
                        <ChevronsRight
                            size={17}
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </div>

            {/* =============================================
                SCREEN READER STATUS

                Announce current page and total count.
            ============================================== */}

            <p className="sr-only">
                {`Jami ${safeCount} ta loyiha. `}
                {`Hozir ${currentPage}-sahifa, `}
                {`jami ${totalPages} ta sahifa.`}
            </p>
        </nav>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectsPagination);
