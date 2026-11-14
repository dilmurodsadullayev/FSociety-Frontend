
import React, { memo, useId } from "react";

import WINTER_BACKGROUND_CONFIG, {
  isWinterLayerEnabled,
} from "../data/winterBackgroundConfig";

// =========================================================
// FSOCIETY — WINTER FROST
// Frozen Glass / Arctic Ice Crystals
// =========================================================

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const getDuration = (value, fallback) => {
  const duration = Number(value);

  return `${duration > 0 ? duration : fallback}ms`;
};

// =========================================================
// ICE CRYSTAL SVG
// =========================================================

const IceCrystalSvg = memo(function IceCrystalSvg({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient
          id="winter-frost-crystal-stroke"
          x1="20"
          y1="20"
          x2="180"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="50%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>

      <g
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Main six radial axes */}
        <path d="M100 10V190" />
        <path d="M22 55L178 145" />
        <path d="M22 145L178 55" />

        {/* Vertical crystal branches */}
        <path d="M100 10L88 30M100 10L112 30" />
        <path d="M100 190L88 170M100 190L112 170" />

        {/* Upper-left branches */}
        <path d="M22 55L45 57M22 55L34 75" />
        <path d="M178 145L155 143M178 145L166 125" />

        {/* Lower-left branches */}
        <path d="M22 145L45 143M22 145L34 125" />
        <path d="M178 55L155 57M178 55L166 75" />

        {/* Inner chevrons */}
        <path
          d="
            M100 36L91 49
            M100 36L109 49
            M100 164L91 151
            M100 164L109 151
          "
          strokeOpacity="0.72"
        />

        <path
          d="
            M44 68L60 69
            M44 68L52 82
            M156 132L140 131
            M156 132L148 118
          "
          strokeOpacity="0.72"
        />

        <path
          d="
            M44 132L60 131
            M44 132L52 118
            M156 68L140 69
            M156 68L148 82
          "
          strokeOpacity="0.72"
        />

        {/* Cyber geometric rings */}
        <polygon
          points="100,66 129,83 129,117 100,134 71,117 71,83"
          strokeOpacity="0.48"
        />

        <polygon
          points="100,82 116,91 116,109 100,118 84,109 84,91"
          strokeOpacity="0.68"
        />

        {/* Connecting geometry */}
        <path
          d="
            M100 10L100 66
            M100 134L100 190
            M22 55L71 83
            M129 117L178 145
          "
          strokeOpacity="0.24"
        />
      </g>

      <circle
        cx="100"
        cy="100"
        r="5"
        fill="currentColor"
        opacity="0.85"
      />

      <circle
        cx="100"
        cy="100"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
      />
    </svg>
  );
});

// =========================================================
// CORNER FROST DETAIL
// =========================================================

