import React, {
  memo,
  useCallback,
  useMemo,
} from "react";

import {
  Music2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Snowflake,
  Disc3,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

// =========================================================
// FSOCIETY — WINTER MUSIC PLAYER
// =========================================================
//
// Location:
//
// src/features/newYear/components/MusicPlayer.jsx
//
// Responsibilities:
//
// - Current track information (title, artist, category)
// - Play / Pause
// - Previous / Next track
// - Accessible seek & playback progress
// - Current playback time & duration
// - Audio loading state & error feedback
// - Full Light & Dark frosted-glass theme compatibility
// - Responsive layout (320px to 1536px+)
//
// IMPORTANT:
//
// - Receives a shared audio controller.
// - Does not create an Audio instance.
// - Does not call useWinterAudio.
// - Audio lifecycle is managed externally.
// - Volume control is a separate component.
//
// =========================================================

// =========================================================
// CATEGORY LABELS (UZBEK)
// =========================================================

const CATEGORY_LABELS = {
  classic: "Qishki klassika",
  christmas: "Yangi yil",
  peaceful: "Sokin ohang",
  uzbek: "O‘zbekcha",
};

// =========================================================
// TIME FORMATTER
// =========================================================

const formatTime = (seconds) => {
  const safeSeconds =
    Number.isFinite(seconds) && seconds > 0
      ? Math.floor(seconds)
      : 0;

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// =========================================================
// PLAYER COMPONENT
// =========================================================

function MusicPlayer({
  audioController = null,
}) {
  // =======================================================
  // SHARED AUDIO CONTROLLER
  // =======================================================

  const {
    tracks = [],
    currentTrack = null,

    isPlaying = false,
    isLoading = false,

    currentTime = 0,
    duration = 0,

    error = null,

    play,
    pause,
    togglePlay,

    previousTrack,
    nextTrack,

    seek,
  } = audioController ?? {};

  // =======================================================
  // CURRENT TRACK INDEX
  // =======================================================

  const currentTrackIndex = useMemo(() => {
    return tracks.findIndex(
      (track) => track.id === currentTrack?.id
    );
  }, [tracks, currentTrack?.id]);

  // =======================================================
  // PROGRESS PERCENTAGE
  // =======================================================

  const progress = useMemo(() => {
    if (
      !Number.isFinite(duration) ||
      duration <= 0 ||
      !Number.isFinite(currentTime)
    ) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(0, (currentTime / duration) * 100)
    );
  }, [currentTime, duration]);

  // =======================================================
  // PREVIOUS TRACK
  // =======================================================

  const handlePrevious = useCallback(() => {
    if (
      tracks.length <= 1 ||
      typeof previousTrack !== "function"
    ) {
      return;
    }

    previousTrack();
  }, [tracks.length, previousTrack]);

  // =======================================================
  // NEXT TRACK
  // =======================================================

  const handleNext = useCallback(() => {
    if (
      tracks.length <= 1 ||
      typeof nextTrack !== "function"
    ) {
      return;
    }

    nextTrack();
  }, [tracks.length, nextTrack]);

  // =======================================================
  // PLAYBACK TOGGLE
  // =======================================================

  const handlePlaybackToggle = useCallback(() => {
    if (typeof togglePlay === "function") {
      togglePlay();
      return;
    }

    if (isPlaying) {
      pause?.();
    } else {
      play?.();
    }
  }, [togglePlay, isPlaying, play, pause]);

  // =======================================================
  // SEEK HANDLER
  // =======================================================

  const handleSeek = useCallback(
    (event) => {
      if (typeof seek !== "function") {
        return;
      }

      const nextTime = Number(event.target.value);

      if (Number.isFinite(nextTime)) {
        seek(nextTime);
      }
    },
    [seek]
  );

  // =======================================================
  // EMPTY TRACK STATE
  // =======================================================

  if (!currentTrack || tracks.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-slate-200/90
          bg-white/80
          p-4
          text-center
          backdrop-blur-md
          dark:border-white/[0.08]
          dark:bg-white/[0.03]
        "
      >
        <Music2
          size={24}
          className="mx-auto text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />

        <p
          className="
            mt-2
            text-xs
            font-bold
            text-slate-800
            dark:text-slate-100
          "
        >
          Qo‘shiqlar topilmadi
        </p>

        <p
          className="
            mt-0.5
            text-[11px]
            text-slate-500
            dark:text-slate-400
          "
        >
          Qishki playlist hozircha bo‘sh.
        </p>
      </div>
    );
  }

  const categoryLabel =
    CATEGORY_LABELS[currentTrack.category] ||
    "Qishki musiqa";

  const canSeek =
    typeof seek === "function" &&
    Number.isFinite(duration) &&
    duration > 0;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section
      aria-label="Qishki musiqa pleyeri"
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-cyan-500/25
        bg-gradient-to-br
        from-white/95
        via-[#f0f7ff]/92
        to-[#e2f0fe]/95
        p-3
        sm:p-3.5
        shadow-[0_10px_28px_-10px_rgba(14,116,144,0.16)]
        backdrop-blur-md
        dark:border-cyan-400/20
        dark:from-[#0b192e]/95
        dark:via-[#091528]/95
        dark:to-[#11132d]/95
        dark:shadow-[0_12px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(6,182,212,0.08)]
      "
    >
      {/* AMBIENT CORNER GLOWS */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-28 w-28
          rounded-full
          bg-cyan-400/15
          blur-2xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-10
          -left-10
          h-24 w-24
          rounded-full
          bg-indigo-500/10
          dark:bg-violet-500/15
          blur-2xl
        "
      />

      <div className="relative">
        {/* ==============================================
            ROW 1: ALBUM ART + TRACK INFO + PLAY/PAUSE
        ============================================== */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* ALBUM ART */}

          <div
            className="
              relative
              flex
              h-11 w-11
              sm:h-[52px] sm:w-[52px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-cyan-500/25
              bg-gradient-to-br
              from-cyan-500/15
              via-sky-500/15
              to-indigo-500/20
              text-cyan-700
              dark:border-cyan-400/25
              dark:from-cyan-400/20
              dark:via-blue-500/20
              dark:to-indigo-500/25
              dark:text-cyan-200
            "
          >
            <Disc3
              size={30}
              strokeWidth={1.35}
              className={`
                ${isPlaying ? "motion-safe:animate-spin" : ""}
                motion-reduce:animate-none
              `}
              style={{ animationDuration: "8s" }}
              aria-hidden="true"
            />

            <Snowflake
              size={12}
              className="
                absolute
                text-cyan-800
                dark:text-white
              "
              aria-hidden="true"
            />
          </div>

          {/* TRACK INFORMATION */}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`
                  h-1.5 w-1.5
                  shrink-0
                  rounded-full
                  ${
                    isPlaying
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]"
                      : isLoading
                        ? "bg-amber-400 animate-pulse"
                        : "bg-slate-400 dark:bg-slate-500"
                  }
                `}
              />

              <span
                className="
                  truncate
                  font-mono
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-cyan-700
                  dark:text-cyan-300
                "
              >
                {isLoading
                  ? "Yuklanmoqda..."
                  : isPlaying
                    ? "Ijro etilmoqda"
                    : categoryLabel}
              </span>

              <span
                className="
                  ml-auto
                  shrink-0
                  font-mono
                  text-[9px]
                  font-semibold
                  tabular-nums
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {Math.max(0, currentTrackIndex) + 1}/{tracks.length}
              </span>
            </div>

            <h4
              className="
                mt-0.5
                truncate
                text-[13px]
                sm:text-sm
                font-extrabold
                text-slate-900
                dark:text-white
              "
              title={currentTrack.title}
            >
              {currentTrack.title}
            </h4>

            <p
              className="
                truncate
                text-[11px]
                text-slate-600
                dark:text-slate-300/90
              "
            >
              {currentTrack.artist}
            </p>
          </div>

          {/* PRIMARY PLAY / PAUSE BUTTON */}

          <button
            type="button"
            onClick={handlePlaybackToggle}
            disabled={
              !currentTrack ||
              (
                !isPlaying &&
                typeof togglePlay !== "function" &&
                typeof play !== "function"
              )
            }
            aria-label={
              isPlaying
                ? "Musiqani pauzaga qo‘yish"
                : "Musiqani ijro etish"
            }
            className="
              inline-flex
              h-9 w-9
              sm:h-11 sm:w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-cyan-300/45
              bg-gradient-to-br
              from-cyan-500
              via-blue-500
              to-indigo-600
              text-white
              shadow-[0_4px_16px_rgba(6,182,212,0.34)]
              transition-all
              duration-200
              hover:scale-105
              hover:shadow-[0_6px_22px_rgba(6,182,212,0.46)]
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-500
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#f0f7ff]
              dark:border-cyan-300/35
              dark:from-cyan-400
              dark:via-blue-500
              dark:to-indigo-500
              dark:focus-visible:ring-offset-[#091528]
              disabled:cursor-not-allowed
              disabled:opacity-50
              motion-reduce:transition-none
              motion-reduce:hover:scale-100
            "
          >
            {isLoading && !isPlaying ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : isPlaying ? (
              <Pause
                size={17}
                fill="currentColor"
                aria-hidden="true"
              />
            ) : (
              <Play
                size={17}
                fill="currentColor"
                className="translate-x-0.5"
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {/* ==============================================
            AUDIO ERROR FEEDBACK
        ============================================== */}

        {error && (
          <div
            role="alert"
            className="
              mt-2.5
              flex
              items-start
              gap-2
              rounded-xl
              border
              border-red-500/30
              bg-red-500/10
              px-2.5
              py-2
              text-red-700
              dark:border-red-400/25
              dark:bg-red-500/15
              dark:text-red-200
            "
          >
            <AlertCircle
              size={14}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <p className="text-[11px] leading-snug">
              {error}
            </p>
          </div>
        )}

        {/* ==============================================
            ROW 2: PREV + SEEK PROGRESS BAR + NEXT
        ============================================== */}

        <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2">
          {/* PREVIOUS */}

          <button
            type="button"
            onClick={handlePrevious}
            disabled={
              tracks.length <= 1 ||
              typeof previousTrack !== "function"
            }
            aria-label="Oldingi qo‘shiq"
            className="
              inline-flex
              h-7 w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition-colors
              duration-150
              hover:bg-cyan-500/12
              hover:text-cyan-700
              dark:text-slate-300
              dark:hover:bg-cyan-400/10
              dark:hover:text-cyan-200
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-500
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <SkipBack
              size={15}
              fill="currentColor"
              aria-hidden="true"
            />
          </button>

          {/* CURRENT TIME */}

          <span
            className="
              w-8
              sm:w-9
              shrink-0
              text-right
              font-mono
              text-[10px]
              font-semibold
              tabular-nums
              text-slate-700
              dark:text-slate-200
            "
          >
            {formatTime(currentTime)}
          </span>

          {/* SEEK SLIDER */}

          <div className="relative flex h-6 min-w-0 flex-1 items-center">
            <input
              type="range"
              min="0"
              max={duration > 0 ? duration : 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              disabled={!canSeek}
              aria-label="Musiqa ijro pozitsiyasi"
              aria-valuetext={`${formatTime(currentTime)} / ${formatTime(
                duration
              )}`}
              className="
                peer
                relative
                z-10
                h-6
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
                peer-focus-visible:ring-offset-[#f0f7ff]
                dark:peer-focus-visible:ring-offset-[#091528]
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-500
                  to-indigo-500
                  dark:from-cyan-400
                  dark:via-blue-400
                  dark:to-indigo-400
                  transition-[width]
                  duration-150
                  motion-reduce:transition-none
                "
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* THUMB DOT */}

            {canSeek && (
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  h-3 w-3
                  -translate-x-1/2
                  rounded-full
                  border-2
                  border-white
                  bg-cyan-500
                  shadow-[0_1px_5px_rgba(6,182,212,0.5)]
                  dark:border-[#091528]
                  dark:bg-cyan-300
                "
                style={{ left: `${progress}%` }}
              />
            )}
          </div>

          {/* DURATION */}

          <span
            className="
              w-8
              sm:w-9
              shrink-0
              font-mono
              text-[10px]
              font-medium
              tabular-nums
              text-slate-500
              dark:text-slate-400
            "
          >
            {formatTime(duration)}
          </span>

          {/* NEXT */}

          <button
            type="button"
            onClick={handleNext}
            disabled={
              tracks.length <= 1 ||
              typeof nextTrack !== "function"
            }
            aria-label="Keyingi qo‘shiq"
            className="
              inline-flex
              h-7 w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition-colors
              duration-150
              hover:bg-cyan-500/12
              hover:text-cyan-700
              dark:text-slate-300
              dark:hover:bg-cyan-400/10
              dark:hover:text-cyan-200
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-500
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <SkipForward
              size={15}
              fill="currentColor"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(MusicPlayer);