
import React from "react";

import {
  Activity,
  Loader2,
} from "lucide-react";

import {
  safeNumber,
} from "./postDetailHelpers";

// =========================================================
// FSOCIETY — POST DETAIL STAT CARD
// =========================================================
//
// Supports:
// - Like
// - Views
// - Comments
// - Other statistics
//
// Features:
// - Interactive or read-only mode
// - Light / Dark Mode
// - Responsive layout
// - Loading state
// - Active state
// - Accessible buttons
// - FCoin-compatible numeric formatting
//
// No Redux or API calls.
// =========================================================

// =========================================================
// TONE CONFIG
// =========================================================

const TONES = {
  pink: {
    panel: `
      border-slate-200
      bg-white/80

      dark:border-white/[0.08]
      dark:bg-white/[0.025]
    `,

    hover: `
      hover:border-pink-300
      hover:bg-pink-50/70

      dark:hover:border-pink-400/25
      dark:hover:bg-pink-500/[0.06]
    `,

    active: `
      border-pink-300
      bg-pink-50

      dark:border-pink-400/30
      dark:bg-pink-500/[0.11]
    `,

    icon: `
      border-pink-200
      bg-pink-50
      text-pink-600

      dark:border-pink-400/20
      dark:bg-pink-500/10
      dark:text-pink-300
    `,

    activeIcon: `
      border-pink-300
      bg-pink-100
      text-pink-600

      dark:border-pink-400/30
      dark:bg-pink-500/15
      dark:text-pink-300
    `,
  },

  cyan: {
    panel: `
      border-slate-200
      bg-white/80

      dark:border-white/[0.08]
      dark:bg-white/[0.025]
    `,

    hover: `
      hover:border-cyan-300
      hover:bg-cyan-50/70

      dark:hover:border-cyan-400/25
      dark:hover:bg-cyan-500/[0.06]
    `,

    active: `
      border-cyan-300
      bg-cyan-50

      dark:border-cyan-400/25
      dark:bg-cyan-500/[0.08]
    `,

    icon: `
      border-cyan-200
      bg-cyan-50
      text-cyan-700

      dark:border-cyan-400/20
      dark:bg-cyan-500/10
      dark:text-cyan-300
    `,

    activeIcon: `
      border-cyan-300
      bg-cyan-100
      text-cyan-700

      dark:border-cyan-400/25
      dark:bg-cyan-500/15
      dark:text-cyan-300
    `,
  },

  emerald: {
    panel: `
      border-slate-200
      bg-white/80

      dark:border-white/[0.08]
      dark:bg-white/[0.025]
    `,

    hover: `
      hover:border-emerald-300
      hover:bg-emerald-50/70

      dark:hover:border-emerald-400/25
      dark:hover:bg-emerald-500/[0.06]
    `,

    active: `
      border-emerald-300
      bg-emerald-50

      dark:border-emerald-400/25
      dark:bg-emerald-500/[0.08]
    `,

    icon: `
      border-emerald-200
      bg-emerald-50
      text-emerald-700

      dark:border-emerald-400/20
      dark:bg-emerald-500/10
      dark:text-emerald-300
    `,

    activeIcon: `
      border-emerald-300
      bg-emerald-100
      text-emerald-700

      dark:border-emerald-400/25
      dark:bg-emerald-500/15
      dark:text-emerald-300
    `,
  },

  indigo: {
    panel: `
      border-slate-200
      bg-white/80

      dark:border-white/[0.08]
      dark:bg-white/[0.025]
    `,

    hover: `
      hover:border-indigo-300
      hover:bg-indigo-50/70

      dark:hover:border-indigo-400/25
      dark:hover:bg-indigo-500/[0.06]
    `,

    active: `
      border-indigo-300
      bg-indigo-50

      dark:border-indigo-400/25
      dark:bg-indigo-500/[0.08]
    `,

    icon: `
      border-indigo-200
      bg-indigo-50
      text-indigo-700

      dark:border-indigo-400/20
      dark:bg-indigo-500/10
      dark:text-indigo-300
    `,

    activeIcon: `
      border-indigo-300
      bg-indigo-100
      text-indigo-700

      dark:border-indigo-400/25
      dark:bg-indigo-500/15
      dark:text-indigo-300
    `,
  },
};

