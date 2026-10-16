
import React, { useMemo } from "react";

import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    MoreHorizontal,
} from "lucide-react";

// =========================================================
// FSOCIETY — FEEDBACK PAGINATION
//
// Features:
// - Dark / Light Mode
// - Responsive navigation
// - Page ellipsis
// - Accessible buttons
// - Loading indicator
// - Safe page normalization
// - No duplicate page changes while loading
//
// Existing public props preserved.
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const normalizePositiveInteger = (
    value,
    fallback = 1
) => {
    const number = Number(value);

    if (
        !Number.isSafeInteger(number) ||
        number <= 0
    ) {
        return fallback;
    }

    return number;
};

const normalizeCount = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.max(0, Math.trunc(number));
};

// =========================================================
// PAGINATION ITEMS
// =========================================================

const getPaginationItems = (
    currentPage,
    totalPages
) => {
    if (totalPages <= 7) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    if (currentPage <= 4) {
        return [
            1, 2, 3, 4, 5,
            "ellipsis-right",
            totalPages,
        ];
    }

    if (currentPage >= totalPages - 3) {
        return [
            1,
            "ellipsis-left",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "ellipsis-left",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis-right",
        totalPages,
    ];
};

// =========================================================
// PAGE BUTTON
// =========================================================

const PageButton = React.memo(({
    page,
    active = false,
    disabled = false,
    onClick,
}) => {
    const handleClick = () => {
        if (
            disabled ||
            active ||
            typeof onClick !== "function"
        ) {
            return;
        }

        onClick(page);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || active}
            aria-current={
                active ? "page" : undefined
            }
            aria-label={
                active
                    ? `${page}-sahifa, joriy sahifa`
                    : `${page}-sahifaga o‘tish`
            }
            className={`
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
                text-[12px]
                font-bold
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
                            border-indigo-400/40
                            bg-indigo-500/[0.11]
                            text-indigo-700

                            dark:border-indigo-400/25
                            dark:bg-indigo-400/[0.12]
                            dark:text-indigo-300
                        `
                        : `
                            border-slate-200
                            bg-white
                            text-slate-600

                            hover:border-indigo-400/40
                            hover:bg-indigo-500/[0.06]
                            hover:text-indigo-700

                            disabled:opacity-50

                            dark:border-white/[0.09]
                            dark:bg-white/[0.035]
                            dark:text-gray-400

                            dark:hover:border-indigo-400/25
                            dark:hover:bg-indigo-400/[0.07]
                            dark:hover:text-indigo-300
                        `
                }
            `}
        >
            {page}
        </button>
    );
});

// =========================================================
// ELLIPSIS
// =========================================================

const PaginationEllipsis = React.memo(() => (
    <span
        aria-hidden="true"
        className="
            inline-flex
            h-10
            min-w-7
            shrink-0
            items-center
            justify-center

            text-slate-400

            dark:text-gray-500
        "
    >
        <MoreHorizontal size={18} />
    </span>
));

// =========================================================
// NAVIGATION BUTTON
// =========================================================

const NavigationButton = React.memo(({
    direction = "next",
    disabled = false,
    isLoading = false,
    onClick,
}) => {
    const previous =
        direction === "previous";

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
            className="
                inline-flex
                h-10
                min-w-10
                shrink-0

                items-center
                justify-center
                gap-2

                rounded-xl
                border
                border-slate-200

                bg-white

                px-3

                font-display
                text-[11px]
                font-bold

                text-slate-600

                transition-colors
                duration-150

                hover:border-indigo-400/40
                hover:bg-indigo-500/[0.06]
                hover:text-indigo-700

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:border-white/[0.09]
                dark:bg-white/[0.035]
                dark:text-gray-400

                dark:hover:border-indigo-400/25
                dark:hover:bg-indigo-400/[0.07]
                dark:hover:text-indigo-300
            "
        >
            {isLoading ? (
                <Loader2
                    size={16}
                    aria-hidden="true"
                    className="
                        animate-spin
                        motion-reduce:animate-none
                    "
                />
            ) : (
                <Icon
                    size={17}
                    aria-hidden="true"
                />
            )}

            <span className="hidden lg:inline">
                {previous ? "Oldingi" : "Keyingi"}
            </span>
        </button>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const FeedbackPagination = ({
    page = 1,
    totalPages = 1,
    count = 0,

    hasPrevious,
    hasNext,

    isLoading = false,
    onPageChange,

    label = "Feedback sahifalari",
}) => {
    // =====================================================
    // NORMALIZED VALUES
    // =====================================================

    const safeTotalPages =
        normalizePositiveInteger(
            totalPages,
            1
        );

    const safePage = Math.min(
        normalizePositiveInteger(page, 1),
        safeTotalPages
    );

    const safeCount =
        normalizeCount(count);

    const loading = Boolean(isLoading);

    // =====================================================
    // PAGINATION ITEMS
    // =====================================================

    const paginationItems = useMemo(
        () => getPaginationItems(
            safePage,
            safeTotalPages
        ),
        [safePage, safeTotalPages]
    );

    // =====================================================
    // PREVIOUS / NEXT
    // =====================================================

    const canGoPrevious =
        safePage > 1 &&
        (
            typeof hasPrevious === "boolean"
                ? hasPrevious
                : true
        );

    const canGoNext =
        safePage < safeTotalPages &&
        (
            typeof hasNext === "boolean"
                ? hasNext
                : true
        );

    const canNavigate =
        !loading &&
        typeof onPageChange === "function";

    // =====================================================
    // CHANGE PAGE
    // =====================================================

    const handlePageChange = (nextPage) => {
        if (!canNavigate) {
            return;
        }

        const normalizedPage =
            normalizePositiveInteger(
                nextPage,
                safePage
            );

        if (
            normalizedPage === safePage ||
            normalizedPage > safeTotalPages
        ) {
            return;
        }

        if (
            normalizedPage < safePage &&
            !canGoPrevious
        ) {
            return;
        }

        if (
            normalizedPage > safePage &&
            !canGoNext
        ) {
            return;
        }

        onPageChange(normalizedPage);
    };

    // =====================================================
    // HIDE SINGLE PAGE
    // =====================================================

    if (safeTotalPages <= 1) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <nav
            aria-label={label}
            aria-busy={loading}
            className="
                relative
                mt-6

                w-full
                min-w-0

                overflow-hidden

                rounded-2xl
                border
                border-slate-200

                bg-white/80

                p-3

                shadow-[0_4px_18px_rgba(15,23,42,0.025)]

                sm:p-4

                dark:border-white/[0.08]
                dark:bg-white/[0.025]
                dark:shadow-none
            "
        >
            <div
                className="
                    flex
                    min-w-0

                    flex-col
                    gap-4

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                {/* ==================================
                    PAGE INFO
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        justify-between
                        gap-3

                        lg:flex-col
                        lg:items-start
                        lg:gap-2
                    "
                >
                    <div>
                        <p
                            className="
                                font-display
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.10em]

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            Sahifa
                        </p>

                        <p
                            aria-live="polite"
                            className="
                                mt-1
                                text-[12px]
                                font-medium
                                tabular-nums

                                text-slate-600

                                dark:text-gray-400
                            "
                        >
                            <strong
                                className="
                                    font-display
                                    font-black

                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                {safePage}
                            </strong>

                            <span
                                className="
                                    mx-1.5
                                    text-slate-400

                                    dark:text-gray-600
                                "
                            >
                                /
                            </span>

                            {safeTotalPages}
                        </p>
                    </div>

                    <div
                        className="
                            inline-flex
                            shrink-0
                            items-center

                            rounded-xl
                            border
                            border-slate-200

                            bg-slate-50

                            px-3
                            py-2

                            dark:border-white/[0.08]
                            dark:bg-white/[0.035]
                        "
                    >
                        <span
                            className="
                                font-display
                                text-[10px]
                                font-bold

                                text-slate-600

                                dark:text-gray-400
                            "
                        >
                            Jami{" "}
                            <span
                                className="
                                    tabular-nums
                                    text-slate-900

                                    dark:text-gray-200
                                "
                            >
                                {safeCount.toLocaleString(
                                    "uz-UZ"
                                )}
                            </span>
                        </span>
                    </div>
                </div>

                {/* ==================================
                    MOBILE CONTROLS
                ================================== */}

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
                    <NavigationButton
                        direction="previous"
                        disabled={
                            !canNavigate ||
                            !canGoPrevious
                        }
                        onClick={() =>
                            handlePageChange(
                                safePage - 1
                            )
                        }
                    />

                    <div
                        className="
                            inline-flex
                            min-w-0
                            flex-1

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border
                            border-indigo-400/20

                            bg-indigo-500/[0.07]

                            px-3
                            py-2

                            font-display
                            text-[12px]
                            font-bold
                            tabular-nums

                            text-indigo-700

                            dark:border-indigo-400/15
                            dark:bg-indigo-400/[0.07]
                            dark:text-indigo-300
                        "
                    >
                        {loading && (
                            <Loader2
                                size={15}
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />
                        )}

                        <span>
                            {safePage} / {safeTotalPages}
                        </span>
                    </div>

                    <NavigationButton
                        direction="next"
                        disabled={
                            !canNavigate ||
                            !canGoNext
                        }
                        onClick={() =>
                            handlePageChange(
                                safePage + 1
                            )
                        }
                    />
                </div>

                {/* ==================================
                    TABLET / DESKTOP CONTROLS
                ================================== */}

                <div
                    className="
                        hidden
                        w-full
                        min-w-0

                        items-center
                        gap-2

                        sm:flex
                        lg:w-auto
                    "
                >
                    <NavigationButton
                        direction="previous"
                        disabled={
                            !canNavigate ||
                            !canGoPrevious
                        }
                        onClick={() =>
                            handlePageChange(
                                safePage - 1
                            )
                        }
                    />

                    <div
                        className="
                            flex
                            min-w-0
                            flex-1

                            items-center
                            justify-start
                            gap-1.5

                            overflow-x-auto
                            overscroll-x-contain

                            py-1

                            lg:flex-none
                        "
                    >
                        {paginationItems.map((item) => {
                            if (
                                typeof item === "string"
                            ) {
                                return (
                                    <PaginationEllipsis
                                        key={item}
                                    />
                                );
                            }

                            return (
                                <PageButton
                                    key={item}
                                    page={item}
                                    active={
                                        item === safePage
                                    }
                                    disabled={
                                        !canNavigate
                                    }
                                    onClick={
                                        handlePageChange
                                    }
                                />
                            );
                        })}
                    </div>

                    <NavigationButton
                        direction="next"
                        disabled={
                            !canNavigate ||
                            !canGoNext
                        }
                        onClick={() =>
                            handlePageChange(
                                safePage + 1
                            )
                        }
                    />
                </div>
            </div>

            {/* ==================================
                LOADING PROGRESS
            ================================== */}

            <div
                aria-hidden="true"
                className="
                    mt-3
                    h-1

                    overflow-hidden
                    rounded-full

                    bg-slate-100

                    dark:bg-white/[0.05]
                "
            >
                <div
                    className={`
                        h-full

                        bg-gradient-to-r
                        from-indigo-500
                        via-cyan-400
                        to-indigo-500

                        transition-all
                        duration-200

                        motion-reduce:animate-none

                        ${
                            loading
                                ? `
                                    w-full
                                    animate-pulse
                                    opacity-80
                                `
                                : `
                                    w-0
                                    opacity-0
                                `
                        }
                    `}
                />
            </div>

            {loading && (
                <span
                    role="status"
                    className="sr-only"
                >
                    Feedback sahifasi yuklanmoqda.
                </span>
            )}
        </nav>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackPagination
);
