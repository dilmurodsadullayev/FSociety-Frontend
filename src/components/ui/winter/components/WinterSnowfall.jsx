
import React, { memo, useId, useMemo } from "react";

import WINTER_BACKGROUND_CONFIG from "../data/winterBackgroundConfig";

// =========================================================
// FSOCIETY — WINTER SNOWFALL
// Multi-depth cinematic snowfall
// =========================================================

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const getDuration = (value, fallback) => {
  const parsed = Number(value);

  return parsed > 0 ? parsed : fallback;
};

const sanitizeId = (value) =>
  value.replace(/[^a-zA-Z0-9_-]/g, "");

// =========================================================
// SNOWFLAKE SVG
// =========================================================

const SnowflakeSvg = memo(function SnowflakeSvg({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Main axes */}
        <path d="M20 3V37" />
        <path d="M5.3 11.5L34.7 28.5" />
        <path d="M5.3 28.5L34.7 11.5" />

        {/* Vertical branches */}
        <path d="M20 3L16 8M20 3L24 8" />
        <path d="M20 37L16 32M20 37L24 32" />

        {/* Diagonal branches */}
        <path d="M5.3 11.5L12 12L12 18" />
        <path d="M34.7 28.5L28 28L28 22" />

        <path d="M5.3 28.5L12 28L12 22" />
        <path d="M34.7 11.5L28 12L28 18" />
      </g>

      <circle
        cx="20"
        cy="20"
        r="2.2"
        fill="currentColor"
      />
    </svg>
  );
});

// =========================================================
// PARTICLE GENERATOR
// Deterministic positions — no Math.random()
// =========================================================