// =========================================================
// FORMAT COUNT
// =========================================================

const formatCount = (value) => {
  const count = Math.trunc(
    safeNumber(value)
  );

  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(count);
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const PostDetailStatCard = ({
  icon: Icon = Activity,

  label = "",
  value = 0,
  tone = "indigo",

  onClick,

  isActive = false,
  isLoading = false,
  disabled = false,

  ariaLabel,
  pressed,

  className = "",
}) => {
  // =======================================================
  // VALUES
  // =======================================================

  const styles =
    TONES[tone] ??
    TONES.indigo;

  const clickable =
    typeof onClick === "function";

  const loading =
    Boolean(isLoading);

  const active =
    Boolean(isActive);

  const isDisabled =
    Boolean(disabled || loading);

  const displayValue =
    formatCount(value);

  const selectedPressed =
    typeof pressed === "boolean"
      ? pressed
      : active;

  // =======================================================
  // COMPONENT TYPE
  // =======================================================

  const Root = clickable
    ? "button"
    : "div";

  // =======================================================
  // ROOT PROPS
  // =======================================================

  const interactiveProps = clickable
    ? {
        type: "button",
        onClick,
        disabled: isDisabled,

        "aria-label":
          ariaLabel ||
          `${displayValue} ${label}`,

        "aria-pressed":
          typeof pressed === "boolean" ||
          tone === "pink"
            ? selectedPressed
            : undefined,

        "aria-busy": loading,
      }
    : {};

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Root
      {...interactiveProps}
      className={`
        group
        relative
        flex
        w-full
        min-w-0
        items-center
        gap-3
        overflow-hidden

        rounded-2xl
        border
        p-3.5
        text-left

        transition-colors
        duration-200

        sm:gap-4
        sm:p-4

        ${
          active
            ? styles.active
            : styles.panel
        }

        ${
          clickable && !isDisabled
            ? `
              cursor-pointer
              ${styles.hover}

              active:scale-[0.99]

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2

              dark:focus-visible:ring-offset-[#0b1018]
            `
            : ""
        }

        ${
          clickable && isDisabled
            ? `
              cursor-not-allowed
              opacity-65
            `
            : ""
        }

        motion-reduce:transition-none

        ${className}
      `}
    >
      {/* =====================================
          ICON
      ===================================== */}

      <div
        className={`
          grid
          h-11
          w-11
          shrink-0
          place-items-center
          rounded-xl
          border

          ${
            active
              ? styles.activeIcon
              : styles.icon
          }
        `}
      >
        {loading ? (
          <Loader2
            size={20}
            className="
              motion-safe:animate-spin
            "
            aria-hidden="true"
          />
        ) : (
          <Icon
            size={21}
            strokeWidth={1.9}
            className={
              active && tone === "pink"
                ? "fill-current"
                : ""
            }
            aria-hidden="true"
          />
        )}
      </div>

      {/* =====================================
          COUNT AND LABEL
      ===================================== */}

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-xl
            font-black
            leading-6
            tabular-nums
            tracking-tight
            text-slate-900

            dark:text-white
          "
        >
          {displayValue}
        </p>

        <p
          className="
            mt-1
            min-w-0
            break-words
            text-xs
            font-medium
            leading-5
            text-slate-500

            dark:text-slate-400
          "
        >
          {label}
        </p>
      </div>

      {/* =====================================
          LOADING STATUS
      ===================================== */}

      {loading && (
        <span
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          Statistik ma'lumot yangilanmoqda.
        </span>
      )}
    </Root>
  );
};

export default React.memo(
  PostDetailStatCard
);
