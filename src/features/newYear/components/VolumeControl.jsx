import React, {
  memo,
  useEffect,
  useRef,
} from "react";

import {
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

// =========================================================
// FSOCIETY — WINTER VOLUME CONTROL
// =========================================================
//
// Location:
//
// src/features/newYear/components/VolumeControl.jsx
//
// Responsibilities:
//
// - Compact frosted-glass volume bar
// - Cross-browser accessible volume slider
// - Volume percentage indicator
// - Mute / Unmute with previous volume restoration
// - Full Light & Dark theme support
// - Responsive layout (320px to 1536px+)
//
// Props:
//
// - volume: number (0 - 1)
// - onChange: function (0 - 1)
// - disabled: boolean
//
// IMPORTANT:
//
// - Controlled component.
// - Does not create an Audio instance.
// - Volume is managed by useWinterAudio.
// - Previous non-zero volume is restored when unmuting.
//
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const normalizeVolume = (value) => {
  const volume = Number(value);

  if (!Number.isFinite(volume)) {
    return 0.7;
  }

  return Math.min(1, Math.max(0, volume));
};

// =========================================================
// COMPONENT
// =========================================================

function VolumeControl({
  volume = 0.7,
  onChange,
  disabled = false,
}) {
  // =======================================================
  // NORMALIZED VOLUME
  // =======================================================

  const normalizedVolume = normalizeVolume(volume);
  const volumePercentage = Math.round(normalizedVolume * 100);
  const isMuted = normalizedVolume === 0;

  // =======================================================
  // PREVIOUS VOLUME REF
  // =======================================================

  const previousVolumeRef = useRef(
    normalizedVolume > 0 ? normalizedVolume : 0.7
  );

  // =======================================================
  // REMEMBER LAST NON-ZERO VOLUME
  // =======================================================

  useEffect(() => {
    if (normalizedVolume > 0) {
      previousVolumeRef.current = normalizedVolume;
    }
  }, [normalizedVolume]);

  // =======================================================
  // CHANGE HANDLER
  // =======================================================

  const handleVolumeChange = (event) => {
    if (disabled || typeof onChange !== "function") {
      return;
    }

    const nextPercentage = Number(event.target.value);

    if (!Number.isFinite(nextPercentage)) {
      return;
    }

    const nextVolume = normalizeVolume(nextPercentage / 100);

    if (nextVolume > 0) {
      previousVolumeRef.current = nextVolume;
    }

    onChange(nextVolume);
  };

  // =======================================================
  // MUTE / UNMUTE
  // =======================================================

  const handleMuteToggle = () => {
    if (disabled || typeof onChange !== "function") {
      return;
    }

    if (normalizedVolume > 0) {
      previousVolumeRef.current = normalizedVolume;
      onChange(0);
      return;
    }

    const restoredVolume =
      previousVolumeRef.current > 0
        ? previousVolumeRef.current
        : 0.7;

    onChange(restoredVolume);
  };

  // =======================================================
  // VOLUME ICON
  // =======================================================

  const VolumeIcon = isMuted
    ? VolumeX
    : normalizedVolume < 0.5
      ? Volume1
      : Volume2;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section
      aria-label="Ovoz balandligini boshqarish"
      className="
        flex
        items-center
        gap-2.5
        sm:gap-3
        rounded-2xl
        border
        border-slate-200/85
        bg-white/75
        px-3
        py-2.5
        sm:px-3.5
        backdrop-blur-md
        transition-colors
        duration-200
        dark:border-white/[0.08]
        dark:bg-white/[0.03]
        motion-reduce:transition-none
      "
    >
      {/* MUTE / UNMUTE BUTTON */}

      <button
        type="button"
        onClick={handleMuteToggle}
        disabled={disabled}
        aria-label={isMuted ? "Ovozni yoqish" : "Ovozni o‘chirish"}
        aria-pressed={isMuted}
        title={isMuted ? "Ovozni yoqish" : "Ovozni o‘chirish"}
        className={`
          inline-flex
          h-8 w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
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
            isMuted
              ? `
                border-rose-500/25
                bg-rose-500/10
                text-rose-600
                hover:bg-rose-500/15
                dark:border-rose-400/25
                dark:bg-rose-400/10
                dark:text-rose-300
              `
              : `
                border-cyan-500/20
                bg-cyan-500/[0.08]
                text-cyan-700
                hover:border-cyan-500/35
                hover:bg-cyan-500/[0.14]
                dark:border-cyan-400/20
                dark:bg-cyan-400/[0.08]
                dark:text-cyan-300
                dark:hover:bg-cyan-400/[0.14]
              `
          }
        `}
      >
        <VolumeIcon
          size={16}
          aria-hidden="true"
        />
      </button>

      {/* ACCESSIBLE CUSTOM LAYERED SLIDER */}

      <div className="relative flex h-7 min-w-0 flex-1 items-center">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volumePercentage}
          onChange={handleVolumeChange}
          disabled={disabled}
          aria-label="Musiqa ovoz balandligi"
          aria-valuetext={`${volumePercentage} foiz`}
          className="
            peer
            relative
            z-10
            h-7
            w-full
            cursor-pointer
            opacity-0
            disabled:cursor-not-allowed
          "
        />

        {/* VISUAL TRACK */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            h-1.5
            overflow-hidden
            rounded-full
            bg-slate-200/95
            dark:bg-white/15
            peer-focus-visible:ring-2
            peer-focus-visible:ring-cyan-500
            peer-focus-visible:ring-offset-2
            peer-focus-visible:ring-offset-[#f2f8ff]
            dark:peer-focus-visible:ring-offset-[#081222]
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-cyan-500
              to-blue-500
              dark:from-cyan-400
              dark:to-blue-400
              transition-[width]
              duration-100
              motion-reduce:transition-none
            "
            style={{ width: `${volumePercentage}%` }}
          />
        </div>

        {/* SLIDER THUMB */}

        <span
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            h-3.5 w-3.5
            -translate-x-1/2
            rounded-full
            border-2
            border-white
            shadow-[0_1px_6px_rgba(6,182,212,0.45)]
            transition-transform
            duration-100
            peer-active:scale-110
            dark:border-[#081222]
            motion-reduce:transition-none

            ${
              isMuted
                ? "bg-slate-400 dark:bg-slate-500"
                : "bg-cyan-500 dark:bg-cyan-300"
            }
          `}
          style={{ left: `${volumePercentage}%` }}
        />
      </div>

      {/* PERCENTAGE BADGE */}

      <span
        className="
          w-11
          shrink-0
          rounded-lg
          border
          border-cyan-500/20
          bg-cyan-500/[0.08]
          py-1
          text-center
          font-mono
          text-[11px]
          font-bold
          tabular-nums
          text-cyan-700
          dark:border-cyan-400/20
          dark:bg-cyan-400/[0.08]
          dark:text-cyan-300
        "
      >
        {volumePercentage}%
      </span>
    </section>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(VolumeControl);