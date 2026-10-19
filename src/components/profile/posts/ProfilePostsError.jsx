
import React, { memo } from "react";

import {
    AlertTriangle,
    RefreshCcw,
} from "lucide-react";

// =========================================================
// ERROR MESSAGE NORMALIZER
//
// Supports:
// - String
// - Error instance
// - DRF validation objects
// - Error arrays
//
// Prevents [object Object] from appearing in the UI.
// =========================================================

const getErrorMessage = (
    error,
    fallback = "Kutilmagan xatolik yuz berdi."
) => {
    if (typeof error === "string") {
        return error.trim() || fallback;
    }

    if (Array.isArray(error)) {
        const messages = error
            .map((item) => getErrorMessage(item, ""))
            .filter(Boolean);

        return messages.join("; ") || fallback;
    }

    if (error && typeof error === "object") {
        const responseData = error?.response?.data;

        if (responseData && responseData !== error) {
            return getErrorMessage(responseData, fallback);
        }

        for (const key of [
            "detail",
            "message",
            "non_field_errors",
            "error",
        ]) {
            if (error[key]) {
                const message = getErrorMessage(
                    error[key],
                    ""
                );

                if (message) {
                    return message;
                }
            }
        }

        const messages = Object.entries(error)
            .filter(
                ([key]) =>
                    ![
                        "response",
                        "config",
                        "request",
                        "stack",
                    ].includes(key)
            )
            .map(([key, value]) => {
                if (
                    typeof value !== "string" &&
                    !Array.isArray(value) &&
                    (
                        !value ||
                        typeof value !== "object"
                    )
                ) {
                    return "";
                }

                const message = getErrorMessage(value, "");

                return message
                    ? `${key}: ${message}`
                    : "";
            })
            .filter(Boolean);

        return messages.join("; ") || fallback;
    }

    return fallback;
};

// =========================================================
// RETRY BUTTON
// =========================================================

const RetryButton = memo(function RetryButton({
    onRetry,
    isLoading = false,
    compact = false,
}) {
    const disabled =
        isLoading ||
        typeof onRetry !== "function";

    return (
        <button
            type="button"
            onClick={onRetry}
            disabled={disabled}
            className={`
                inline-flex
                min-h-10
                shrink-0
                items-center
                justify-center
                gap-2

                rounded-xl
                border

                px-4 py-2

                text-xs
                font-black

                transition-colors

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-red-500/50

                disabled:cursor-not-allowed
                disabled:opacity-50

                ${
                    compact
                        ? `
                            border-red-400/30
                            bg-red-500/10
                            text-red-700

                            hover:bg-red-500/20

                            dark:text-red-200
                        `
                        : `
                            border-red-500/40
                            bg-red-600
                            text-white

                            hover:bg-red-500
                        `
                }
            `}
        >
            <RefreshCcw
                size={compact ? 14 : 17}
                aria-hidden="true"
                className={
                    isLoading
                        ? "animate-spin motion-reduce:animate-none"
                        : ""
                }
            />

            {isLoading
                ? "Yuklanmoqda..."
                : "Qayta urinish"}
        </button>
    );
});

// =========================================================
// FETCH ERROR — FULL STATE
//
// Shown when post list could not be loaded and
// there are no existing posts to display.
//
// - Error icon
// - Title
// - Description
// - Retry button
// =========================================================

const PostsFetchError = memo(
    function PostsFetchError({
        error,
        onRetry,
        isLoading = false,
    }) {
        const message = getErrorMessage(
            error,
            "Postlarni yuklashda xato yuz berdi."
        );

        return (
            <div
                role="alert"
                className="
                    min-w-0
                    rounded-3xl
                    border

                    border-red-300
                    bg-red-50

                    p-6
                    text-center

                    dark:border-red-500/30
                    dark:bg-red-500/10

                    sm:p-8
                "
            >
                {/* ERROR ICON */}

                <div
                    className="
                        mx-auto
                        mb-5

                        flex
                        h-20
                        w-20

                        items-center
                        justify-center

                        rounded-full
                        border

                        border-red-300
                        bg-red-100

                        text-red-700

                        dark:border-red-400/25
                        dark:bg-red-500/10
                        dark:text-red-300
                    "
                >
                    <AlertTriangle
                        size={42}
                        aria-hidden="true"
                    />
                </div>

                {/* ERROR TITLE */}

                <h3
                    className="
                        text-2xl
                        font-black

                        text-slate-900
                        dark:text-white
                    "
                >
                    Postlar yuklanmadi
                </h3>

                {/* ERROR MESSAGE */}

                <p
                    className="
                        mx-auto
                        mt-3

                        max-w-xl
                        break-words

                        text-sm
                        font-semibold
                        leading-7

                        text-red-700
                        dark:text-red-200
                    "
                >
                    {message}
                </p>

                {/* RETRY */}

                <div className="mt-6">
                    <RetryButton
                        onRetry={onRetry}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        );
    }
);

