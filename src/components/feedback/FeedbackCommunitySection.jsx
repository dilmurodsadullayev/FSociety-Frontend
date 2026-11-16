
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
//
// - Approved public feedbacks
// - Community feedback counter
// - Loading state
// - Empty state
// - Optional error / retry state
// - Pagination
// - Dark / Light Mode
// - Responsive layout
// - Winter glass panel
// - Improved text contrast
//
// Existing FeedbackCard contract preserved.
//
// No Redux.
// No direct API calls.
//
// Background is managed globally by App.jsx.
//
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
                relative
                isolate

                overflow-hidden

                rounded-2xl

                border
                border-red-200/90

                bg-red-50/[0.97]

                px-4
                py-8

                text-center

                shadow-sm

                sm:px-6

                dark:border-red-400/25
                dark:bg-[#301923]/[0.97]
                dark:shadow-none
            "
        >

            {/* ======================================
                ERROR DECORATION
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-12
                    -top-12

                    h-36
                    w-36

                    rounded-full

                    bg-red-500/[0.08]

                    blur-3xl

                    dark:bg-red-400/[0.10]
                "
            />

            <div className="relative z-10">

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

                        dark:text-red-200
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

                            shadow-sm

                            transition-colors

                            hover:bg-red-100

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-red-500

                            dark:border-red-400/30
                            dark:bg-red-400/[0.09]
                            dark:text-red-200

                            dark:shadow-none

                            dark:hover:bg-red-400/[0.16]
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
    //
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
                relative
                isolate

                mt-12

                w-full
                min-w-0

                overflow-hidden

                rounded-[24px]

                border
                border-slate-200/90

                bg-white/[0.92]

                p-4

                shadow-[0_20px_65px_rgba(15,23,42,0.075)]

                backdrop-blur-xl

                sm:mt-14
                sm:rounded-[28px]
                sm:p-6

                lg:p-7

                dark:border-white/[0.11]
                dark:bg-[#071426]/[0.93]

                dark:shadow-[0_24px_75px_rgba(0,0,0,0.25)]
            "
        >

            {/* ======================================
                BACKGROUND DECORATION
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-24
                    -top-28

                    h-64
                    w-64

                    rounded-full

                    bg-emerald-500/[0.07]

                    blur-[100px]

                    dark:bg-emerald-400/[0.10]
                "
            />

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -bottom-28
                    left-[20%]

                    h-56
                    w-56

                    rounded-full

                    bg-cyan-500/[0.06]

                    blur-[100px]

                    dark:bg-cyan-400/[0.09]
                "
            />


            {/* ======================================
                TOP ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-6
                    top-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-emerald-500/40
                    to-transparent

                    dark:via-cyan-400/35
                "
            />


            {/* ======================================
                FOREGROUND CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    min-w-0
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
                                    h-10
                                    w-10
                                    shrink-0

                                    place-items-center

                                    rounded-xl

                                    border
                                    border-emerald-400/35

                                    bg-emerald-500/[0.10]

                                    text-emerald-700

                                    shadow-sm

                                    dark:border-emerald-400/25
                                    dark:bg-emerald-400/[0.10]
                                    dark:text-emerald-300

                                    dark:shadow-none
                                "
                            >
                                <ShieldCheck
                                    size={19}
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


                        {/* DESCRIPTION */}

                        <p
                            className="
                                mt-3

                                max-w-2xl

                                text-[12px]
                                font-medium
                                leading-6

                                text-slate-600

                                sm:text-[13px]

                                dark:text-slate-300
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
                            min-h-10
                            shrink-0

                            items-center
                            justify-center
                            gap-2

                            self-start

                            rounded-full

                            border
                            border-emerald-400/30

                            bg-emerald-50/[0.95]

                            px-3.5
                            py-2

                            font-display
                            text-[11px]
                            font-bold
                            tabular-nums

                            text-emerald-800

                            shadow-sm

                            sm:self-auto

                            dark:border-emerald-400/25
                            dark:bg-[#123328]/95
                            dark:text-emerald-300

                            dark:shadow-none
                        "
                    >
                        <ShieldCheck
                            size={14}
                            aria-hidden="true"
                        />

                        {initialLoading
                            ? "Yuklanmoqda..."
                            : `${count.toLocaleString("uz-UZ")} ta`
                        }

                    </div>

                </div>


                {/* ======================================
                    HEADER DIVIDER
                ====================================== */}

                <div
                    aria-hidden="true"

                    className="
                        my-6

                        h-px
                        w-full

                        bg-gradient-to-r
                        from-slate-200
                        via-slate-300/60
                        to-transparent

                        dark:from-white/[0.12]
                        dark:via-white/[0.07]
                        dark:to-transparent

                        sm:my-7
                    "
                />


                {/* ======================================
                    FEEDBACK CONTENT
                ====================================== */}

                <div className="min-w-0">

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

                                items-stretch

                                gap-4

                                lg:grid-cols-2
                                lg:gap-5
                            "
                        >
                            {feedbacks.map(
                                (feedback, index) => (
                                    <FeedbackCard
                                        key={
                                            feedback?.id ??
                                            `community-feedback-${index}`
                                        }

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

            </div>

        </section>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackCommunitySection
);
