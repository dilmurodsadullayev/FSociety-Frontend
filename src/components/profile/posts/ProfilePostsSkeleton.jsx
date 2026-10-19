
import React, { memo } from "react";

// =========================================================
// CONSTANTS
// =========================================================

const SKELETON_CARD_COUNT = 2;

// =========================================================
// SKELETON BLOCK
//
// Shared placeholder for loading UI.
//
// Animation is inherited from the parent container,
// preventing unnecessary individual animations.
// =========================================================

const SkeletonBlock = memo(function SkeletonBlock({
    className = "",
}) {
    return (
        <div
            aria-hidden="true"
            className={`
                rounded-xl
                bg-slate-200

                dark:bg-slate-800

                ${className}
            `}
        />
    );
});

// =========================================================
// POSTS HEADER SKELETON
//
// Matches ProfilePostsHeader:
//
// - Category label
// - Section title
// - Description
// - Search input
// - Owner-only create button
// =========================================================

const ProfilePostsHeaderSkeleton = memo(
    function ProfilePostsHeaderSkeleton({
        isOwner = false,
    }) {
        return (
            <div
                aria-hidden="true"
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

                    sm:p-5
                "
            >
                {/* DECORATIVE GLOW */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24

                        h-52
                        w-52

                        rounded-full
                        bg-indigo-500/10
                        blur-3xl
                    "
                />

                {/* CONTENT */}

                <div
                    className="
                        relative
                        z-10

                        flex
                        min-w-0
                        flex-col
                        gap-5

                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >
                    {/* TITLE AREA */}

                    <div
                        className="
                            min-w-0
                            space-y-3
                        "
                    >
                        {/* LABEL */}

                        <SkeletonBlock
                            className="
                                h-7
                                w-40
                                rounded-full
                            "
                        />

                        {/* TITLE */}

                        <SkeletonBlock
                            className="
                                h-8
                                w-52

                                max-w-full
                            "
                        />

                        {/* DESCRIPTION */}

                        <SkeletonBlock
                            className="
                                h-4
                                w-72

                                max-w-full
                            "
                        />
                    </div>

                    {/* SEARCH + CREATE */}

                    <div
                        className="
                            flex
                            w-full
                            min-w-0

                            flex-col
                            gap-3

                            sm:flex-row
                            sm:items-center

                            lg:w-auto
                        "
                    >
                        {/* SEARCH INPUT */}

                        <SkeletonBlock
                            className="
                                h-12
                                w-full
                                min-w-0

                                rounded-2xl

                                sm:flex-1

                                lg:w-64
                                lg:flex-none
                            "
                        />

                        {/* CREATE BUTTON */}

                        {isOwner && (
                            <SkeletonBlock
                                className="
                                    h-12
                                    w-full
                                    shrink-0

                                    rounded-2xl

                                    sm:w-40
                                "
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

// =========================================================
// POST CARD SKELETON
//
// Matches the existing ProfilePosts PostCard:
//
// - Post type badge
// - Date
// - Title
// - Description
// - Counters
// - Detail link
// =========================================================

const ProfilePostCardSkeleton = memo(
    function ProfilePostCardSkeleton() {
        return (
            <div
                aria-hidden="true"
                className="
                    min-w-0
                    overflow-hidden

                    rounded-3xl
                    border

                    border-slate-200
                    bg-white/95

                    p-5
                    shadow-sm

                    dark:border-white/[0.09]
                    dark:bg-[#0d1117]
                "
            >
                {/* =====================================
                    POST TYPE AND DATE
                ====================================== */}

                <div
                    className="
                        mb-4
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    <SkeletonBlock
                        className="
                            h-7
                            w-28
                            rounded-full
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-4
                            w-20
                        "
                    />
                </div>

                {/* =====================================
                    POST TITLE
                ====================================== */}

                <div className="space-y-2">
                    <SkeletonBlock
                        className="
                            h-7
                            w-3/4
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-6
                            w-1/2
                        "
                    />
                </div>

                {/* =====================================
                    POST DESCRIPTION
                ====================================== */}

                <div
                    className="
                        mt-4
                        space-y-3

                        border-l-2
                        border-slate-200

                        pl-4

                        dark:border-white/10
                    "
                >
                    <SkeletonBlock
                        className="
                            h-4
                            w-full
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-4
                            w-11/12
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-4
                            w-3/4
                        "
                    />
                </div>

                {/* =====================================
                    POST FOOTER
                ====================================== */}

                <div
                    className="
                        mt-5

                        flex
                        flex-wrap

                        items-center
                        justify-between
                        gap-4

                        border-t
                        border-slate-200

                        pt-4

                        dark:border-white/10
                    "
                >
                    {/* COUNTERS */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                        "
                    >
                        <SkeletonBlock
                            className="
                                h-5
                                w-12
                            "
                        />

                        <SkeletonBlock
                            className="
                                h-5
                                w-12
                            "
                        />

                        <SkeletonBlock
                            className="
                                h-5
                                w-12
                            "
                        />
                    </div>

                    {/* READ MORE BUTTON */}

                    <SkeletonBlock
                        className="
                            h-10
                            w-36

                            rounded-2xl
                        "
                    />
                </div>
            </div>
        );
    }
);

// =========================================================
// PROFILE POSTS SKELETON
//
// Props:
//
// isOwner:
//   Whether the profile belongs to the current user.
//
// Features:
//
// - Header skeleton
// - Two post card skeletons
// - Accessible loading announcement
// - Responsive design
// - Light / Dark Mode
// - Reduced motion support
//
// No Redux or API dependency.
// =========================================================

const ProfilePostsSkeleton = ({
    isOwner = false,
}) => {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Postlar yuklanmoqda"
            className="
                min-w-0
                space-y-5
            "
        >
            {/* SCREEN READER MESSAGE */}

            <span className="sr-only">
                Postlar yuklanmoqda, iltimos kuting.
            </span>

            {/* LOADING CONTENT */}

            <div
                className="
                    space-y-5

                    animate-pulse
                    motion-reduce:animate-none
                "
            >
                {/* HEADER */}

                <ProfilePostsHeaderSkeleton
                    isOwner={isOwner}
                />

                {/* POST CARDS */}

                <div
                    className="
                        grid
                        min-w-0
                        gap-5
                    "
                >
                    {Array.from(
                        {
                            length: SKELETON_CARD_COUNT,
                        },
                        (_, index) => (
                            <ProfilePostCardSkeleton
                                key={index}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfilePostsSkeleton);
