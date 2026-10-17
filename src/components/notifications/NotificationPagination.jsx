// src/components/notifications/NotificationPagination.jsx

import React, { memo } from "react";

import {
    BellOff,
    ChevronLeft,
    ChevronRight,
    Inbox,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const PAGE_SIZES = [5, 10, 20, 50];

const SKELETON_ROWS_DEFAULT = 6;

// =========================================================
// SHARED HELPERS
// =========================================================

const safeInteger = (
    value,
    fallback,
    min = 0
) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(min, Math.trunc(number))
        : fallback;
};

const formatNumber = (value) =>
    new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
    })
        .format(value)
        .replace(/,/g, " ");

// =========================================================
// PAGE NUMBERS
//
// Original pagination behavior preserved:
// - Maximum seven simple pages
// - First page
// - Current page and neighbors
// - Left/right ellipsis
// - Last page
// =========================================================

const getPageNumbers = (
    currentPage,
    totalPages
) => {
    if (totalPages <= 7) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    const pages = [1];

    const start = Math.max(
        2,
        currentPage - 1
    );

    const end = Math.min(
        totalPages - 1,
        currentPage + 1
    );

    if (start > 2) {
        pages.push("left-ellipsis");
    }

    for (
        let page = start;
        page <= end;
        page += 1
    ) {
        pages.push(page);
    }

    if (end < totalPages - 1) {
        pages.push("right-ellipsis");
    }

    pages.push(totalPages);

    return pages;
};

// =========================================================
// NOTIFICATION EMPTY STATE
//
// Named export — DO NOT REMOVE
// =========================================================

