
import React from "react";

import {
    AlertCircle,
    RefreshCcw,
    ShieldCheck,
} from "lucide-react";

import FeedbackCard from "./FeedbackCard";

import FeedbackEmptyState from "./FeedbackEmptyState";

import FeedbackPagination from "./FeedbackPagination";

import {
    FeedbackListSkeleton,
} from "./FeedbackSkeleton";

// =========================================================
// FSOCIETY — FEEDBACK COMMUNITY SECTION
//
// Responsibilities:
// - Approved public feedbacks
// - Community feedback counter
// - Loading state
// - Empty state
// - Optional error / retry state
// - Pagination
// - Dark / Light Mode
// - Responsive layout
//
// Existing FeedbackCard contract preserved.
//
// No Redux.
// No direct API calls.
// =========================================================

// =========================================================
// ERROR STATE
// =========================================================

const CommunityErrorState = ({
    error,
    onRetry,
}) => {
    const message =
        typeof error === "string" && error.trim()
            ? error.trim()
            : "Tasdiqlangan feedbacklarni yuklab bo‘lmadi.";

    return (
        <div
            role="alert"

            className="
                rounded-2xl
                border
                border-red-200

                bg-red-50

                px-4
                py-8

                text-center

                sm:px-6

                dark:border-red-400/20
                dark:bg-red-500/[0.06]
            "
        >
            <AlertCircle
                size={28}
                aria-hidden="true"

                className="
                    mx-auto
                    text-red-600

                    dark:text-red-300
                "
            />

            <h3
                className="
                    mt-3

                    text-sm
                    font-black

                    text-slate-900

                    dark:text-white
                "
            >
                Feedbacklarni yuklashda xatolik
            </h3>

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-lg

                    break-words
                    [overflow-wrap:anywhere]

                    text-xs
                    font-medium
                    leading-6

                    text-red-700

                    dark:text-red-300
                "
            >
                {message}
            </p>

            {typeof onRetry === "function" && (
                <button
                    type="button"

                    onClick={onRetry}

                    className="
                        mt-4

                        inline-flex
                        min-h-10

                        items-center
                        justify-center
                        gap-2

                        rounded-xl
                        border
                        border-red-300

                        bg-white

                        px-4
                        py-2.5

                        text-xs
                        font-bold

                        text-red-700

                        transition-colors

                        hover:bg-red-100

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-500

                        dark:border-red-400/20
                        dark:bg-red-500/[0.08]
                        dark:text-red-300

                        dark:hover:bg-red-500/[0.13]
                    "
                >
                    <RefreshCcw
                        size={15}
                        aria-hidden="true"
                    />

                    Qayta urinish
                </button>
            )}
        </div>
    );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const FeedbackCommunitySection = ({
    publicFeedbacks = [],

    publicCount = 0,

    publicPagination = null,

    isPublicLoading = false,

    isInitialLoading = false,

    error = null,

    onRetry,

    onPageChange,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const feedbacks = Array.isArray(
        publicFeedbacks
    )
        ? publicFeedbacks
        : [];

    const pagination =
        publicPagination &&
        typeof publicPagination === "object"
            ? publicPagination
            : {};

    const loading = Boolean(
        isPublicLoading
    );

    const initialLoading = Boolean(
        isInitialLoading
    );

    // =====================================================
    // PUBLIC COUNT
    // =====================================================

    const numericCount = Number(
        publicCount
    );

    const count = Number.isFinite(numericCount)
        ? Math.max(0, Math.floor(numericCount))
        : feedbacks.length;

    // =====================================================
    // ERROR STATE
    //
    // Show the error panel only when no data
    // is available.
    // =====================================================

    const showError =
        Boolean(error) &&
        feedbacks.length === 0 &&
        !loading;

    // =====================================================
    // LOADING STATE
    // =====================================================

    const showSkeleton =
        initialLoading ||
        (
            loading &&
            feedbacks.length === 0
        );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            id="community-feedbacks"

            aria-labelledby="community-feedbacks-title"

            aria-busy={loading}

            className="
                mt-12

                w-full
                min-w-0

                sm:mt-14
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
                    gap-3

                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                    sm:gap-4
                "
            >
                {/* ==================================
                    HEADER INFORMATION
                ================================== */}

                <div className="min-w-0 flex-1">
                    <div
                        className="
                            flex
                            min-w-0

                            items-center
                            gap-2.5
                        "
                    >
                        {/* ICON */}

                        <div
                            className="
                                grid
                                h-9
                                w-9
                                shrink-0

                                place-items-center

                                rounded-xl
                                border
                                border-emerald-400/25

                                bg-emerald-500/[0.07]

                                text-emerald-700

                                dark:border-emerald-400/15
                                dark:bg-emerald-400/[0.06]
                                dark:text-emerald-300
                            "
                        >
                            <ShieldCheck
                                size={18}
                                strokeWidth={1.9}
                                aria-hidden="true"
                            />
                        </div>

                        {/* TITLE */}

                        <h2
                            id="community-feedbacks-title"

                            className="
                                min-w-0

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
                            Tasdiqlangan feedbacklar
                        </h2>
                    </div>

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
                        Admin tomonidan tasdiqlangan
                        hamjamiyat feedbacklari.
                        Bu yerda boshqa foydalanuvchilar
                        yuborgan foydali fikr va
                        takliflarni ham ko‘rishingiz mumkin.
                    </p>
                </div>

                {/* ==================================
                    PUBLIC COUNT
                ================================== */}

                <div
                    aria-live="polite"

                    className="
                        inline-flex
                        min-h-9
                        shrink-0

                        items-center
                        justify-center

                        self-start

                        rounded-full
                        border
                        border-slate-200

                        bg-white

                        px-3.5
                        py-2

                        font-display
                        text-[11px]
                        font-bold
                        tabular-nums

                        text-slate-700

                        sm:self-auto

                        dark:border-white/[0.09]
                        dark:bg-white/[0.025]
                        dark:text-gray-300
                    "
                >
                    {initialLoading
                        ? "Yuklanmoqda..."
                        : `${count.toLocaleString("uz-UZ")} ta`}
                </div>
            </div>

            {/* ======================================
                FEEDBACK CONTENT
            ====================================== */}

            <div className="mt-5 min-w-0">
                {showSkeleton ? (
                    <FeedbackListSkeleton
                        count={4}
                    />
                ) : showError ? (
                    <CommunityErrorState
                        error={error}
                        onRetry={onRetry}
                    />
                ) : feedbacks.length > 0 ? (
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
                        {feedbacks.map(
                            (feedback) => (
                                <FeedbackCard
                                    key={feedback.id}

                                    feedback={feedback}

                                    showStatus={false}
                                />
                            )
                        )}
                    </div>
                ) : (
                    <FeedbackEmptyState
                        title="Hozircha tasdiqlangan feedback yo‘q"

                        description="Birinchi foydali feedbackni siz yuborishingiz mumkin."
                    />
                )}
            </div>

            {/* ======================================
                PAGINATION
            ====================================== */}

            {!showSkeleton && !showError && (
                <FeedbackPagination
                    page={
                        pagination.page ?? 1
                    }

                    totalPages={
                        pagination.totalPages ?? 1
                    }

                    count={
                        pagination.count ?? count
                    }

                    hasPrevious={
                        pagination.hasPrevious ?? false
                    }

                    hasNext={
                        pagination.hasNext ?? false
                    }

                    isLoading={loading}

                    onPageChange={onPageChange}

                    label="Tasdiqlangan feedbacklar sahifalari"
                />
            )}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackCommunitySection
);
