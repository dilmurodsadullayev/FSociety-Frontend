import React, {
  memo,
  useCallback,
  useMemo,
} from "react";

import {
  Snowflake,
  Bell,
  Moon,
  Gift,
  Heart,
  Music2,
  Check,
  ListMusic,
  Play,
} from "lucide-react";

import {
  useNewYear,
} from "../context/NewYearContext";

import {
  WINTER_TRACKS,
} from "../data/winterTracks";

// =========================================================
// FSOCIETY — WINTER MUSIC PLAYLIST
// =========================================================
//
// Location:
//
// src/features/newYear/components/MusicPlaylist.jsx
//
// Responsibilities:
//
// - Display winter music tracks in a compact frosted list
// - Track selection via NewYearContext
// - Clear selected indicator (check / ring)
// - Localized Uzbek category labels
// - Full Light & Dark theme support
// - Responsive layout (320px to 1536px+)
//
// IMPORTANT:
//
// - Track selection uses NewYearContext.
// - Does not create another Audio instance.
// - Does not autoplay music.
// - Playback is controlled by MusicPlayer.
// - Selected track is persisted in localStorage.
//
// =========================================================

// =========================================================
// TRACK ICONS
// =========================================================

const TRACK_ICONS = {
  snowflake: Snowflake,
  bell: Bell,
  moon: Moon,
  gift: Gift,
  heart: Heart,
  music: Music2,
};

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
// TRACK ROW COMPONENT
// =========================================================

