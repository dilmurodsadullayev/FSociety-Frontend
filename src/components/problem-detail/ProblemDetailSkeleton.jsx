
import React, { memo } from "react";

// =========================================================
// FSOCIETY — PROBLEM DETAIL SKELETON
//
// Standalone loading component.
//
// - No Redux
// - No API calls
// - No router
// - No other ProblemDetail imports
// - Light / Dark Mode
// - Responsive layout
// - Feedback-style skeleton cards
// - Reduced motion support
// =========================================================

// =========================================================
// BASE SKELETON BLOCK
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => (
    <div
        aria-hidden="true"
        className={`
            rounded-lg
            bg-slate-200/90
            dark:bg-slate-700/50
            ${className}
        `}
    />
);

// =========================================================
// SHARED CARD STYLES
// =========================================================

const CARD_CLASS = `
    w-full
    min-w-0
    overflow-hidden

    rounded-[22px]
    border
    border-slate-200

    bg-white/95

    shadow-[0_12px_40px_rgba(15,23,42,0.045)]

    sm:rounded-[28px]

    dark:border-white/[0.09]
    dark:bg-[#0e1421]/95

    dark:shadow-[0_18px_50px_rgba(0,0,0,0.18)]
`;

// =========================================================
// AUTHOR PLACEHOLDER
// =========================================================

const SkeletonAuthor = memo(() => (
    <div
        className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
        "
    >
        <div className="flex min-w-0 flex-1 items-center gap-3">
            <SkeletonBlock
                className="
                    h-12
                    w-12
                    shrink-0
                    rounded-2xl
                "
            />

            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock
                    className="h-3.5 w-32 max-w-full rounded-full"
                />

                <SkeletonBlock
                    className="h-2.5 w-24 max-w-full rounded-full"
                />
            </div>
        </div>

        <SkeletonBlock
            className="h-8 w-24 rounded-full"
        />
    </div>
));

// =========================================================
// PROBLEM TITLE / LANGUAGES
// =========================================================

const SkeletonTitle = memo(() => (
    <div className="mt-7 space-y-4">
        <div className="space-y-3">
            <SkeletonBlock
                className="h-7 w-[94%] rounded-xl sm:h-9"
            />

            <SkeletonBlock
                className="h-7 w-[65%] rounded-xl sm:h-9"
            />
        </div>

        <div className="flex flex-wrap gap-2">
            <SkeletonBlock
                className="h-8 w-20 rounded-full"
            />

            <SkeletonBlock
                className="h-8 w-24 rounded-full"
            />

            <SkeletonBlock
                className="h-8 w-16 rounded-full"
            />
        </div>
    </div>
));

// =========================================================
// PRIORITY / DEADLINE PLACEHOLDER
// =========================================================

const SkeletonPriority = memo(() => (
    <div
        className="
            mt-6
            flex
            flex-wrap
            items-center
            justify-between
            gap-4

            rounded-2xl
            border
            border-slate-200

            bg-slate-50/80
            p-4

            dark:border-white/[0.08]
            dark:bg-white/[0.025]
        "
    >
        <div className="flex flex-1 items-center gap-3">
            <SkeletonBlock
                className="h-11 w-11 shrink-0 rounded-xl"
            />

            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock
                    className="h-3 w-36 max-w-full rounded-full"
                />

                <SkeletonBlock
                    className="h-2.5 w-48 max-w-full rounded-full"
                />
            </div>
        </div>

        <SkeletonBlock
            className="h-11 w-36 rounded-xl"
        />
    </div>
));

// =========================================================
// DESCRIPTION PLACEHOLDER
// =========================================================

const SkeletonDescription = memo(() => (
    <div
        className="
            mt-7
            rounded-2xl
            border
            border-slate-200
            bg-slate-50/70
            p-4

            sm:p-5

            dark:border-white/[0.08]
            dark:bg-white/[0.025]
        "
    >
        <div className="mb-5 flex items-center gap-3">
            <SkeletonBlock
                className="h-9 w-9 rounded-xl"
            />

            <SkeletonBlock
                className="h-4 w-40 max-w-full rounded-full"
            />
        </div>

        <div className="space-y-3">
            <SkeletonBlock
                className="h-3 w-[96%] rounded-full"
            />

            <SkeletonBlock
                className="h-3 w-[83%] rounded-full"
            />

            <SkeletonBlock
                className="h-3 w-[92%] rounded-full"
            />

            <SkeletonBlock
                className="h-3 w-[75%] rounded-full"
            />

            <SkeletonBlock
                className="h-3 w-[87%] rounded-full"
            />
        </div>

        <div
            className="
                mt-6
                flex
                flex-wrap
                gap-2

                border-t
                border-slate-200
                pt-5

                dark:border-white/[0.07]
            "
        >
            <SkeletonBlock
                className="h-7 w-20 rounded-full"
            />

            <SkeletonBlock
                className="h-7 w-24 rounded-full"
            />

            <SkeletonBlock
                className="h-7 w-16 rounded-full"
            />
        </div>
    </div>
));

