import React, {
  memo,
  useId,
} from "react";

// =========================================================
// FSOCIETY — WINTER SETTING TOGGLE
// =========================================================
//
// Location:
//
// src/features/newYear/components/WinterSettingToggle.jsx
//
// Responsibilities:
//
// - Reusable compact frosted-glass winter switch card
// - Accessible switch interaction (label + aria-describedby)
// - Active cyan-blue winter state indication
// - Light & Dark theme compatibility
// - Disabled & reduced-motion states
// - Responsive layout (320px to 1536px+)
//
// =========================================================

function WinterSettingToggle({
  checked = false,
  onChange,
  label = "",
  description = "",
  icon: Icon = null,
  disabled = false,
}) {
  // =======================================================
  // ACCESSIBLE IDS
  // =======================================================

  const uid = useId();
  const switchId = `${uid}-switch`;
  const labelId = `${uid}-label`;
  const descriptionId = `${uid}-description`;

  // =======================================================
  // CHANGE HANDLER
  // =======================================================

  const handleChange = () => {
    if (disabled || typeof onChange !== "function") {
      return;
    }

    onChange();
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className={`
        group
        flex
        items-center
        justify-between
        gap-2.5
        sm:gap-3
        rounded-2xl
        border
        px-3
        py-2.5
        sm:px-3.5
        sm:py-3
        backdrop-blur-md
        transition-all
        duration-200
        motion-reduce:transition-none

        ${
          checked
            ? `
              border-cyan-500/35
              bg-gradient-to-r
              from-cyan-500/[0.09]
              via-sky-500/[0.06]
              to-indigo-500/[0.06]
              shadow-[0_4px_16px_rgba(6,182,212,0.08)]
              dark:border-cyan-400/30
              dark:from-cyan-400/[0.11]
              dark:via-sky-400/[0.07]
              dark:to-indigo-400/[0.07]
              dark:shadow-[0_4px_18px_rgba(6,182,212,0.10)]
            `
            : `
              border-slate-200/80
              bg-white/75
              hover:border-cyan-500/25
              hover:bg-white/95
              dark:border-white/[0.07]
              dark:bg-white/[0.03]
              dark:hover:border-cyan-400/20
              dark:hover:bg-white/[0.05]
            `
        }

        ${disabled ? "opacity-60" : ""}
      `}
    >
      {/* ================================================
          SETTING INFORMATION
      ================================================ */}

      <label
        htmlFor={switchId}
        className={`
          flex
          min-w-0
          flex-1
          items-center
          gap-2.5
          sm:gap-3
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {/* ICON */}

        <span
          className={`
            flex
            h-9 w-9
            sm:h-10 sm:w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            transition-colors
            duration-200
            motion-reduce:transition-none

            ${
              checked
                ? `
                  border-cyan-500/30
                  bg-cyan-500/15
                  text-cyan-700
                  dark:border-cyan-400/25
                  dark:bg-cyan-400/15
                  dark:text-cyan-300
                `
                : `
                  border-slate-200/80
                  bg-slate-100/80
                  text-slate-500
                  group-hover:border-cyan-500/20
                  group-hover:text-cyan-600
                  dark:border-white/[0.08]
                  dark:bg-white/[0.04]
                  dark:text-slate-400
                  dark:group-hover:text-cyan-300
                `
            }
          `}
        >
          {Icon && (
            <Icon
              size={18}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          )}
        </span>

        {/* LABEL & DESCRIPTION */}

        <span className="min-w-0 flex-1">
          <span
            id={labelId}
            className="
              block
              truncate
              text-[13px]
              sm:text-sm
              font-bold
              leading-snug
              text-slate-800
              dark:text-slate-100
            "
          >
            {label}
          </span>

          {description && (
            <span
              id={descriptionId}
              className="
                mt-0.5
                block
                text-[11px]
                leading-snug
                text-slate-500
                dark:text-slate-400
              "
            >
              {description}
            </span>
          )}
        </span>
      </label>

      {/* ================================================
          SWITCH
      ================================================ */}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={handleChange}
        className={`
          relative
          inline-flex
          h-[26px]
          w-[46px]
          shrink-0
          cursor-pointer
          items-center
          rounded-full
          border
          transition-all
          duration-200
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-cyan-500
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[#f2f8ff]
          dark:focus-visible:ring-offset-[#081222]
          disabled:cursor-not-allowed
          disabled:opacity-50
          motion-reduce:transition-none

          ${
            checked
              ? `
                border-cyan-500
                bg-gradient-to-r
                from-cyan-500
                to-blue-500
                shadow-[0_0_12px_rgba(6,182,212,0.35)]
                dark:border-cyan-400
                dark:from-cyan-400
                dark:to-blue-500
              `
              : `
                border-slate-300/90
                bg-slate-200/90
                dark:border-slate-600
                dark:bg-slate-700/80
              `
          }
        `}
      >
        {/* SWITCH KNOB */}

        <span
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            left-0
            h-5 w-5
            rounded-full
            bg-white
            shadow-[0_1px_4px_rgba(15,23,42,0.22)]
            transition-transform
            duration-200
            motion-reduce:transition-none

            ${
              checked
                ? "translate-x-[22px]"
                : "translate-x-[2px]"
            }
          `}
        />
      </button>
    </div>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(WinterSettingToggle);