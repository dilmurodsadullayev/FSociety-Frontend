
// src/components/daily-gift/RewardRevealEffects.jsx

import React, { memo } from "react";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

// =========================================================
// FSOCIETY — REWARD REVEAL EFFECTS
// =========================================================
//
// A purely visual component.
//
// Supported modes:
// - burst: one-time particle explosion
// - ambient: subtle static reward-card glow
//
// Supported rarities:
// - common
// - rare
// - epic
// - legendary
//
// IMPORTANT:
// - Does not choose rewards
// - Does not make API requests
// - Does not modify Redux
// - Does not grant coins or badges
// - Only render after backend confirmation
// =========================================================

const EFFECT_STYLES = Object.freeze({
    common: {
        glow: "bg-slate-300/35 dark:bg-slate-300/25",
        ring: "border-slate-300/70 dark:border-slate-300/60",
        particle: "bg-slate-200 dark:bg-slate-100",
        center: "bg-slate-200/70 dark:bg-slate-200/50",
    },

    rare: {
        glow: "bg-blue-400/35 dark:bg-sky-400/30",
        ring: "border-blue-400/70 dark:border-sky-300/70",
        particle: "bg-sky-300 dark:bg-cyan-200",
        center: "bg-sky-300/70 dark:bg-cyan-200/60",
    },

    epic: {
        glow: "bg-violet-400/40 dark:bg-fuchsia-500/30",
        ring: "border-violet-400/70 dark:border-fuchsia-300/70",
        particle: "bg-fuchsia-300 dark:bg-violet-200",
        center: "bg-fuchsia-300/70 dark:bg-violet-300/60",
    },

    legendary: {
        glow: "bg-amber-400/45 dark:bg-amber-400/35",
        ring: "border-amber-400/80 dark:border-yellow-300/80",
        particle: "bg-yellow-300 dark:bg-amber-200",
        center: "bg-amber-200/80 dark:bg-yellow-200/70",
    },
});

// Deterministic particles.
// No Math.random() during render.

const PARTICLES = Object.freeze([
    { id: 1, x: -125, y: -85, size: 5, delay: 0.00 },
    { id: 2, x: -90, y: -145, size: 7, delay: 0.04 },
    { id: 3, x: -40, y: -175, size: 4, delay: 0.08 },
    { id: 4, x: 30, y: -175, size: 6, delay: 0.02 },
    { id: 5, x: 95, y: -135, size: 5, delay: 0.10 },
    { id: 6, x: 140, y: -75, size: 7, delay: 0.05 },
    { id: 7, x: 155, y: 5, size: 4, delay: 0.13 },
    { id: 8, x: 115, y: 80, size: 6, delay: 0.06 },
    { id: 9, x: 55, y: 115, size: 4, delay: 0.15 },
    { id: 10, x: -25, y: 125, size: 7, delay: 0.03 },
    { id: 11, x: -105, y: 85, size: 5, delay: 0.12 },
    { id: 12, x: -155, y: 5, size: 6, delay: 0.07 },
    { id: 13, x: -60, y: -90, size: 3, delay: 0.18 },
    { id: 14, x: 65, y: -85, size: 3, delay: 0.11 },
    { id: 15, x: 80, y: 30, size: 4, delay: 0.17 },
    { id: 16, x: -70, y: 35, size: 4, delay: 0.09 },
]);

const EXTRA_LEGENDARY_PARTICLES = Object.freeze([
    { id: 17, x: -175, y: -100, size: 7, delay: 0.15 },
    { id: 18, x: 175, y: -100, size: 7, delay: 0.17 },
    { id: 19, x: -145, y: 125, size: 5, delay: 0.21 },
    { id: 20, x: 145, y: 125, size: 5, delay: 0.23 },
]);

// =========================================================
// MAIN COMPONENT
// =========================================================

