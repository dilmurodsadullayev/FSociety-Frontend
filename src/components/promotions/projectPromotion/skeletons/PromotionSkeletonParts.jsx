
import React from "react";

// =========================================================
// FSOCIETY — PROMOTION SKELETON PARTS
// =========================================================
//
// Reusable presentation primitives.
//
// - No Redux
// - No API
// - No timers
// - No business logic
//
// Animation is controlled by each parent skeleton.
// =========================================================

// =========================================================
// SHAPES
// =========================================================

const SHAPE_CLASSES = {
  line: "rounded-full",
  rectangle: "rounded-xl",
  card: "rounded-2xl",
  circle: "rounded-full",
};

// =========================================================
// COLORS
// =========================================================

const TONE_CLASSES = {
  default: `
    bg-slate-200/90
    dark:bg-white/[0.09]
  `,

  purple: `
    bg-purple-200/80
    dark:bg-purple-400/[0.13]
  `,

  indigo: `
    bg-indigo-200/80
    dark:bg-indigo-400/[0.13]
  `,

  emerald: `
    bg-emerald-200/80
    dark:bg-emerald-400/[0.13]
  `,

  amber: `
    bg-amber-200/80
    dark:bg-amber-400/[0.13]
  `,
};

// =========================================================
// SKELETON BLOCK
// =========================================================

export const PromotionSkeletonBlock = React.memo(
  function PromotionSkeletonBlock({
    className = "",
    shape = "line",
    tone = "default",
  }) {
    const shapeClass =
      SHAPE_CLASSES[shape] ??
      SHAPE_CLASSES.line;

    const toneClass =
      TONE_CLASSES[tone] ??
      TONE_CLASSES.default;

    return (
      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          max-w-full
          select-none

          ${shapeClass}
          ${toneClass}
          ${className}
        `}
      />
    );
  }
);

// =========================================================
// SKELETON SURFACE
// =========================================================

export const PromotionSkeletonSurface = React.memo(
  function PromotionSkeletonSurface({
    children,
    className = "",
  }) {
    return (
      <div
        aria-hidden="true"
        className={`
          min-w-0
          rounded-2xl
          border
          border-slate-200/80
          bg-white/75
          p-3.5

          dark:border-white/[0.07]
          dark:bg-white/[0.025]

          ${className}
        `}
      >
        {children}
      </div>
    );
  }
);