// =========================================================
// FETCH ERROR — INLINE
//
// Shown when previous posts exist but refreshing
// or fetching another page fails.
//
// Existing content remains visible.
// =========================================================

const PostsInlineFetchError = memo(
    function PostsInlineFetchError({
        error,
        onRetry,
        isLoading = false,
    }) {
        const message = getErrorMessage(
            error,
            "Postlarni yangilashda xato yuz berdi."
        );

        return (
            <div
                role="alert"
                className="
                    flex
                    min-w-0
                    flex-col
                    gap-3

                    rounded-2xl
                    border

                    border-red-300
                    bg-red-50

                    p-4

                    dark:border-red-500/20
                    dark:bg-red-500/10

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* ERROR MESSAGE */}

                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-3

                        text-sm
                        font-semibold

                        text-red-700
                        dark:text-red-300
                    "
                >
                    <AlertTriangle
                        size={18}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                    />

                    <span
                        className="
                            min-w-0
                            break-words
                            [overflow-wrap:anywhere]
                        "
                    >
                        {message}
                    </span>
                </div>

                {/* RETRY */}

                <RetryButton
                    onRetry={onRetry}
                    isLoading={isLoading}
                    compact
                />
            </div>
        );
    }
);

// =========================================================
// CREATE POST ERROR
//
// Displays errors returned by PostService.createPost().
//
// Does not control the modal or Redux.
// =========================================================

const PostsCreateError = memo(
    function PostsCreateError({ error }) {
        if (!error) {
            return null;
        }

        const message = getErrorMessage(
            error,
            "Post yaratishda xato yuz berdi."
        );

        return (
            <div
                role="alert"
                className="
                    flex
                    min-w-0
                    items-start
                    gap-2

                    rounded-2xl
                    border

                    border-red-300
                    bg-red-50

                    p-4

                    text-sm
                    font-semibold
                    text-red-700

                    dark:border-red-500/30
                    dark:bg-red-500/10
                    dark:text-red-300
                "
            >
                <AlertTriangle
                    size={17}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                />

                <span
                    className="
                        min-w-0
                        break-words
                        [overflow-wrap:anywhere]
                    "
                >
                    Post yaratishda xato: {message}
                </span>
            </div>
        );
    }
);

// =========================================================
// PROFILE POSTS ERROR
//
// Props:
//
// variant:
//   "fetch"  — failed to load posts
//   "create" — failed to create a post
//
// hasPosts:
//   true  — show compact inline fetch error
//   false — show full-screen fetch error
//
// error:
//   Error message, Error object, or DRF response.
//
// onRetry:
//   Retry callback from ProfilePosts.jsx.
//
// isLoading:
//   Disable retry during active request.
//
// No API calls or Redux subscriptions.
// =========================================================

const ProfilePostsError = ({
    variant = "fetch",
    error,
    hasPosts = false,
    onRetry,
    isLoading = false,
}) => {
    if (!error) {
        return null;
    }

    // CREATE ERROR

    if (variant === "create") {
        return (
            <PostsCreateError
                error={error}
            />
        );
    }

    // FETCH ERROR WITH EXISTING POSTS

    if (hasPosts) {
        return (
            <PostsInlineFetchError
                error={error}
                onRetry={onRetry}
                isLoading={isLoading}
            />
        );
    }

    // FULL FETCH ERROR

    return (
        <PostsFetchError
            error={error}
            onRetry={onRetry}
            isLoading={isLoading}
        />
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfilePostsError);
