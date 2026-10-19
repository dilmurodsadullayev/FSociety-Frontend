
import React, { memo, useMemo } from "react";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// =========================================================
// PAGINATION ITEMS
//
// Features:
//
// - First page
// - Last page
// - Current page
// - Previous / next neighboring pages
// - Ellipsis
//
// Original pagination calculation is preserved.
// =========================================================

const buildPaginationItems = (
    totalPages,
    currentPage
) => {
    if (totalPages <= 7) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    const items = [1];

    const start = Math.max(
        2,
        currentPage - 1
    );

    const end = Math.min(
        totalPages - 1,
        currentPage + 1
    );

    if (start > 2) {
        items.push("left-ellipsis");
    }

    for (
        let page = start;
        page <= end;
        page += 1
    ) {
        items.push(page);
    }

    if (end < totalPages - 1) {
        items.push("right-ellipsis");
    }

    items.push(totalPages);

    return items;
};

// =========================================================
// PAGINATION BUTTON STYLES
// =========================================================

const NAV_BUTTON_CLASS = `
    inline-flex
    min-h-10
    w-full

    items-center
    justify-center
    gap-2

    rounded-2xl
    border

    border-slate-300
    bg-slate-50

    px-4
    py-3

    text-xs
    font-black

    text-slate-700

    transition-colors

    hover:border-indigo-400

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500/50

    disabled:cursor-not-allowed
    disabled:opacity-35

    dark:border-white/15
    dark:bg-white/[0.04]
    dark:text-slate-200

    sm:w-auto
`;

// =========================================================
// PROFILE POSTS PAGINATION
//
// Props:
//
// currentPage:
//   Currently selected page.
//
// totalPages:
//   Number of available pages.
//
// hasPreviousPage:
//   Whether previous page is available.
//
// hasNextPage:
//   Whether next page is available.
//
// isLoading:
//   Disable controls while fetching.
//
// onPageChange:
//   Callback controlled by ProfilePosts.
//
// This component does not fetch posts.
// =========================================================

const ProfilePostsPagination = ({
    currentPage = 1,
    totalPages = 1,
    hasPreviousPage = false,
    hasNextPage = false,
    isLoading = false,
    onPageChange,
}) => {
    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const paginationItems = useMemo(
        () =>
            buildPaginationItems(
                totalPages,
                currentPage
            ),
        [
            totalPages,
            currentPage,
        ]
    );

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (page) => {
        if (
            isLoading ||
            typeof onPageChange !== "function" ||
            !Number.isInteger(page) ||
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        onPageChange(page);
    };

    // =====================================================
    // HIDE PAGINATION IF ONLY ONE PAGE
    // =====================================================

    if (totalPages <= 1) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Postlar sahifalari"
            className="
                relative
                min-w-0
                overflow-hidden

                rounded-3xl
                border

                border-slate-200
                bg-white/95

                p-4
                shadow-sm

                dark:border-white/[0.09]
                dark:bg-[#0d1117]
            "
        >
            <nav
                aria-label="Postlar sahifalash navigatsiyasi"
                className="
                    relative
                    z-10

                    flex
                    flex-col

                    items-center
                    justify-between
                    gap-4

                    sm:flex-row
                "
            >
                {/* =====================================
                    PREVIOUS PAGE
                ====================================== */}

                <button
                    type="button"
                    disabled={
                        !hasPreviousPage ||
                        isLoading
                    }
                    onClick={() =>
                        handlePageChange(
                            currentPage - 1
                        )
                    }
                    className={NAV_BUTTON_CLASS}
                >
                    <ChevronLeft
                        size={17}
                        aria-hidden="true"
                    />

                    Oldingi
                </button>

                {/* =====================================
                    PAGE NUMBERS
                ====================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-wrap

                        items-center
                        justify-center
                        gap-2
                    "
                >
                    {paginationItems.map(
                        (item) => {
                            // =============================
                            // ELLIPSIS
                            // =============================

                            if (
                                typeof item === "string"
                            ) {
                                return (
                                    <span
                                        key={item}
                                        aria-hidden="true"
                                        className="
                                            flex
                                            h-10
                                            min-w-8

                                            items-center
                                            justify-center

                                            text-sm
                                            font-black

                                            text-slate-400
                                        "
                                    >
                                        ...
                                    </span>
                                );
                            }

                            // =============================
                            // PAGE BUTTON
                            // =============================

                            const isActive =
                                item === currentPage;

                            return (
                                <button
                                    key={item}
                                    type="button"
                                    aria-label={`${item}-sahifa`}
                                    aria-current={
                                        isActive
                                            ? "page"
                                            : undefined
                                    }
                                    disabled={isLoading}
                                    onClick={() =>
                                        handlePageChange(
                                            item
                                        )
                                    }
                                    className={`
                                        flex
                                        h-10
                                        min-w-10

                                        items-center
                                        justify-center

                                        rounded-xl
                                        border
                                        px-3

                                        text-xs
                                        font-black

                                        transition-colors

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-indigo-500/50

                                        disabled:cursor-not-allowed

                                        ${
                                            isActive
                                                ? `
                                                    border-indigo-400
                                                    bg-indigo-600
                                                    text-white
                                                    shadow-lg
                                                `
                                                : `
                                                    border-slate-300
                                                    bg-white

                                                    text-slate-600

                                                    hover:border-indigo-400

                                                    dark:border-white/15
                                                    dark:bg-white/[0.04]
                                                    dark:text-slate-300
                                                `
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
                    disabled={
                        !hasNextPage ||
                        isLoading
                    }
                    onClick={() =>
                        handlePageChange(
                            currentPage + 1
                        )
                    }
                    className={NAV_BUTTON_CLASS}
                >
                    Keyingi

                    <ChevronRight
                        size={17}
                        aria-hidden="true"
                    />
                </button>
            </nav>

            {/* =====================================
                CURRENT PAGE INFO
            ====================================== */}

            <p
                className="
                    relative
                    z-10

                    mt-4
                    text-center

                    text-[11px]
                    font-bold

                    text-slate-500
                    dark:text-slate-400
                "
            >
                Sahifa{" "}

                <strong
                    className="
                        text-indigo-700
                        dark:text-indigo-300
                    "
                >
                    {currentPage}
                </strong>

                {" / "}

                {totalPages}
            </p>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfilePostsPagination);