// =========================================================
// CODE EDITOR PLACEHOLDER
// =========================================================

const SkeletonCode = memo(() => (
    <div
        className="
            mt-6
            overflow-hidden
            rounded-2xl

            border
            border-slate-200

            bg-slate-50

            dark:border-white/[0.08]
            dark:bg-[#090f1b]
        "
    >
        {/* EDITOR HEADER */}

        <div
            className="
                flex
                items-center
                justify-between
                gap-3

                border-b
                border-slate-200

                px-4
                py-3

                dark:border-white/[0.08]
            "
        >
            <div className="flex items-center gap-2">
                <SkeletonBlock
                    className="h-2.5 w-2.5 rounded-full"
                />

                <SkeletonBlock
                    className="h-2.5 w-2.5 rounded-full"
                />

                <SkeletonBlock
                    className="h-2.5 w-2.5 rounded-full"
                />
            </div>

            <SkeletonBlock
                className="h-3 w-24 rounded-full"
            />
        </div>

        {/* CODE LINES */}

        <div className="space-y-4 p-4 sm:p-5">
            <SkeletonBlock
                className="h-3 w-[42%] rounded-full"
            />

            <SkeletonBlock
                className="ml-4 h-3 w-[73%] max-w-[calc(100%-1rem)] rounded-full"
            />

            <SkeletonBlock
                className="ml-4 h-3 w-[58%] max-w-[calc(100%-1rem)] rounded-full"
            />

            <SkeletonBlock
                className="ml-8 h-3 w-[49%] max-w-[calc(100%-2rem)] rounded-full"
            />

            <SkeletonBlock
                className="ml-4 h-3 w-[67%] max-w-[calc(100%-1rem)] rounded-full"
            />

            <SkeletonBlock
                className="h-3 w-[35%] rounded-full"
            />
        </div>
    </div>
));

// =========================================================
// STATISTICS PLACEHOLDER
// =========================================================

const SkeletonStatistics = memo(() => (
    <div
        className="
            mt-6
            flex
            flex-wrap
            items-center
            justify-between
            gap-3

            border-t
            border-slate-200

            pt-5

            dark:border-white/[0.08]
        "
    >
        <div className="flex flex-wrap gap-2">
            <SkeletonBlock
                className="h-8 w-20 rounded-full"
            />

            <SkeletonBlock
                className="h-8 w-20 rounded-full"
            />

            <SkeletonBlock
                className="h-8 w-16 rounded-full"
            />
        </div>

        <SkeletonBlock
            className="h-10 w-28 rounded-xl"
        />
    </div>
));

// =========================================================
// MAIN PROBLEM CARD
// =========================================================

const SkeletonProblemCard = memo(() => (
    <section
        className={`
            ${CARD_CLASS}
            p-4
            sm:p-6
            lg:p-7
        `}
    >
        <SkeletonAuthor />

        <SkeletonTitle />

        <SkeletonPriority />

        <SkeletonDescription />

        <SkeletonCode />

        <SkeletonStatistics />
    </section>
));

// =========================================================
// SINGLE SOLUTION PLACEHOLDER
// =========================================================

const SkeletonSolutionCard = memo(() => (
    <div
        className="
            rounded-2xl
            border
            border-slate-200

            bg-slate-50/80
            p-4

            dark:border-white/[0.08]
            dark:bg-white/[0.025]
        "
    >
        <div className="flex items-center gap-3">
            <SkeletonBlock
                className="h-10 w-10 shrink-0 rounded-xl"
            />

            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock
                    className="h-3 w-28 max-w-full rounded-full"
                />

                <SkeletonBlock
                    className="h-2.5 w-20 max-w-full rounded-full"
                />
            </div>

            <SkeletonBlock
                className="h-7 w-16 rounded-full"
            />
        </div>

        <div className="mt-5 space-y-3">
            <SkeletonBlock
                className="h-3 w-[93%] rounded-full"
            />

            <SkeletonBlock
                className="h-3 w-[78%] rounded-full"
            />

            <SkeletonBlock
                className="h-3 w-[61%] rounded-full"
            />
        </div>

        <div
            className="
                mt-5
                flex
                justify-between
                gap-3

                border-t
                border-slate-200
                pt-4

                dark:border-white/[0.08]
            "
        >
            <SkeletonBlock
                className="h-8 w-24 rounded-xl"
            />

            <SkeletonBlock
                className="h-8 w-20 rounded-xl"
            />
        </div>
    </div>
));

// =========================================================
// SOLUTIONS SECTION
// =========================================================

const SkeletonSolutions = memo(() => (
    <section
        className={`
            ${CARD_CLASS}
            p-4
            sm:p-6
        `}
    >
        <div
            className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
            "
        >
            <div className="space-y-2">
                <SkeletonBlock
                    className="h-5 w-36 rounded-full"
                />

                <SkeletonBlock
                    className="h-3 w-48 rounded-full"
                />
            </div>

            <SkeletonBlock
                className="h-10 w-28 rounded-xl"
            />
        </div>

        <div className="mt-6 space-y-4">
            <SkeletonSolutionCard />

            <SkeletonSolutionCard />
        </div>
    </section>
));

// =========================================================
// SIMILAR PROBLEM PLACEHOLDER
// =========================================================

const SkeletonSimilarProblem = memo(() => (
    <div
        className="
            rounded-xl
            border
            border-slate-200

            bg-slate-50/80
            p-3

            dark:border-white/[0.07]
            dark:bg-white/[0.025]
        "
    >
        <div className="flex items-center gap-3">
            <SkeletonBlock
                className="h-9 w-9 shrink-0 rounded-xl"
            />

            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock
                    className="h-3 w-[85%] rounded-full"
                />

                <SkeletonBlock
                    className="h-2.5 w-[60%] rounded-full"
                />
            </div>
        </div>

        <div className="mt-4 flex gap-2">
            <SkeletonBlock
                className="h-6 w-16 rounded-full"
            />

            <SkeletonBlock
                className="h-6 w-20 rounded-full"
            />
        </div>
    </div>
));

// =========================================================
// SIMILAR PROBLEMS SIDEBAR
// =========================================================

const SkeletonSidebar = memo(() => (
    <aside
        className={`
            ${CARD_CLASS}
            p-4
            sm:p-5
        `}
    >
        <div
            className="
                mb-5
                flex
                items-center
                justify-between
                gap-3
            "
        >
            <SkeletonBlock
                className="h-4 w-36 rounded-full"
            />

            <SkeletonBlock
                className="h-8 w-10 rounded-lg"
            />
        </div>

        <div className="space-y-3">
            <SkeletonSimilarProblem />

            <SkeletonSimilarProblem />

            <SkeletonSimilarProblem />
        </div>

        <SkeletonBlock
            className="
                mx-auto
                mt-5
                h-10
                w-36
                rounded-xl
            "
        />
    </aside>
));

// =========================================================
// MAIN SKELETON PAGE
// =========================================================

const ProblemDetailSkeleton = () => {
    return (
        <main
            id="problem-detail-skeleton"
            aria-busy="true"
            className="
                relative
                isolate

                min-h-screen
                w-full
                min-w-0

                bg-gradient-to-b
                from-slate-50
                via-white
                to-slate-100

                dark:from-[#070b14]
                dark:via-[#080e19]
                dark:to-[#050816]
            "
        >
            {/* ======================================
                ACCESSIBILITY
                No visible loading text.
            ====================================== */}

            <span
                role="status"
                className="sr-only"
            >
                Muammo tafsilotlari yuklanmoqda.
            </span>

            {/* ======================================
                BACKGROUND DECORATIONS
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        -left-32
                        top-10

                        h-80
                        w-80

                        rounded-full

                        bg-cyan-500/[0.035]
                        blur-[100px]

                        dark:bg-cyan-400/[0.05]
                    "
                />

                <div
                    className="
                        absolute
                        -right-32
                        top-[35%]

                        h-80
                        w-80

                        rounded-full

                        bg-indigo-500/[0.035]
                        blur-[100px]

                        dark:bg-indigo-400/[0.06]
                    "
                />
            </div>

            {/* ======================================
                SKELETON CONTENT
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    relative
                    z-10

                    mx-auto
                    w-full
                    max-w-[1500px]
                    min-w-0

                    animate-pulse
                    motion-reduce:animate-none

                    px-3
                    py-6

                    sm:px-5
                    sm:py-8

                    md:px-6

                    lg:px-8
                    lg:py-10

                    xl:py-12
                "
            >
                {/* PAGE GRID */}

                <div
                    className="
                        grid
                        w-full
                        min-w-0

                        grid-cols-1
                        items-start

                        gap-6

                        sm:gap-8

                        xl:grid-cols-12
                        xl:gap-8

                        2xl:gap-10
                    "
                >
                    {/* MAIN COLUMN */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-col

                            gap-6

                            sm:gap-8

                            xl:col-span-8
                        "
                    >
                        <SkeletonProblemCard />

                        <SkeletonSolutions />
                    </div>

                    {/* SIDEBAR */}

                    <div
                        className="
                            min-w-0
                            xl:col-span-4
                        "
                    >
                        <div
                            className="
                                xl:sticky
                                xl:top-24
                            "
                        >
                            <SkeletonSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProblemDetailSkeleton);
