
import React from "react";

// =========================================================
// FSOCIETY — PROBLEM CARD SKELETON
//
// Responsibilities:
// - ProblemCard loading placeholder
// - Author / status skeleton
// - Title skeleton
// - Languages skeleton
// - Technologies skeleton
// - Metadata skeleton
// - Footer skeleton
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Consistent card spacing
// - Reduced motion support
// - No unnecessary React state
// - No API requests
//
// Existing default export preserved.
// =========================================================

// =========================================================
// BASE SKELETON BLOCK
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => {
    return (
        <div
            aria-hidden="true"
            className={`
                shrink-0

                rounded-lg

                bg-slate-200/80

                dark:bg-white/[0.07]

                ${className}
            `}
        />
    );
};

// =========================================================
// AUTHOR SKELETON
// =========================================================

const AuthorSkeleton = () => {
    return (
        <div
            className="
                flex
                min-w-0
                flex-1

                items-center
                gap-3
            "
        >
            {/* AVATAR */}

            <SkeletonBlock
                className="
                    h-10
                    w-10

                    rounded-xl

                    sm:h-11
                    sm:w-11
                    sm:rounded-2xl
                "
            />

            {/* USERNAME AND DATE */}

            <div
                className="
                    flex
                    min-w-0
                    flex-1

                    flex-col
                    gap-2
                "
            >
                <SkeletonBlock
                    className="
                        h-3
                        w-28
                        max-w-full

                        rounded-full
                    "
                />

                <SkeletonBlock
                    className="
                        h-2.5
                        w-20
                        max-w-full

                        rounded-full

                        bg-slate-200/60

                        dark:bg-white/[0.05]
                    "
                />
            </div>
        </div>
    );
};

// =========================================================
// TITLE SKELETON
// =========================================================

const TitleSkeleton = () => {
    return (
        <div
            className="
                mt-6

                flex
                min-w-0
                flex-col
                gap-3

                sm:mt-7
            "
        >
            <SkeletonBlock
                className="
                    h-5
                    w-4/5
                    max-w-full

                    rounded-lg

                    bg-slate-300/65

                    dark:bg-white/[0.09]
                "
            />

            <SkeletonBlock
                className="
                    h-5
                    w-2/3
                    max-w-full

                    rounded-lg
                "
            />
        </div>
    );
};

// =========================================================
// LANGUAGES SKELETON
// =========================================================

const LanguagesSkeleton = () => {
    return (
        <div
            className="
                mt-6
                min-w-0

                sm:mt-7
            "
        >
            {/* SECTION LABEL */}

            <SkeletonBlock
                className="
                    mb-3

                    h-2
                    w-16

                    rounded-full

                    bg-slate-200/60

                    dark:bg-white/[0.05]
                "
            />

            {/* LANGUAGE BADGES */}

            <div
                className="
                    flex
                    min-w-0

                    flex-wrap
                    items-center
                    gap-2
                "
            >
                <SkeletonBlock
                    className="
                        h-7
                        w-20

                        rounded-full
                    "
                />

                <SkeletonBlock
                    className="
                        h-7
                        w-24

                        rounded-full
                    "
                />
            </div>
        </div>
    );
};

// =========================================================
// TECHNOLOGIES SKELETON
// =========================================================

const TechnologiesSkeleton = () => {
    return (
        <div
            className="
                mt-5
                min-w-0
            "
        >
            {/* SECTION LABEL */}

            <SkeletonBlock
                className="
                    mb-3

                    h-2
                    w-20

                    rounded-full

                    bg-slate-200/60

                    dark:bg-white/[0.05]
                "
            />

            {/* TECHNOLOGY BADGES */}

            <div
                className="
                    flex
                    min-w-0

                    flex-wrap
                    items-center
                    gap-2
                "
            >
                <SkeletonBlock
                    className="
                        h-6
                        w-16

                        rounded-full
                    "
                />

                <SkeletonBlock
                    className="
                        h-6
                        w-20

                        rounded-full
                    "
                />

                <SkeletonBlock
                    className="
                        h-6
                        w-14

                        rounded-full
                    "
                />
            </div>
        </div>
    );
};

// =========================================================
// METADATA SKELETON
// =========================================================

const MetadataSkeleton = () => {
    return (
        <div
            className="
                mt-6

                flex
                min-w-0

                flex-wrap
                items-center
                gap-2
            "
        >
            <SkeletonBlock
                className="
                    h-7
                    w-16

                    rounded-full
                "
            />

            <SkeletonBlock
                className="
                    h-7
                    w-16

                    rounded-full
                "
            />

            <SkeletonBlock
                className="
                    h-7
                    w-16

                    rounded-full
                "
            />
        </div>
    );
};

// =========================================================
// FOOTER SKELETON
// =========================================================

const FooterSkeleton = () => {
    return (
        <div
            className="
                mt-auto

                flex
                min-w-0

                flex-wrap
                items-center
                justify-between
                gap-3

                border-t
                border-slate-200

                pt-4

                dark:border-white/[0.08]
            "
        >
            {/* FOOTER INFORMATION */}

            <SkeletonBlock
                className="
                    h-3
                    w-24
                    max-w-full

                    rounded-full
                "
            />

            {/* ACTION */}

            <SkeletonBlock
                className="
                    h-9
                    w-28

                    rounded-xl
                "
            />
        </div>
    );
};

// =========================================================
// MAIN PROBLEM CARD SKELETON
// =========================================================

const ProblemCardSkeleton = () => {
    return (
        <div
            aria-hidden="true"

            className="
                relative

                flex
                h-full
                min-h-[380px]

                w-full
                min-w-0

                flex-col

                overflow-hidden

                rounded-[22px]
                border
                border-slate-200

                bg-white

                p-4

                shadow-[0_10px_35px_rgba(15,23,42,0.045)]

                animate-pulse

                sm:min-h-[400px]
                sm:rounded-3xl
                sm:p-5

                motion-reduce:animate-none

                dark:border-white/[0.08]
                dark:bg-[#0a0f18]

                dark:shadow-[0_15px_45px_rgba(0,0,0,0.14)]
            "
        >
            {/* ======================================
                TOP BORDER ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    top-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-indigo-400/20
                    to-transparent

                    dark:via-indigo-400/15
                "
            />

            {/* ======================================
                AUTHOR + STATUS
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    flex-wrap
                    items-start
                    justify-between
                    gap-3
                "
            >
                <AuthorSkeleton />

                <SkeletonBlock
                    className="
                        h-7
                        w-20

                        rounded-full

                        sm:w-24
                    "
                />
            </div>

            {/* ======================================
                TITLE
            ====================================== */}

            <TitleSkeleton />

            {/* ======================================
                LANGUAGES
            ====================================== */}

            <LanguagesSkeleton />

            {/* ======================================
                TECHNOLOGIES
            ====================================== */}

            <TechnologiesSkeleton />

            {/* ======================================
                METADATA
            ====================================== */}

            <MetadataSkeleton />

            {/* ======================================
                FLEXIBLE SPACING
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    min-h-5
                    flex-1
                "
            />

            {/* ======================================
                FOOTER
            ====================================== */}

            <FooterSkeleton />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemCardSkeleton);
