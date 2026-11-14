
import React, { memo, useId } from "react";

import WINTER_BACKGROUND_CONFIG, {
  isWinterLayerEnabled,
} from "../data/winterBackgroundConfig";

// =========================================================
// FSOCIETY — WINTER GLOW
// Cyber-Neon Arctic Atmosphere
// =========================================================

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const getDuration = (value, fallback) => {
  const duration = Number(value);

  return duration > 0 ? `${duration}ms` : `${fallback}ms`;
};

const toRgba = (color, opacity) => {
  const alpha = clamp(opacity);
  const hex = String(color ?? "").trim();

  const match = hex.match(/^#([a-f\d]{3}|[a-f\d]{6})$/i);

  if (!match) {
    return `color-mix(in srgb, ${hex} ${Math.round(alpha * 100)}%, transparent)`;
  }

  let value = match[1];

  if (value.length === 3) {
    value = value
      .split("")
      .map((character) => character + character)
      .join("");
  }

  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const WinterGlow = ({ className = "" }) => {
  const reactId = useId();

  const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
  const animationId = `fs-winter-glow-${safeId}`;

  const glowConfig = WINTER_BACKGROUND_CONFIG.glow ?? {};
  const colors = glowConfig.colors ?? {};
  const animation = glowConfig.animation ?? {};

  const responsive = WINTER_BACKGROUND_CONFIG.responsive ?? {};
  const performance = WINTER_BACKGROUND_CONFIG.performance ?? {};

  // =======================================================
  // LAYER VISIBILITY
  // =======================================================

  if (
    !isWinterLayerEnabled("glow") ||
    !glowConfig.enabled
  ) {
    return null;
  }

  // =======================================================
  // COLOR PALETTE
  // =======================================================

  const primary = colors.primary || "#22D3EE";
  const secondary = colors.secondary || "#6366F1";
  const accent = colors.accent || "#8B5CF6";

  // =======================================================
  // LIGHT / DARK INTENSITY
  // =======================================================

  const lightIntensity = clamp(
    glowConfig.intensity?.light ?? 0.45
  );

  const darkIntensity = clamp(
    glowConfig.intensity?.dark ?? 0.72
  );

  // =======================================================
  // ANIMATION CONFIGURATION
  // =======================================================

  const animationEnabled = animation.enabled !== false;

  const pulseDuration = getDuration(
    animation.pulseDuration,
    9000
  );

  const breatheDuration = getDuration(
    animation.breatheDuration,
    12000
  );

  const scanDuration = getDuration(
    animation.scanDuration,
    16000
  );

  const beamDuration = getDuration(
    animation.beamDuration,
    9500
  );

  const respectReducedMotion =
    performance.respectReducedMotion !== false;

  // =======================================================
  // RESPONSIVE BLUR
  // =======================================================

  const mobileBlur = Math.max(
    0,
    Number(responsive.mobile?.glowBlur) || 95
  );

  const tabletBlur = Math.max(
    0,
    Number(responsive.tablet?.glowBlur) || 120
  );

  const desktopBlur = Math.max(
    0,
    Number(responsive.desktop?.glowBlur) || 145
  );

  // =======================================================
  // COLOR LAYERS
  // =======================================================

  const centerGlowLight = toRgba(
    primary,
    lightIntensity * 0.18
  );

  const centerGlowDark = toRgba(
    primary,
    darkIntensity * 0.22
  );

  const leftGlow = `
    radial-gradient(
      circle,
      ${toRgba(primary, 0.22)} 0%,
      ${toRgba("#38BDF8", 0.10)} 42%,
      transparent 72%
    )
  `;

  const rightGlow = `
    radial-gradient(
      circle,
      ${toRgba(secondary, 0.20)} 0%,
      ${toRgba(accent, 0.12)} 44%,
      transparent 74%
    )
  `;

  const bottomLeftGlow = `
    radial-gradient(
      circle,
      ${toRgba(accent, 0.16)} 0%,
      ${toRgba(secondary, 0.08)} 46%,
      transparent 72%
    )
  `;

  const bottomRightGlow = `
    radial-gradient(
      circle,
      ${toRgba(secondary, 0.19)} 0%,
      ${toRgba(primary, 0.08)} 45%,
      transparent 74%
    )
  `;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-[1]",
        "overflow-hidden select-none",
        className,
      ].join(" ")}
    >
      <style>
        {`
          /* ================================================
             MAIN AMBIENT PULSE
          ================================================ */

          @keyframes ${animationId}-pulse {
            0%, 100% {
              opacity: 0.35;
              transform: scale(1);
            }

            50% {
              opacity: 0.72;
              transform: scale(1.1);
            }
          }

          /* ================================================
             SOFT LIGHT BREATHING
          ================================================ */

          @keyframes ${animationId}-breathe {
            0%, 100% {
              opacity: 0.25;
            }

            50% {
              opacity: 0.58;
            }
          }

          /* ================================================
             DIGITAL LIGHT SCAN
          ================================================ */

          @keyframes ${animationId}-scan {
            0% {
              transform: translateY(-100%);
              opacity: 0;
            }

            15% {
              opacity: 0.4;
            }

            85% {
              opacity: 0.4;
            }

            100% {
              transform: translateY(320%);
              opacity: 0;
            }
          }

          /* ================================================
             TRAVELING NEON BEAM
          ================================================ */

          @keyframes ${animationId}-beam {
            0% {
              transform: translate3d(-120%, 0, 0);
              opacity: 0;
            }

            15%, 85% {
              opacity: 1;
            }

            100% {
              transform: translate3d(520%, 0, 0);
              opacity: 0;
            }
          }

          /* ================================================
             RESPONSIVE GLOW BLUR
          ================================================ */

          .${animationId}-blur {
            filter: blur(${mobileBlur}px);
          }

          @media (min-width: 640px) {
            .${animationId}-blur {
              filter: blur(${tabletBlur}px);
            }
          }

          @media (min-width: 1024px) {
            .${animationId}-blur {
              filter: blur(${desktopBlur}px);
            }
          }

          /* ================================================
             LIGHT / DARK THEME INTENSITY
          ================================================ */

          .${animationId}-center-glow {
            background: radial-gradient(
              circle,
              ${centerGlowLight} 0%,
              transparent 70%
            );
          }

          .dark .${animationId}-center-glow {
            background: radial-gradient(
              circle,
              ${centerGlowDark} 0%,
              transparent 70%
            );
          }

          .${animationId}-ambient {
            opacity: ${lightIntensity};
          }

          .dark .${animationId}-ambient {
            opacity: ${darkIntensity};
          }

          .${animationId}-horizon {
            opacity: ${lightIntensity * 0.58};
          }

          .dark .${animationId}-horizon {
            opacity: ${darkIntensity * 0.75};
          }

          .${animationId}-scan-layer {
            opacity: 0.18;
          }

          .dark .${animationId}-scan-layer {
            opacity: 0.28;
          }

          /* ================================================
             ANIMATION CLASSES
          ================================================ */

          .${animationId}-pulse {
            animation: ${
              animationEnabled
                ? `${animationId}-pulse ${pulseDuration} ease-in-out infinite`
                : "none"
            };

            will-change: transform, opacity;
          }

          .${animationId}-breathe {
            animation: ${
              animationEnabled
                ? `${animationId}-breathe ${breatheDuration} ease-in-out infinite`
                : "none"
            };

            will-change: opacity;
          }

          .${animationId}-scan {
            animation: ${
              animationEnabled
                ? `${animationId}-scan ${scanDuration} linear infinite`
                : "none"
            };

            will-change: transform, opacity;
          }

          .${animationId}-beam {
            animation: ${
              animationEnabled
                ? `${animationId}-beam ${beamDuration} ease-in-out infinite`
                : "none"
            };

            will-change: transform, opacity;
          }

          /* ================================================
             REDUCED MOTION
          ================================================ */

          ${
            respectReducedMotion
              ? `
                @media (prefers-reduced-motion: reduce) {
                  .${animationId}-pulse,
                  .${animationId}-breathe,
                  .${animationId}-scan,
                  .${animationId}-beam {
                    animation: none !important;
                    will-change: auto !important;
                  }

                  .${animationId}-scan,
                  .${animationId}-beam {
                    opacity: 0 !important;
                  }
                }
              `
              : ""
          }
        `}
      </style>

      {/* ===================================================
          LAYER 1 — CENTRAL ATMOSPHERIC GLOW
          Soft light behind the main page content
      =================================================== */}

      <div
        className={[
          `${animationId}-center-glow`,
          "absolute",
          "left-1/2",
          "top-[42%]",
          "h-[55vw]",
          "w-[75vw]",
          "max-h-[640px]",
          "max-w-[880px]",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "rounded-full",
          animationId + "-blur",
        ].join(" ")}
      />

      {/* ===================================================
          LAYER 2 — TOP LEFT CYAN NEON
      =================================================== */}

      <div
        className={[
          `${animationId}-pulse`,
          `${animationId}-ambient`,
          `${animationId}-blur`,
          "absolute",
          "-left-[12%]",
          "top-[8%]",
          "h-[260px]",
          "w-[260px]",
          "rounded-full",
          "will-change-transform",
          "sm:h-[420px]",
          "sm:w-[420px]",
        ].join(" ")}
        style={{
          background: leftGlow,
        }}
      />

      {/* ===================================================
          LAYER 3 — TOP RIGHT INDIGO / VIOLET NEON
      =================================================== */}

      <div
        className={[
          `${animationId}-breathe`,
          `${animationId}-ambient`,
          `${animationId}-blur`,
          "absolute",
          "-right-[14%]",
          "top-[18%]",
          "h-[250px]",
          "w-[250px]",
          "rounded-full",
          "will-change-transform",
          "sm:h-[410px]",
          "sm:w-[410px]",
        ].join(" ")}
        style={{
          background: rightGlow,
        }}
      />

      {/* ===================================================
          LAYER 4 — BOTTOM LEFT VIOLET GLOW
      =================================================== */}

      <div
        className={[
          `${animationId}-ambient`,
          `${animationId}-blur`,
          "absolute",
          "-bottom-[12%]",
          "-left-[12%]",
          "h-[280px]",
          "w-[280px]",
          "rounded-full",
          "sm:h-[440px]",
          "sm:w-[440px]",
        ].join(" ")}
        style={{
          background: bottomLeftGlow,
        }}
      />

      {/* ===================================================
          LAYER 5 — BOTTOM RIGHT CYAN / BLUE GLOW
      =================================================== */}

      <div
        className={[
          `${animationId}-pulse`,
          `${animationId}-ambient`,
          `${animationId}-blur`,
          "absolute",
          "-bottom-[14%]",
          "-right-[10%]",
          "h-[260px]",
          "w-[260px]",
          "rounded-full",
          "sm:h-[430px]",
          "sm:w-[430px]",
        ].join(" ")}
        style={{
          animationDelay: "4s",
          background: bottomRightGlow,
        }}
      />

      {/* ===================================================
          LAYER 6 — UPPER CYBER HORIZON
      =================================================== */}

      <div
        className={[
          `${animationId}-horizon`,
          "absolute",
          "inset-x-0",
          "top-[24%]",
          "h-px",
          "overflow-hidden",
          "bg-gradient-to-r",
          "from-transparent",
          "via-cyan-500/25",
          "to-transparent",
          "dark:via-cyan-300/30",
        ].join(" ")}
      >
        <div
          className={[
            `${animationId}-beam`,
            "h-full",
            "w-[24%]",
            "bg-gradient-to-r",
            "from-transparent",
            "via-cyan-400",
            "to-transparent",
            "shadow-[0_0_12px_rgba(34,211,238,0.75)]",
          ].join(" ")}
        />
      </div>

      {/* ===================================================
          LAYER 7 — LOWER CYBER HORIZON
      =================================================== */}

      <div
        className={[
          `${animationId}-horizon`,
          "absolute",
          "inset-x-0",
          "bottom-[22%]",
          "h-px",
          "overflow-hidden",
          "bg-gradient-to-r",
          "from-transparent",
          "via-indigo-500/20",
          "to-transparent",
          "dark:via-indigo-300/25",
        ].join(" ")}
      >
        <div
          className={[
            `${animationId}-beam`,
            "h-full",
            "w-[24%]",
            "bg-gradient-to-r",
            "from-transparent",
            "via-indigo-400",
            "to-transparent",
            "shadow-[0_0_12px_rgba(129,140,248,0.65)]",
          ].join(" ")}
          style={{
            animationDelay: "4.8s",
          }}
        />
      </div>

      {/* ===================================================
          LAYER 8 — DIGITAL LIGHT SCAN
      =================================================== */}

      <div
        className={[
          `${animationId}-scan`,
          `${animationId}-scan-layer`,
          "absolute",
          "inset-x-0",
          "top-0",
          "h-[30%]",
          "bg-gradient-to-b",
          "from-transparent",
          "via-cyan-400/[0.06]",
          "to-transparent",
          "dark:via-cyan-300/[0.08]",
        ].join(" ")}
      />

      {/* ===================================================
          LAYER 9 — AMBIENT VIGNETTE
          Controls edge brightness and preserves readability
      =================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(148,163,184,0.07)_100%)]
          dark:bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(2,6,23,0.42)_100%)]
        "
      />

      {/* ===================================================
          LAYER 10 — TOP ATMOSPHERIC FADE
      =================================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[18%]
          bg-gradient-to-b
          from-sky-100/[0.10]
          to-transparent
          dark:from-cyan-300/[0.035]
        "
      />
    </div>
  );
};

export default memo(WinterGlow);
