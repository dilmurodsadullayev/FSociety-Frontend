
import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

// =========================================================
// FSOCIETY — SHARED BACKGROUND
// =========================================================

import PageGridBackground from "./ui/PageGridBackground";

// =========================================================
// ASSETS
// =========================================================

import FSocietyLogo from "../assests/logo/f_society.png";

// =========================================================
// FSOCIETY — GLOBAL APPLICATION LOADER
//
// Features:
//
// - Shared futuristic PageGridBackground
// - Light / Dark Mode
// - Responsive design
// - Animated outer and inner rings
// - Animated FSociety logo
// - Scanning line
// - System initialization text
// - Indeterminate progress bar
// - Binary code decoration
// - React.memo optimization
// - Reduced-motion accessibility
//
// No API calls.
// No timers.
// No artificial loading delays.
//
// This component can be used in:
// - App.js
// - PrivateRoute
// - PublicAuthPage
// - Suspense fallback
// =========================================================

// =========================================================
// ANIMATION CONFIGURATION
//
// Static constants prevent creating unnecessary
// animation configuration objects on every render.
// =========================================================

const OUTER_RING_ANIMATION = {
    rotate: 360,
};

const INNER_RING_ANIMATION = {
    rotate: -360,
};

const OUTER_RING_TRANSITION = {
    duration: 12,
    repeat: Infinity,
    ease: "linear",
};

const INNER_RING_TRANSITION = {
    duration: 6,
    repeat: Infinity,
    ease: "linear",
};

const LOGO_ANIMATION = {
    opacity: 1,
    scale: [1, 1.045, 1],
};

const LOGO_STATIC_ANIMATION = {
    opacity: 1,
    scale: 1,
};

const LOGO_INITIAL = {
    opacity: 0,
    scale: 0.9,
};

const LOGO_TRANSITION = {
    scale: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
    },

    opacity: {
        duration: 0.45,
        ease: "easeOut",
    },
};

const STATIC_TRANSITION = {
    duration: 0,
};

const SCAN_ANIMATION = {
    top: ["8%", "92%", "8%"],
};

const SCAN_TRANSITION = {
    duration: 3.5,
    repeat: Infinity,
    ease: "easeInOut",
};

const PROGRESS_INITIAL = {
    x: "-100%",
};

const PROGRESS_ANIMATION = {
    x: ["-100%", "100%"],
};

const PROGRESS_STATIC = {
    x: "0%",
};

const PROGRESS_TRANSITION = {
    duration: 1.8,
    repeat: Infinity,
    ease: "easeInOut",
};

const TEXT_ANIMATION = {
    opacity: [0.55, 1, 0.55],
};

const TEXT_TRANSITION = {
    duration: 2.2,
    repeat: Infinity,
    ease: "easeInOut",
};

const TITLE_INITIAL = {
    opacity: 0,
    y: 12,
};

const TITLE_ANIMATION = {
    opacity: 1,
    y: 0,
};

const TITLE_TRANSITION = {
    duration: 0.55,
    ease: "easeOut",
};

// =========================================================
// LOADER LOGO
//
// Preserves:
// - Outer rotating ring
// - Inner rotating ring
// - Glass background
// - Logo pulse
// - Scanning line
// - Bottom system indicator
// =========================================================

