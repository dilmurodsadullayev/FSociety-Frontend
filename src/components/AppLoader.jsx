
import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import FSocietyLogo from "../assests/logo/f_society.png";

// =========================================================
// FSOCIETY — GLOBAL APP LOADER
//
// Features:
// - Light / Dark Mode
// - Responsive layout
// - Animated rotating rings
// - Logo glow
// - Scanning line
// - System initialization text
// - Indeterminate progress bar
// - Decorative binary code
// - Accessibility support
// - Reduced-motion support
//
// No API calls.
// No timers.
// No artificial loading delays.
// =========================================================

// =========================================================
// ANIMATION SETTINGS
// =========================================================

const OUTER_RING_TRANSITION = {
    rotate: {
        duration: 12,
        repeat: Infinity,
        ease: "linear",
    },
};

const INNER_RING_TRANSITION = {
    rotate: {
        duration: 6,
        repeat: Infinity,
        ease: "linear",
    },
};

const LOGO_TRANSITION = {
    scale: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
    },
};

const SCAN_TRANSITION = {
    duration: 3.5,
    repeat: Infinity,
    ease: "easeInOut",
};

const PROGRESS_TRANSITION = {
    duration: 1.8,
    repeat: Infinity,
    ease: "easeInOut",
};

const TEXT_TRANSITION = {
    duration: 2.2,
    repeat: Infinity,
    ease: "easeInOut",
};

// =========================================================
// DECORATIVE BACKGROUND
// =========================================================

