
import React from "react";

// =========================================================
// FSOCIETY — PROBLEMS HEADER
//
// Features:
// - Light / Dark Mode
// - Mobile-first typography
// - Responsive layout
// - Accessible decorative elements
// - Reduced motion support
//
// No props.
// No API requests.
// =========================================================

// =========================================================
// PAGE FEATURES
// =========================================================

const PAGE_FEATURES = [
    {
        label: "Search",
        dotClass: "bg-cyan-500 dark:bg-cyan-400",
    },
    {
        label: "Filter",
        dotClass: "bg-indigo-500 dark:bg-indigo-400",
    },
    {
        label: "Sort",
        dotClass: "bg-purple-500 dark:bg-purple-400",
    },
    {
        label: "Solve",
        dotClass: "bg-emerald-500 dark:bg-emerald-400",
    },
];

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemsHeader = () => {
    return (
        <header
            aria-labelledby="problems-page-title"
            className="
                relative
                mx-auto

                w-full
                max-w-4xl
                min-w-0

                px-1
                py-2

                text-center

                sm:px-4
                sm:py-4
            "
        >
            {/* ==========================================
                AMBIENT GLOW
            ========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-0

                    h-40
                    w-[85%]
                    max-w-2xl

                    -translate-x-1/2

                    rounded-full

                    bg-gradient-to-r
                    from-cyan-500/[0.07]
                    via-indigo-500/[0.08]
                    to-purple-500/[0.07]

                    blur-[75px]

                    sm:h-48
                    sm:w-[70%]
                    sm:blur-[90px]

                    dark:from-cyan-400/[0.08]
                    dark:via-indigo-500/[0.09]
                    dark:to-purple-500/[0.08]
                "
            />

            {/* ==========================================
                CONTENT
            ========================================== */}

            <div
                className="
                    relative
                    z-10

                    min-w-0

                    animate-fade-in-up
                    motion-reduce:animate-none
                "
            >
                {/* ======================================
                    SYSTEM BADGE
                ====================================== */}

                <div
                    className="
                        mx-auto
                        mb-4

                        inline-flex
                        max-w-full

                        items-center
                        justify-center
                        gap-2

                        rounded-full

                        border
                        border-cyan-400/35

                        bg-cyan-500/[0.07]

                        px-3
                        py-2

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.12em]

                        text-cyan-800

                        shadow-sm

                        sm:mb-5
                        sm:text-[10px]
                        sm:tracking-[0.18em]

                        dark:border-cyan-400/20
                        dark:bg-cyan-400/[0.06]
                        dark:text-cyan-300

                        dark:shadow-cyan-950/10
                    "
                >
                    {/* STATUS DOT */}

                    <span
                        aria-hidden="true"
                        className="
                            relative
                            flex
                            h-2
                            w-2
                            shrink-0
                        "
                    >
                        <span
                            className="
                                absolute
                                inset-0

                                animate-ping
                                rounded-full

                                bg-emerald-500
                                opacity-30

                                motion-reduce:animate-none

                                dark:bg-emerald-400
                            "
                        />

                        <span
                            className="
                                relative
                                inline-flex

                                h-2
                                w-2

                                rounded-full

                                bg-emerald-500

                                shadow-[0_0_9px_rgba(16,185,129,0.45)]

                                dark:bg-emerald-400
                                dark:shadow-[0_0_10px_rgba(52,211,153,0.55)]
                            "
                        />
                    </span>

                    <span
                        className="
                            min-w-0
                            break-all
                        "
                    >
                        fsociety://problems
                    </span>
                </div>

                {/* ======================================
                    MAIN TITLE
                ====================================== */}

                <h1
                    id="problems-page-title"
                    className="
                        mx-auto
                        max-w-4xl

                        break-words

                        font-display
                        text-[30px]
                        font-black
                        leading-[1.15]
                        tracking-tight

                        text-slate-950

                        sm:text-5xl
                        sm:leading-[1.12]

                        lg:text-6xl

                        dark:text-white
                    "
                >
                    Muammolar{" "}

                    <span
                        className="
                            bg-gradient-to-r
                            from-purple-700
                            via-indigo-700
                            to-cyan-700

                            bg-clip-text
                            text-transparent

                            dark:from-purple-400
                            dark:via-indigo-400
                            dark:to-cyan-400
                        "
                    >
                        Markazi
                    </span>
                </h1>

                {/* ======================================
                    DESCRIPTION
                ====================================== */}

                <p
                    className="
                        mx-auto
                        mt-4

                        max-w-2xl

                        break-words

                        text-[13px]
                        font-medium
                        leading-6

                        text-slate-600

                        sm:mt-5
                        sm:text-[15px]
                        sm:leading-7

                        lg:text-base

                        dark:text-gray-400
                    "
                >
                    Dasturchilar muammolarini ulashadi,
                    community yechim beradi va eng foydali
                    javoblar bilim bazasiga aylanadi.
                </p>

                {/* ======================================
                    PAGE FEATURES
                ====================================== */}

                <div
                    aria-label="Sahifa imkoniyatlari"
                    className="
                        mt-5

                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        justify-center

                        gap-x-4
                        gap-y-2

                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.12em]

                        text-slate-500

                        sm:mt-6
                        sm:gap-x-5
                        sm:text-[10px]

                        dark:text-gray-400
                    "
                >
                    {PAGE_FEATURES.map((feature) => (
                        <span
                            key={feature.label}
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                            "
                        >
                            <span
                                aria-hidden="true"
                                className={`
                                    h-1.5
                                    w-1.5
                                    shrink-0
                                    rounded-full

                                    ${feature.dotClass}
                                `}
                            />

                            {feature.label}
                        </span>
                    ))}
                </div>
            </div>
        </header>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemsHeader);
