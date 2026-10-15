
import React from "react";

import {
    AlertTriangle,
    Loader2,
    MessageCircle,
    RefreshCw,
} from "lucide-react";

// =========================================================
// COMPONENTS
// =========================================================

import ProjectCommentCard from "./ProjectCommentCard";

// =========================================================
// HELPERS
// =========================================================

import {
    getDiscussionErrorMessage,
    normalizeProjectComments,
} from "./discussionHelpers";

// =========================================================
// FSOCIETY — DISCUSSION COMMENT LIST
//
// Responsibilities:
// - Display project comments
// - Loading state
// - Error state
// - Empty state
// - Retry
// - Edit / Delete callbacks
// - Dark / Light Mode
// - Responsive layout
//
// No direct API requests.
// No Redux hooks.
// =========================================================

// =========================================================
// LOADING STATE
// =========================================================

const CommentsLoadingState = React.memo(() => {
    return (
        <div
            role="status"
            aria-live="polite"

            className="
                flex
                w-full
                min-w-0

                flex-col
                items-center
                justify-center

                rounded-2xl
                border
                border-[#dce5f0]

                bg-white/70

                px-5
                py-12

                text-center

                sm:py-16

                dark:border-white/[0.07]
                dark:bg-white/[0.02]
            "
        >
            <div
                className="
                    grid
                    h-14
                    w-14
                    place-items-center

                    rounded-2xl
                    border
                    border-indigo-400/25

                    bg-indigo-500/[0.07]

                    dark:border-indigo-400/15
                    dark:bg-indigo-400/[0.06]
                "
            >
                <Loader2
                    size={28}
                    strokeWidth={1.8}
                    aria-hidden="true"

                    className="
                        animate-spin
                        text-indigo-600

                        dark:text-indigo-300

                        motion-reduce:animate-none
                    "
                />
            </div>

            <h3
                className="
                    mt-4
                    text-sm
                    font-black

                    text-slate-800

                    dark:text-gray-100
                "
            >
                Sharhlar yuklanmoqda
            </h3>

            <p
                className="
                    mt-1.5
                    text-xs
                    font-medium

                    text-slate-500

                    dark:text-gray-500
                "
            >
                Loyiha muhokamasi ma’lumotlari olinmoqda...
            </p>
        </div>
    );
});

// =========================================================
// ERROR STATE
// =========================================================

const CommentsErrorState = React.memo(({
    error,
    onRetry,
}) => {
    const errorMessage = getDiscussionErrorMessage(
        error,
        "Sharhlarni yuklashda xatolik yuz berdi."
    );

    const canRetry =
        typeof onRetry === "function";

    return (
        <div
            role="alert"

            className="
                w-full
                min-w-0

                rounded-2xl
                border
                border-red-200

                bg-red-50/70

                px-5
                py-9

                text-center

                sm:py-11

                dark:border-red-400/20
                dark:bg-red-500/[0.05]
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    h-14
                    w-14
                    place-items-center

                    rounded-2xl
                    border
                    border-red-300/50

                    bg-red-500/[0.08]

                    text-red-700

                    dark:border-red-400/20
                    dark:text-red-300
                "
            >
                <AlertTriangle
                    size={27}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <h3
                className="
                    mt-4
                    text-base
                    font-black

                    text-slate-900

                    dark:text-white
                "
            >
                Sharhlarni yuklab bo‘lmadi
            </h3>

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-md

                    whitespace-pre-wrap
                    break-words
                    [overflow-wrap:anywhere]

                    text-xs
                    font-medium
                    leading-6

                    text-red-700

                    dark:text-red-300
                "
            >
                {errorMessage}
            </p>

            {canRetry && (
                <button
                    type="button"

                    onClick={onRetry}

                    className="
                        mt-5

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

                        dark:border-red-400/25
                        dark:bg-red-500/[0.08]
                        dark:text-red-200

                        dark:hover:bg-red-500/[0.14]
                    "
                >
                    <RefreshCw
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                    />

                    Qayta urinish
                </button>
            )}
        </div>
    );
});

// =========================================================
// EMPTY STATE
// =========================================================

const CommentsEmptyState = React.memo(() => {
    return (
        <div
            className="
                w-full
                min-w-0

                rounded-2xl
                border
                border-dashed
                border-[#dce5f0]

                bg-white/60

                px-5
                py-12

                text-center

                sm:py-14

                dark:border-white/[0.08]
                dark:bg-white/[0.018]
            "
        >
            <div
                className="
                    mx-auto

                    grid
                    h-14
                    w-14
                    place-items-center

                    rounded-2xl
                    border
                    border-indigo-400/20

                    bg-indigo-500/[0.06]

                    text-indigo-700

                    dark:border-indigo-400/15
                    dark:bg-indigo-400/[0.05]
                    dark:text-indigo-300
                "
            >
                <MessageCircle
                    size={25}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <h3
                className="
                    mt-4

                    text-base
                    font-black

                    text-slate-900

                    dark:text-white
                "
            >
                Hozircha sharh yo‘q
            </h3>

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-md

                    text-xs
                    font-medium
                    leading-6

                    text-slate-500

                    dark:text-gray-400
                "
            >
                Loyiha bo‘yicha birinchi bo‘lib
                fikringizni bildiring.
            </p>
        </div>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const DiscussionCommentList = ({
    comments = [],

    isLoading = false,
    error = null,

    onRetry,

    currentUser = null,
    isLoggedIn = false,

    onEdit,
    onDelete,
}) => {
    // =====================================================
    // NORMALIZE DATA
    // =====================================================

    const safeComments = normalizeProjectComments(
        comments
    );

    const loading = Boolean(isLoading);

    // =====================================================
    // RENDER ERROR
    //
    // Original error > loading precedence preserved.
    // =====================================================

    if (error) {
        return (
            <section
                aria-label="Sharhlar ro‘yxati"

                className="w-full min-w-0"
            >
                <CommentsErrorState
                    error={error}
                    onRetry={onRetry}
                />
            </section>
        );
    }

    // =====================================================
    // RENDER LOADING
    // =====================================================

    if (loading) {
        return (
            <section
                aria-label="Sharhlar ro‘yxati"

                className="w-full min-w-0"
            >
                <CommentsLoadingState />
            </section>
        );
    }

    // =====================================================
    // RENDER EMPTY
    // =====================================================

    if (safeComments.length === 0) {
        return (
            <section
                aria-label="Sharhlar ro‘yxati"

                className="w-full min-w-0"
            >
                <CommentsEmptyState />
            </section>
        );
    }

    // =====================================================
    // RENDER COMMENTS
    // =====================================================

    return (
        <section
            aria-label="Sharhlar ro‘yxati"
            aria-busy={false}

            className="
                w-full
                min-w-0
            "
        >
            <div
                className="
                    flex
                    w-full
                    min-w-0

                    flex-col
                    gap-3
                "
            >
                {safeComments.map((comment, index) => (
                    <ProjectCommentCard
                        key={
                            comment?.id ??
                            `comment-${index}`
                        }

                        comment={comment}

                        currentUser={currentUser}

                        isLoggedIn={isLoggedIn}

                        onEdit={onEdit}

                        onDelete={onDelete}
                    />
                ))}
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    DiscussionCommentList
);
