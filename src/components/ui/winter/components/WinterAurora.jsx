
import React, { memo, useId } from "react";

import WINTER_BACKGROUND_CONFIG, {
  isWinterLayerEnabled,
} from "../data/winterBackgroundConfig";

// =========================================================
// FSOCIETY — WINTER AURORA
// Northern Lights / Cyber Arctic Sky
// =========================================================

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const getDuration = (value, fallback) => {
  const parsed = Number(value);

  return `${parsed > 0 ? parsed : fallback}ms`;
};

const toRgba = (color, opacity) => {
  const alpha = clamp(opacity);
  const value = String(color || "#22D3EE").replace("#", "");

  const hex =
    value.length === 3
      ? value.split("").map((character) => character + character).join("")
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return `rgba(34, 211, 238, ${alpha})`;
  }

  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const WinterAurora = ({ className = "" }) => {
  const reactId = useId();
  const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
  const animationId = `fs-aurora-${safeId}`;

  const config = WINTER_BACKGROUND_CONFIG.aurora ?? {};
  const animation = config.animation ?? {};
  const performance = WINTER_BACKGROUND_CONFIG.performance ?? {};

  // =======================================================
  // VISIBILITY
  // =======================================================

  if (
    !isWinterLayerEnabled("aurora") ||
    !config.enabled
  ) {
    return null;
  }

  // =======================================================
  // COLOR PALETTE
  // =======================================================

  const colors = Array.isArray(config.colors)
    ? config.colors
    : [];

  const cyan = colors[0] || "#22D3EE";
  const skyBlue = colors[1] || "#38BDF8";
  const royalBlue = colors[2] || "#3B82F6";
  const indigo = colors[3] || "#6366F1";
  const violet = colors[4] || "#8B5CF6";
  const emerald = "#10B981";

  // =======================================================
  // THEME OPACITY
  // =======================================================

  const lightOpacity = clamp(config.opacity?.light ?? 0.42);
  const darkOpacity = clamp(config.opacity?.dark ?? 0.62);

  // =======================================================
  // ANIMATION
  // =======================================================

  const animationEnabled = animation.enabled !== false;

  const durationOne = getDuration(animation.duration, 22000);
  const durationTwo = getDuration(
    animation.secondaryDuration,
    28000
  );
  const durationThree = getDuration(
    animation.tertiaryDuration,
    18000
  );
  const shimmerDuration = getDuration(
    animation.shimmerDuration,
    11000
  );

  const easing = animation.easing || "ease-in-out";

  const respectReducedMotion =
    performance.respectReducedMotion !== false;

  // =======================================================
  // RESPONSIVE BLUR
  // =======================================================

  const mobileBlur = Math.max(
    0,
    Number(animation.blur?.mobile ?? 80)
  );

  const tabletBlur = Math.max(
    0,
    Number(animation.blur?.tablet ?? 110)
  );

  const desktopBlur = Math.max(
    0,
    Number(animation.blur?.desktop ?? 135)
  );

  // =======================================================
  // GRADIENT COLORS
  // =======================================================

  const cyanGlow = toRgba(cyan, 0.42);
  const blueGlow = toRgba(royalBlue, 0.32);
  const violetGlow = toRgba(violet, 0.34);
  const greenGlow = toRgba(emerald, 0.25);

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none",
        "absolute inset-0 z-0",
        "overflow-hidden select-none",
        className,
      ].join(" ")}
    >
      <style>
        {`
          /* ================================================
             RESPONSIVE BLUR
          ================================================ */

          .${animationId}-blur {
            filter: blur(${mobileBlur * 0.2}px);
          }

          @media (min-width: 640px) {
            .${animationId}-blur {
              filter: blur(${tabletBlur * 0.2}px);
            }
          }

          @media (min-width: 1024px) {
            .${animationId}-blur {
              filter: blur(${desktopBlur * 0.2}px);
            }
          }

          /* ================================================
             PRIMARY AURORA MOVEMENT
          ================================================ */

          @keyframes ${animationId}-flow-one {
            0%, 100% {
              transform: translate3d(-3%, 0, 0) scaleX(1);
            }

            50% {
              transform: translate3d(4%, 2%, 0) scaleX(1.08);
            }
          }

          /* ================================================
             SECONDARY AURORA MOVEMENT
          ================================================ */

          @keyframes ${animationId}-flow-two {
            0%, 100% {
              transform: translate3d(4%, -1%, 0) scaleX(1.04);
            }

            50% {
              transform: translate3d(-5%, 3%, 0) scaleX(0.96);
            }
          }

          /* ================================================
             VERTICAL LIGHT CURTAINS
          ================================================ */

          @keyframes ${animationId}-curtain {
            0%, 100% {
              transform: translate3d(-2%, 0, 0) skewX(-3deg);
              opacity: 0.65;
            }

            50% {
              transform: translate3d(2%, 2%, 0) skewX(3deg);
              opacity: 1;
            }
          }

          /* ================================================
             AMBIENT COLOR BREATHING
          ================================================ */

          @keyframes ${animationId}-breathing {
            0%, 100% {
              opacity: 0.55;
            }

            50% {
              opacity: 0.95;
            }
          }

          /* ================================================
             LIGHT / DARK INTENSITY
          ================================================ */

          .${animationId}-atmosphere {
            opacity: ${lightOpacity};
          }

          .dark .${animationId}-atmosphere {
            opacity: ${darkOpacity};
          }

          /* ================================================
             ANIMATION BINDINGS
          ================================================ */

          .${animationId}-flow-one {
            animation: ${
              animationEnabled
                ? `${animationId}-flow-one ${durationOne} ${easing} infinite`
                : "none"
            };
          }

          .${animationId}-flow-two {
            animation: ${
              animationEnabled
                ? `${animationId}-flow-two ${durationTwo} ${easing} infinite`
                : "none"
            };
          }

          .${animationId}-curtain {
            animation: ${
              animationEnabled
                ? `${animationId}-curtain ${shimmerDuration} ${easing} infinite`
                : "none"
            };
          }

          .${animationId}-breathing {
            animation: ${
              animationEnabled
                ? `${animationId}-breathing ${durationThree} ${easing} infinite`
                : "none"
            };
          }

          ${
            respectReducedMotion
              ? `
                @media (prefers-reduced-motion: reduce) {
                  .${animationId}-flow-one,
                  .${animationId}-flow-two,
                  .${animationId}-curtain,
                  .${animationId}-breathing {
                    animation: none !important;
                    will-change: auto !important;
                  }
                }
              `
              : ""
          }
        `}
      </style>

      {/* ===================================================
          LAYER 1 — UPPER ARCTIC ATMOSPHERE
      =================================================== */}

      <div
        className="
          absolute inset-x-0 top-0
          h-[48%]
          bg-gradient-to-b
          from-cyan-400/[0.04]
          via-blue-500/[0.025]
          to-transparent
          dark:from-cyan-400/[0.06]
          dark:via-indigo-500/[0.035]
        "
      />

      {/* ===================================================
          LAYER 2 — PRIMARY NORTHERN LIGHTS
          Large flowing cyan / emerald / violet ribbon
      =================================================== */}

      <svg
        viewBox="0 0 1920 600"
        preserveAspectRatio="xMidYMin slice"
        className={[
          `${animationId}-atmosphere`,
          `${animationId}-flow-one`,
          "absolute",
          "-top-[5%]",
          "left-[-8%]",
          "h-[43%]",
          "w-[116%]",
          "overflow-visible",
          "will-change-transform",
        ].join(" ")}
      >
        <defs>
          <linearGradient
            id={`${safeId}-aurora-main`}
            x1="0"
            y1="0"
            x2="1920"
            y2="420"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={cyan} stopOpacity="0" />
            <stop offset="17%" stopColor={cyan} stopOpacity="0.48" />
            <stop offset="34%" stopColor={emerald} stopOpacity="0.44" />
            <stop offset="53%" stopColor={skyBlue} stopOpacity="0.62" />
            <stop offset="72%" stopColor={indigo} stopOpacity="0.52" />
            <stop offset="88%" stopColor={violet} stopOpacity="0.4" />
            <stop offset="100%" stopColor={violet} stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id={`${safeId}-aurora-secondary`}
            x1="1920"
            y1="0"
            x2="0"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={violet} stopOpacity="0" />
            <stop offset="24%" stopColor={violet} stopOpacity="0.5" />
            <stop offset="49%" stopColor={cyan} stopOpacity="0.46" />
            <stop offset="75%" stopColor={skyBlue} stopOpacity="0.48" />
            <stop offset="100%" stopColor={cyan} stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id={`${safeId}-aurora-fade`}
            x1="0"
            y1="0"
            x2="0"
            y2="600"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="45%" stopColor="white" stopOpacity="0.78" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <mask id={`${safeId}-aurora-mask`}>
            <rect
              width="1920"
              height="600"
              fill={`url(#${safeId}-aurora-fade)`}
            />
          </mask>
        </defs>

        <g mask={`url(#${safeId}-aurora-mask)`}>
          <path
            d="
              M0 60
              C230 -40 385 170 625 82
              C855 -15 1040 140 1220 55
              C1440 -35 1650 140 1920 18
              L1920 330
              C1660 240 1490 390 1250 260
              C1040 175 850 380 620 270
              C390 170 180 365 0 245
              Z
            "
            fill={`url(#${safeId}-aurora-main)`}
          />

          <path
            d="
              M0 145
              C245 40 480 275 720 150
              C965 22 1160 270 1370 150
              C1580 45 1760 210 1920 130
              L1920 415
              C1690 300 1480 455 1250 350
              C1010 235 830 475 590 350
              C340 225 160 430 0 345
              Z
            "
            fill={`url(#${safeId}-aurora-secondary)`}
            opacity="0.76"
          />
        </g>
      </svg>

      {/* ===================================================
          LAYER 3 — VERTICAL AURORA CURTAINS
          Northern lights flowing down from the sky
      =================================================== */}

      <svg
        viewBox="0 0 1920 650"
        preserveAspectRatio="xMidYMin slice"
        className={[
          `${animationId}-atmosphere`,
          `${animationId}-curtain`,
          "absolute",
          "-top-[3%]",
          "left-[-5%]",
          "h-[42%]",
          "w-[110%]",
          "will-change-transform",
        ].join(" ")}
      >
        <defs>
          <linearGradient
            id={`${safeId}-curtain-cyan`}
            x1="0"
            y1="0"
            x2="0"
            y2="650"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={cyan} stopOpacity="0" />
            <stop offset="22%" stopColor={cyan} stopOpacity="0.5" />
            <stop offset="66%" stopColor={cyan} stopOpacity="0.16" />
            <stop offset="100%" stopColor={cyan} stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id={`${safeId}-curtain-violet`}
            x1="0"
            y1="0"
            x2="0"
            y2="650"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={violet} stopOpacity="0" />
            <stop offset="25%" stopColor={violet} stopOpacity="0.48" />
            <stop offset="65%" stopColor={violet} stopOpacity="0.14" />
            <stop offset="100%" stopColor={violet} stopOpacity="0" />
          </linearGradient>
        </defs>

        <g fill="none" strokeLinecap="round">
          {/* Cyan light curtains */}
          <path
            d="M360 -20C420 120 330 280 390 520"
            stroke={`url(#${safeId}-curtain-cyan)`}
            strokeWidth="90"
            opacity="0.55"
          />

          <path
            d="M570 -20C630 120 520 270 590 470"
            stroke={`url(#${safeId}-curtain-cyan)`}
            strokeWidth="65"
            opacity="0.46"
          />

          <path
            d="M1200 -20C1135 140 1265 290 1195 510"
            stroke={`url(#${safeId}-curtain-cyan)`}
            strokeWidth="82"
            opacity="0.48"
          />

          <path
            d="M1450 -20C1400 135 1500 270 1460 460"
            stroke={`url(#${safeId}-curtain-cyan)`}
            strokeWidth="58"
            opacity="0.42"
          />

          {/* Violet light curtains */}
          <path
            d="M840 -20C900 145 800 290 865 440"
            stroke={`url(#${safeId}-curtain-violet)`}
            strokeWidth="76"
            opacity="0.42"
          />

          <path
            d="M1040 -20C1095 120 1010 300 1070 480"
            stroke={`url(#${safeId}-curtain-violet)`}
            strokeWidth="48"
            opacity="0.4"
          />

          <path
            d="M1680 -20C1635 135 1710 285 1685 430"
            stroke={`url(#${safeId}-curtain-violet)`}
            strokeWidth="62"
            opacity="0.34"
          />
        </g>
      </svg>

      {/* ===================================================
          LAYER 4 — SOFT AURORA COLOR CLOUDS
      =================================================== */}

      <div
        className={[
          `${animationId}-blur`,
          `${animationId}-atmosphere`,
          `${animationId}-breathing`,
          "absolute",
          "-top-[12%]",
          "left-[6%]",
          "h-[36%]",
          "w-[48%]",
          "rounded-full",
          "will-change-transform",
        ].join(" ")}
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              ${cyanGlow} 0%,
              ${greenGlow} 35%,
              transparent 74%
            )
          `,
        }}
      />

      <div
        className={[
          `${animationId}-blur`,
          `${animationId}-atmosphere`,
          `${animationId}-breathing`,
          "absolute",
          "-top-[10%]",
          "right-[5%]",
          "h-[34%]",
          "w-[46%]",
          "rounded-full",
          "will-change-transform",
        ].join(" ")}
        style={{
          animationDelay: "3s",
          background: `
            radial-gradient(
              ellipse at center,
              ${blueGlow} 0%,
              ${violetGlow} 42%,
              transparent 76%
            )
          `,
        }}
      />

      {/* ===================================================
          LAYER 5 — CENTRAL SKY ATMOSPHERE
          Keep brand area visible and readable
      =================================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[37%]
          bg-gradient-to-b
          from-transparent
          via-transparent
          to-[#DCEFFF]/10
          dark:to-[#02091D]/20
        "
      />
    </div>
  );
};

export default memo(WinterAurora);
