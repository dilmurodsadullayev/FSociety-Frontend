import React, { memo } from "react";

import { useNewYear } from "../context/NewYearContext";

// =========================================================
// FSOCIETY — CHRISTMAS LIGHTS (CYBERPUNK WINTER GARLAND)
// =========================================================
//
// Location:
//
// src/features/newYear/components/ChristmasLights.jsx
//
// Responsibilities:
//
// - Decorative twinkling Christmas garland along navbar
// - Authentic on/off blinking & chasing light rhythm
// - Classic teardrop glass bulbs with metallic socket caps
// - Seamless responsive scalloped wire (no stretching)
// - Full Light & Dark theme glow adaptation
// - Reduced motion support (stays calmly lit)
// - Winter settings integration (settings.lightsEnabled)
//
// IMPORTANT:
//
// - No React animation loops (pure CSS keyframes).
// - No external animation libraries or extra CSS files.
// - Pointer events are disabled.
// - Visibility follows NewYearContext.
//
// =========================================================

// =========================================================
// LIGHT CONFIGURATION
// =========================================================

const LIGHT_PALETTE = [
  "#06b6d4", // Cyber Cyan
  "#ef4444", // Festive Crimson
  "#10b981", // Winter Emerald
  "#8b5cf6", // Neon Violet
  "#f59e0b", // Warm Amber
  "#3b82f6", // Electric Blue
  "#ec4899", // Neon Pink
];

// Exact coordinates along cubic Bezier wire:
// M 0 2.5 C 70 18, 210 18, 280 2.5
const SWAG_BULBS = [
  { x: 28.0, y: 7.4, tilt: -4 },
  { x: 78.1, y: 12.3, tilt: 2.5 },
  { x: 140.0, y: 14.1, tilt: 0 },
  { x: 201.9, y: 12.3, tilt: -2.5 },
  { x: 252.0, y: 7.4, tilt: 4 },
];

// 10 swags cover up to 2240px on mobile & 2800px on ultrawide desktop
const SWAG_COUNT = 10;

const TWINKLE_DURATIONS = ["2.4s", "2.9s", "3.3s"];

// =========================================================
// COMPONENT
// =========================================================