const createSnowParticles = (count) => {
  return Array.from({ length: count }, (_, index) => {
    const seed = index + 1;

    const isNear = index % 4 === 0;
    const isFlake = index % 5 === 0 || index % 7 === 0;

    const position = (seed * 137.508) % 100;

    const size = isNear
      ? 4 + ((seed * 7) % 8)
      : 1.5 + ((seed * 5) % 4);

    const duration = isNear
      ? 7 + ((seed * 3) % 7)
      : 15 + ((seed * 7) % 13);

    const delay = -((seed * 1.73) % duration);

    const drift = isNear
      ? ((seed * 19) % 100) - 50
      : ((seed * 11) % 45) - 22;

    const spin = ((seed * 43) % 360) - 180;

    const opacity = isNear
      ? 0.55 + ((seed * 3) % 40) / 100
      : 0.25 + ((seed * 7) % 40) / 100;

    return {
      id: index,
      left: `${position}%`,
      size,
      duration,
      delay,
      drift,
      spin,
      opacity: clamp(opacity, 0.15, 0.95),
      isNear,
      isFlake,
    };
  });
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const WinterSnowfall = ({ className = "" }) => {
  const reactId = useId();

  const safeId = sanitizeId(reactId);
  const animationId = `fs-winter-snow-${safeId}`;

  const snowfallConfig =
    WINTER_BACKGROUND_CONFIG.snowfall ?? {};

  const performance =
    WINTER_BACKGROUND_CONFIG.performance ?? {};

  const maxParticles =
    performance.maxParticles ?? {};

  // =======================================================
  // CONFIGURATION
  // =======================================================

  const snowfallEnabled =
    WINTER_BACKGROUND_CONFIG.enabled !== false &&
    snowfallConfig.enabled !== false &&
    WINTER_BACKGROUND_CONFIG.layers?.snowfall !== false;

  const animationEnabled =
    snowfallConfig.animation?.enabled !== false;

  const respectReducedMotion =
    performance.respectReducedMotion !== false;

  // =======================================================
  // PARTICLE COUNTS
  // =======================================================

  const mobileCount = Math.min(
    110,
    clamp(
      maxParticles.mobile ?? 45,
      0,
      110
    )
  );

  const tabletCount = Math.max(
    mobileCount,
    clamp(
      maxParticles.tablet ?? 75,
      mobileCount,
      110
    )
  );

  const desktopCount = Math.max(
    tabletCount,
    clamp(
      maxParticles.desktop ?? 110,
      tabletCount,
      110
    )
  );

  const configuredCount = clamp(
    snowfallConfig.count ?? desktopCount,
    0,
    desktopCount
  );

  const particleCount = Math.min(
    configuredCount,
    desktopCount
  );

  // =======================================================
  // GENERATE PARTICLES
  // =======================================================

  const particles = useMemo(
    () => createSnowParticles(particleCount),
    [particleCount]
  );

  if (!snowfallEnabled || particleCount === 0) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none",
        "fixed inset-0",
        "z-[6]",
        "overflow-hidden",
        "select-none",
        className,
      ].join(" ")}
    >
      <style>
        {`
          /* ================================================
             FAR SNOWFALL
             Small / slow particles
          ================================================ */

          @keyframes ${animationId}-far-fall {
            0% {
              transform:
                translate3d(
                  0,
                  -12vh,
                  0
                )
                rotate(0deg);

              opacity: 0;
            }

            10% {
              opacity: var(--snow-opacity);
            }

            88% {
              opacity: var(--snow-opacity);
            }

            100% {
              transform:
                translate3d(
                  var(--snow-drift),
                  112vh,
                  0
                )
                rotate(var(--snow-spin));

              opacity: 0;
            }
          }

          /* ================================================
             NEAR SNOWFALL
             Large / faster particles
          ================================================ */

          @keyframes ${animationId}-near-fall {
            0% {
              transform:
                translate3d(
                  0,
                  -14vh,
                  0
                )
                rotate(0deg);

              opacity: 0;
            }

            8% {
              opacity: var(--snow-opacity);
            }

            92% {
              opacity: var(--snow-opacity);
            }

            100% {
              transform:
                translate3d(
                  var(--snow-drift),
                  115vh,
                  0
                )
                rotate(var(--snow-spin));

              opacity: 0;
            }
          }

          /* ================================================
             PARTICLE LAYERS
          ================================================ */

          .${animationId}-far {
            animation: ${
              animationEnabled
                ? `${animationId}-far-fall var(--snow-duration) linear var(--snow-delay) infinite`
                : "none"
            };

            will-change: transform, opacity;
          }

          .${animationId}-near {
            animation: ${
              animationEnabled
                ? `${animationId}-near-fall var(--snow-duration) linear var(--snow-delay) infinite`
                : "none"
            };

            will-change: transform, opacity;
          }

          /* ================================================
             RESPONSIVE PARTICLE DENSITY
          ================================================ */

          .${animationId}-particle:nth-child(n + ${mobileCount + 1}) {
            display: none;
          }

          @media (min-width: 640px) {
            .${animationId}-particle:nth-child(n + ${tabletCount + 1}) {
              display: none;
            }
          }

          @media (min-width: 1024px) {
            .${animationId}-particle:nth-child(n + ${desktopCount + 1}) {
              display: none;
            }
          }

          /* ================================================
             ACCESSIBILITY
             Static snowfall instead of continuous movement
          ================================================ */

          ${
            respectReducedMotion
              ? `
                @media (prefers-reduced-motion: reduce) {
                  .${animationId}-far,
                  .${animationId}-near {
                    animation: none !important;
                    transform: none !important;
                    opacity: var(--snow-opacity) !important;
                    will-change: auto !important;
                  }
                }
              `
              : ""
          }

          /* ================================================
             HIDDEN DOCUMENTS
          ================================================ */

          @media (prefers-reduced-motion: reduce) {
            .${animationId}-particle {
              transition: none !important;
            }
          }
        `}
      </style>

      {/* ===================================================
          LAYER 1 — FAR SNOW
      =================================================== */}

      <div className="absolute inset-0">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className={[
              `${animationId}-particle`,
              particle.isNear
                ? `${animationId}-near`
                : `${animationId}-far`,
              "absolute",
              "top-0",
              "flex",
              "items-center",
              "justify-center",
              particle.isNear
                ? "text-white dark:text-cyan-100"
                : "text-sky-100 dark:text-white",
            ].join(" ")}
            style={{
              left: particle.left,

              width: `${particle.size}px`,
              height: `${particle.size}px`,

              "--snow-duration": `${particle.duration}s`,
              "--snow-delay": `${particle.delay}s`,
              "--snow-drift": `${particle.drift}px`,
              "--snow-spin": `${particle.spin}deg`,
              "--snow-opacity": particle.opacity,

              filter: particle.isNear
                ? "drop-shadow(0 0 5px rgba(255,255,255,0.55))"
                : "drop-shadow(0 0 3px rgba(125,211,252,0.35))",
            }}
          >
            {particle.isFlake ? (
              <SnowflakeSvg
                className="h-full w-full"
              />
            ) : (
              <span
                className="
                  block
                  h-full
                  w-full
                  rounded-full
                  bg-current
                "
              />
            )}
          </span>
        ))}
      </div>

      {/* ===================================================
          LAYER 2 — ATMOSPHERIC SNOW HAZE
      =================================================== */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[24%]
          bg-gradient-to-t
          from-sky-100/[0.08]
          to-transparent
          dark:from-cyan-100/[0.025]
        "
      />
    </div>
  );
};

export default memo(WinterSnowfall);