const LoaderBackground = memo(() => {
    return (
        <div
            aria-hidden="true"
            className="
                pointer-events-none
                absolute
                inset-0
                overflow-hidden
            "
        >
            {/* GRID PATTERN */}

            <div
                className="
                    absolute
                    inset-0

                    opacity-40

                    dark:opacity-25
                "
                style={{
                    backgroundImage: `
                        linear-gradient(
                            rgba(99, 102, 241, 0.065) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(99, 102, 241, 0.065) 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: "36px 36px",
                }}
            />

            {/* TOP GLOW */}

            <div
                className="
                    absolute
                    left-1/2
                    top-[12%]

                    h-64
                    w-64

                    -translate-x-1/2

                    rounded-full

                    bg-indigo-500/10

                    blur-[90px]

                    sm:h-96
                    sm:w-96

                    dark:bg-indigo-500/15
                "
            />

            {/* LEFT GLOW */}

            <div
                className="
                    absolute
                    -left-24
                    bottom-[15%]

                    h-64
                    w-64

                    rounded-full

                    bg-cyan-500/[0.06]

                    blur-[100px]

                    dark:bg-cyan-400/[0.07]
                "
            />

            {/* RIGHT GLOW */}

            <div
                className="
                    absolute
                    -right-24
                    top-[30%]

                    h-64
                    w-64

                    rounded-full

                    bg-violet-500/[0.07]

                    blur-[100px]

                    dark:bg-violet-400/[0.08]
                "
            />

            {/* EDGE VIGNETTE */}

            <div
                className="
                    absolute
                    inset-0

                    bg-gradient-to-b

                    from-white/30
                    via-transparent
                    to-slate-100/60

                    dark:from-black/10
                    dark:via-transparent
                    dark:to-black/30
                "
            />
        </div>
    );
});

// =========================================================
// ANIMATED LOGO
// =========================================================

const LoaderLogo = memo(({
    reducedMotion = false,
}) => {
    return (
        <div
            className="
                relative

                mx-auto

                flex
                h-44
                w-44

                shrink-0

                items-center
                justify-center

                sm:h-56
                sm:w-56

                md:h-60
                md:w-60
            "
        >
            {/* ======================================
                OUTER ROTATING RING
            ====================================== */}

            <motion.div
                aria-hidden="true"

                animate={
                    reducedMotion
                        ? undefined
                        : { rotate: 360 }
                }

                transition={
                    OUTER_RING_TRANSITION
                }

                className="
                    absolute
                    inset-0

                    rounded-full

                    border-2
                    border-transparent

                    border-t-indigo-500/60
                    border-b-cyan-500/40

                    dark:border-t-indigo-400/70
                    dark:border-b-cyan-400/50
                "
            />

            {/* ======================================
                OUTER RING DETAIL
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    absolute
                    inset-2

                    rounded-full

                    border
                    border-indigo-200/80

                    dark:border-indigo-400/10
                "
            />

            {/* ======================================
                INNER ROTATING RING
            ====================================== */}

            <motion.div
                aria-hidden="true"

                animate={
                    reducedMotion
                        ? undefined
                        : { rotate: -360 }
                }

                transition={
                    INNER_RING_TRANSITION
                }

                className="
                    absolute
                    inset-4

                    rounded-full

                    border-2
                    border-transparent

                    border-l-indigo-500
                    border-r-cyan-500

                    shadow-[0_0_25px_rgba(99,102,241,0.12)]

                    dark:border-l-indigo-400
                    dark:border-r-cyan-400

                    dark:shadow-[0_0_30px_rgba(99,102,241,0.2)]
                "
            />

            {/* ======================================
                INNER GLASS CIRCLE
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    absolute
                    inset-[18%]

                    rounded-full

                    border
                    border-white/90

                    bg-white/70

                    shadow-[0_0_45px_rgba(99,102,241,0.08)]

                    backdrop-blur-sm

                    dark:border-white/[0.08]
                    dark:bg-[#101629]/80

                    dark:shadow-[0_0_45px_rgba(99,102,241,0.16)]
                "
            />

            {/* ======================================
                CENTRAL LOGO
            ====================================== */}

            <motion.img
                src={FSocietyLogo}

                alt="FSociety logotipi"

                draggable={false}

                initial={
                    reducedMotion
                        ? false
                        : {
                            opacity: 0,
                            scale: 0.9,
                        }
                }

                animate={
                    reducedMotion
                        ? {
                            opacity: 1,
                            scale: 1,
                        }
                        : {
                            opacity: 1,
                            scale: [1, 1.045, 1],
                        }
                }

                transition={
                    reducedMotion
                        ? { duration: 0 }
                        : LOGO_TRANSITION
                }

                className="
                    relative
                    z-10

                    h-28
                    w-28

                    select-none

                    object-contain

                    sm:h-36
                    sm:w-36

                    md:h-40
                    md:w-40

                    drop-shadow-[0_0_15px_rgba(99,102,241,0.18)]

                    dark:drop-shadow-[0_0_20px_rgba(99,102,241,0.28)]
                "
            />

            {/* ======================================
                SCANNING LINE
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-[18%]

                    z-20

                    overflow-hidden

                    rounded-full
                "
            >
                <motion.div
                    initial={false}

                    animate={
                        reducedMotion
                            ? undefined
                            : {
                                top: [
                                    "8%",
                                    "92%",
                                    "8%",
                                ],
                            }
                    }

                    transition={
                        SCAN_TRANSITION
                    }

                    className="
                        absolute
                        left-[10%]
                        right-[10%]
                        top-[8%]

                        h-px

                        bg-gradient-to-r

                        from-transparent
                        via-indigo-500/75
                        to-transparent

                        shadow-[0_0_12px_rgba(99,102,241,0.55)]

                        dark:via-cyan-400/70
                    "
                />
            </div>

            {/* ======================================
                CENTER BOTTOM INDICATOR
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    absolute
                    -bottom-3

                    flex
                    items-center
                    gap-2
                "
            >
                <span
                    className="
                        h-1.5
                        w-1.5

                        rounded-full

                        bg-indigo-500

                        dark:bg-indigo-400
                    "
                />

                <span
                    className="
                        h-1
                        w-8

                        rounded-full

                        bg-gradient-to-r

                        from-indigo-500/60
                        to-cyan-500/60
                    "
                />

                <span
                    className="
                        h-1.5
                        w-1.5

                        rounded-full

                        bg-cyan-500

                        dark:bg-cyan-400
                    "
                />
            </div>
        </div>
    );
});

// =========================================================
// LOADING PROGRESS
// =========================================================

const LoaderProgress = memo(({
    reducedMotion = false,
}) => {
    return (
        <div
            className="
                mx-auto
                mt-7

                w-full
                max-w-64

                sm:max-w-72
            "
        >
            {/* PROGRESS TRACK */}

            <div
                role="progressbar"

                aria-label="FSociety yuklanmoqda"

                className="
                    relative

                    h-1.5
                    w-full

                    overflow-hidden

                    rounded-full

                    border
                    border-indigo-200

                    bg-slate-200/80

                    dark:border-white/[0.09]
                    dark:bg-white/[0.06]
                "
            >
                {/* INDETERMINATE BAR */}

                <motion.div
                    initial={
                        reducedMotion
                            ? false
                            : { x: "-100%" }
                    }

                    animate={
                        reducedMotion
                            ? {
                                x: "0%",
                            }
                            : {
                                x: [
                                    "-100%",
                                    "100%",
                                ],
                            }
                    }

                    transition={
                        reducedMotion
                            ? { duration: 0 }
                            : PROGRESS_TRANSITION
                    }

                    className="
                        h-full
                        w-full

                        bg-gradient-to-r

                        from-transparent
                        via-indigo-500
                        to-transparent

                        dark:via-indigo-400
                    "
                />
            </div>

            {/* PROGRESS LABELS */}

            <div
                aria-hidden="true"

                className="
                    mt-3

                    flex
                    items-center
                    justify-between

                    font-mono
                    text-[10px]

                    uppercase
                    tracking-wider

                    text-slate-500

                    dark:text-slate-400
                "
            >
                <span>
                    System startup
                </span>

                <span
                    className="
                        text-indigo-600

                        dark:text-indigo-400
                    "
                >
                    Loading...
                </span>
            </div>
        </div>
    );
});

// =========================================================
// TEXT CONTENT
// =========================================================

const LoaderText = memo(({
    reducedMotion = false,
}) => {
    return (
        <div
            className="
                mt-10

                w-full

                text-center

                sm:mt-12
            "
        >
            {/* ======================================
                SYSTEM LABEL
            ====================================== */}

            <p
                className="
                    mb-4

                    font-mono
                    text-[10px]
                    font-black

                    uppercase

                    tracking-[0.16em]

                    text-indigo-600

                    sm:text-xs

                    dark:text-indigo-400
                "
            >
                fsociety://system.init
            </p>

            {/* ======================================
                BRAND TITLE
            ====================================== */}

            <motion.h1
                initial={
                    reducedMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 12,
                        }
                }

                animate={{
                    opacity: 1,
                    y: 0,
                }}

                transition={{
                    duration:
                        reducedMotion ? 0 : 0.55,

                    ease: "easeOut",
                }}

                className="
                    font-black

                    text-3xl

                    uppercase

                    italic

                    tracking-[0.12em]

                    text-slate-900

                    sm:text-4xl
                    sm:tracking-[0.16em]

                    md:text-5xl

                    dark:text-white
                "
            >
                F

                <span
                    className="
                        bg-gradient-to-r

                        from-indigo-600
                        via-violet-600
                        to-cyan-600

                        bg-clip-text
                        text-transparent

                        dark:from-indigo-400
                        dark:via-violet-400
                        dark:to-cyan-400
                    "
                >
                    Society
                </span>
            </motion.h1>

            {/* ======================================
                DESCRIPTION
            ====================================== */}

            <motion.p
                initial={false}

                animate={
                    reducedMotion
                        ? undefined
                        : {
                            opacity: [
                                0.55,
                                1,
                                0.55,
                            ],
                        }
                }

                transition={
                    TEXT_TRANSITION
                }

                className="
                    mx-auto
                    mt-5

                    max-w-sm

                    font-mono

                    text-[11px]
                    font-semibold

                    uppercase

                    tracking-[0.1em]

                    text-indigo-700

                    sm:text-sm

                    dark:text-indigo-300
                "
            >
                Initializing system scan...
            </motion.p>

            {/* ======================================
                SUBTITLE
            ====================================== */}

            <p
                className="
                    mx-auto
                    mt-3

                    max-w-xs

                    text-xs
                    leading-6

                    text-slate-500

                    sm:text-sm

                    dark:text-slate-400
                "
            >
                FSociety tizimi yuklanmoqda.
                Iltimos, biroz kuting.
            </p>
        </div>
    );
});

// =========================================================
// BINARY DECORATION
// =========================================================

const LoaderBinary = memo(() => {
    return (
        <p
            aria-hidden="true"

            className="
                mx-auto

                mt-14

                hidden

                max-w-2xl

                select-none

                break-all

                text-center

                font-mono
                text-[10px]

                leading-6

                tracking-wider

                text-indigo-300/60

                sm:block

                dark:text-indigo-400/20
            "
        >
            01010100 01101000 01100101 00100000
            01110111 01101111 01110010 01101100
            01100100 00100000 01101001 01110011
            00100000 01101111 01110101 01110010
            01110011
        </p>
    );
});

// =========================================================
// MAIN APP LOADER
// =========================================================

const AppLoader = () => {
    // =====================================================
    // ACCESSIBILITY
    //
    // Respect operating system preference.
    //
    // Users with reduced motion enabled
    // should not see infinite rotations.
    // =====================================================

    const reducedMotion = Boolean(
        useReducedMotion()
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            role="status"

            aria-live="polite"

            aria-busy="true"

            aria-label="FSociety yuklanmoqda"

            className="
                relative

                isolate

                flex

                min-h-screen
                min-h-[100dvh]

                w-full
                min-w-0

                items-center
                justify-center

                overflow-x-hidden

                bg-gradient-to-br

                from-slate-50
                via-white
                to-indigo-50/60

                px-4
                py-12

                text-slate-900

                sm:px-6

                dark:from-[#05070a]
                dark:via-[#080d17]
                dark:to-[#0a1020]

                dark:text-white
            "
        >
            {/* ======================================
                BACKGROUND
            ====================================== */}

            <LoaderBackground />

            {/* ======================================
                CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    flex
                    w-full
                    max-w-2xl

                    flex-col

                    items-center
                    justify-center
                "
            >
                {/* ANIMATED LOGO */}

                <LoaderLogo
                    reducedMotion={
                        reducedMotion
                    }
                />

                {/* BRAND AND TEXT */}

                <LoaderText
                    reducedMotion={
                        reducedMotion
                    }
                />

                {/* PROGRESS */}

                <LoaderProgress
                    reducedMotion={
                        reducedMotion
                    }
                />

                {/* BINARY DECORATION */}

                <LoaderBinary />
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(AppLoader);
