
import React, { memo, useMemo } from "react";

import {
    Eye,
    FileText,
    Heart,
    MessageCircle,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_POSTS = [];

const STAT_TONES = {
    indigo: `
        border-indigo-300
        bg-indigo-50
        text-indigo-700

        dark:border-indigo-400/20
        dark:bg-indigo-500/10
        dark:text-indigo-300
    `,

    pink: `
        border-pink-300
        bg-pink-50
        text-pink-700

        dark:border-pink-400/20
        dark:bg-pink-500/10
        dark:text-pink-300
    `,

    cyan: `
        border-cyan-300
        bg-cyan-50
        text-cyan-700

        dark:border-cyan-400/20
        dark:bg-cyan-500/10
        dark:text-cyan-300
    `,

    emerald: `
        border-emerald-300
        bg-emerald-50
        text-emerald-700

        dark:border-emerald-400/20
        dark:bg-emerald-500/10
        dark:text-emerald-300
    `,
};

// =========================================================
// SAFE NUMBER
// =========================================================

const safeNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(0, number)
        : 0;
};

// =========================================================
// MINI STAT CARD
// =========================================================

const MiniStat = memo(function MiniStat({
    icon: Icon,
    label,
    hint,
    value,
    tone = "indigo",
}) {
    const toneClass =
        STAT_TONES[tone] || STAT_TONES.indigo;

    return (
        <div
            className="
                min-w-0
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
            <div className="flex items-center gap-4">
                {/* ICON */}

                <span
                    aria-hidden="true"
                    className={`
                        flex
                        h-12
                        w-12
                        shrink-0

                        items-center
                        justify-center

                        rounded-2xl
                        border

                        ${toneClass}
                    `}
                >
                    <Icon size={22} />
                </span>

                {/* VALUE AND DESCRIPTION */}

                <div className="min-w-0">
                    <p
                        className="
                            text-2xl
                            font-black
                            tabular-nums

                            text-slate-900
                            dark:text-white
                        "
                    >
                        {safeNumber(value).toLocaleString()}
                    </p>

                    <p
                        className="
                            truncate
                            text-xs
                            font-bold

                            uppercase
                            tracking-wider

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {label}
                    </p>

                    {hint && (
                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                font-semibold

                                text-slate-500
                                dark:text-slate-500
                            "
                        >
                            {hint}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
});

// =========================================================
// PROFILE POSTS STATS
//
// Props:
//
// posts:
//   Posts belonging to the currently loaded page.
//
// totalPosts:
//   Total number of posts reported by the backend.
//
// IMPORTANT:
//
// - Total posts: all pages.
// - Likes: current page.
// - Views: current page.
// - Comments: current page.
//
// No API calls.
// No Redux subscriptions.
// =========================================================

const ProfilePostsStats = ({
    posts = EMPTY_POSTS,
    totalPosts = 0,
}) => {
    // =====================================================
    // SAFE POSTS
    // =====================================================

    const safePosts = Array.isArray(posts)
        ? posts
        : EMPTY_POSTS;

    const safeTotal = safeNumber(totalPosts);

    // =====================================================
    // CALCULATE STATISTICS
    // =====================================================

    const stats = useMemo(() => {
        return {
            total: safeTotal,

            likes: safePosts.reduce(
                (sum, post) =>
                    sum + safeNumber(
                        post?.likes_count
                    ),
                0
            ),

            views: safePosts.reduce(
                (sum, post) =>
                    sum + safeNumber(
                        post?.views_count
                    ),
                0
            ),

            comments: safePosts.reduce(
                (sum, post) =>
                    sum + safeNumber(
                        post?.comments_count
                    ),
                0
            ),
        };
    }, [
        safePosts,
        safeTotal,
    ]);

    // =====================================================
    // EMPTY STATE
    //
    // ProfilePosts will handle the empty screen.
    // =====================================================

    if (safeTotal === 0) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Postlar statistikasi"
            className="
                grid
                min-w-0
                gap-3

                sm:grid-cols-2
                xl:grid-cols-4
            "
        >
            {/* TOTAL POSTS */}

            <MiniStat
                icon={FileText}
                label="Jami postlar"
                hint="barcha sahifalar"
                value={stats.total}
                tone="indigo"
            />

            {/* TOTAL LIKES */}

            <MiniStat
                icon={Heart}
                label="Layklar"
                hint="joriy sahifa"
                value={stats.likes}
                tone="pink"
            />

            {/* TOTAL VIEWS */}

            <MiniStat
                icon={Eye}
                label="Ko‘rishlar"
                hint="joriy sahifa"
                value={stats.views}
                tone="cyan"
            />

            {/* TOTAL COMMENTS */}

            <MiniStat
                icon={MessageCircle}
                label="Sharhlar"
                hint="joriy sahifa"
                value={stats.comments}
                tone="emerald"
            />
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfilePostsStats);