const FrostCorner = memo(function FrostCorner({
  className = "",
  flip = false,
}) {
  return (
    <svg
      viewBox="0 0 260 220"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={[
        "h-full w-full",
        flip ? "-scale-x-100" : "",
        className,
      ].join(" ")}
    >
      <defs>
        <linearGradient
          id="winter-frost-corner-line"
          x1="0"
          y1="0"
          x2="260"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#67E8F9" stopOpacity="0.44" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main frozen frame */}
      <path
        d="M0 2H145L175 28H258"
        stroke="url(#winter-frost-corner-line)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M2 0V104L35 137V219"
        stroke="url(#winter-frost-corner-line)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Ice branches */}
      <g
        stroke="#67E8F9"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.58"
      >
        <path d="M52 3L52 34L68 50" />
        <path d="M52 34L39 48" />
        <path d="M52 34L67 25" />

        <path d="M3 72L34 72L49 87" />
        <path d="M34 72L34 56" />
        <path d="M34 72L51 66" />

        <path d="M90 3L90 18L103 31" />
        <path d="M90 18L78 30" />
      </g>

      {/* Digital points */}
      <g fill="#67E8F9">
        <circle cx="52" cy="34" r="2.3" />
        <circle cx="34" cy="72" r="2.3" />
        <circle cx="90" cy="18" r="2" />
      </g>

      {/* Small frozen facets */}
      <g
        fill="#BAE6FD"
        fillOpacity="0.38"
      >
        <path d="M116 8L128 20L116 32L104 20Z" />
        <path d="M15 122L27 134L15 146L3 134Z" />
        <path d="M75 112L83 120L75 128L67 120Z" />
      </g>
    </svg>
  );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const WinterFrost = ({ className = "" }) => {
  const reactId = useId();

  const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
  const animationId = `fs-winter-frost-${safeId}`;

  const frostConfig = WINTER_BACKGROUND_CONFIG.frost ?? {};
  const animation = frostConfig.animation ?? {};
  const performance = WINTER_BACKGROUND_CONFIG.performance ?? {};

  if (
    !isWinterLayerEnabled("frost") ||
    !frostConfig.enabled
  ) {
    return null;
  }

  // =======================================================
  // CONFIGURATION
  // =======================================================

  const edgeEffect = frostConfig.edgeEffect !== false;
  const cornerCrystals = frostConfig.cornerCrystals !== false;
  const glassEffect = frostConfig.glassEffect !== false;

  const lightOpacity = clamp(
    frostConfig.opacity?.light ?? 0.42
  );

  const darkOpacity = clamp(
    frostConfig.opacity?.dark ?? 0.24
  );

  const animationEnabled = animation.enabled !== false;

  const pulseDuration = getDuration(
    animation.pulseDuration,
    10000
  );

  const driftDuration = getDuration(
    animation.driftDuration,
    14000
  );

  const respectReducedMotion =
    performance.respectReducedMotion !== false;

  // =======================================================
  // ANIMATION
  // =======================================================

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-[2]",
        "overflow-hidden select-none",
        className,
      ].join(" ")}
    >
      <style>
        {`
          /* ================================================
             FROST LIGHT PULSE
          ================================================ */

          @keyframes ${animationId}-ice-pulse {
            0%, 100% {
              opacity: 0.36;
              filter: brightness(1);
            }

            50% {
              opacity: 0.76;
              filter: brightness(1.2);
            }
          }

          /* ================================================
             CRYSTAL FLOATING
          ================================================ */

          @keyframes ${animationId}-ice-drift {
            0%, 100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }

            50% {
              transform: translate3d(0, -9px, 0) rotate(2deg);
            }
          }

          /* ================================================
             FROZEN SHIMMER
          ================================================ */

          @keyframes ${animationId}-ice-shimmer {
            0%, 100% {
              opacity: 0.12;
              transform: translateX(-15%);
            }

            50% {
              opacity: 0.34;
              transform: translateX(15%);
            }
          }

          /* ================================================
             LIGHT / DARK OPACITY
          ================================================ */

          .${animationId}-surface {
            opacity: ${lightOpacity};
          }

          .dark .${animationId}-surface {
            opacity: ${darkOpacity};
          }

          .${animationId}-edge {
            opacity: ${lightOpacity * 0.72};
          }

          .dark .${animationId}-edge {
            opacity: ${darkOpacity * 0.9};
          }

          .${animationId}-crystal {
            opacity: ${lightOpacity * 0.8};
          }

          .dark .${animationId}-crystal {
            opacity: ${darkOpacity * 1.15};
          }

          /* ================================================
             ANIMATION CLASSES
          ================================================ */

          .${animationId}-pulse {
            animation: ${
              animationEnabled
                ? `${animationId}-ice-pulse ${pulseDuration} ease-in-out infinite`
                : "none"
            };
          }

          .${animationId}-drift {
            animation: ${
              animationEnabled
                ? `${animationId}-ice-drift ${driftDuration} ease-in-out infinite`
                : "none"
            };
          }

          .${animationId}-shimmer {
            animation: ${
              animationEnabled
                ? `${animationId}-ice-shimmer 12s ease-in-out infinite`
                : "none"
            };
          }

          ${
            respectReducedMotion
              ? `
                @media (prefers-reduced-motion: reduce) {
                  .${animationId}-pulse,
                  .${animationId}-drift,
                  .${animationId}-shimmer {
                    animation: none !important;
                  }
                }
              `
              : ""
          }
        `}
      </style>

      {/* ===================================================
          LAYER 1 — FROSTED TOP EDGE
      =================================================== */}

      {edgeEffect && (
        <>
          <div
            className={`
              ${animationId}-edge
              absolute inset-x-0 top-0
              h-16
              sm:h-24
              lg:h-32
              bg-gradient-to-b
              from-sky-100/60
              via-cyan-100/20
              to-transparent
              dark:from-cyan-300/[0.08]
              dark:via-blue-300/[0.025]
            `}
          />

          {/* Left frozen edge */}
          <div
            className={`
              ${animationId}-edge
              absolute inset-y-0 left-0
              w-8
              sm:w-14
              lg:w-20
              bg-gradient-to-r
              from-sky-200/40
              via-cyan-100/10
              to-transparent
              dark:from-cyan-300/[0.065]
              dark:via-blue-300/[0.018]
            `}
          />

          {/* Right frozen edge */}
          <div
            className={`
              ${animationId}-edge
              absolute inset-y-0 right-0
              w-8
              sm:w-14
              lg:w-20
              bg-gradient-to-l
              from-sky-200/40
              via-cyan-100/10
              to-transparent
              dark:from-cyan-300/[0.065]
              dark:via-blue-300/[0.018]
            `}
          />

          {/* Bottom snow reflection */}
          <div
            className={`
              ${animationId}-edge
              absolute inset-x-0 bottom-0
              h-16
              sm:h-24
              lg:h-32
              bg-gradient-to-t
              from-cyan-100/35
              via-sky-100/10
              to-transparent
              dark:from-cyan-300/[0.055]
              dark:via-blue-300/[0.015]
            `}
          />
        </>
      )}

      {/* ===================================================
          LAYER 2 — FROZEN GLASS ATMOSPHERE
      =================================================== */}

      {glassEffect && (
        <>
          {/* Top-left frost glow */}
          <div
            className={`
              ${animationId}-pulse
              ${animationId}-surface
              absolute
              -left-16
              -top-16
              h-44
              w-44
              rounded-full
              bg-cyan-300/35
              blur-[55px]
              sm:h-72
              sm:w-72
              sm:blur-[85px]
              dark:bg-cyan-300/15
            `}
          />

          {/* Top-right ice glow */}
          <div
            className={`
              ${animationId}-drift
              ${animationId}-surface
              absolute
              -right-20
              -top-14
              h-44
              w-44
              rounded-full
              bg-sky-300/30
              blur-[60px]
              sm:h-72
              sm:w-72
              sm:blur-[90px]
              dark:bg-blue-400/15
            `}
          />

          {/* Bottom-left frozen reflection */}
          <div
            className={`
              ${animationId}-surface
              absolute
              -bottom-24
              left-[8%]
              h-52
              w-52
              rounded-full
              bg-cyan-200/30
              blur-[70px]
              sm:h-72
              sm:w-72
              sm:blur-[100px]
              dark:bg-cyan-400/10
            `}
          />

          {/* Bottom-right violet ice glow */}
          <div
            className={`
              ${animationId}-pulse
              ${animationId}-surface
              absolute
              -bottom-24
              right-[6%]
              h-56
              w-56
              rounded-full
              bg-indigo-200/25
              blur-[75px]
              sm:h-80
              sm:w-80
              sm:blur-[110px]
              dark:bg-indigo-400/12
            `}
            style={{
              animationDelay: "3s",
            }}
          />
        </>
      )}

      {/* ===================================================
          LAYER 3 — FROZEN CORNER FRAME
      =================================================== */}

      {edgeEffect && (
        <>
          <FrostCorner
            className={`
              ${animationId}-surface
              absolute
              -left-1
              -top-1
              h-36
              w-40
              sm:h-52
              sm:w-56
              lg:h-64
              lg:w-72
            `}
          />

          <FrostCorner
            flip
            className={`
              ${animationId}-surface
              absolute
              -right-1
              -top-1
              h-36
              w-40
              sm:h-52
              sm:w-56
              lg:h-64
              lg:w-72
            `}
          />
        </>
      )}

      {/* ===================================================
          LAYER 4 — GEOMETRIC ICE CRYSTALS
      =================================================== */}

      {cornerCrystals && (
        <>
          {/* Top-left main crystal */}
          <IceCrystalSvg
            className={`
              ${animationId}-drift
              ${animationId}-crystal
              absolute
              -left-9
              top-16
              h-24
              w-24
              text-cyan-600
              drop-shadow-[0_0_12px_rgba(34,211,238,0.2)]
              dark:text-cyan-200
              dark:drop-shadow-[0_0_16px_rgba(34,211,238,0.25)]
              sm:h-40
              sm:w-40
              lg:h-48
              lg:w-48
            `}
          />

          {/* Top-right crystal */}
          <IceCrystalSvg
            className={`
              ${animationId}-pulse
              ${animationId}-crystal
              absolute
              -right-8
              top-24
              hidden
              h-32
              w-32
              -rotate-12
              text-blue-600
              dark:text-indigo-200
              md:block
              lg:h-44
              lg:w-44
            `}
          />

          {/* Bottom-right crystal */}
          <IceCrystalSvg
            className={`
              ${animationId}-drift
              ${animationId}-crystal
              absolute
              -bottom-10
              -right-10
              h-28
              w-28
              rotate-12
              text-sky-600
              drop-shadow-[0_0_14px_rgba(56,189,248,0.2)]
              dark:text-cyan-100
              sm:h-44
              sm:w-44
              lg:h-56
              lg:w-56
            `}
            style={{
              animationDelay: "2s",
            }}
          />
        </>
      )}

      {/* ===================================================
          LAYER 5 — FROSTED GLASS SHIMMER
      =================================================== */}

      {glassEffect && (
        <div
          className={`
            ${animationId}-shimmer
            absolute
            inset-x-0
            top-0
            h-[38%]
            bg-gradient-to-br
            from-transparent
            via-white/15
            to-transparent
            blur-2xl
            dark:via-cyan-100/[0.035]
          `}
        />
      )}

      {/* ===================================================
          LAYER 6 — SUBTLE ICE HIGHLIGHTS
      =================================================== */}

      {cornerCrystals && (
        <>
          <div
            className="
              absolute
              left-[9%]
              top-[34%]
              h-1.5
              w-1.5
              rounded-full
              bg-cyan-400
              opacity-60
              shadow-[0_0_12px_rgba(34,211,238,0.8)]
              dark:bg-cyan-200
            "
          />

          <div
            className="
              absolute
              right-[11%]
              top-[43%]
              h-1.5
              w-1.5
              rounded-full
              bg-sky-400
              opacity-60
              shadow-[0_0_12px_rgba(56,189,248,0.8)]
              dark:bg-sky-200
            "
          />

          <div
            className="
              absolute
              bottom-[17%]
              left-[18%]
              hidden
              h-1
              w-1
              rounded-full
              bg-violet-400
              opacity-60
              shadow-[0_0_10px_rgba(139,92,246,0.8)]
              sm:block
              dark:bg-violet-200
            "
          />
        </>
      )}
    </div>
  );
};

export default memo(WinterFrost);
