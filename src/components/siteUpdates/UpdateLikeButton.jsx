
import React from "react";

import {
    Heart,
    Loader2,
} from "lucide-react";

// =========================================================
// FSOCIETY — UPDATE LIKE BUTTON
//
// Features:
// - Like / Unlike
// - API loading state
// - Prevent duplicate click while loading
// - Accessible button
// - Dark / Light Mode
// =========================================================

const UpdateLikeButton = ({
    update,
    loading = false,
    onLike,
}) => {
    // =====================================================
    // LIKE STATE
    // =====================================================

    const isLiked = Boolean(
        update?.is_liked
    );

    // =====================================================
    // LIKE COUNT
    // =====================================================

    const rawCount = Number(
        update?.likes_count ?? 0
    );

    const likesCount = Number.isFinite(rawCount)
        ? Math.max(0, rawCount)
        : 0;

    // =====================================================
    // CLICK HANDLER
    // =====================================================

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (
            loading ||
            update?.id == null ||
            typeof onLike !== "function"
        ) {
            return;
        }

        onLike(update.id);
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <button
            type="button"

            onClick={handleClick}

            disabled={
                loading ||
                update?.id == null
            }

            aria-label={
                isLiked
                    ? `Likeni olib tashlash. ${likesCount} ta like`
                    : `Like bosish. ${likesCount} ta like`
            }

            aria-pressed={isLiked}

            aria-busy={Boolean(loading)}

            className={`
                group/like

                relative

                inline-flex
                h-10
                min-w-[66px]
                shrink-0

                items-center
                justify-center
                gap-2

                rounded-xl
                border

                px-3

                font-mono
                text-[11px]
                font-bold

                transition-colors
                duration-150

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-pink-500

                disabled:cursor-wait
                disabled:opacity-60

                ${
                    isLiked
                        ? `
                            border-pink-400/30
                            bg-pink-500/[0.10]

                            text-pink-700

                            hover:bg-pink-500/[0.15]

                            dark:border-pink-400/30
                            dark:bg-pink-500/[0.13]
                            dark:text-pink-300
                        `
                        : `
                            border-[#dce5f0]
                            bg-white/80

                            text-slate-600

                            hover:border-pink-400/30
                            hover:bg-pink-500/[0.07]
                            hover:text-pink-700

                            dark:border-white/[0.08]
                            dark:bg-white/[0.035]
                            dark:text-gray-400

                            dark:hover:border-pink-400/25
                            dark:hover:bg-pink-500/[0.07]
                            dark:hover:text-pink-300
                        `
                }
            `}
        >
            {/* ======================================
                ICON / LOADING
            ====================================== */}

            {loading ? (
                <Loader2
                    size={15}
                    strokeWidth={2}

                    aria-hidden="true"

                    className="
                        animate-spin

                        text-pink-600

                        dark:text-pink-300

                        motion-reduce:animate-none
                    "
                />
            ) : (
                <Heart
                    size={15}
                    strokeWidth={2}

                    aria-hidden="true"

                    fill={
                        isLiked
                            ? "currentColor"
                            : "none"
                    }

                    className={`
                        transition-colors
                        duration-150

                        ${
                            isLiked
                                ? `
                                    text-pink-600
                                    dark:text-pink-300
                                `
                                : `
                                    group-hover/like:text-pink-600
                                    dark:group-hover/like:text-pink-300
                                `
                        }
                    `}
                />
            )}

            {/* ======================================
                LIKE COUNT
            ====================================== */}

            <span
                aria-live="polite"
                className="
                    min-w-[8px]
                    text-center
                    tabular-nums
                "
            >
                {likesCount}
            </span>
        </button>
    );
};

export default React.memo(UpdateLikeButton);