export const NotificationEmptyState = memo(
    function NotificationEmptyState({
        filter = "all",
        onShowAll,
    }) {
        const isFiltered = filter !== "all";

        const title =
            filter === "unread"
                ? "O‘qilmagan xabar yo‘q"
                : filter === "read"
                    ? "O‘qilgan xabar yo‘q"
                    : "Bildirishnomalar mavjud emas";

        return (
            <section
                aria-label="Bildirishnomalar holati"
                className="
                    min-w-0 rounded-3xl border border-dashed
                    border-slate-300 bg-white/85

                    px-5 py-14 text-center

                    shadow-[0_15px_45px_rgba(15,23,42,0.05)]

                    dark:border-white/[0.07]
                    dark:bg-[#0d121a]/80
                    dark:shadow-none

                    sm:py-16
                "
            >
                {/* EMPTY ICON */}

                <div
                    className="
                        mx-auto grid h-20 w-20
                        place-items-center rounded-3xl

                        border border-slate-200
                        bg-slate-100 text-slate-500

                        dark:border-white/[0.07]
                        dark:bg-white/[0.025]
                        dark:text-gray-500
                    "
                >
                    {isFiltered ? (
                        <Inbox
                            size={32}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />
                    ) : (
                        <BellOff
                            size={32}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />
                    )}
                </div>

                {/* TITLE */}

                <h3
                    className="
                        mt-5 text-xl font-bold
                        text-slate-900 dark:text-white
                    "
                >
                    {title}
                </h3>

                {/* DESCRIPTION */}

                <p
                    className="
                        mx-auto mt-2 max-w-md
                        text-sm font-medium leading-6

                        text-slate-600
                        dark:text-gray-400
                    "
                >
                    {isFiltered
                        ? "Bu filter bo‘yicha hozircha bildirishnoma topilmadi."
                        : "Yangi notificationlar kelganda ular shu yerda paydo bo‘ladi."}
                </p>

                {/* SHOW ALL BUTTON */}

                {isFiltered &&
                    typeof onShowAll === "function" && (
                        <button
                            type="button"
                            onClick={onShowAll}
                            className="
                                mt-6 min-h-10 rounded-xl border

                                border-indigo-200 bg-indigo-50
                                px-5 py-2.5

                                text-xs font-bold
                                text-indigo-700

                                transition-colors

                                hover:border-indigo-300
                                hover:bg-indigo-100

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500/50

                                dark:border-indigo-400/15
                                dark:bg-indigo-500/[0.07]
                                dark:text-indigo-300

                                dark:hover:border-indigo-400/30
                                dark:hover:bg-indigo-500/10
                                dark:hover:text-indigo-200
                            "
                        >
                            Hammasini ko‘rsatish
                        </button>
                    )}
            </section>
        );
    }
);

// =========================================================
// REUSABLE SKELETON BLOCK
// =========================================================

const SkeletonBlock = memo(
    function SkeletonBlock({
        className = "",
    }) {
        return (
            <div
                aria-hidden="true"
                className={`
                    animate-pulse rounded-lg
                    bg-slate-200/90

                    motion-reduce:animate-none

                    dark:bg-white/[0.07]

                    ${className}
                `}
            />
        );
    }
);

// =========================================================
// NOTIFICATION LOADING STATE
//
// Named export — DO NOT REMOVE
//
// Projects / Problems-style skeleton loading.
// Keeps the NotificationCard structure:
//
// - Sender avatar
// - Notification type icon
// - Category and unread badges
// - Notification message
// - Sender metadata
// - Coins / deadline placeholders
// - Date
// - Mark as read button
// =========================================================

export const NotificationLoadingState = memo(
    function NotificationLoadingState({
        count = SKELETON_ROWS_DEFAULT,
    }) {
        const safeCount = Math.min(
            safeInteger(
                count,
                SKELETON_ROWS_DEFAULT,
                1
            ),
            10
        );

        return (
            <div
                role="status"
                aria-label="Bildirishnomalar yuklanmoqda"
                aria-busy="true"
                className="space-y-4"
            >
                <span className="sr-only">
                    Bildirishnomalar yuklanmoqda,
                    iltimos kuting.
                </span>

                {Array.from(
                    { length: safeCount },
                    (_, index) => (
                        <div
                            key={index}
                            aria-hidden="true"
                            className="
                                relative flex min-w-0
                                flex-col gap-4

                                rounded-3xl border
                                border-slate-200/90
                                bg-white/90 p-4 shadow-sm

                                dark:border-white/[0.06]
                                dark:bg-[#0d121a]/75
                                dark:shadow-none

                                sm:flex-row sm:items-start
                                sm:p-5
                            "
                        >
                            {/* AVATAR SKELETON */}

                            <div
                                className="
                                    relative w-fit shrink-0
                                "
                            >
                                <SkeletonBlock
                                    className="
                                        !h-14 !w-14 !rounded-2xl
                                    "
                                />

                                {/* TYPE ICON */}

                                <SkeletonBlock
                                    className="
                                        absolute -bottom-1.5
                                        -right-1.5

                                        !h-8 !w-8 !rounded-xl

                                        !bg-indigo-100

                                        dark:!bg-indigo-500/[0.10]
                                    "
                                />
                            </div>

                            {/* MAIN CONTENT */}

                            <div
                                className="
                                    min-w-0 flex-1 space-y-3
                                    pt-1
                                "
                            >
                                {/* BADGES */}

                                <div
                                    className="
                                        flex flex-wrap gap-2
                                    "
                                >
                                    <SkeletonBlock
                                        className="
                                            !h-5 !w-20
                                            !rounded-full
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            !h-5 !w-14
                                            !rounded-full
                                        "
                                    />
                                </div>

                                {/* NOTIFICATION MESSAGE */}

                                <SkeletonBlock
                                    className={`
                                        !h-4 max-w-full

                                        ${
                                            index % 2 === 0
                                                ? "!w-[85%]"
                                                : "!w-[65%]"
                                        }
                                    `}
                                />

                                <SkeletonBlock
                                    className="
                                        !h-3 !w-[92%] max-w-full
                                    "
                                />

                                {/* METADATA */}

                                <div
                                    className="
                                        flex flex-wrap gap-3 pt-1
                                    "
                                >
                                    <SkeletonBlock
                                        className="
                                            !h-3 !w-24
                                        "
                                    />

                                    <SkeletonBlock
                                        className="
                                            !h-3 !w-16
                                        "
                                    />
                                </div>

                                {/* DATE */}

                                <SkeletonBlock
                                    className="
                                        !h-2.5 !w-32 max-w-full
                                    "
                                />
                            </div>

                            {/* MARK READ BUTTON */}

                            <SkeletonBlock
                                className="
                                    !h-9 !w-20 shrink-0
                                    !rounded-xl
                                "
                            />
                        </div>
                    )
                )}
            </div>
        );
    }
);

// =========================================================
// NOTIFICATION PAGINATION
//
// Default export — DO NOT REMOVE
//
// Original props preserved:
// - currentPage
// - totalPages
// - totalItems
// - perPage
// - startItem
// - endItem
// - onPageChange
// - onPerPageChange
// =========================================================

const NotificationPagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    perPage = 10,
    startItem = 0,
    endItem = 0,
    onPageChange,
    onPerPageChange,
}) => {
    // =====================================================
    // SAFE PAGINATION DATA
    // =====================================================

    const total = safeInteger(
        totalItems,
        0
    );

    const pagesCount = safeInteger(
        totalPages,
        1,
        1
    );

    const page = Math.min(
        safeInteger(currentPage, 1, 1),
        pagesCount
    );

    const pageSize = safeInteger(
        perPage,
        10,
        1
    );

    const from = Math.min(
        safeInteger(startItem, 0),
        total
    );

    const to = Math.min(
        Math.max(
            safeInteger(endItem, 0),
            from
        ),
        total
    );

    const pages = getPageNumbers(
        page,
        pagesCount
    );

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handleChange = (nextPage) => {
        if (
            typeof onPageChange !== "function"
        ) {
            return;
        }

        if (
            !Number.isInteger(nextPage) ||
            nextPage < 1 ||
            nextPage > pagesCount ||
            nextPage === page
        ) {
            return;
        }

        onPageChange(nextPage);
    };

    // =====================================================
    // PAGE SIZE CHANGE
    // =====================================================

    const handlePerPageChange = (event) => {
        const value = Number(
            event.target.value
        );

        if (
            PAGE_SIZES.includes(value) &&
            typeof onPerPageChange === "function"
        ) {
            onPerPageChange(value);
        }
    };

    // =====================================================
    // EMPTY DATA
    //
    // Keep the original behavior:
    // No pagination when no notifications exist.
    // =====================================================

    if (total === 0) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <nav
            aria-label="Bildirishnomalar sahifalari"
            className="
                mt-8 flex min-w-0 flex-col gap-4
                rounded-2xl border border-slate-200

                bg-white/90 p-4

                shadow-[0_10px_35px_rgba(15,23,42,0.045)]

                dark:border-white/[0.06]
                dark:bg-[#0d121a]/80
                dark:shadow-none

                sm:flex-row sm:items-center
                sm:justify-between
            "
        >
            {/* =========================================
                PAGINATION INFO
            ========================================== */}

            <div
                className="
                    flex min-w-0 flex-wrap
                    items-center gap-x-4 gap-y-3
                "
            >
                <p
                    className="
                        text-xs font-medium
                        text-slate-600 dark:text-gray-400
                    "
                >
                    <span
                        className="
                            font-mono font-bold tabular-nums
                            text-slate-900 dark:text-gray-200
                        "
                    >
                        {formatNumber(from)}–{formatNumber(to)}
                    </span>

                    {" / "}

                    <span
                        className="
                            font-mono font-bold tabular-nums
                            text-slate-900 dark:text-gray-200
                        "
                    >
                        {formatNumber(total)}
                    </span>
                </p>

                {/* =====================================
                    PAGE SIZE SELECTOR
                ====================================== */}

                <label
                    className="
                        flex items-center gap-2
                        text-[11px] font-semibold

                        text-slate-600
                        dark:text-gray-400
                    "
                >
                    <span>Sahifada</span>

                    <select
                        value={pageSize}
                        onChange={handlePerPageChange}
                        disabled={
                            typeof onPerPageChange !==
                            "function"
                        }
                        aria-label="
                            Bir sahifadagi bildirishnomalar soni
                        "
                        className="
                            min-h-9 rounded-lg border
                            border-slate-300

                            bg-white px-2 py-1.5

                            font-mono text-[11px]
                            font-bold text-slate-900
                            outline-none transition-colors

                            focus-visible:border-indigo-500
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500/25

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.09]
                            dark:bg-[#080c12]
                            dark:text-gray-200

                            dark:focus-visible:border-indigo-400/40
                        "
                    >
                        {PAGE_SIZES.map((size) => (
                            <option
                                key={size}
                                value={size}
                            >
                                {size}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* =========================================
                PAGINATION CONTROLS
            ========================================== */}

            <div
                className="
                    flex min-w-0 items-center
                    justify-between gap-2

                    sm:justify-end
                "
                aria-label="
                    Sahifalar bo‘yicha navigatsiya
                "
            >
                {/* =====================================
                    PREVIOUS PAGE
                ====================================== */}

                <button
                    type="button"
                    disabled={
                        page <= 1 ||
                        typeof onPageChange !== "function"
                    }
                    onClick={() =>
                        handleChange(page - 1)
                    }
                    aria-label="Oldingi sahifa"
                    className="
                        grid h-10 w-10 shrink-0
                        place-items-center rounded-xl

                        border border-slate-200
                        bg-white/80 text-slate-600

                        transition-colors

                        hover:border-indigo-300
                        hover:bg-indigo-50
                        hover:text-indigo-700

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500/50

                        disabled:cursor-not-allowed
                        disabled:opacity-35

                        dark:border-white/[0.07]
                        dark:bg-white/[0.025]
                        dark:text-gray-400

                        dark:hover:border-indigo-400/20
                        dark:hover:bg-indigo-500/[0.06]
                        dark:hover:text-indigo-300
                    "
                >
                    <ChevronLeft
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </button>

                {/* =====================================
                    DESKTOP PAGE NUMBERS
                ====================================== */}

                <div
                    className="
                        hidden min-w-0 items-center
                        gap-1.5 md:flex
                    "
                >
                    {pages.map((item, index) => {
                        // ELLIPSIS

                        if (typeof item !== "number") {
                            return (
                                <span
                                    key={`${item}-${index}`}
                                    aria-hidden="true"
                                    className="
                                        grid h-10 min-w-7
                                        place-items-center

                                        text-xs text-slate-400
                                        dark:text-gray-500
                                    "
                                >
                                    …
                                </span>
                            );
                        }

                        const active = item === page;

                        return (
                            <button
                                key={item}
                                type="button"
                                disabled={
                                    active ||
                                    typeof onPageChange !==
                                    "function"
                                }
                                onClick={() =>
                                    handleChange(item)
                                }
                                aria-current={
                                    active
                                        ? "page"
                                        : undefined
                                }
                                aria-label={`${item}-sahifa`}
                                className={`
                                    grid h-10 min-w-10
                                    place-items-center

                                    rounded-xl border px-2

                                    font-mono text-[11px]
                                    font-bold tabular-nums

                                    transition-colors

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500/50

                                    disabled:cursor-default

                                    ${
                                        active
                                            ? `
                                                border-indigo-600
                                                bg-indigo-600
                                                text-white

                                                shadow-md
                                                shadow-indigo-600/15

                                                dark:border-indigo-400/25
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

                                                dark:hover:border-indigo-400/20
                                                dark:hover:bg-indigo-500/[0.06]
                                                dark:hover:text-indigo-300
                                            `
                                    }
                                `}
                            >
                                {formatNumber(item)}
                            </button>
                        );
                    })}
                </div>

                {/* =====================================
                    MOBILE CURRENT PAGE
                ====================================== */}

                <div
                    className="
                        min-w-0 rounded-xl border
                        border-indigo-200 bg-indigo-50

                        px-3 py-2 text-center

                        font-mono text-xs font-bold
                        tabular-nums text-indigo-700

                        dark:border-indigo-400/15
                        dark:bg-indigo-500/[0.07]
                        dark:text-indigo-200

                        md:hidden
                    "
                >
                    {formatNumber(page)} / {formatNumber(pagesCount)}
                </div>

                {/* =====================================
                    NEXT PAGE
                ====================================== */}

                <button
                    type="button"
                    disabled={
                        page >= pagesCount ||
                        typeof onPageChange !== "function"
                    }
                    onClick={() =>
                        handleChange(page + 1)
                    }
                    aria-label="Keyingi sahifa"
                    className="
                        grid h-10 w-10 shrink-0
                        place-items-center rounded-xl

                        border border-slate-200
                        bg-white/80 text-slate-600

                        transition-colors

                        hover:border-indigo-300
                        hover:bg-indigo-50
                        hover:text-indigo-700

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500/50

                        disabled:cursor-not-allowed
                        disabled:opacity-35

                        dark:border-white/[0.07]
                        dark:bg-white/[0.025]
                        dark:text-gray-400

                        dark:hover:border-indigo-400/20
                        dark:hover:bg-indigo-500/[0.06]
                        dark:hover:text-indigo-300
                    "
                >
                    <ChevronRight
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </button>
            </div>
        </nav>
    );
};

export default memo(NotificationPagination);