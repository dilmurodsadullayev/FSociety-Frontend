
// src/components/daily-gift/GiftBox3D.jsx

import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    CalendarClock,
    Sparkles,
} from "lucide-react";


// =========================================================
// FSOCIETY — CSS 3D MYSTERY GIFT BOX
// =========================================================
//
// Props:
//
// phase:
// - idle: closed box
// - opening: waiting for backend claim response
// - revealed: backend confirmed reward
//
// rarity:
// - common
// - rare
// - epic
// - legendary
//
// This is a visual component only.
//
// No API calls.
// No Redux state.
// No reward selection.
// No FCoin modification.
//
// =========================================================


// =========================================================
// STATIC DECORATIVE PARTICLES
// =========================================================

const PARTICLES = [
    { x: 9,  y: 18, size: 3, delay: 0.0 },
    { x: 20, y: 52, size: 2, delay: 0.6 },
    { x: 29, y: 12, size: 3, delay: 1.2 },
    { x: 76, y: 16, size: 2, delay: 0.3 },
    { x: 89, y: 36, size: 4, delay: 1.5 },
    { x: 84, y: 73, size: 2, delay: 0.8 },
    { x: 18, y: 79, size: 3, delay: 1.8 },
    { x: 67, y: 91, size: 2, delay: 1.1 },
    { x: 95, y: 58, size: 2, delay: 0.4 },
    { x: 41, y: 87, size: 3, delay: 1.6 },
];


// =========================================================
// RARITY GLOW
// =========================================================

const RARITY_GLOW = Object.freeze({

    common: {
        glow: "bg-cyan-400/20 dark:bg-cyan-400/25",
        ring: "border-cyan-400/30",
    },

    rare: {
        glow: "bg-blue-400/25 dark:bg-blue-500/30",
        ring: "border-blue-400/40",
    },

    epic: {
        glow: "bg-violet-400/30 dark:bg-violet-500/35",
        ring: "border-violet-400/50",
    },

    legendary: {
        glow: "bg-amber-400/35 dark:bg-amber-400/40",
        ring: "border-amber-400/60",
    },
});


// =========================================================
// 3D FACE STYLES
// =========================================================

const BODY_FACE = `
    absolute inset-0
    overflow-hidden
    border border-cyan-200/50
    dark:border-cyan-300/40
`;

const RIBBON_VERTICAL = `
    absolute inset-y-0
    left-1/2
    w-[22px]
    -translate-x-1/2

    bg-gradient-to-r
    from-sky-300
    via-cyan-50
    to-sky-400

    shadow-[0_0_12px_rgba(165,243,252,0.22)]
`;


// =========================================================
// MAIN COMPONENT
// =========================================================