const PlaylistTrack = memo(function PlaylistTrack({
  track,
  index,
  isSelected,
  onSelect,
}) {
  const TrackIcon = TRACK_ICONS[track.icon] || Music2;
  const category =
    CATEGORY_LABELS[track.category] || "Qishki musiqa";

  return (
    <button
      type="button"
      onClick={() => onSelect(track.id)}
      aria-pressed={isSelected}
      aria-label={`Tanlash: ${track.title} — ${track.artist}`}
      className={`
        group/track
        relative
        flex
        w-full
        min-w-0
        items-center
        gap-2.5
        rounded-xl
        border
        px-2.5
        py-2
        text-left
        transition-all
        duration-150
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-500
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#f2f8ff]
        dark:focus-visible:ring-offset-[#081222]
        active:scale-[0.99]
        motion-reduce:transition-none
        motion-reduce:transform-none

        ${
          isSelected
            ? `
              border-cyan-500/35
              bg-gradient-to-r
              from-cyan-500/[0.12]
              to-blue-500/[0.07]
              shadow-[0_4px_14px_rgba(6,182,212,0.08)]
              dark:border-cyan-400/30
              dark:from-cyan-400/[0.14]
              dark:to-blue-400/[0.08]
            `
            : `
              border-slate-200/60
              bg-white/60
              hover:border-cyan-500/25
              hover:bg-cyan-500/[0.05]
              dark:border-white/[0.05]
              dark:bg-white/[0.025]
              dark:hover:border-cyan-400/20
              dark:hover:bg-white/[0.06]
            `
        }
      `}
    >
      {/* ================================================
          LEFT PLAY / TRACK ICON BADGE
      ================================================ */}

      <span
        className={`
          relative
          flex
          h-8 w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          transition-colors
          duration-150
          motion-reduce:transition-none

          ${
            isSelected
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
                bg-slate-100/85
                text-slate-500
                group-hover/track:border-cyan-500/25
                group-hover/track:text-cyan-600
                dark:border-white/[0.07]
                dark:bg-white/[0.04]
                dark:text-slate-400
                dark:group-hover/track:text-cyan-300
              `
          }
        `}
      >
        {isSelected ? (
          <Play
            size={13}
            fill="currentColor"
            className="translate-x-[1px]"
            aria-hidden="true"
          />
        ) : (
          <TrackIcon
            size={15}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        )}
      </span>

      {/* ================================================
          TRACK TITLE + ARTIST / CATEGORY
      ================================================ */}

      <span className="min-w-0 flex-1">
        <span
          className={`
            block
            truncate
            text-xs
            sm:text-[13px]
            font-bold
            leading-tight

            ${
              isSelected
                ? "text-cyan-800 dark:text-cyan-200"
                : "text-slate-800 dark:text-slate-100"
            }
          `}
        >
          {track.title}
        </span>

        <span
          className="
            mt-0.5
            flex
            items-center
            gap-1.5
            truncate
            text-[10px]
            text-slate-500
            dark:text-slate-400
          "
        >
          <span className="font-mono text-[9px] opacity-75">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true">•</span>
          <span className="truncate">{track.artist}</span>
          <span
            className="
              hidden
              sm:inline
              shrink-0
              text-[9px]
              text-slate-400
              dark:text-slate-500
            "
          >
            ({category})
          </span>
        </span>
      </span>

      {/* ================================================
          RIGHT SELECTION CIRCLE (✓ / ○)
      ================================================ */}

      <span
        aria-hidden="true"
        className="
          flex
          h-6 w-6
          shrink-0
          items-center
          justify-center
        "
      >
        {isSelected ? (
          <span
            className="
              flex
              h-5 w-5
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-cyan-500
              to-blue-600
              text-white
              shadow-[0_2px_8px_rgba(6,182,212,0.35)]
              dark:from-cyan-400
              dark:to-blue-500
            "
          >
            <Check
              size={12}
              strokeWidth={3}
            />
          </span>
        ) : (
          <span
            className="
              h-5 w-5
              rounded-full
              border
              border-slate-300
              transition-colors
              duration-150
              group-hover/track:border-cyan-500/60
              dark:border-slate-600
              dark:group-hover/track:border-cyan-400/60
            "
          />
        )}
      </span>
    </button>
  );
});

// =========================================================
// MAIN PLAYLIST COMPONENT
// =========================================================

function MusicPlaylist() {
  // =======================================================
  // NEW YEAR CONTEXT
  // =======================================================

  const {
    settings,
    setSetting,
  } = useNewYear();

  // =======================================================
  // AVAILABLE TRACKS
  // =======================================================

  const tracks = useMemo(() => {
    return WINTER_TRACKS.filter((track) => track.enabled);
  }, []);

  // =======================================================
  // SELECTED TRACK
  // =======================================================

  const selectedTrack = useMemo(() => {
    const selected = tracks.find(
      (track) => track.id === settings.selectedTrackId
    );

    return selected ?? tracks[0] ?? null;
  }, [tracks, settings.selectedTrackId]);

  // =======================================================
  // SELECT TRACK
  // =======================================================

  const handleSelectTrack = useCallback(
    (trackId) => {
      const selected = tracks.find(
        (track) => track.id === trackId
      );

      if (!selected) {
        return;
      }

      setSetting("selectedTrackId", selected.id);
    },
    [tracks, setSetting]
  );

  // =======================================================
  // EMPTY STATE
  // =======================================================

  if (tracks.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-white/60
          p-4
          text-center
          dark:border-white/[0.12]
          dark:bg-white/[0.02]
        "
      >
        <ListMusic
          size={24}
          className="mx-auto text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />

        <p
          className="
            mt-2
            text-xs
            font-bold
            text-slate-700
            dark:text-slate-200
          "
        >
          Ro‘yxat bo‘sh
        </p>

        <p
          className="
            mt-0.5
            text-[11px]
            text-slate-500
            dark:text-slate-400
          "
        >
          Hozircha mavjud qo‘shiqlar yo‘q.
        </p>
      </div>
    );
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section
      aria-labelledby="winter-playlist-title"
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/85
        bg-white/75
        backdrop-blur-md
        dark:border-white/[0.08]
        dark:bg-white/[0.03]
      "
    >
      {/* ================================================
          PLAYLIST HEADER
      ================================================ */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
          border-b
          border-slate-200/75
          px-3
          py-2.5
          dark:border-white/[0.07]
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="
              flex
              h-7 w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-cyan-500/10
              text-cyan-700
              dark:bg-cyan-400/10
              dark:text-cyan-300
            "
          >
            <ListMusic
              size={15}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <h3
              id="winter-playlist-title"
              className="
                truncate
                text-xs
                font-bold
                text-slate-800
                dark:text-white
              "
            >
              Qo‘shiqlar ro‘yxati
            </h3>
          </div>
        </div>

        <span
          className="
            shrink-0
            rounded-md
            border
            border-cyan-500/20
            bg-cyan-500/[0.08]
            px-2
            py-0.5
            font-mono
            text-[10px]
            font-bold
            tabular-nums
            text-cyan-700
            dark:border-cyan-400/20
            dark:bg-cyan-400/[0.08]
            dark:text-cyan-300
          "
        >
          {tracks.length} ta
        </span>
      </div>

      {/* ================================================
          COMPACT SCROLLABLE TRACK LIST
      ================================================ */}

      <div
        className="
          max-h-[232px]
          space-y-1.5
          overflow-y-auto
          overscroll-contain
          p-2
        "
      >
        {tracks.map((track, index) => (
          <PlaylistTrack
            key={track.id}
            track={track}
            index={index}
            isSelected={selectedTrack?.id === track.id}
            onSelect={handleSelectTrack}
          />
        ))}
      </div>
    </section>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(MusicPlaylist);