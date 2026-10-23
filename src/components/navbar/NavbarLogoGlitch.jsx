
import React, { memo } from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import FSocietyLogo from "../../assests/logo/f_society.png";

// =========================================================
// FSOCIETY — NAVBAR LOGO GLITCH
// =========================================================
//
// Location:
// src/components/navbar/NavbarLogoGlitch.jsx
//
// Inspired by Mr. Robot's digital transitions:
//
// - RGB channel displacement
// - CRT scanline interference
// - Horizontal image slicing
// - Digital frame jumps
// - Brief screen flash
//
// No rotation.
// No infinite animation.
// No external CSS file.
//
// Responsive:
// Mobile: 36x36
// Desktop: 40x40
//
// Supports:
// - Dark / Light mode
// - Reduced motion accessibility
// - Mouse and keyboard activation
// =========================================================

// =========================================================
// ANIMATION CONFIGURATION
// =========================================================

const DURATION = 0.64;

const FRAME_TIMES = [
  0,
  0.12,
  0.2,
  0.31,
  0.43,
  0.57,
  0.74,
  1,
];

const transition = {
  duration: DURATION,
  times: FRAME_TIMES,
  ease: "linear",
};

// =========================================================
// MAIN IMAGE ANIMATION
// =========================================================

const imageVariants = {
  idle: {
    x: 0,
    opacity: 1,
  },

  glitch: {
    x: [
      0,
      -2,
      3,
      -1,
      2,
      -2,
      1,
      0,
    ],

    opacity: [
      1,
      0.75,
      1,
      0.55,
      1,
      0.85,
      1,
      1,
    ],

    transition,
  },
};

// =========================================================
// CYAN CHANNEL
// =========================================================

const cyanVariants = {
  idle: {
    opacity: 0,
    x: 0,
  },

  glitch: {
    opacity: [
      0,
      0.9,
      0,
      0.85,
      0,
      0.55,
      0,
      0,
    ],

    x: [
      0,
      -4,
      0,
      4,
      -2,
      2,
      0,
      0,
    ],

    transition,
  },
};

// =========================================================
// RED CHANNEL
// =========================================================

const redVariants = {
  idle: {
    opacity: 0,
    x: 0,
  },

  glitch: {
    opacity: [
      0,
      0,
      0.8,
      0,
      0.95,
      0,
      0.3,
      0,
    ],

    x: [
      0,
      0,
      4,
      -3,
      3,
      -2,
      1,
      0,
    ],

    transition,
  },
};

// =========================================================
// CRT SCANLINES
// =========================================================

const scanlineVariants = {
  idle: {
    opacity: 0,
    y: 0,
  },

  glitch: {
    opacity: [
      0,
      0.45,
      0,
      0.7,
      0.4,
      0,
      0.25,
      0,
    ],

    y: [
      0,
      -3,
      5,
      -2,
      6,
      0,
      2,
      0,
    ],

    transition,
  },
};

// =========================================================
// HORIZONTAL SIGNAL BAR
// =========================================================

const signalVariants = {
  idle: {
    opacity: 0,
    y: -12,
    scaleX: 1,
  },

  glitch: {
    opacity: [
      0,
      0.8,
      0,
      1,
      0.2,
      0.9,
      0,
      0,
    ],

    y: [
      -12,
      -7,
      6,
      -3,
      11,
      -6,
      8,
      0,
    ],

    scaleX: [
      1,
      0.6,
      1,
      0.8,
      1,
      0.7,
      1,
      1,
    ],

    transition,
  },
};

// =========================================================
// SCREEN FLASH
// =========================================================

const flashVariants = {
  idle: {
    opacity: 0,
  },

  glitch: {
    opacity: [
      0,
      0.12,
      0,
      0.4,
      0,
      0.15,
      0,
      0,
    ],

    transition,
  },
};

// =========================================================
// COMPONENT
// =========================================================