function GiftBox3D({
    phase = "idle",
    rarity = "common",
    isScheduled = false,
    className = "",
}) {

    const shouldReduceMotion =
        useReducedMotion();

    const isOpening =
        phase === "opening";

    const isRevealed =
        phase === "revealed";

    const glow =
        RARITY_GLOW[rarity]
        ??
        RARITY_GLOW.common;


    // =====================================================
    // LID TRANSFORMATION
    //
    // The lid remains physically closed during
    // pending server requests.
    //
    // It only opens after a confirmed reward.
    // =====================================================

    const lidTransform = isRevealed

        ? "translate3d(5px, -105px, 24px) rotateZ(-14deg)"

        : "translate3d(0px, 0px, 0px) rotateZ(0deg)";


    // =====================================================
    // FLOAT ANIMATION
    // =====================================================

    const floatingAnimation = shouldReduceMotion

        ? undefined

        : isOpening

            ? {
                y: [0, -5, 3, -4, 0],
                rotateZ: [0, -2, 2, -1, 0],
            }

            : {
                y: [0, -7, 0],
                rotateZ: 0,
            };


    const floatingTransition = {

        duration: isOpening ? 0.65 : 3.6,

        repeat: Infinity,

        ease: "easeInOut",
    };


    return (

        <div
            aria-hidden="true"
            className={`
                relative isolate

                flex h-[245px]
                w-full

                items-center justify-center

                overflow-hidden

                sm:h-[275px]

                ${className}
            `}
        >

            {/* ==========================================
                AMBIENT BACKGROUND LIGHT
            ========================================== */}

            <div
                className={`
                    pointer-events-none

                    absolute left-1/2 top-[43%]

                    h-48 w-48
                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full blur-3xl

                    transition-all duration-700

                    ${glow.glow}

                    ${
                        isRevealed
                            ? "scale-125 opacity-100"
                            : "scale-90 opacity-70"
                    }

                    motion-reduce:transition-none
                `}
            />


            {/* ==========================================
                OUTER HOLOGRAPHIC RING
            ========================================== */}

            <div
                className={`
                    pointer-events-none

                    absolute left-1/2 top-1/2

                    h-[205px] w-[205px]

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full
                    border border-dashed

                    ${glow.ring}

                    sm:h-[230px] sm:w-[230px]
                `}
            />


            {/* ==========================================
                PARTICLES
            ========================================== */}

            {PARTICLES.map((particle, index) => (

                <motion.span
                    key={index}
                    className="
                        pointer-events-none
                        absolute z-10

                        rounded-full

                        bg-cyan-300
                        dark:bg-cyan-200

                        shadow-[0_0_10px_rgba(103,232,249,0.6)]
                    "
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={
                        shouldReduceMotion

                            ? undefined

                            : {
                                opacity: [
                                    0.2,
                                    0.9,
                                    0.2,
                                ],

                                scale: [
                                    0.75,
                                    1.35,
                                    0.75,
                                ],
                            }
                    }
                    transition={{
                        duration: 2.2,

                        delay: particle.delay,

                        repeat: Infinity,

                        ease: "easeInOut",
                    }}
                />

            ))}


            {/* ==========================================
                EVENT SCHEDULE INDICATOR
            ========================================== */}

            {isScheduled && (

                <div
                    className="
                        absolute right-4 top-3 z-20

                        flex h-9 w-9

                        items-center justify-center

                        rounded-xl border

                        border-violet-400/30

                        bg-violet-400/10
                        text-violet-600

                        dark:text-violet-300
                    "
                >

                    <CalendarClock size={19}/>

                </div>

            )}


            {/* ==========================================
                FLOOR SHADOW
            ========================================== */}

            <div
                className="
                    pointer-events-none

                    absolute bottom-[24px]
                    left-1/2

                    h-[24px] w-[175px]

                    -translate-x-1/2

                    rounded-full

                    bg-slate-950/40
                    dark:bg-black/60

                    blur-xl
                "
            />


            {/* ==========================================
                3D PERSPECTIVE SCENE
            ========================================== */}

            <div
                className="
                    absolute left-1/2
                    top-[57%]

                    -translate-x-1/2
                    -translate-y-1/2
                "
                style={{
                    perspective: "900px",
                }}
            >

                <motion.div
                    className="
                        relative

                        h-[112px]
                        w-[148px]

                        transform-gpu
                    "
                    animate={floatingAnimation}
                    transition={floatingTransition}
                >

                    {/* ==================================
                        BODY ROTATION

                        Parent rotation makes the front,
                        right side and lid top visible.
                    ================================== */}

                    <div
                        className="
                            relative h-full w-full
                        "
                        style={{
                            transformStyle:
                                "preserve-3d",

                            transform:
                                "rotateX(-19deg) rotateY(-29deg)",
                        }}
                    >

                        {/* ==============================
                            INNER LIGHT
                        ============================== */}

                        <div
                            className={`
                                pointer-events-none
                                absolute

                                left-1/2 top-0

                                h-28 w-28

                                -translate-x-1/2
                                -translate-y-1/2

                                rounded-full
                                blur-2xl

                                bg-cyan-200/80

                                transition-opacity
                                duration-700

                                ${
                                    isRevealed
                                        ? "opacity-100"
                                        : "opacity-0"
                                }
                            `}
                            style={{
                                transform:
                                    "translateZ(0px)",
                            }}
                        />


                        {/* ==============================
                            BACK FACE
                        ============================== */}

                        <div
                            className={BODY_FACE}
                            style={{
                                transform:
                                    "rotateY(180deg) translateZ(74px)",

                                background:
                                    "linear-gradient(135deg, #155E75, #082F49)",

                                backfaceVisibility:
                                    "hidden",
                            }}
                        />


                        {/* ==============================
                            LEFT FACE
                        ============================== */}

                        <div
                            className={BODY_FACE}
                            style={{
                                transform:
                                    "rotateY(-90deg) translateZ(74px)",

                                background:
                                    "linear-gradient(90deg, #082F49, #155E75)",

                                backfaceVisibility:
                                    "hidden",
                            }}
                        >

                            <span
                                className={
                                    RIBBON_VERTICAL
                                }
                            />

                        </div>


                        {/* ==============================
                            RIGHT FACE
                        ============================== */}

                        <div
                            className={BODY_FACE}
                            style={{
                                transform:
                                    "rotateY(90deg) translateZ(74px)",

                                background:
                                    "linear-gradient(90deg, #164E63, #0E7490)",

                                backfaceVisibility:
                                    "hidden",
                            }}
                        >

                            <span
                                className={
                                    RIBBON_VERTICAL
                                }
                            />

                        </div>


                        {/* ==============================
                            BOTTOM FACE
                        ============================== */}

                        <div
                            className="
                                absolute

                                h-[148px]
                                w-[148px]

                                bg-slate-950
                            "
                            style={{
                                top: -18,

                                transform:
                                    "rotateX(-90deg) translateZ(56px)",
                            }}
                        />


                        {/* ==============================
                            TOP FACE
                        ============================== */}

                        <div
                            className="
                                absolute

                                h-[148px]
                                w-[148px]

                                border border-cyan-200/50

                                bg-gradient-to-br
                                from-cyan-800
                                to-sky-950
                            "
                            style={{
                                top: -18,

                                transform:
                                    "rotateX(90deg) translateZ(56px)",

                                backfaceVisibility:
                                    "hidden",
                            }}
                        />


                        {/* ==============================
                            FRONT FACE
                        ============================== */}

                        <div
                            className={BODY_FACE}
                            style={{
                                transform:
                                    "translateZ(74px)",

                                background:
                                    "linear-gradient(135deg, #0E7490 0%, #164E63 48%, #082F49 100%)",

                                boxShadow:
                                    "inset 0 0 32px rgba(34,211,238,0.13)",

                                backfaceVisibility:
                                    "hidden",
                            }}
                        >

                            {/* Ribbon */}

                            <span
                                className={
                                    RIBBON_VERTICAL
                                }
                            />


                            {/* Horizontal ribbon */}

                            <span
                                className="
                                    absolute left-0
                                    right-0 top-[46%]

                                    h-[19px]

                                    bg-gradient-to-b

                                    from-cyan-100
                                    via-sky-300
                                    to-cyan-500
                                "
                            />


                            {/* Front emblem */}

                            <div
                                className="
                                    absolute left-1/2
                                    top-1/2

                                    flex h-10 w-10

                                    -translate-x-1/2
                                    -translate-y-1/2

                                    items-center justify-center

                                    rounded-xl border

                                    border-white/50

                                    bg-sky-950/80

                                    shadow-lg
                                "
                            >

                                <Sparkles
                                    size={19}
                                    className="
                                        text-cyan-100
                                    "
                                />

                            </div>

                        </div>


                        {/* ==============================
                            3D LID

                            The lid opens only when
                            phase === "revealed".
                        ============================== */}

                        <div
                            className="
                                absolute

                                left-[-8px]
                                top-[-22px]

                                h-[30px]
                                w-[164px]
                            "
                            style={{
                                transformStyle:
                                    "preserve-3d",

                                transform:
                                    lidTransform,

                                transition:
                                    shouldReduceMotion

                                        ? "none"

                                        : "transform 950ms cubic-bezier(.2,.8,.2,1)",
                            }}
                        >

                            {/* Lid back */}

                            <div
                                className="
                                    absolute inset-0

                                    bg-cyan-900

                                    border border-cyan-200/60
                                "
                                style={{
                                    transform:
                                        "rotateY(180deg) translateZ(82px)",
                                }}
                            />


                            {/* Lid left */}

                            <div
                                className="
                                    absolute inset-0

                                    bg-cyan-800

                                    border border-cyan-200/60
                                "
                                style={{
                                    transform:
                                        "rotateY(-90deg) translateZ(82px)",
                                }}
                            />


                            {/* Lid right */}

                            <div
                                className="
                                    absolute inset-0

                                    bg-cyan-700

                                    border border-cyan-200/60
                                "
                                style={{
                                    transform:
                                        "rotateY(90deg) translateZ(82px)",
                                }}
                            />


                            {/* Lid front */}

                            <div
                                className="
                                    absolute inset-0

                                    overflow-hidden

                                    border border-cyan-100/70

                                    bg-gradient-to-r
                                    from-cyan-700
                                    via-sky-600
                                    to-cyan-800
                                "
                                style={{
                                    transform:
                                        "translateZ(82px)",
                                }}
                            >

                                <span
                                    className={
                                        RIBBON_VERTICAL
                                    }
                                />

                            </div>


                            {/* Lid top */}

                            <div
                                className="
                                    absolute

                                    h-[164px]
                                    w-[164px]

                                    border border-cyan-100/70

                                    bg-gradient-to-br
                                    from-cyan-500
                                    via-sky-700
                                    to-cyan-950
                                "
                                style={{
                                    top: -67,

                                    transform:
                                        "rotateX(90deg) translateZ(15px)",

                                    transformStyle:
                                        "preserve-3d",
                                }}
                            >

                                {/* Cross ribbons */}

                                <span
                                    className="
                                        absolute inset-y-0
                                        left-1/2

                                        w-[26px]
                                        -translate-x-1/2

                                        bg-gradient-to-r
                                        from-cyan-100
                                        via-white
                                        to-sky-300
                                    "
                                />

                                <span
                                    className="
                                        absolute inset-x-0
                                        top-1/2

                                        h-[26px]
                                        -translate-y-1/2

                                        bg-gradient-to-b
                                        from-cyan-100
                                        via-white
                                        to-sky-300
                                    "
                                />


                                {/* Gift bow */}

                                <div
                                    className="
                                        absolute left-1/2
                                        top-1/2

                                        -translate-x-1/2
                                        -translate-y-1/2

                                        h-[55px]
                                        w-[104px]
                                    "
                                >

                                    <span
                                        className="
                                            absolute left-1
                                            top-2

                                            h-9 w-12

                                            rotate-[-25deg]

                                            rounded-[70%_30%_65%_35%]

                                            border-[5px]
                                            border-cyan-100

                                            bg-sky-200/40

                                            shadow-lg
                                        "
                                    />

                                    <span
                                        className="
                                            absolute right-1
                                            top-2

                                            h-9 w-12

                                            rotate-[25deg]

                                            rounded-[30%_70%_35%_65%]

                                            border-[5px]
                                            border-cyan-100

                                            bg-sky-200/40

                                            shadow-lg
                                        "
                                    />

                                    <span
                                        className="
                                            absolute left-1/2
                                            top-1/2

                                            h-7 w-7

                                            -translate-x-1/2
                                            -translate-y-1/2

                                            rounded-full

                                            border-[5px]
                                            border-white

                                            bg-cyan-300

                                            shadow-md
                                        "
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>


            {/* ==========================================
                REVEAL PARTICLE GLOW
            ========================================== */}

            {isRevealed && (

                <motion.div
                    className="
                        pointer-events-none

                        absolute left-1/2
                        top-[34%]

                        h-24 w-24

                        -translate-x-1/2

                        rounded-full

                        bg-cyan-200/60

                        blur-2xl
                    "
                    initial={
                        shouldReduceMotion
                            ? false
                            : {
                                opacity: 0,
                                scale: 0.4,
                            }
                    }
                    animate={{
                        opacity: 0.9,
                        scale: 2.2,
                    }}
                    transition={{
                        duration: shouldReduceMotion
                            ? 0
                            : 0.9,
                    }}
                />

            )}

        </div>
    );
}


// =========================================================
// EXPORT
// =========================================================

export default memo(GiftBox3D);