function ChristmasLights() {
  // =======================================================
  // NEW YEAR CONTEXT
  // =======================================================

  const { settings } = useNewYear();

  // =======================================================
  // VISIBILITY
  // =======================================================

  if (!settings?.lightsEnabled) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        select-none
        absolute
        inset-x-0
        top-0
        z-[1]
        flex
        h-9
        w-full
        items-start
        justify-center
        overflow-hidden
        sm:h-11
      "
    >
      {/* ================================================
          SCOPED KEYFRAMES FOR REALISTIC ON/OFF TWINKLE
      ================================================ */}

      <style>{`
        @keyframes fs-xmas-bulb-kf {
          0%, 24% {
            opacity: 1;
          }
          42%, 62% {
            opacity: 0.24;
          }
          78%, 100% {
            opacity: 1;
          }
        }

        @keyframes fs-xmas-glow-kf {
          0%, 24% {
            opacity: 1;
          }
          40%, 64% {
            opacity: 0;
          }
          78%, 100% {
            opacity: 1;
          }
        }

        .fs-xmas-bulb {
          animation-name: fs-xmas-bulb-kf;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .fs-xmas-glow {
          animation-name: fs-xmas-glow-kf;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fs-xmas-bulb,
          .fs-xmas-glow {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {Array.from({ length: SWAG_COUNT }).map((_, swagIndex) => (
        <svg
          key={`winter-swag-${swagIndex}`}
          viewBox="0 0 280 44"
          className="
            block
            h-[35px]
            w-[224px]
            shrink-0
            sm:h-[44px]
            sm:w-[280px]
          "
        >
          {/* ==============================================
              SCALLOPED GARLAND WIRE + SUBTLE SHEEN
          ============================================== */}

          <path
            d="M 0 2.5 C 70 18, 210 18, 280 2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            className="
              text-slate-600/60
              dark:text-slate-400/45
            "
          />

          <path
            d="M 0 2.1 C 70 17.6, 210 17.6, 280 2.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinecap="round"
            className="
              text-slate-300/60
              dark:text-cyan-200/20
            "
          />

          {/* ==============================================
              TWINKLING TEARDROP BULBS
          ============================================== */}

          {SWAG_BULBS.map((bulb, bulbIndex) => {
            const globalIndex =
              swagIndex * SWAG_BULBS.length + bulbIndex;
            const color =
              LIGHT_PALETTE[globalIndex % LIGHT_PALETTE.length];
            const duration =
              TWINKLE_DURATIONS[globalIndex % TWINKLE_DURATIONS.length];
            // Staggered phase offset for organic chasing twinkle
            const delayMs = -((globalIndex * 430) % 2800);

            const cordTopY = bulb.y;
            const socketTopY = bulb.y + 3.2;
            const bulbTopY = bulb.y + 7.2;
            const bulbCenterY = bulb.y + 13.4;

            return (
              <g
                key={`winter-light-${swagIndex}-${bulbIndex}`}
                transform={`rotate(${bulb.tilt} ${bulb.x} ${cordTopY})`}
              >
                {/* HANGING CORD & SOCKET CAP (STATIC) */}

                <path
                  d={`M ${bulb.x} ${cordTopY} L ${bulb.x} ${socketTopY}`}
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  className="text-slate-600/80 dark:text-slate-400/75"
                />

                {/* SOCKET BODY */}
                <rect
                  x={bulb.x - 2.3}
                  y={socketTopY}
                  width="4.6"
                  height="3.4"
                  rx="1"
                  className="fill-slate-700 dark:fill-slate-800"
                />

                {/* METALLIC SOCKET COLLAR */}
                <rect
                  x={bulb.x - 2.6}
                  y={socketTopY + 2.8}
                  width="5.2"
                  height="1.4"
                  rx="0.6"
                  className="fill-slate-400 dark:fill-slate-500"
                />

                {/* ========================================
                    LIT RADIAL BLOOM (TURNS COMPLETELY OFF)
                ======================================== */}

                <g
                  className="fs-xmas-glow"
                  style={{
                    color,
                    animationDuration: duration,
                    animationDelay: `${delayMs}ms`,
                  }}
                >
                  {/* OUTER DIFFUSED AURA */}
                  <circle
                    cx={bulb.x}
                    cy={bulbCenterY}
                    r="11.5"
                    fill="currentColor"
                    className="opacity-[0.16] dark:opacity-[0.26]"
                  />

                  {/* INNER NEON HALO */}
                  <circle
                    cx={bulb.x}
                    cy={bulbCenterY}
                    r="6.8"
                    fill="currentColor"
                    className="opacity-[0.28] dark:opacity-[0.42]"
                  />
                </g>

                {/* ========================================
                    UNLIT BASE OUTLINE (VISIBLE WHEN BLINKED OFF)
                ======================================== */}

                <path
                  d={`
                    M ${bulb.x - 2.2} ${bulbTopY}
                    C ${bulb.x - 4.4} ${bulbTopY + 3.8},
                      ${bulb.x - 4.2} ${bulbTopY + 10.2},
                      ${bulb.x} ${bulbTopY + 11.4}
                    C ${bulb.x + 4.2} ${bulbTopY + 10.2},
                      ${bulb.x + 4.4} ${bulbTopY + 3.8},
                      ${bulb.x + 2.2} ${bulbTopY}
                    Z
                  `}
                  fill="currentColor"
                  className="text-slate-400/30 dark:text-slate-700/45"
                />

                {/* ========================================
                    COLORED TEARDROP GLASS BULB (BLINKS)
                ======================================== */}

                <path
                  d={`
                    M ${bulb.x - 2.2} ${bulbTopY}
                    C ${bulb.x - 4.4} ${bulbTopY + 3.8},
                      ${bulb.x - 4.2} ${bulbTopY + 10.2},
                      ${bulb.x} ${bulbTopY + 11.4}
                    C ${bulb.x + 4.2} ${bulbTopY + 10.2},
                      ${bulb.x + 4.4} ${bulbTopY + 3.8},
                      ${bulb.x + 2.2} ${bulbTopY}
                    Z
                  `}
                  fill={color}
                  className="fs-xmas-bulb"
                  style={{
                    animationDuration: duration,
                    animationDelay: `${delayMs}ms`,
                  }}
                />

                {/* ========================================
                    HOT INNER FILAMENT CORE (BLINKS)
                ======================================== */}

                <g
                  className="fs-xmas-glow"
                  style={{
                    animationDuration: duration,
                    animationDelay: `${delayMs}ms`,
                  }}
                >
                  <ellipse
                    cx={bulb.x}
                    cy={bulbCenterY - 0.6}
                    rx="1.5"
                    ry="2.5"
                    fill="#ffffff"
                    opacity="0.72"
                  />
                </g>

                {/* ========================================
                    STATIC GLASS SPECULAR REFLECTION
                ======================================== */}

                <path
                  d={`
                    M ${bulb.x - 1.5} ${bulbTopY + 2.1}
                    Q ${bulb.x - 2.4} ${bulbTopY + 4.6},
                      ${bulb.x - 1.4} ${bulbTopY + 7.2}
                  `}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.95"
                  strokeLinecap="round"
                  opacity="0.78"
                />
              </g>
            );
          })}
        </svg>
      ))}
    </div>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(ChristmasLights);