function NavbarLogoGlitch({
  active = false,
  logoSrc = FSocietyLogo,
  className = "",
}) {
  // =====================================================
  // ACCESSIBILITY
  // =====================================================

  const reduceMotion = useReducedMotion();

  const animationState =
    active && !reduceMotion
      ? "glitch"
      : "idle";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <motion.span
      initial="idle"
      animate={animationState}
      aria-hidden="true"
      className={`
        relative isolate

        flex h-9 w-9
        shrink-0

        items-center
        justify-center

        overflow-hidden

        rounded-lg

        border
        border-indigo-200/70

        bg-white/75

        shadow-sm

        transition-[background-color,border-color,box-shadow]
        duration-200

        dark:border-indigo-400/20
        dark:bg-[#101827]

        group-hover/brand:border-cyan-400/60
        group-hover/brand:shadow-[0_0_15px_rgba(34,211,238,0.12)]

        dark:group-hover/brand:border-cyan-400/40

        sm:h-10 sm:w-10
        sm:rounded-[10px]

        ${className}
      `}
    >
      {/* ======================================
          BASE LOGO
         ====================================== */}

      <motion.img
        src={logoSrc}
        alt=""
        draggable={false}
        variants={imageVariants}
        className="
          relative z-10

          h-7 w-7

          select-none
          object-contain

          sm:h-8 sm:w-8
        "
      />

      {/* ======================================
          CYAN RGB SLICE
         ====================================== */}

      <span
        className="
          pointer-events-none

          absolute inset-0 z-20

          flex items-center
          justify-center
        "
      >
        <motion.img
          src={logoSrc}
          alt=""
          draggable={false}
          variants={cyanVariants}
          style={{
            clipPath:
              "inset(10% 0 57% 0)",
            filter:
              "drop-shadow(-2px 0 #00d9ff)",
          }}
          className="
            h-7 w-7

            select-none
            object-contain

            sm:h-8 sm:w-8
          "
        />
      </span>

      {/* ======================================
          RED RGB SLICE
         ====================================== */}

      <span
        className="
          pointer-events-none

          absolute inset-0 z-20

          flex items-center
          justify-center
        "
      >
        <motion.img
          src={logoSrc}
          alt=""
          draggable={false}
          variants={redVariants}
          style={{
            clipPath:
              "inset(52% 0 16% 0)",
            filter:
              "drop-shadow(2px 0 #ff3158)",
          }}
          className="
            h-7 w-7

            select-none
            object-contain

            sm:h-8 sm:w-8
          "
        />
      </span>

      {/* ======================================
          CRT INTERFERENCE
         ====================================== */}

      <motion.span
        variants={scanlineVariants}
        style={{
          backgroundImage:
            "repeating-linear-gradient(" +
            "to bottom," +
            "transparent 0px," +
            "transparent 2px," +
            "rgba(34,211,238,0.38) 3px," +
            "transparent 4px" +
            ")",
        }}
        className="
          pointer-events-none

          absolute inset-0 z-30
        "
      />

      {/* ======================================
          SIGNAL DISTORTION BAR
         ====================================== */}

      <motion.span
        variants={signalVariants}
        className="
          pointer-events-none

          absolute left-0
          right-0 top-1/2
          z-30

          h-[3px]

          bg-gradient-to-r
          from-cyan-400/10
          via-cyan-300/90
          to-rose-500/40

          shadow-[0_0_7px_rgba(34,211,238,0.45)]
        "
      />

      {/* ======================================
          SCREEN FLASH
         ====================================== */}

      <motion.span
        variants={flashVariants}
        className="
          pointer-events-none

          absolute inset-0
          z-40

          bg-white/80

          dark:bg-cyan-100/70
        "
      />

      {/* ======================================
          CORNER STATUS PIXEL
         ====================================== */}

      <span
        className="
          pointer-events-none

          absolute bottom-[3px]
          right-[3px] z-40

          h-[3px] w-[3px]

          rounded-[1px]

          bg-indigo-500/70

          transition-colors
          duration-200

          group-hover/brand:bg-cyan-400
        "
      />
    </motion.span>
  );
}

export default memo(NavbarLogoGlitch);
