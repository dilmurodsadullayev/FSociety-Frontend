
import React, { memo } from "react";

import {
    FolderKanban,
} from "lucide-react";

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_SKELETON_COUNT = 4;

const MAX_SKELETON_COUNT = 12;

// =========================================================
// SKELETON BASE CLASS
// =========================================================

const SKELETON_CLASS = `
    animate-pulse

    rounded-lg

    bg-slate-200/90

    dark:bg-white/[0.075]

    motion-reduce:animate-none
`;

// =========================================================
// SAFE SKELETON COUNT
// =========================================================

const getSafeCount = (value) => {
    const parsed = Number(value);

    if (
        !Number.isSafeInteger(parsed) ||
        parsed < 1
    ) {
        return DEFAULT_SKELETON_COUNT;
    }

    return Math.min(
        parsed,
        MAX_SKELETON_COUNT
    );
};

// =========================================================
// PROFILE PROJECT STAT SKELETON
//
// Matches one statistic card.
// =========================================================

const StatSkeleton = memo(
    function StatSkeleton() {
        return (
            <div
                className="
                    min-w-0

                    rounded-2xl
                    border

                    border-slate-200
                    bg-white/90

                    p-4

                    dark:border-white/[0.07]
                    dark:bg-[#0d131d]/90

                    sm:p-5
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >
                    <div
                        className="
                            flex-1
                            space-y-2
                        "
                    >
                        <div
                            className={`
                                h-3
                                w-20
                                max-w-full
                                ${SKELETON_CLASS}
                            `}
                        />

                        <div
                            className={`
                                h-2.5
                                w-24
                                max-w-full
                                ${SKELETON_CLASS}
                            `}
                        />
                    </div>

                    <div
                        className={`
                            h-10
                            w-10
                            shrink-0

                            rounded-xl

                            ${SKELETON_CLASS}
                        `}
                    />
                </div>

                <div
                    className={`
                        mt-4
                        h-8
                        w-16
                        ${SKELETON_CLASS}
                    `}
                />
            </div>
        );
    }
);

// =========================================================
// SINGLE PROJECT CARD SKELETON
//
// Matches:
//
// - Project cover image
// - Project title
// - Description
// - Technology tags
// - Footer / action bar
// =========================================================

const ProjectCardSkeleton = memo(
    function ProjectCardSkeleton({
        index = 0,
    }) {
        return (
            <article
                aria-hidden="true"
                className="
                    min-w-0
                    overflow-hidden

                    rounded-3xl
                    border

                    border-slate-200
                    bg-white/90

                    shadow-sm

                    dark:border-white/[0.07]
                    dark:bg-[#0d131d]/90
                    dark:shadow-none
                "
            >
                {/* =====================================
                    COVER IMAGE
                ====================================== */}

                <div
                    className={`
                        relative
                        aspect-[16/9]
                        w-full

                        rounded-none

                        ${SKELETON_CLASS}
                    `}
                >
                    {/* COVER BADGE */}

                    <div
                        className="
                            absolute
                            left-4
                            top-4

                            h-6
                            w-20

                            animate-pulse
                            rounded-full

                            bg-white/30
                            dark:bg-white/[0.09]

                            motion-reduce:animate-none
                        "
                    />

                    {/* COVER DECORATION */}

                    <div
                        className="
                            absolute
                            right-4
                            top-4

                            h-8
                            w-8

                            animate-pulse
                            rounded-xl

                            bg-white/30
                            dark:bg-white/[0.09]

                            motion-reduce:animate-none
                        "
                    />
                </div>

                {/* =====================================
                    CARD CONTENT
                ====================================== */}

                <div
                    className="
                        min-w-0
                        space-y-4
                        p-4

                        sm:p-5
                    "
                >
                    {/* =================================
                        TITLE
                    ================================== */}

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >
                        <div
                            className={`
                                h-6
                                w-2/3

                                ${SKELETON_CLASS}
                            `}
                        />

                        <div
                            className={`
                                h-6
                                w-12
                                shrink-0

                                ${SKELETON_CLASS}
                            `}
                        />
                    </div>

                    {/* =================================
                        DESCRIPTION
                    ================================== */}

                    <div className="space-y-2.5">
                        <div
                            className={`
                                h-3.5
                                w-full

                                ${SKELETON_CLASS}
                            `}
                        />

                        <div
                            className={`
                                h-3.5
                                w-[94%]

                                ${SKELETON_CLASS}
                            `}
                        />

                        <div
                            className={`
                                h-3.5
                                w-[64%]

                                ${SKELETON_CLASS}
                            `}
                        />
                    </div>

                    {/* =================================
                        STACK TAGS
                    ================================== */}

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        <div
                            className={`
                                h-7
                                w-[76px]

                                rounded-full

                                ${SKELETON_CLASS}
                            `}
                        />

                        <div
                            className={`
                                h-7
                                w-[90px]

                                rounded-full

                                ${SKELETON_CLASS}
                            `}
                        />

                        {index % 2 === 0 && (
                            <div
                                className={`
                                    h-7
                                    w-[65px]

                                    rounded-full

                                    ${SKELETON_CLASS}
                                `}
                            />
                        )}
                    </div>

                    {/* =================================
                        DIVIDER
                    ================================== */}

                    <div
                        className="
                            h-px
                            w-full

                            bg-slate-100

                            dark:bg-white/[0.06]
                        "
                    />

                    {/* =================================
                        CARD FOOTER
                    ================================== */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className={`
                                    h-4
                                    w-12

                                    ${SKELETON_CLASS}
                                `}
                            />

                            <div
                                className={`
                                    h-4
                                    w-12

                                    ${SKELETON_CLASS}
                                `}
                            />
                        </div>

                        <div
                            className={`
                                h-10
                                w-28
                                shrink-0

                                rounded-xl

                                ${SKELETON_CLASS}
                            `}
                        />
                    </div>
                </div>
            </article>
        );
    }
);

// =========================================================
// PROFILE PROJECTS SKELETON
//
// Props:
//
// count:
//   Number of loading project cards.
//   Default = 4.
//
// isOwner:
//   Preserved for compatibility.
//
// showStats:
//   Display four statistics placeholders.
//   Default = true.
//
// showHeader:
//   Optional header skeleton.
//   Default = false because ProfileProjects
//   already renders its real header.
//
// Features:
//
// - Initial load
// - Browser refresh
// - Pagination loading
// - Search loading
// - Refresh after creation
// - Light / Dark Mode
// - Responsive project grid
// - Reduced motion support
// =========================================================

const ProfileProjectsSkeleton = ({
    count = DEFAULT_SKELETON_COUNT,
    isOwner = false,
    showStats = true,
    showHeader = false,
    className = "",
}) => {
    // =====================================================
    // SAFE COUNT
    // =====================================================

    const skeletonCount =
        getSafeCount(count);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Profil loyihalari yuklanmoqda"
            className={`
                min-w-0
                space-y-5

                ${className}
            `}
        >
            <span className="sr-only">
                Loyihalar yuklanmoqda, iltimos kuting.
            </span>

            {/* =========================================
                OPTIONAL HEADER SKELETON

                Disabled by default to avoid
                duplicating ProfileProjectsHeader.
            ========================================== */}

            {showHeader && (
                <div
                    className="
                        flex
                        min-w-0

                        flex-col
                        gap-4

                        rounded-3xl
                        border

                        border-slate-200
                        bg-white/90

                        p-5

                        dark:border-white/[0.07]
                        dark:bg-[#0d131d]/90

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div className="space-y-3">
                        <div
                            className={`
                                h-5
                                w-36

                                ${SKELETON_CLASS}
                            `}
                        />

                        <div
                            className={`
                                h-4
                                w-56
                                max-w-full

                                ${SKELETON_CLASS}
                            `}
                        />
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className={`
                                h-10
                                w-44

                                ${SKELETON_CLASS}
                            `}
                        />

                        {isOwner && (
                            <div
                                className={`
                                    h-10
                                    w-10

                                    shrink-0

                                    ${SKELETON_CLASS}
                                `}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* =========================================
                STATS SKELETON
            ========================================== */}

            {showStats && (
                <div
                    className="
                        grid
                        min-w-0

                        grid-cols-2
                        gap-3

                        xl:grid-cols-4
                    "
                >
                    {Array.from(
                        { length: 4 },
                        (_, index) => (
                            <StatSkeleton
                                key={`stat-skeleton-${index}`}
                            />
                        )
                    )}
                </div>
            )}

            {/* =========================================
                PROJECT CARDS SKELETON
            ========================================== */}

            <div
                className="
                    grid
                    min-w-0

                    grid-cols-1
                    gap-5

                    md:grid-cols-2
                    sm:gap-6
                "
            >
                {Array.from(
                    { length: skeletonCount },
                    (_, index) => (
                        <ProjectCardSkeleton
                            key={`project-skeleton-${index}`}
                            index={index}
                        />
                    )
                )}
            </div>

            {/* =========================================
                LOADING CAPTION
            ========================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-center
                    gap-2

                    py-2

                    text-[11px]
                    font-medium

                    text-slate-500
                    dark:text-slate-400
                "
            >
                <FolderKanban
                    size={15}
                    aria-hidden="true"
                    className="
                        animate-pulse
                        text-indigo-500

                        motion-reduce:animate-none
                    "
                />

                <span>
                    Loyihalar yuklanmoqda...
                </span>
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectsSkeleton);
