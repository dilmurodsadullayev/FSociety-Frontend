
import React from "react";

// =========================================================
// FSOCIETY — PROJECT CARD SKELETON
//
// Features:
// - Dark / Light Mode
// - Responsive card proportions
// - Same layout as ProjectsPageCard
// - Reduced motion support
// - Accessible loading state
// =========================================================

// =========================================================
// REUSABLE SKELETON BLOCK
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => {
    return (
        <div
            aria-hidden="true"

            className={`
                animate-pulse

                rounded-lg

                bg-slate-200/90

                dark:bg-white/[0.07]

                motion-reduce:animate-none

                ${className}
            `}
        />
    );
};

// =========================================================
// PROJECT CARD SKELETON
// =========================================================

const ProjectCardSkeleton = () => {
    return (
        <div
            role="status"
            aria-label="Loyiha yuklanmoqda"

            className="
                relative

                flex
                h-full
                min-w-0
                flex-col

                overflow-hidden

                rounded-2xl
                border
                border-[#dce5f0]

                bg-white

                shadow-[0_8px_30px_rgba(15,23,42,0.045)]

                dark:border-white/[0.07]
                dark:bg-[#0d1117]

                dark:shadow-[0_8px_28px_rgba(0,0,0,0.14)]
            "
        >
            {/* ======================================
                TOP BAR
            ====================================== */}

            <div
                className="
                    flex
                    h-10
                    min-w-0
                    shrink-0

                    items-center
                    justify-between
                    gap-3

                    border-b
                    border-[#e4eaf3]

                    bg-slate-50/60

                    px-3

                    sm:px-4

                    dark:border-white/[0.055]
                    dark:bg-black/[0.10]
                "
            >
                {/* PROJECT NUMBER / PROMOTION */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2
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
                            w-14

                            rounded-full
                        "
                    />
                </div>

                {/* STATS */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-3
                    "
                >
                    <SkeletonBlock
                        className="
                            h-2.5
                            w-7
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-2.5
                            w-7
                        "
                    />
                </div>
            </div>

            {/* ======================================
                IMAGE PREVIEW SKELETON
            ====================================== */}

            <div
                className="
                    relative

                    h-[170px]
                    w-full
                    shrink-0

                    overflow-hidden

                    border-b
                    border-[#e2e8f0]

                    bg-gradient-to-br
                    from-[#edf5fd]
                    via-[#f6f9fe]
                    to-[#e8effa]

                    md:h-[180px]

                    dark:border-white/[0.06]
                    dark:from-[#080d14]
                    dark:via-[#0b111b]
                    dark:to-[#101a2a]
                "
            >
                {/* IMAGE SHAPE */}

                <div
                    className="
                        absolute
                        inset-3

                        overflow-hidden

                        rounded-xl
                        border
                        border-slate-200/50

                        dark:border-white/[0.03]
                    "
                >
                    <SkeletonBlock
                        className="
                            h-full
                            w-full

                            !rounded-xl

                            !bg-slate-200/60

                            dark:!bg-white/[0.04]
                        "
                    />
                </div>

                {/* PREVIEW LABEL */}

                <SkeletonBlock
                    className="
                        absolute
                        bottom-3
                        left-3

                        h-2
                        w-24

                        !bg-slate-300/60

                        dark:!bg-white/[0.055]
                    "
                />
            </div>

            {/* ======================================
                CARD CONTENT
            ====================================== */}

            <div
                className="
                    flex
                    min-h-[220px]
                    min-w-0
                    flex-1
                    flex-col

                    p-4
                "
            >
                {/* ==================================
                    AUTHOR + DATE
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        justify-between
                        gap-3
                    "
                >
                    {/* AUTHOR */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >
                        <SkeletonBlock
                            className="
                                h-6
                                w-6
                                shrink-0

                                !rounded-full
                            "
                        />

                        <SkeletonBlock
                            className="
                                h-2.5
                                w-20

                                sm:w-24
                            "
                        />
                    </div>

                    {/* DATE */}

                    <SkeletonBlock
                        className="
                            h-2.5
                            w-16
                            shrink-0
                        "
                    />
                </div>

                {/* ==================================
                    PROJECT TITLE
                ================================== */}

                <SkeletonBlock
                    className="
                        mt-4

                        h-5
                        w-[72%]
                    "
                />

                {/* ==================================
                    MAIN FEATURES
                ================================== */}

                <div
                    className="
                        mt-3

                        flex
                        items-center
                        gap-2
                    "
                >
                    <SkeletonBlock
                        className="
                            h-3
                            w-3
                            shrink-0

                            !rounded
                            !bg-violet-200/80

                            dark:!bg-violet-400/[0.10]
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-2.5
                            w-32
                            max-w-[65%]

                            !bg-violet-200/70

                            dark:!bg-violet-400/[0.08]
                        "
                    />
                </div>

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <div className="mt-4 space-y-2.5">
                    <SkeletonBlock
                        className="
                            h-2.5
                            w-full

                            !bg-slate-100

                            dark:!bg-white/[0.045]
                        "
                    />

                    <SkeletonBlock
                        className="
                            h-2.5
                            w-[82%]

                            !bg-slate-100

                            dark:!bg-white/[0.045]
                        "
                    />
                </div>

                {/* ==================================
                    BOTTOM
                ================================== */}

                <div className="mt-auto pt-4">

                    {/* STACK BADGES */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >
                        <SkeletonBlock
                            className="
                                h-7
                                w-16

                                !rounded-lg
                            "
                        />

                        <SkeletonBlock
                            className="
                                h-7
                                w-20

                                !rounded-lg
                            "
                        />

                        <SkeletonBlock
                            className="
                                h-7
                                w-14

                                !rounded-lg
                            "
                        />

                        {/* DETAIL BUTTON */}

                        <SkeletonBlock
                            className="
                                ml-auto

                                h-9
                                w-9
                                shrink-0

                                !rounded-xl
                            "
                        />
                    </div>

                    {/* ==================================
                        CARD FOOTER
                    ================================== */}

                    <div
                        className="
                            mt-3

                            flex
                            items-center
                            justify-between
                            gap-3

                            border-t
                            border-[#e7ebf2]

                            pt-3

                            dark:border-white/[0.055]
                        "
                    >
                        {/* COLLABORATIONS / STACK COUNT */}

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                            "
                        >
                            <SkeletonBlock
                                className="
                                    h-2.5
                                    w-14

                                    !bg-slate-100

                                    dark:!bg-white/[0.035]
                                "
                            />

                            <SkeletonBlock
                                className="
                                    h-2.5
                                    w-14

                                    !bg-slate-100

                                    dark:!bg-white/[0.035]
                                "
                            />
                        </div>

                        {/* PUBLIC STATUS */}

                        <SkeletonBlock
                            className="
                                h-2.5
                                w-12
                                shrink-0

                                !bg-emerald-200/70

                                dark:!bg-emerald-400/[0.08]
                            "
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProjectCardSkeleton);