const LoaderLogo = memo(function LoaderLogo({
    reducedMotion = false,
}) {
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

                initial={false}

                animate={
                    reducedMotion
                        ? undefined
                        : OUTER_RING_ANIMATION
                }

                transition={
                    reducedMotion
                        ? STATIC_TRANSITION
                        : OUTER_RING_TRANSITION
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

                    dark:border-indigo-400/15
                "
            />

            {/* ======================================
                INNER ROTATING RING
            ====================================== */}

            <motion.div
                aria-hidden="true"

                initial={false}

                animate={
                    reducedMotion
                        ? undefined
                        : INNER_RING_ANIMATION
                }

                transition={
                    reducedMotion
                        ? STATIC_TRANSITION
                        : INNER_RING_TRANSITION
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

                    dark:shadow-[0_0_30px_rgba(99,102,241,0.20)]
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
                CENTER LOGO
            ====================================== */}

            <motion.img
                src={FSocietyLogo}

                alt="FSociety logotipi"

                draggable={false}

                initial={
                    reducedMotion
                        ? false
                        : LOGO_INITIAL
                }

                animate={
                    reducedMotion
                        ? LOGO_STATIC_ANIMATION
                        : LOGO_ANIMATION
                }

                transition={
                    reducedMotion
                        ? STATIC_TRANSITION
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
                            : SCAN_ANIMATION
                    }

                    transition={
                        reducedMotion
                            ? STATIC_TRANSITION
                            : SCAN_TRANSITION
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
                BOTTOM INDICATOR
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
// LOADER TEXT
//
// Preserves:
// - FSociety system label
// - Animated brand title
// - Initializing system scan
// - Loading description
// =========================================================

const LoaderText = memo(function LoaderText({
    reducedMotion = false,
}) {
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

                    text-indigo-700

                    sm:text-xs

                    dark:text-indigo-300
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
                        : TITLE_INITIAL
                }

                animate={TITLE_ANIMATION}

                transition={
                    reducedMotion
                        ? STATIC_TRANSITION
                        : TITLE_TRANSITION
                }

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
                F.

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
                SYSTEM MESSAGE
            ====================================== */}

            <motion.p
                initial={false}

                animate={
                    reducedMotion
                        ? undefined
                        : TEXT_ANIMATION
                }

                transition={
                    reducedMotion
                        ? STATIC_TRANSITION
                        : TEXT_TRANSITION
                }

                className="
                    mx-auto
                    mt-5

                    max-w-sm

                    font-mono

                    text-[11px]
                    font-semibold

                    uppercase

                    tracking-[0.10em]

                    text-indigo-700

                    sm:text-sm

                    dark:text-indigo-300
                "
            >
                Initializing system scan...
            </motion.p>

            {/* ======================================
                DESCRIPTION
            ====================================== */}

            <p
                className="
                    mx-auto
                    mt-3

                    max-w-xs

                    text-xs
                    leading-6

                    text-slate-600

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
// LOADING PROGRESS
//
// This is an indeterminate progress indicator.
//
// It does not represent a real download percentage.
// =========================================================

const LoaderProgress = memo(function LoaderProgress({
    reducedMotion = false,
}) {
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
            {/* ======================================
                PROGRESS TRACK
            ====================================== */}

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
                {/* ==================================
                    PROGRESS ANIMATION
                ================================== */}

                <motion.div
                    initial={
                        reducedMotion
                            ? false
                            : PROGRESS_INITIAL
                    }

                    animate={
                        reducedMotion
                            ? PROGRESS_STATIC
                            : PROGRESS_ANIMATION
                    }

                    transition={
                        reducedMotion
                            ? STATIC_TRANSITION
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

            {/* ======================================
                PROGRESS LABELS
            ====================================== */}

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
// DECORATIVE BINARY CODE
// =========================================================

const LoaderBinary = memo(function LoaderBinary() {
    return (
        <p
            aria-hidden="true"

            className="
                mx-auto
                mt-12

                hidden

                max-w-2xl

                select-none

                break-all

                text-center

                font-mono
                text-[10px]

                leading-6

                tracking-wider

                text-indigo-600/25

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
// MAIN APPLICATION LOADER
//
// All visual sections use one shared background.
//
// PageGridBackground provides:
// - Grid
// - Network lines
// - Glowing nodes
// - 3D FS cubes
// - FS watermark
// - Light / Dark Mode
//
// No duplicate LoaderBackground needed.
// =========================================================

const AppLoader = () => {
    // =====================================================
    // REDUCED MOTION
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

                bg-[#edf4ff]

                px-4
                py-10

                text-slate-900

                sm:px-6
                sm:py-12

                dark:bg-[#060b15]
                dark:text-white
            "
        >
            {/* ======================================
                SHARED FUTURISTIC BACKGROUND

                Uses the same background component
                as the rest of FSociety.

                Background must stay behind the
                loader and not intercept clicks.
            ====================================== */}

            <PageGridBackground
                showMonogram
                showCubes
            />

            {/* ======================================
                LOADER CONTENT

                relative z-10:
                Keeps content above background.

                max-w-2xl:
                Responsive content container.
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    flex

                    w-full
                    min-w-0
                    max-w-2xl

                    flex-col

                    items-center
                    justify-center
                "
            >
                {/* ==================================
                    ANIMATED FSOCIETY LOGO
                ================================== */}

                <LoaderLogo
                    reducedMotion={reducedMotion}
                />

                {/* ==================================
                    BRAND AND LOADING TEXT
                ================================== */}

                <LoaderText
                    reducedMotion={reducedMotion}
                />

                {/* ==================================
                    LOADING PROGRESS
                ================================== */}

                <LoaderProgress
                    reducedMotion={reducedMotion}
                />

                {/* ==================================
                    BINARY CODE DECORATION
                ================================== */}

                <LoaderBinary />
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(AppLoader);
