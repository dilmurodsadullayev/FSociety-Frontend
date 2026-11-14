import React, { memo, useId, useMemo } from "react";

import WINTER_BACKGROUND_CONFIG from "../data/winterBackgroundConfig";

// =========================================================
// FSOCIETY — NEW YEAR TRANSITION
// 2026 → 2027
// Cyber Glitch / Grid Disintegration
// =========================================================

const GRID_COLUMNS = 8;
const GRID_ROWS = 10;
const TOTAL_CELLS = GRID_COLUMNS * GRID_ROWS;

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const getPositiveNumber = (value, fallback) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : fallback;
};

const sanitizeId = (value) =>
  String(value).replace(/[^a-zA-Z0-9_-]/g, "");

// =========================================================
// GRID GENERATOR
// Deterministic animation values
// =========================================================

const createGridCells = () =>
  Array.from({ length: TOTAL_CELLS }, (_, index) => {
    const row = Math.floor(index / GRID_COLUMNS);
    const column = index % GRID_COLUMNS;

    const seed = index + 1;

    const centerX = (column - (GRID_COLUMNS - 1) / 2) * 1.8;
    const centerY = (row - (GRID_ROWS - 1) / 2) * 1.8;

    const direction = seed % 2 === 0 ? 1 : -1;

    const translateX =
      centerX * 2.4 + direction * ((seed * 13) % 18);

    const translateY =
      centerY * 2.2 - ((seed * 17) % 24);

    const rotate =
      ((seed * 29) % 90) - 45;

    const delay =
      ((seed * 37) % 70) / 100;

    const duration =
      0.65 + ((seed * 11) % 45) / 100;

    return {
      id: index,
      row,
      column,
      translateX,
      translateY,
      rotate,
      delay,
      duration,
    };
  });

// =========================================================
// MAIN COMPONENT
// =========================================================

