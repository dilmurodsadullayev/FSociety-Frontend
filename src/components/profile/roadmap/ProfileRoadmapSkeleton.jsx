
import React, { memo } from "react";

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_ITEM_COUNT = 3;

const MAX_ITEM_COUNT = 10;

// =========================================================
// SKELETON BLOCK
//
// Shared placeholder for loading states.
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => (
    <div
        aria-hidden="true"
        className={`
            rounded-lg
            bg-slate-200

            dark:bg-white/[0.07]

            ${className}
        `}
    />
);

// =========================================================
// ROADMAP HEADER SKELETON
//
// Matches the layout of ProfileRoadmapHeader.
//
// - Icon
// - Title
// - Description
// - Counter
// - Refresh button
// - Owner-only create button
// - Four statistics
// =========================================================

const RoadmapHeaderSkeleton = ({
    isOwner = false,
}) => (
    <div
        aria-hidden="true"
        className="
            relative
            min-w-0
            overflow-hidden

            rounded-[26px]
            border
            border-slate-200

            bg-white/95
            p-5

            shadow-sm

            dark:border-white/[0.08]
            dark:bg-[#0b1018]/90

            sm:p-6
        "
    >
        {/* DECORATIVE GLOW */}

        <div
            className="
                pointer-events-none
                absolute
                -right-16
                -top-20

                h-48
                w-48

                rounded-full
                bg-indigo-500/[0.08]
                blur-3xl
            "
        />

        {/* HEADER */}

        <div
            className="
                relative
                z-10

                flex
                min-w-0
                flex-col
                gap-5

                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            {/* HEADING */}

            <div
                className="
                    flex
                    min-w-0
                    items-center
                    gap-4
                "
            >
                <SkeletonBlock
                    className="
                        h-12
                        w-12
                        shrink-0

                        rounded-2xl
                    "
                />

                <div
                    className="
                        min-w-0
                        space-y-2
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <SkeletonBlock
                            className="
                                h-7
                                w-36
                            "
                        />

                        <SkeletonBlock
                            className="
                                h-5
                                w-10
                                rounded-full
                            "
                        />
                    </div>

                    <SkeletonBlock
                        className="
                            h-3
                            w-64
                            max-w-full
                        "
                    />
                </div>
            </div>

            {/* ACTIONS */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >
                <SkeletonBlock
                    className="
                        h-10
                        w-10
                        rounded-xl
                    "
                />

                {isOwner && (
                    <SkeletonBlock
                        className="
                            h-10
                            w-40
                            rounded-xl
                        "
                    />
                )}
            </div>
        </div>

        {/* STATISTICS */}

        <div
            className="
                relative
                z-10

                mt-5
                grid
                grid-cols-2
                gap-2

                sm:grid-cols-4
            "
        >
            {Array.from(
                { length: 4 },
                (_, index) => (
                    <div
                        key={index}
                        className="
                            space-y-2
                            rounded-xl
                            border

                            border-slate-200
                            bg-slate-50

                            px-3
                            py-2.5

                            dark:border-white/[0.06]
                            dark:bg-black/15
                        "
                    >
                        <SkeletonBlock
                            className="
                                h-2.5
                                w-16
                            "
                        />

                        <SkeletonBlock
                            className="
                                h-5
                                w-9
                            "
                        />
                    </div>
                )
            )}
        </div>
    </div>
);

// =========================================================
// ROADMAP ITEM SKELETON
//
// Matches the RoadmapItem timeline layout.
//
// - Timeline node
// - Type badge
// - Date
// - Title
// - Description
// - Footer
// =========================================================

const RoadmapItemSkeleton = ({
    index = 0,
}) => (
    <div
        aria-hidden="true"
        className="
            relative
            min-w-0

            pl-12
        "
        style={{
            animationDelay: `${index * 80}ms`,
        }}
    >
        {/* TIMELINE NODE */}

        <div
            className="
                absolute
                left-0
                top-1.5

                flex
                h-8
                w-8

                items-center
                justify-center

                rounded-full

                bg-indigo-100

                ring-4
                ring-white

                dark:bg-white/[0.09]
                dark:ring-[#0b1018]
            "
        >
            <SkeletonBlock
                className="
                    h-4
                    w-4
                    rounded-full
                "
            />
        </div>

        {/* ITEM CARD */}

        <div
            className="
                min-w-0

                rounded-3xl
                border

                border-slate-200
                bg-white/95

                p-5
                shadow-sm

                dark:border-white/[0.08]
                dark:bg-[#0b1018]/80
            "
        >
            {/* TYPE AND DATE */}

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
                        h-7
                        w-24
                        rounded-full
                    "
                />

                <SkeletonBlock
                    className="
                        h-3
                        w-32
                    "
                />
            </div>

            {/* TITLE */}

            <SkeletonBlock
                className="
                    mt-4
                    h-7
                    w-2/3
                    max-w-full
                "
            />

            {/* DESCRIPTION */}

            <div
                className="
                    mt-4
                    space-y-3
                "
            >
                <SkeletonBlock
                    className="
                        h-3
                        w-full
                    "
                />

                <SkeletonBlock
                    className="
                        h-3
                        w-11/12
                    "
                />

                <SkeletonBlock
                    className="
                        h-3
                        w-3/4
                    "
                />
            </div>

            {/* FOOTER */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    gap-4

                    border-t
                    border-slate-200

                    pt-4

                    dark:border-white/[0.08]
                "
            >
                <SkeletonBlock
                    className="
                        h-3
                        w-36
                        max-w-[55%]
                    "
                />

                <SkeletonBlock
                    className="
                        h-10
                        w-24
                        rounded-xl
                    "
                />
            </div>
        </div>
    </div>
);

// =========================================================
// PROFILE ROADMAP SKELETON
//
// Props:
//
// isOwner:
//   Whether the user owns this profile.
//
// itemCount:
//   Number of timeline placeholders.
//
// Responsibilities:
//
// - Initial roadmap loading
// - Header placeholder
// - Statistics placeholders
// - Timeline loading
//
// No Redux / API dependencies.
// =========================================================

const ProfileRoadmapSkeleton = ({
    isOwner = false,
    itemCount = DEFAULT_ITEM_COUNT,
}) => {
    const count = Number.isFinite(itemCount)
        ? Math.max(
              1,
              Math.min(
                  MAX_ITEM_COUNT,
                  Math.floor(itemCount)
              )
          )
        : DEFAULT_ITEM_COUNT;

    return (
        <section
            id="roadmap"
            role="status"
            aria-label="Roadmaplar yuklanmoqda"
            aria-live="polite"
            aria-busy="true"
            className="
                min-w-0
                space-y-5
            "
        >
            {/* SCREEN READER MESSAGE */}

            <span className="sr-only">
                Yo‘l xaritasi yuklanmoqda,
                iltimos kuting.
            </span>

            {/* ANIMATED CONTENT */}

            <div
                className="
                    space-y-5

                    animate-pulse
                    motion-reduce:animate-none
                "
            >
                {/* HEADER */}

                <RoadmapHeaderSkeleton
                    isOwner={isOwner}
                />

                {/* TIMELINE */}

                <div
                    className="
                        relative
                        min-w-0
                    "
                >
                    {/* TIMELINE LINE */}

                    <div
                        aria-hidden="true"
                        className="
                            absolute
                            bottom-5
                            left-[15px]
                            top-5

                            w-px

                            bg-slate-200

                            dark:bg-white/[0.10]
                        "
                    />

                    {/* TIMELINE ITEMS */}

                    <div className="space-y-6">
                        {Array.from(
                            { length: count },
                            (_, index) => (
                                <RoadmapItemSkeleton
                                    key={index}
                                    index={index}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileRoadmapSkeleton);
