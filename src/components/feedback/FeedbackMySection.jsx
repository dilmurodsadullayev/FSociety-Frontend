
import React from "react";

import {
    AnimatePresence,
} from "framer-motion";

import {
    Filter,
    Loader2,
} from "lucide-react";

import FeedbackCard from "./FeedbackCard";
import FeedbackEmptyState from "./FeedbackEmptyState";
import FeedbackPagination from "./FeedbackPagination";

import {
    FeedbackListSkeleton,
} from "./FeedbackSkeleton";

import {
    FEEDBACK_STATUS_FILTERS,
    getFeedbackStatusFilterLabel,
} from "./feedbackHelpers";

// =========================================================
// FSOCIETY — MY FEEDBACK SECTION
//
// Features:
// - Status filters
// - Light / Dark Mode
// - Responsive layout
// - Initial loading
// - Background refresh
// - Empty state
// - Feedback cards
// - Edit / Delete callbacks
// - Per-item mutation loading
// - Pagination
//
// No direct API requests.
// No Redux hooks.
// =========================================================

// =========================================================
// ACTIVE FILTER CLASSES
// =========================================================

const ACTIVE_FILTER_CLASSES = {
    all: `
        border-indigo-400/40
        bg-indigo-500/[0.10]
        text-indigo-700

        dark:border-indigo-400/25
        dark:bg-indigo-400/[0.10]
        dark:text-indigo-300
    `,

    pending: `
        border-amber-400/50
        bg-amber-500/[0.10]
        text-amber-800

        dark:border-amber-400/25
        dark:bg-amber-400/[0.10]
        dark:text-amber-300
    `,

    in_progress: `
        border-blue-400/50
        bg-blue-500/[0.10]
        text-blue-800

        dark:border-blue-400/25
        dark:bg-blue-400/[0.10]
        dark:text-blue-300
    `,

    approved: `
        border-emerald-400/50
        bg-emerald-500/[0.10]
        text-emerald-800

        dark:border-emerald-400/25
        dark:bg-emerald-400/[0.10]
        dark:text-emerald-300
    `,

    rejected: `
        border-red-400/50
        bg-red-500/[0.10]
        text-red-800

        dark:border-red-400/25
        dark:bg-red-400/[0.10]
        dark:text-red-300
    `,
};

const INACTIVE_FILTER_CLASS = `
    border-slate-200
    bg-white
    text-slate-600

    hover:border-indigo-400/40
    hover:bg-indigo-500/[0.05]
    hover:text-indigo-700

    dark:border-white/[0.09]
    dark:bg-white/[0.025]
    dark:text-gray-400

    dark:hover:border-indigo-400/20
    dark:hover:bg-white/[0.05]
    dark:hover:text-indigo-300
`;

// =========================================================
// STATUS FILTER BUTTON
// =========================================================

