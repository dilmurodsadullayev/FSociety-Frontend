import React, {
  memo,
  useContext,
  useMemo,
} from "react";

import {
  Snowflake,
} from "lucide-react";

import NewYearContext from "../context/NewYearContext";

// =========================================================
// FSOCIETY — WINTER EXPERIENCE BUTTON
// =========================================================
//
// Location:
//
// src/features/newYear/components/WinterExperienceButton.jsx
//
// Responsibilities:
//
// - Open / Close Winter Experience floating card
// - Accessible navbar trigger button
// - Active state & live winter effects indicator
// - Responsive sizing for mobile & desktop navbars
// - Full Light & Dark theme compatibility
//
// IMPORTANT:
//
// - Does not manage card open/close state internally.
// - Visibility comes from Navbar props (isOpen, onClick).
// - Safely reads NewYearContext without throwing if isolated.
// - Preserves aria-controls="fsociety-winter-settings".
//
// =========================================================

// =========================================================
// MAIN COMPONENT
// =========================================================

function WinterExperienceButton({
  isOpen = false,
  onClick,
  disabled = false,
}) {
  // =======================================================
  // SAFE CONTEXT READ (LIVE INDICATOR)
  // =======================================================

  const newYearContext = useContext(NewYearContext);
  const settings = newYearContext?.settings;

  const hasActiveEffects = useMemo(() => {
    if (!settings) {
      return false;
    }

    return Boolean(
      settings.snowfallEnabled ||
      settings.lightsEnabled ||
      settings.winterBackgroundEnabled ||
      settings.musicEnabled
    );
  }, [settings]);

  // =======================================================
  // CLICK HANDLER
  // =======================================================

  const handleClick = () => {
    if (disabled || typeof onClick !== "function") {
      return;
    }

    onClick();
  };

  // =======================================================
  // STATE STYLES (LIGHT & DARK)
  // =======================================================

  const stateClasses = isOpen
    ? `
        border-cyan-500/50
        bg-cyan-500/[0.16]
        text-cyan-700
        shadow-[0_0_18px_rgba(6,182,212,0.22)]
        dark:border-cyan-400/45
        dark:bg-cyan-400/[0.16]
        dark:text-cyan-200
        dark:shadow-[0_0_20px_rgba(34,211,238,0.22)]
      `
    : hasActiveEffects
      ? `
          border-cyan-500/35
          bg-cyan-500/[0.10]
          text-cyan-700
          hover:border-cyan-500/50
          hover:bg-cyan-500/[0.16]
          dark:border-cyan-400/30
          dark:bg-cyan-400/[0.10]
          dark:text-cyan-300
          dark:hover:border-cyan-400/45
          dark:hover:bg-cyan-400/[0.16]
        `
      : `
          border-cyan-600/20
          bg-cyan-500/[0.06]
          text-cyan-700
          hover:border-cyan-500/40
          hover:bg-cyan-500/[0.12]
          hover:text-cyan-600
          dark:border-cyan-400/15
          dark:bg-cyan-400/[0.05]
          dark:text-cyan-300
          dark:hover:border-cyan-400/30
          dark:hover:bg-cyan-400/[0.11]
        `;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={
        isOpen
          ? "Qishki muhit oynasini yopish"
          : "Qishki muhit oynasini ochish"
      }
      aria-expanded={Boolean(isOpen)}
      aria-controls="fsociety-winter-settings"
      aria-haspopup="dialog"
      title="Qishki muhit (Winter Experience)"
      className={`
        group/winter
        relative
        inline-flex
        h-9 w-9
        sm:h-10 sm:w-10
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-xl
        border
        transition-[background-color,border-color,color,transform,box-shadow]
        duration-200
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-500
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white
        dark:focus-visible:ring-offset-[#080c12]
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:active:scale-100
        motion-reduce:transform-none
        motion-reduce:transition-none

        ${stateClasses}
      `}
    >
      {/* SUBTLE FROST SHIMMER */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-cyan-400/15
          via-transparent
          to-indigo-500/15
          opacity-0
          transition-opacity
          duration-200
          group-hover/winter:opacity-100
          motion-reduce:transition-none
        "
      />

      {/* OPEN OR ACTIVE WINTER INDICATOR DOT */}

      {(isOpen || hasActiveEffects) && (
        <span
          aria-hidden="true"
          className={`
            absolute
            right-1.5
            top-1.5
            h-1.5 w-1.5
            rounded-full
            ${
              isOpen
                ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.9)] dark:bg-cyan-300"
                : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)] dark:bg-emerald-400"
            }
          `}
        />
      )}

      {/* SNOWFLAKE ICON */}

      <Snowflake
        size={18}
        strokeWidth={2}
        aria-hidden="true"
        className={`
          relative
          z-10
          shrink-0
          transition-transform
          duration-300
          group-hover/winter:rotate-45
          motion-reduce:transform-none
          motion-reduce:transition-none
          ${isOpen ? "rotate-45" : ""}
        `}
      />

      {/* SCREEN READER LABEL */}

      <span className="sr-only">
        Qishki muhit
      </span>
    </button>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(WinterExperienceButton);