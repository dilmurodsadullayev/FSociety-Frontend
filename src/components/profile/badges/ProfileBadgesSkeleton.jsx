
import React, { memo } from "react";

// =========================================================
// FSOCIETY — PROFILE BADGES SKELETON
//
// Features:
//
// - Three badge loading placeholders
// - Header skeleton
// - Badge image placeholders
// - Badge title and description placeholders
// - Responsive layout
// - Light / Dark Mode
// - Accessible loading state
// - Reduced motion support
//
// Original skeleton design and structure preserved.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_SKELETON_COUNT = 3;

const MAX_SKELETON_COUNT = 12;

// =========================================================
// BASE SKELETON STYLES
// =========================================================

const SKELETON_CLASS = `
    animate-pulse
    rounded-xl
    bg-slate-200/90
    dark:bg-gray-800
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
// SINGLE BADGE SKELETON CARD
//
// Mirrors the original ProfileBadgeCard layout:
//
// - Image
// - Name
// - Achievement and date badges
// - Description
// - Decorative progress line
// =========================================================

const BadgeSkeletonCard = memo(
    function BadgeSkeletonCard() {
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

                    bg-slate-50/80
                    p-4

                    dark:border-gray-700/70
                    dark:bg-gray-950/35
                "
            >
                {/* =====================================
                    BADGE CONTENT
                ====================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-3

                        sm:gap-4
                    "
                >
                    {/* =================================
                        BADGE IMAGE
                    ================================== */}

                    <div
                        className={`
                            h-20
                            w-20
                            shrink-0

                            rounded-2xl

                            sm:h-24
                            sm:w-24

                            ${SKELETON_CLASS}
                        `}
                    />

                    {/* =================================
                        TEXT CONTENT
                    ================================== */}

                    <div
                        className="
                            min-w-0
                            flex-1
                            space-y-3
                        "
                    >
                        {/* TITLE */}

                        <div
                            className={`
                                h-5
                                w-2/3
                                max-w-full

                                ${SKELETON_CLASS}
                            `}
                        />

                        {/* ACHIEVEMENT + DATE */}

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >
                            <div
                                className={`
                                    h-6
                                    w-24

                                    rounded-full

                                    ${SKELETON_CLASS}
                                `}
                            />

                            <div
                                className={`
                                    h-6
                                    w-28

                                    ${SKELETON_CLASS}
                                `}
                            />
                        </div>

                        {/* DESCRIPTION LINE 1 */}

                        <div
                            className={`
                                h-3
                                w-full

                                ${SKELETON_CLASS}
                            `}
                        />

                        {/* DESCRIPTION LINE 2 */}

                        <div
                            className={`
                                h-3
                                w-4/5

                                ${SKELETON_CLASS}
                            `}
                        />
                    </div>
                </div>

                {/* =====================================
                    DECORATIVE PROGRESS LINE

                    Original badge cards have this
                    line beneath their content.
                ====================================== */}

                <div
                    className={`
                        mt-4
                        h-1.5
                        w-full

                        rounded-full

                        ${SKELETON_CLASS}
                    `}
                />
            </div>
        );
    }
);

// =========================================================
// PROFILE BADGES SKELETON
//
// Props:
//
// count:
//   Number of placeholder badge cards.
//   Default: 3.
//
// className:
//   Additional wrapper styles.
//
// Used during:
// - Initial profile opening
// - Profile refresh
// - Switching users
// - Badge API refetch
// =========================================================

const ProfileBadgesSkeleton = ({
    count = DEFAULT_SKELETON_COUNT,
    className = "",
}) => {
    // =====================================================
    // SAFE COUNT
    // =====================================================

    const skeletonCount = getSafeCount(count);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Nishonlar yuklanmoqda"
            className={`
                relative
                isolate
                min-w-0
                overflow-hidden

                rounded-3xl
                border

                border-slate-200
                bg-white/90

                p-4

                shadow-lg
                shadow-slate-900/5

                dark:border-gray-700/70
                dark:bg-gray-900/70
                dark:shadow-2xl
                dark:shadow-black/30

                sm:p-5

                ${className}
            `}
        >
            {/* =============================================
                ACCESSIBLE LOADING MESSAGE
            ============================================== */}

            <span className="sr-only">
                Nishonlar yuklanmoqda.
                Iltimos, kuting.
            </span>

            {/* =============================================
                BACKGROUND DECORATIONS
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute

                    -right-24
                    -top-24

                    h-52
                    w-52

                    rounded-full
                    bg-yellow-500/[0.05]

                    blur-3xl

                    dark:bg-yellow-500/[0.08]
                "
            />

            {/* =============================================
                HEADER SKELETON

                Preserves:
                - Header icon
                - Heading
                - Subtitle
                - Badge count
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    relative
                    z-10

                    mb-6

                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    {/* HEADER ICON */}

                    <div
                        className={`
                            h-12
                            w-12
                            shrink-0

                            rounded-2xl

                            ${SKELETON_CLASS}
                        `}
                    />

                    {/* HEADER TEXT */}

                    <div
                        className="
                            min-w-0
                            space-y-2
                        "
                    >
                        <div
                            className={`
                                h-5
                                w-32
                                max-w-full

                                ${SKELETON_CLASS}
                            `}
                        />

                        <div
                            className={`
                                h-3
                                w-44
                                max-w-full

                                ${SKELETON_CLASS}
                            `}
                        />
                    </div>
                </div>

                {/* BADGE COUNT */}

                <div
                    className={`
                        h-7
                        w-14
                        shrink-0

                        rounded-full

                        ${SKELETON_CLASS}
                    `}
                />
            </div>

            {/* =============================================
                BADGE LIST SKELETON

                Three cards, matching the original file.
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    relative
                    z-10

                    space-y-4
                "
            >
                {Array.from(
                    { length: skeletonCount },
                    (_, index) => (
                        <BadgeSkeletonCard
                            key={`badge-skeleton-${index}`}
                        />
                    )
                )}
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileBadgesSkeleton);