function RewardRevealEffects({
    active = false,
    rarity = "common",
    mode = "burst",
    className = "",
}) {
    const reducedMotion = useReducedMotion();

    if (!active) {
        return null;
    }

    const style =
        EFFECT_STYLES[rarity] ??
        EFFECT_STYLES.common;

    const isBurst = mode === "burst";

    const particles =
        rarity === "legendary"
            ? [
                ...PARTICLES,
                ...EXTRA_LEGENDARY_PARTICLES,
            ]
            : PARTICLES;

    // Reduced-motion mode keeps only a static glow.
    // No particle movement or flashing animation.

    if (reducedMotion) {
        return (
            <div
                aria-hidden="true"
                className={`
                    pointer-events-none
                    absolute inset-0
                    overflow-hidden
                    ${className}
                `}
            >
                <div
                    className={`
                        absolute left-1/2 top-1/2
                        h-48 w-48
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full blur-3xl
                        ${style.glow}
                    `}
                />
            </div>
        );
    }

    return (
        <div
            aria-hidden="true"
            className={`
                pointer-events-none
                absolute inset-0
                overflow-hidden
                ${className}
            `}
        >
            {/* ==========================================
                AMBIENT LIGHT
            ========================================== */}

            <motion.div
                className={`
                    absolute left-1/2 top-1/2
                    h-56 w-56
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full blur-3xl
                    ${style.glow}
                `}
                initial={{
                    opacity: 0,
                    scale: 0.5,
                }}
                animate={{
                    opacity: isBurst ? 0.9 : 0.5,
                    scale: isBurst ? 1.3 : 1,
                }}
                transition={{
                    duration: 0.7,
                    ease: "easeOut",
                }}
            />

            {/* ==========================================
                STATIC REWARD HALO
            ========================================== */}

            {!isBurst && (
                <div
                    className={`
                        absolute left-1/2 top-1/2
                        h-44 w-44
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full border
                        ${style.ring}
                        opacity-30
                    `}
                />
            )}

            {/* ==========================================
                ONE-TIME REVEAL BURST
            ========================================== */}

            {isBurst && (
                <>
                    {/* Expanding energy rings */}

                    {[0, 0.18].map((delay, index) => (
                        <motion.div
                            key={`ring-${index}`}
                            className={`
                                absolute left-1/2 top-1/2
                                h-32 w-32
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full border-2
                                ${style.ring}
                            `}
                            initial={{
                                opacity: 0,
                                scale: 0.25,
                            }}
                            animate={{
                                opacity: [0, 0.9, 0],
                                scale: [0.25, 1.1, 2.1],
                            }}
                            transition={{
                                duration: 1.05,
                                delay,
                                ease: "easeOut",
                            }}
                        />
                    ))}

                    {/* Central flash */}

                    <motion.div
                        className={`
                            absolute left-1/2 top-1/2
                            h-20 w-20
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full blur-xl
                            ${style.center}
                        `}
                        initial={{
                            opacity: 0,
                            scale: 0.3,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.3, 1.5, 2.4],
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                        }}
                    />

                    {/* Flying particles */}

                    {particles.map((particle) => (
                        <motion.span
                            key={particle.id}
                            className={`
                                absolute left-1/2 top-1/2
                                rounded-full
                                shadow-[0_0_12px_currentColor]
                                ${style.particle}
                            `}
                            style={{
                                width: particle.size,
                                height: particle.size,
                            }}
                            initial={{
                                x: 0,
                                y: 0,
                                opacity: 0,
                                scale: 0.2,
                            }}
                            animate={{
                                x: particle.x,
                                y: particle.y,
                                opacity: [0, 1, 0],
                                scale: [0.2, 1.3, 0.5],
                            }}
                            transition={{
                                duration:
                                    rarity === "legendary"
                                        ? 1.1
                                        : 0.9,
                                delay: particle.delay,
                                ease: "easeOut",
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

export default memo(RewardRevealEffects);