const StatusFilterButton = React.memo(({
    item,
    active = false,
    disabled = false,
    onChange,
}) => {
    const activeClass =
        ACTIVE_FILTER_CLASSES[item.value] ??
        ACTIVE_FILTER_CLASSES.all;

    const handleClick = () => {
        if (
            disabled ||
            active ||
            typeof onChange !== "function"
        ) {
            return;
        }

        onChange(item.value);
    };

    return (
        <button
            type="button"

            onClick={handleClick}

            disabled={disabled}

            aria-pressed={active}

            className={`
                inline-flex
                min-h-10

                shrink-0
                items-center
                justify-center

                rounded-xl
                border

                px-3
                py-2

                font-display
                text-[10px]
                font-bold
                uppercase
                tracking-[0.05em]

                transition-colors

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                disabled:cursor-not-allowed
                disabled:opacity-50

                ${
                    active
                        ? activeClass
                        : INACTIVE_FILTER_CLASS
                }
            `}
        >
            {item.label}
        </button>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const FeedbackMySection = ({
    myFeedbacks = [],
    myPagination = null,

    isMyLoading = false,
    isMyInitialLoading = false,

    activeStatus = "all",
    statusFilters = [],
    onStatusChange,

    isUpdating = false,
    updatingId = null,

    isDeleting = false,
    deletingId = null,

    onEdit,
    onDelete,
    onPageChange,
}) => {
    // =====================================================
    // NORMALIZED DATA
    // =====================================================

    const feedbacks = Array.isArray(myFeedbacks)
        ? myFeedbacks
        : [];

    const filters =
        Array.isArray(statusFilters) &&
        statusFilters.length > 0
            ? statusFilters
            : FEEDBACK_STATUS_FILTERS;

    const pagination =
        myPagination &&
        typeof myPagination === "object"
            ? myPagination
            : {};

    // =====================================================
    // LOADING STATE
    // =====================================================

    const loading = Boolean(isMyLoading);

    const initialLoading =
        Boolean(isMyInitialLoading);

    const busy =
        Boolean(isUpdating || isDeleting);

    // A stale initial-loading flag must not hide
    // feedbacks that are already available.
    const showSkeleton =
        feedbacks.length === 0 &&
        (initialLoading || loading);

    // Keep existing cards on the screen while
    // refreshing or changing pages.
    const showRefreshIndicator =
        loading &&
        feedbacks.length > 0;

    const showCards =
        feedbacks.length > 0;

    const showEmpty =
        !showSkeleton &&
        !showCards;

    // =====================================================
    // ACTIVE FILTER
    // =====================================================

    const activeStatusLabel =
        getFeedbackStatusFilterLabel(
            activeStatus
        );

    // =====================================================
    // FILTER HANDLER
    // =====================================================

    const handleStatusChange = (value) => {
        if (
            loading ||
            busy ||
            value === activeStatus ||
            typeof onStatusChange !== "function"
        ) {
            return;
        }

        onStatusChange(value);
    };

    // =====================================================
    // PER-ITEM MUTATION STATE
    // =====================================================

    const getItemState = (feedback) => {
        const feedbackId = feedback?.id;

        const cardUpdating =
            Boolean(isUpdating) &&
            updatingId != null &&
            feedbackId != null &&
            String(updatingId) ===
                String(feedbackId);

        const cardDeleting =
            Boolean(isDeleting) &&
            deletingId != null &&
            feedbackId != null &&
            String(deletingId) ===
                String(feedbackId);

        return {
            cardUpdating,
            cardDeleting,
        };
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            id="my-feedbacks"

            aria-labelledby="my-feedbacks-title"

            aria-busy={loading}

            className="
                mt-10
                w-full
                min-w-0

                sm:mt-12
            "
        >
            {/* ======================================
                SECTION HEADER
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    flex-col
                    gap-4

                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                    lg:gap-6
                "
            >
                {/* HEADER TEXT */}

                <div className="min-w-0 flex-1">
                    <h2
                        id="my-feedbacks-title"
                        className="
                            break-words

                            font-display
                            text-xl
                            font-black
                            tracking-tight

                            text-slate-900

                            sm:text-2xl

                            dark:text-white
                        "
                    >
                        Mening feedbacklarim
                    </h2>

                    <p
                        className="
                            mt-2
                            max-w-2xl

                            text-[12px]
                            font-medium
                            leading-6

                            text-slate-600

                            sm:text-[13px]

                            dark:text-gray-400
                        "
                    >
                        Faqat{" "}
                        <span
                            className="
                                font-bold
                                text-amber-700

                                dark:text-amber-300
                            "
                        >
                            Kutilmoqda
                        </span>
                        {" "}holatidagi feedbackni
                        tahrirlash yoki o‘chirish
                        mumkin. Admin ishlashni
                        boshlagach, feedback
                        bloklanadi.
                    </p>
                </div>

                {/* ==================================
                    STATUS FILTERS
                ================================== */}

                <div
                    role="group"
                    aria-label="Feedback holati bo‘yicha filter"

                    className="
                        flex
                        w-full
                        min-w-0

                        flex-wrap
                        items-center
                        gap-2

                        lg:w-auto
                        lg:justify-end
                    "
                >
                    {filters.map((item) => (
                        <StatusFilterButton
                            key={item.value}
                            item={item}

                            active={
                                activeStatus ===
                                item.value
                            }

                            disabled={
                                loading ||
                                busy ||
                                typeof onStatusChange !==
                                    "function"
                            }

                            onChange={
                                handleStatusChange
                            }
                        />
                    ))}
                </div>
            </div>

            {/* ======================================
                ACTIVE FILTER INDICATOR
            ====================================== */}

            {activeStatus !== "all" && (
                <div
                    className="
                        mt-4

                        inline-flex
                        max-w-full

                        flex-wrap
                        items-center
                        gap-2

                        rounded-xl
                        border
                        border-slate-200

                        bg-white

                        px-3
                        py-2

                        text-[11px]
                        font-medium
                        leading-5

                        text-slate-600

                        dark:border-white/[0.08]
                        dark:bg-white/[0.025]
                        dark:text-gray-400
                    "
                >
                    <Filter
                        size={14}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    <span>Filter:</span>

                    <strong
                        className="
                            min-w-0
                            break-words
                            font-bold

                            text-slate-900

                            dark:text-gray-200
                        "
                    >
                        {activeStatusLabel}
                    </strong>
                </div>
            )}

            {/* ======================================
                BACKGROUND REFRESH INDICATOR
            ====================================== */}

            {showRefreshIndicator && (
                <div
                    role="status"

                    className="
                        mt-4

                        inline-flex
                        items-center
                        gap-2

                        rounded-xl
                        border
                        border-indigo-200

                        bg-indigo-50

                        px-3
                        py-2

                        text-[11px]
                        font-semibold

                        text-indigo-700

                        dark:border-indigo-400/15
                        dark:bg-indigo-400/[0.06]
                        dark:text-indigo-300
                    "
                >
                    <Loader2
                        size={14}
                        aria-hidden="true"

                        className="
                            animate-spin
                            motion-reduce:animate-none
                        "
                    />

                    Feedbacklar yangilanmoqda...
                </div>
            )}

            {/* ======================================
                FEEDBACK CONTENT
            ====================================== */}

            <div className="mt-5 min-w-0">
                {showSkeleton ? (
                    <FeedbackListSkeleton
                        count={4}
                    />
                ) : showCards ? (
                    <div
                        className="
                            grid
                            w-full
                            min-w-0

                            grid-cols-1
                            gap-4

                            lg:grid-cols-2
                            lg:gap-5
                        "
                    >
                        <AnimatePresence
                            initial={false}
                        >
                            {feedbacks.map((
                                feedback,
                                index
                            ) => {
                                const {
                                    cardUpdating,
                                    cardDeleting,
                                } = getItemState(
                                    feedback
                                );

                                return (
                                    <FeedbackCard
                                        key={
                                            feedback?.id ??
                                            `feedback-${index}`
                                        }

                                        feedback={feedback}
                                        showStatus

                                        onEdit={onEdit}
                                        onDelete={onDelete}

                                        isUpdating={
                                            cardUpdating
                                        }

                                        isDeleting={
                                            cardDeleting
                                        }

                                        actionsDisabled={
                                            busy || loading
                                        }
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : showEmpty ? (
                    <FeedbackEmptyState
                        title="Feedback topilmadi"

                        description={
                            activeStatus === "all"
                                ? "Siz hali feedback yubormagansiz."
                                : (
                                    `${activeStatusLabel} ` +
                                    "holatidagi feedback " +
                                    "hozircha yo‘q."
                                )
                        }
                    />
                ) : null}
            </div>

            {/* ======================================
                PAGINATION
            ====================================== */}

            {!showSkeleton && (
                <FeedbackPagination
                    page={
                        pagination.page ?? 1
                    }

                    totalPages={
                        pagination.totalPages ?? 1
                    }

                    count={
                        pagination.count ?? 0
                    }

                    hasPrevious={
                        pagination.hasPrevious
                    }

                    hasNext={
                        pagination.hasNext
                    }

                    isLoading={
                        loading || busy
                    }

                    onPageChange={
                        onPageChange
                    }

                    label="Mening feedbacklarim sahifalari"
                />
            )}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackMySection
);