const NewYearTransition = ({ className = "" }) => {
  const reactId = useId();

  const safeId = sanitizeId(reactId);
  const animationId = `fs-new-year-${safeId}`;

  const yearConfig =
    WINTER_BACKGROUND_CONFIG.yearTransition ?? {};

  const animationConfig =
    yearConfig.animation ?? {};

  const performanceConfig =
    WINTER_BACKGROUND_CONFIG.performance ?? {};

  // =======================================================
  // CONFIGURATION
  // =======================================================

  const enabled =
    WINTER_BACKGROUND_CONFIG.enabled !== false &&
    yearConfig.enabled !== false &&
    WINTER_BACKGROUND_CONFIG.layers?.yearTransition !== false;

  const animationEnabled =
    animationConfig.enabled !== false;

  const respectReducedMotion =
    performanceConfig.respectReducedMotion !== false;

  const fromYear = String(yearConfig.fromYear || "2026");
  const toYear = String(yearConfig.toYear || "2027");

  const duration = getPositiveNumber(
    animationConfig.duration ?? yearConfig.duration,
    4.2
  );

  const delay = Math.max(
    0,
    Number(animationConfig.delay ?? yearConfig.delay ?? 1.2) || 0
  );

  const primaryColor =
    yearConfig.colors?.primary || "#22D3EE";

  const secondaryColor =
    yearConfig.colors?.secondary || "#6366F1";

  const accentColor =
    yearConfig.colors?.accent || "#A78BFA";

  const oldYear = fromYear.slice(0, -1);
  const oldDigit = fromYear.slice(-1);

  const newYear = toYear.slice(0, -1);
  const newDigit = toYear.slice(-1);

  const cells = useMemo(
    () => createGridCells(),
    []
  );

  if (!enabled || !fromYear || !toYear) {
    return null;
  }

  // =======================================================
  // STATIC MODE
  // =======================================================

  const staticMode = !animationEnabled;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-label={`New Year ${fromYear} to ${toYear}`}
      role="img"
      className={[
        "pointer-events-none",
        "relative",
        "inline-flex",
        "select-none",
        "items-center",
        "justify-center",
        "overflow-visible",
        className,
      ].join(" ")}
    >
      <style>
        {`
          /* ================================================
             MAIN YEAR TRANSITION
          ================================================ */

          @keyframes ${animationId}-old-year {
            0%,
            28% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }

            42% {
              opacity: 0.9;
              transform: translateY(-2px) scale(1.015);
              filter: blur(1px);
            }

            56%,
            100% {
              opacity: 0;
              transform: translateY(-12px) scale(0.96);
              filter: blur(5px);
            }
          }

          @keyframes ${animationId}-new-year {
            0%,
            38% {
              opacity: 0;
              transform: translateY(12px) scale(0.96);
              filter: blur(5px);
            }

            54% {
              opacity: 0.85;
              transform: translateY(-2px) scale(1.025);
              filter: blur(1px);
            }

            68%,
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          /* ================================================
             LAST DIGIT GLITCH
          ================================================ */

          @keyframes ${animationId}-digit-glitch {
            0%,
            30% {
              opacity: 1;
              transform: translate(0, 0);
              text-shadow: none;
            }

            34% {
              transform: translate(-3px, 1px);
              text-shadow:
                -3px 0 ${primaryColor},
                3px 0 ${accentColor};
            }

            37% {
              transform: translate(3px, -1px);
              text-shadow:
                3px 0 ${primaryColor},
                -3px 0 ${secondaryColor};
            }

            40% {
              transform: translate(-2px, 0);
              text-shadow:
                -2px 0 ${accentColor},
                2px 0 ${primaryColor};
            }

            44%,
            100% {
              opacity: 0;
              transform: translate(0, -8px);
              text-shadow: none;
            }
          }

          @keyframes ${animationId}-digit-reveal {
            0%,
            39% {
              opacity: 0;
              transform: translateY(10px) scale(0.8);
              filter: blur(5px);
            }

            45% {
              opacity: 1;
              transform: translateY(-2px) scale(1.12);
              filter: blur(0);
              text-shadow:
                0 0 12px ${primaryColor},
                0 0 28px ${secondaryColor};
            }

            52% {
              transform: translateY(1px) scale(0.96);
            }

            60%,
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
              text-shadow:
                0 0 12px ${primaryColor}80,
                0 0 26px ${secondaryColor}50;
            }
          }

          /* ================================================
             GRID DISINTEGRATION
          ================================================ */

          @keyframes ${animationId}-grid-break {
            0%,
            28% {
              opacity: 0;
              transform: translate3d(0, 0, 0) rotate(0);
            }

            34% {
              opacity: 0.95;
              transform: translate3d(0, 0, 0) rotate(0);
            }

            42% {
              opacity: 1;
              transform:
                translate3d(
                  var(--cell-x),
                  var(--cell-y),
                  0
                )
                rotate(var(--cell-rotation));
            }

            58% {
              opacity: 0.65;
              transform:
                translate3d(
                  calc(var(--cell-x) * 1.5),
                  calc(var(--cell-y) * 1.5),
                  0
                )
                rotate(calc(var(--cell-rotation) * 1.5));
            }

            72%,
            100% {
              opacity: 0;
              transform:
                translate3d(
                  calc(var(--cell-x) * 2),
                  calc(var(--cell-y) * 2),
                  0
                )
                rotate(calc(var(--cell-rotation) * 2));
            }
          }

          @keyframes ${animationId}-grid-rebuild {
            0%,
            38% {
              opacity: 0;
              transform: translate3d(
                var(--cell-x),
                var(--cell-y),
                0
              ) scale(0.2);
            }

            48% {
              opacity: 0.9;
              transform: translate3d(0, 0, 0) scale(1.15);
            }

            62%,
            100% {
              opacity: 0;
              transform: translate3d(0, 0, 0) scale(1);
            }
          }

          /* ================================================
             CHROMATIC SIGNAL
          ================================================ */

          @keyframes ${animationId}-signal {
            0%,
            30%,
            100% {
              opacity: 0;
              transform: scaleX(0.2);
            }

            36% {
              opacity: 0.9;
              transform: scaleX(1);
            }

            44% {
              opacity: 0.3;
              transform: scaleX(0.7);
            }

            52% {
              opacity: 0.8;
              transform: scaleX(1);
            }

            62% {
              opacity: 0;
              transform: scaleX(0.2);
            }
          }

          /* ================================================
             ANIMATION CLASSES
          ================================================ */

          .${animationId}-old {
            ${
              animationEnabled
                ? `animation: ${animationId}-old-year ${duration}s ease-in-out ${delay}s both;`
                : "opacity: 0;"
            }
          }

          .${animationId}-new {
            ${
              animationEnabled
                ? `animation: ${animationId}-new-year ${duration}s ease-in-out ${delay}s both;`
                : "opacity: 1;"
            }
          }

          .${animationId}-old-digit {
            ${
              animationEnabled
                ? `animation: ${animationId}-digit-glitch ${duration}s steps(1, end) ${delay}s both;`
                : "opacity: 0;"
            }
          }

          .${animationId}-new-digit {
            ${
              animationEnabled
                ? `animation: ${animationId}-digit-reveal ${duration}s ease-out ${delay}s both;`
                : "opacity: 1;"
            }
          }

          .${animationId}-grid-break {
            ${
              animationEnabled
                ? `animation: ${animationId}-grid-break ${duration}s ease-out ${delay}s both;`
                : "display: none;"
            }
          }

          .${animationId}-grid-rebuild {
            ${
              animationEnabled
                ? `animation: ${animationId}-grid-rebuild ${duration}s ease-out ${delay}s both;`
                : "display: none;"
            }
          }

          .${animationId}-signal {
            ${
              animationEnabled
                ? `animation: ${animationId}-signal ${duration}s ease-in-out ${delay}s both;`
                : "display: none;"
            }
          }

          /* ================================================
             GRID LAYOUT
          ================================================ */

          .${animationId}-grid {
            display: grid;
            grid-template-columns: repeat(${GRID_COLUMNS}, 1fr);
            grid-template-rows: repeat(${GRID_ROWS}, 1fr);
            pointer-events: none;
          }

          .${animationId}-cell {
            width: 100%;
            height: 100%;
            background: linear-gradient(
              135deg,
              ${primaryColor} 0%,
              ${secondaryColor} 55%,
              ${accentColor} 100%
            );
            box-shadow:
              0 0 5px ${primaryColor}80,
              inset 0 0 3px rgba(255, 255, 255, 0.45);
            opacity: 0;
            transform-origin: center;
          }

          /* ================================================
             REDUCED MOTION
          ================================================ */

          ${
            respectReducedMotion
              ? `
                @media (prefers-reduced-motion: reduce) {
                  .${animationId}-old,
                  .${animationId}-old-digit,
                  .${animationId}-grid-break,
                  .${animationId}-grid-rebuild,
                  .${animationId}-signal {
                    animation: none !important;
                    opacity: 0 !important;
                  }

                  .${animationId}-new,
                  .${animationId}-new-digit {
                    animation: none !important;
                    opacity: 1 !important;
                    transform: none !important;
                    filter: none !important;
                  }

                  .${animationId}-grid {
                    display: none !important;
                  }
                }
              `
              : ""
          }
        `}
      </style>

      {/* ================================================
          YEAR DISPLAY
      ================================================ */}

      <div
        className="
          relative
          inline-flex
          items-center
          justify-center
          font-mono
          font-black
          leading-none
          tracking-[0.04em]
          text-[clamp(1.5rem,5vw,3.5rem)]
          sm:text-[clamp(2rem,4vw,4rem)]
        "
      >
        {/* OLD YEAR */}

        <span
          className={[
            `${animationId}-old`,
            "inline-flex items-center",
            "bg-gradient-to-r",
            "from-slate-200",
            "via-cyan-100",
            "to-slate-300",
            "bg-clip-text",
            "text-transparent",
            "dark:from-cyan-100",
            "dark:via-sky-300",
            "dark:to-indigo-300",
          ].join(" ")}
          aria-hidden="true"
        >
          {oldYear}

          <span
            className={`${animationId}-old-digit inline-block`}
          >
            {oldDigit}
          </span>
        </span>

        {/* NEW YEAR */}

        <span
          className={[
            `${animationId}-new`,
            "absolute inset-0",
            "inline-flex items-center justify-center",
            "bg-gradient-to-r",
            "from-cyan-500",
            "via-sky-500",
            "to-violet-500",
            "bg-clip-text",
            "text-transparent",
            "dark:from-cyan-200",
            "dark:via-blue-300",
            "dark:to-violet-300",
          ].join(" ")}
          aria-hidden="true"
        >
          {newYear}

          <span
            className={`${animationId}-new-digit inline-block`}
          >
            {newDigit}
          </span>
        </span>

        {/* GRID EFFECT */}

        <div
          className={[
            `${animationId}-grid`,
            "absolute",
            "inset-[-12%]",
            "z-10",
            "overflow-visible",
          ].join(" ")}
          aria-hidden="true"
        >
          {cells.map((cell) => (
            <span
              key={cell.id}
              className={[
                "relative",
                "block",
                `${animationId}-cell`,
                cell.id % 2 === 0
                  ? `${animationId}-grid-break`
                  : `${animationId}-grid-rebuild`,
              ].join(" ")}
              style={{
                "--cell-x": `${cell.translateX}px`,
                "--cell-y": `${cell.translateY}px`,
                "--cell-rotation": `${cell.rotate}deg`,
                animationDelay: `${
                  delay + cell.delay
                }s`,
                animationDuration: `${
                  duration + cell.duration * 0.12
                }s`,
              }}
            />
          ))}
        </div>

        {/* CHROMATIC SIGNAL */}

        <span
          className={[
            `${animationId}-signal`,
            "absolute",
            "left-[-12%]",
            "right-[-12%]",
            "top-1/2",
            "z-20",
            "h-px",
            "origin-center",
            "bg-gradient-to-r",
            "from-transparent",
            "via-cyan-300",
            "to-transparent",
            "shadow-[0_0_12px_rgba(34,211,238,0.9)]",
          ].join(" ")}
          aria-hidden="true"
        />
      </div>

      {/* ================================================
          STATIC FALLBACK
      ================================================ */}

      {staticMode && (
        <span className="sr-only">
          {toYear}
        </span>
      )}
    </div>
  );
};

export default memo(NewYearTransition);