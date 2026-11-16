
import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Snowflake,
  Lightbulb,
  Music2,
  X,
  Sparkles,
  Image as ImageIcon,
  Flame,
} from "lucide-react";

// =========================================================
// NEW YEAR CONTEXT
// =========================================================

import {
  useNewYear,
} from "../context/NewYearContext";

// =========================================================
// WINTER COMPONENTS
// =========================================================

import WinterSettingToggle from "./WinterSettingToggle";
import MusicPlayer from "./MusicPlayer";
import MusicPlaylist from "./MusicPlaylist";
import VolumeControl from "./VolumeControl";

// =========================================================
// WINTER AUDIO
// =========================================================

import {
  useWinterAudio,
} from "../hooks/useWinterAudio";

// =========================================================
// FSOCIETY — WINTER EXPERIENCE FLOATING CARD
// =========================================================
//
// Location:
//
// src/features/newYear/components/WinterSettingsSidebar.jsx
//
// Architecture:
//
// WinterSettingsSidebar (Floating Frosted Glass Card)
// ├── Card Header (Qishki muhit + Close)
// ├── Adaptive 2026 -> 2027 Mr. Robot Glitch + Salyut Button
// ├── Winter Settings Section
// │   ├── Qor yog‘ishi (Snowfall)
// │   ├── Navbar chiroqlari (Christmas Lights)
// │   ├── Qishki fon (Winter Background)
// │   └── Qishki musiqa (Winter Radio)
// ├── Music Section
// │   ├── MusicPlayer
// │   ├── VolumeControl
// │   └── MusicPlaylist
// └── Bottom Shaded Snowy Pines & Snowman Illustration
//
// IMPORTANT:
//
// - One shared useWinterAudio instance.
// - Audio survives card closing.
// - Music toggle uses direct user interaction.
// - Playback position is managed by useWinterAudio.
// - Dispatches "fsociety:launch-fireworks" & calls
//   triggerFireworks?.() on Fireworks click.
// - Full Light & Dark theme support + 320px..1536px+.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const EFFECTS_COUNT = 4;

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const GLITCH_GRID_CELLS = [
  { delay: "0ms", tx: "-4px", ty: "-4px" },
  { delay: "45ms", tx: "2px", ty: "-6px" },
  { delay: "90ms", tx: "5px", ty: "-3px" },
  { delay: "120ms", tx: "-6px", ty: "-1px" },
  { delay: "25ms", tx: "0px", ty: "0px" },
  { delay: "75ms", tx: "6px", ty: "1px" },
  { delay: "110ms", tx: "-5px", ty: "3px" },
  { delay: "55ms", tx: "2px", ty: "-2px" },
  { delay: "15ms", tx: "4px", ty: "4px" },
  { delay: "95ms", tx: "-4px", ty: "5px" },
  { delay: "35ms", tx: "1px", ty: "6px" },
  { delay: "80ms", tx: "5px", ty: "4px" },
];

// =========================================================
// MR. ROBOT 2026 -> 2027 COMPACT GLITCH DISPLAY
// =========================================================

const MrRobotYearDisplay = memo(function MrRobotYearDisplay() {
  return (
    <div
      aria-label="Yangi yil animatsiyasi: 2026 dan 2027 ga o‘tish"
      className="
        relative
        inline-flex
        items-center
        select-none
        font-mono
        font-black
        tracking-[0.06em]
        text-2xl
        sm:text-[26px]
        leading-none
      "
    >
      {/* STATIC PREFIX: 202 */}

      <span
        className="
          text-slate-800
          dark:text-white
          drop-shadow-[0_1px_8px_rgba(6,182,212,0.22)]
          dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.45)]
        "
      >
        202
      </span>

      {/* MORPHING DIGIT: 6 -> 7 */}

      <span
        className="
          relative
          inline-flex
          h-[1.12em]
          w-[0.72em]
          items-center
          justify-center
          overflow-hidden
        "
      >
        <span
          aria-hidden="true"
          className="
            fs-mr-digit-6
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-slate-700
            dark:text-slate-200
          "
        >
          6
        </span>

        <span
          aria-hidden="true"
          className="
            fs-mr-glitch-cyan
            pointer-events-none
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-cyan-600
            dark:text-cyan-400
            opacity-0
          "
        >
          6
        </span>

        <span
          aria-hidden="true"
          className="
            fs-mr-glitch-red
            pointer-events-none
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-rose-500
            opacity-0
          "
        >
          7
        </span>

        <span
          aria-hidden="true"
          className="
            fs-mr-digit-7
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-cyan-600
            dark:text-cyan-300
            drop-shadow-[0_2px_10px_rgba(6,182,212,0.35)]
            dark:drop-shadow-[0_0_12px_rgba(34,211,238,0.85)]
          "
        >
          7
        </span>

        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            grid
            grid-cols-3
            grid-rows-4
            gap-[1px]
            p-[1px]
          "
        >
          {GLITCH_GRID_CELLS.map((cell, index) => (
            <span
              key={index}
              className="
                fs-mr-grid-cell
                rounded-[1px]
                bg-cyan-500
                dark:bg-cyan-400/90
                shadow-[0_0_4px_rgba(6,182,212,0.7)]
                opacity-0
              "
              style={{
                "--fs-delay": cell.delay,
                "--fs-tx": cell.tx,
                "--fs-ty": cell.ty,
              }}
            />
          ))}
        </span>
      </span>
    </div>
  );
});

// =========================================================
// DECORATIVE SNOWY PINES & DETAILED SNOWMAN ILLUSTRATION
// =========================================================

const WinterCardIllustration = memo(function WinterCardIllustration() {
  const uid = useId().replace(/:/g, "");

  const ids = {
    hillBackLight: `${uid}-hill-bl`,
    hillFrontLight: `${uid}-hill-fl`,
    hillBackDark: `${uid}-hill-bd`,
    hillFrontDark: `${uid}-hill-fd`,
    snowBody: `${uid}-snow-body`,
    snowHead: `${uid}-snow-head`,
    pineDark: `${uid}-pine-d`,
    pineLight: `${uid}-pine-l`,
    scarfGrad: `${uid}-scarf`,
  };

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        relative
        mt-1
        h-[112px]
        w-full
        shrink-0
        select-none
        overflow-hidden
      "
    >
      {/* ================================================
          WINTER SNOW HILLS + STARS
      ================================================ */}

      <svg
        viewBox="0 0 392 112"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={ids.hillBackLight} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.98" />
          </linearGradient>

          <linearGradient id={ids.hillFrontLight} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fcff" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="1" />
          </linearGradient>

          <linearGradient id={ids.hillBackDark} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f2744" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#09192e" stopOpacity="0.98" />
          </linearGradient>

          <linearGradient id={ids.hillFrontDark} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#173558" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0c1f36" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* SUBTLE FROST SPARKLES */}

        <g className="fill-cyan-500/40 dark:fill-cyan-300/45">
          <circle cx="48" cy="24" r="1.4" />
          <circle cx="152" cy="18" r="1.8" />
          <circle cx="215" cy="30" r="1.2" />
          <circle cx="268" cy="16" r="1.6" />
          <circle cx="352" cy="22" r="1.3" />
        </g>

        {/* LIGHT MODE DRIFTS */}

        <g className="opacity-100 dark:opacity-0 transition-opacity duration-200">
          <path
            d="M0 72 Q 86 44, 198 66 T 392 54 L 392 112 L 0 112 Z"
            fill={`url(#${ids.hillBackLight})`}
          />

          <path
            d="M0 84 Q 130 64, 245 78 T 392 70 L 392 112 L 0 112 Z"
            fill={`url(#${ids.hillFrontLight})`}
          />

          <path
            d="M0 84 Q 130 64, 245 78 T 392 70"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
            opacity="0.9"
          />
        </g>

        {/* DARK MODE DRIFTS */}

        <g className="opacity-0 dark:opacity-100 transition-opacity duration-200">
          <path
            d="M0 72 Q 86 44, 198 66 T 392 54 L 392 112 L 0 112 Z"
            fill={`url(#${ids.hillBackDark})`}
          />

          <path
            d="M0 84 Q 130 64, 245 78 T 392 70 L 392 112 L 0 112 Z"
            fill={`url(#${ids.hillFrontDark})`}
          />

          <path
            d="M0 84 Q 130 64, 245 78 T 392 70"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            opacity="0.35"
          />
        </g>
      </svg>

      {/* ================================================
          SNOW-COVERED PINE TREES (LEFT)
      ================================================ */}

      <svg
        viewBox="0 0 155 104"
        className="absolute bottom-0 left-1.5 h-[98px] w-[146px]"
      >
        <defs>
          <linearGradient id={ids.pineLight} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>

          <linearGradient id={ids.pineDark} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>

        {/* SMALL BACK PINE */}

        <g opacity="0.88">
          <rect
            x="25"
            y="76"
            width="5"
            height="12"
            rx="1.5"
            className="fill-amber-900/70 dark:fill-slate-800"
          />

          <path
            d="M27.5 28 L10 58 Q27.5 54 45 58 Z"
            className="fill-sky-600/80 dark:fill-cyan-700/80"
          />

          <path
            d="M27.5 44 L6 78 Q27.5 73 49 78 Z"
            className="fill-sky-700/85 dark:fill-cyan-800/85"
          />

          <path
            d="M27.5 28 L19 42 Q27.5 39 36 42 Z"
            className="fill-white/95 dark:fill-sky-100/90"
          />
        </g>

        {/* MAIN LAYERED PINE */}

        <g>
          <rect
            x="70"
            y="82"
            width="7"
            height="14"
            rx="2"
            className="fill-amber-950/75 dark:fill-slate-800"
          />

          {/* BOTTOM TIER */}

          <path
            d="M73.5 44 L36 86 Q73.5 80 111 86 Z"
            fill={`url(#${ids.pineLight})`}
            className="opacity-100 dark:opacity-0"
          />

          <path
            d="M73.5 44 L36 86 Q73.5 80 111 86 Z"
            fill={`url(#${ids.pineDark})`}
            className="opacity-0 dark:opacity-100"
          />

          {/* MIDDLE TIER */}

          <path
            d="M73.5 26 L42 64 Q73.5 58 105 64 Z"
            fill={`url(#${ids.pineLight})`}
            className="opacity-100 dark:opacity-0"
          />

          <path
            d="M73.5 26 L42 64 Q73.5 58 105 64 Z"
            fill={`url(#${ids.pineDark})`}
            className="opacity-0 dark:opacity-100"
          />

          {/* TOP TIER */}

          <path
            d="M73.5 10 L49 42 Q73.5 37 98 42 Z"
            className="fill-cyan-600 dark:fill-cyan-500"
          />

          {/* SNOW CAPS ON BRANCHES */}

          <path
            d="M73.5 10 L62 25 Q68 23 73.5 26 Q79 23 85 25 Z"
            className="fill-white dark:fill-sky-100"
          />

          <path
            d="M52 40 Q63 36 73.5 41 Q84 36 95 40 L90 34 Q73.5 38 57 34 Z"
            className="fill-white/95 dark:fill-sky-100/90"
          />

          <path
            d="M45 62 Q59 57 73.5 62 Q88 57 102 62 L96 55 Q73.5 59 51 55 Z"
            className="fill-white/95 dark:fill-sky-100/85"
          />
        </g>

        {/* TINY RIGHT PINE */}

        <g opacity="0.82">
          <path
            d="M122 52 L109 80 Q122 76 135 80 Z"
            className="fill-sky-700/75 dark:fill-cyan-800/80"
          />

          <path
            d="M122 52 L116 64 Q122 61 128 64 Z"
            className="fill-white/90 dark:fill-sky-100/85"
          />
        </g>
      </svg>

      {/* ================================================
          SHADED & EXPRESSIVE CYBER SNOWMAN (RIGHT)
      ================================================ */}

      <svg
        viewBox="0 0 116 110"
        className="absolute bottom-0 right-2.5 h-[104px] w-[110px]"
      >
        <defs>
          <radialGradient id={ids.snowBody} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f1f8ff" />
            <stop offset="100%" stopColor="#cbdcf0" />
          </radialGradient>

          <radialGradient id={ids.snowHead} cx="36%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f4f9ff" />
            <stop offset="100%" stopColor="#d1e2f5" />
          </radialGradient>

          <linearGradient id={ids.scarfGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* GROUND CONTACT SHADOW */}

        <ellipse
          cx="58"
          cy="101"
          rx="27"
          ry="5"
          className="fill-sky-900/18 dark:fill-black/45"
        />

        {/* STICK ARMS WITH TWIGS */}

        <g
          stroke="#6b3b1f"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M35 67 L15 54" />
          <path d="M21 58 L16 49" strokeWidth="1.9" />
          <path d="M19 56 L11 58" strokeWidth="1.9" />

          <path d="M81 67 L101 52" />
          <path d="M95 57 L100 47" strokeWidth="1.9" />
          <path d="M97 55 L105 56" strokeWidth="1.9" />
        </g>

        {/* MITTENS ON TWIG HANDS */}

        <circle cx="14" cy="53" r="3.4" className="fill-cyan-500" />
        <circle cx="102" cy="51" r="3.4" className="fill-cyan-500" />

        {/* LOWER SNOWBALL */}

        <circle
          cx="58"
          cy="80"
          r="21.5"
          fill={`url(#${ids.snowBody})`}
          className="stroke-sky-200/90 dark:stroke-cyan-300/35"
          strokeWidth="1.4"
        />

        {/* COZY KNITTED SCARF TAIL */}

        <path
          d="M66 56 L77 77 L68 80 L59 59 Z"
          fill={`url(#${ids.scarfGrad})`}
        />

        <line x1="69" y1="78" x2="68" y2="82" stroke="#fda4af" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="72.5" y1="77" x2="72" y2="81.5" stroke="#fda4af" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="76" y1="76" x2="76" y2="80" stroke="#fda4af" strokeWidth="1.4" strokeLinecap="round" />

        {/* HEAD SNOWBALL */}

        <circle
          cx="58"
          cy="45"
          r="15.5"
          fill={`url(#${ids.snowHead})`}
          className="stroke-sky-200/90 dark:stroke-cyan-300/35"
          strokeWidth="1.4"
        />

        {/* BUTTONS */}

        <circle cx="58" cy="74" r="2.3" className="fill-slate-800" />
        <circle cx="58" cy="83" r="2.3" className="fill-slate-800" />
        <circle cx="57.3" cy="73.3" r="0.7" className="fill-white/70" />
        <circle cx="57.3" cy="82.3" r="0.7" className="fill-white/70" />

        {/* SCARF COLLAR + CYAN CYBER STRIPE */}

        <rect
          x="42"
          y="55.5"
          width="32"
          height="7.5"
          rx="3.75"
          fill={`url(#${ids.scarfGrad})`}
        />

        <rect
          x="45"
          y="58.2"
          width="26"
          height="2"
          rx="1"
          className="fill-cyan-300/90"
        />

        {/* ROSY CHEEKS */}

        <ellipse cx="47.5" cy="47.5" rx="3.1" ry="1.8" className="fill-rose-300/75" />
        <ellipse cx="68.5" cy="47.5" rx="3.1" ry="1.8" className="fill-rose-300/75" />

        {/* EXPRESSIVE EYES WITH SPARKLE */}

        <circle cx="52" cy="42" r="2.2" className="fill-slate-900" />
        <circle cx="64" cy="42" r="2.2" className="fill-slate-900" />
        <circle cx="51.3" cy="41.2" r="0.75" className="fill-white" />
        <circle cx="63.3" cy="41.2" r="0.75" className="fill-white" />

        {/* SCULPTED CARROT NOSE */}

        <path
          d="M58 44 L70 46.8 Q71.2 47.4 70 48.2 L58 49.2 Z"
          className="fill-orange-500"
        />

        <path
          d="M58.5 44.8 L68 46.8 L58.5 46.6 Z"
          className="fill-amber-300/80"
        />

        {/* WARM SMILE */}

        <path
          d="M52.5 50.8 Q 58 54.4 63.5 50.8"
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* TOP HAT WITH CYAN RIBBON & SNOW FROSTING */}

        <g transform="rotate(-4 58 29)">
          <rect x="40" y="29" width="36" height="4.2" rx="2.1" className="fill-slate-800 dark:fill-slate-900" />
          <rect x="46" y="13" width="24" height="17" rx="3" className="fill-slate-900 dark:fill-slate-950" />

          {/* CYAN CYBER BAND */}

          <rect x="46" y="25" width="24" height="3.2" className="fill-cyan-400" />

          {/* SNOW DUST ON HAT TOP */}

          <path
            d="M47 14 Q54 11 60 13.5 T70 14 L69 16.5 Q58 15 47 16.5 Z"
            className="fill-white/95 dark:fill-sky-100/90"
          />
        </g>
      </svg>
    </div>
  );
});


// =========================================================
// MAIN FLOATING CARD COMPONENT
// =========================================================

function WinterSettingsSidebar({
  isOpen = false,
  onClose,
}) {

  // =======================================================
  // NEW YEAR CONTEXT
  // =======================================================

  const {
    settings,
    toggleSetting,
    triggerFireworks,
  } = useNewYear();


  // =======================================================
  // SHARED AUDIO CONTROLLER
  // =======================================================

  const audio = useWinterAudio();


  // =======================================================
  // FIREWORKS STATE
  // =======================================================

  const [isFiring, setIsFiring] = useState(false);

  const fireworksTimerRef = useRef(null);


  // =======================================================
  // REFS
  // =======================================================

  const panelRef = useRef(null);

  const closeButtonRef = useRef(null);

  const previousFocusRef = useRef(null);

  const onCloseRef = useRef(onClose);

  onCloseRef.current = onClose;


  // =======================================================
  // ACTIVE EFFECTS COUNT
  // =======================================================

  const activeEffectsCount = useMemo(() => {
    return [
      settings.snowfallEnabled,
      settings.lightsEnabled,
      Boolean(settings.winterBackgroundEnabled),
      settings.musicEnabled,
    ].filter(Boolean).length;
  }, [
    settings.snowfallEnabled,
    settings.lightsEnabled,
    settings.winterBackgroundEnabled,
    settings.musicEnabled,
  ]);


  // =======================================================
  // LAUNCH FIREWORKS
  // =======================================================

  const handleLaunchFireworks = useCallback(() => {
    if (typeof triggerFireworks === "function") {
      triggerFireworks();
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("fsociety:launch-fireworks", {
          detail: {
            source: "winter-card",
            timestamp: Date.now(),
          },
        })
      );
    }

    setIsFiring(true);

    if (fireworksTimerRef.current) {
      window.clearTimeout(fireworksTimerRef.current);
    }

    fireworksTimerRef.current = window.setTimeout(() => {
      setIsFiring(false);
      fireworksTimerRef.current = null;
    }, 950);
  }, [
    triggerFireworks,
  ]);


  // =======================================================
  // FIREWORKS CLEANUP
  // =======================================================

  useEffect(() => {
    return () => {
      if (fireworksTimerRef.current) {
        window.clearTimeout(fireworksTimerRef.current);
      }
    };
  }, []);


  // =======================================================
  // CLOSE HANDLER
  // =======================================================

  const handleClose = useCallback(() => {
    if (typeof onCloseRef.current === "function") {
      onCloseRef.current();
    }
  }, []);


  // =======================================================
  // MUSIC TOGGLE HANDLER
  // =======================================================
  //
  // OFF:
  // - Save current playback position.
  // - Pause audio.
  // - Disable music setting.
  //
  // ON:
  // - Start audio directly from the user's action.
  // - useWinterAudio.play() enables music setting.
  // - Browser autoplay restrictions are respected.
  //
  // IMPORTANT:
  // Do not replace this handler with toggleSetting alone.
  //
  // =======================================================

  const handleMusicToggle = useCallback(() => {
    if (settings.musicEnabled) {
      audio.pause();

      toggleSetting("musicEnabled");

      return;
    }

    audio.play();
  }, [
    settings.musicEnabled,
    audio.pause,
    audio.play,
    toggleSetting,
  ]);


  // =======================================================
  // FOCUS MANAGEMENT + ESCAPE CLOSE
  // =======================================================

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;

    const animationFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();

        handleClose();

        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements =
        panelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);

      if (!focusableElements?.length) {
        event.preventDefault();

        return;
      }

      const firstElement = focusableElements[0];

      const lastElement =
        focusableElements[focusableElements.length - 1];

      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (
          activeElement === firstElement ||
          !panelRef.current?.contains(activeElement)
        )
      ) {
        event.preventDefault();

        lastElement.focus();

        return;
      }

      if (
        !event.shiftKey &&
        (
          activeElement === lastElement ||
          !panelRef.current?.contains(activeElement)
        )
      ) {
        event.preventDefault();

        firstElement.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.cancelAnimationFrame(animationFrame);

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      const previousElement = previousFocusRef.current;

      if (
        previousElement &&
        previousElement.isConnected &&
        typeof previousElement.focus === "function"
      ) {
        previousElement.focus({
          preventScroll: true,
        });
      }

      previousFocusRef.current = null;
    };
  }, [
    isOpen,
    handleClose,
  ]);


  // =======================================================
  // CLOSED STATE
  // =======================================================
  //
  // Keep useWinterAudio() above this return.
  // Otherwise closing the sidebar destroys the audio hook.
  //
  // =======================================================

  if (!isOpen) {
    return null;
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[80]
        overflow-hidden
      "
    >
      {/* ================================================
          SCOPED KEYFRAMES FOR MR. ROBOT 2026 -> 2027 GLITCH
      ================================================ */}

      <style>{`
        @keyframes fs-mr-digit-6-kf {
          0%, 28% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            clip-path: inset(0 0 0 0);
          }
          32% {
            opacity: 1;
            transform: translate3d(-2px, 1px, 0) skewX(-6deg);
            clip-path: inset(12% 0 28% 0);
          }
          36% {
            opacity: 0.9;
            transform: translate3d(2px, -1px, 0) skewX(8deg);
            clip-path: inset(40% 0 10% 0);
          }
          42% {
            opacity: 0.35;
            transform: translate3d(-2px, 0, 0) scale(0.95);
            clip-path: inset(25% 0 45% 0);
          }
          48%, 92% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.9);
          }
          95% {
            opacity: 0.7;
            transform: translate3d(2px, -1px, 0) skewX(-5deg);
            clip-path: inset(15% 0 20% 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            clip-path: inset(0 0 0 0);
          }
        }

        @keyframes fs-mr-digit-7-kf {
          0%, 44% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.92);
          }
          48% {
            opacity: 0.65;
            transform: translate3d(2px, -1px, 0) skewX(8deg);
            clip-path: inset(20% 0 30% 0);
          }
          52% {
            opacity: 1;
            transform: translate3d(-2px, 1px, 0) skewX(-4deg);
            clip-path: inset(0 0 18% 0);
          }
          56%, 88% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            clip-path: inset(0 0 0 0);
          }
          92% {
            opacity: 0.5;
            transform: translate3d(-2px, 1px, 0) skewX(10deg);
            clip-path: inset(35% 0 15% 0);
          }
          96%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes fs-mr-glitch-cyan-kf {
          0%, 27%, 55%, 90%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0);
          }
          30%, 35%, 45%, 50%, 93% {
            opacity: 0.85;
            transform: translate3d(-2px, 1px, 0);
          }
          33%, 40%, 48% {
            opacity: 0.6;
            transform: translate3d(2px, -1px, 0);
          }
        }

        @keyframes fs-mr-glitch-red-kf {
          0%, 28%, 55%, 90%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0);
          }
          31%, 38%, 47%, 52%, 94% {
            opacity: 0.8;
            transform: translate3d(2px, -1px, 0);
          }
          35%, 43%, 49% {
            opacity: 0.55;
            transform: translate3d(-2px, 1px, 0);
          }
        }

        @keyframes fs-mr-grid-cell-kf {
          0%, 28%, 56%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.4);
          }
          34% {
            opacity: 0.95;
            transform: translate3d(0, 0, 0) scale(1);
          }
          42% {
            opacity: 0.85;
            transform: translate3d(var(--fs-tx), var(--fs-ty), 0) scale(0.85);
          }
          50% {
            opacity: 0.45;
            transform: translate3d(0, 0, 0) scale(0.7);
          }
        }

        .fs-mr-digit-6 {
          animation: fs-mr-digit-6-kf 5.6s infinite;
        }
        .fs-mr-digit-7 {
          animation: fs-mr-digit-7-kf 5.6s infinite;
        }
        .fs-mr-glitch-cyan {
          animation: fs-mr-glitch-cyan-kf 5.6s steps(2, end) infinite;
        }
        .fs-mr-glitch-red {
          animation: fs-mr-glitch-red-kf 5.6s steps(2, end) infinite;
        }
        .fs-mr-grid-cell {
          animation: fs-mr-grid-cell-kf 5.6s infinite;
          animation-delay: var(--fs-delay, 0ms);
        }

        @media (prefers-reduced-motion: reduce) {
          .fs-mr-digit-6,
          .fs-mr-glitch-cyan,
          .fs-mr-glitch-red,
          .fs-mr-grid-cell {
            animation: none !important;
            opacity: 0 !important;
          }
          .fs-mr-digit-7 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            clip-path: none !important;
          }
        }
      `}</style>

      {/* ================================================
          SUBTLE TRANSPARENT BACKDROP (SAYT KO‘RINIB TURADI)
      ================================================ */}

      <div
        aria-hidden="true"
        onClick={handleClose}
        className="
          absolute
          inset-0
          bg-slate-900/10
          dark:bg-slate-950/45
          backdrop-blur-[1px]
          animate-in
          fade-in
          duration-200
          motion-reduce:animate-none
        "
      />

      {/* ================================================
          FLOATING FROSTED-GLASS CARD (LIGHT & DARK)
      ================================================ */}

      <aside
        ref={panelRef}
        id="fsociety-winter-settings"
        role="dialog"
        aria-modal="true"
        aria-labelledby="winter-sidebar-title"
        aria-describedby="winter-sidebar-description"
        className="
          fixed
          inset-x-3
          top-[68px]
          z-10
          mx-auto
          flex
          max-h-[calc(100dvh-5rem)]
          w-auto
          max-w-[392px]
          flex-col
          overflow-hidden
          rounded-[26px]
          border
          border-white/90
          ring-1
          ring-cyan-500/20
          bg-gradient-to-b
          from-white/92
          via-[#f3f9ff]/92
          to-[#e7f3ff]/94
          text-slate-900
          shadow-[0_24px_60px_-14px_rgba(14,116,144,0.25),0_0_0_1px_rgba(255,255,255,0.75)_inset]
          backdrop-blur-2xl
          dark:border-cyan-400/20
          dark:ring-cyan-400/10
          dark:bg-gradient-to-b
          dark:from-[#0a1628]/94
          dark:via-[#081222]/94
          dark:to-[#060e1b]/96
          dark:text-slate-100
          dark:shadow-[0_24px_70px_-14px_rgba(0,0,0,0.82),0_0_30px_rgba(6,182,212,0.14)]
          sm:inset-x-auto
          sm:right-5
          sm:top-[76px]
          sm:mx-0
          sm:w-[376px]
          md:right-6
          md:w-[392px]
          animate-in
          fade-in
          zoom-in-95
          duration-200
          motion-reduce:animate-none
          motion-reduce:transition-none
        "
      >
        {/* TOP FROSTED HEADER */}

        <header
          className="
            relative
            shrink-0
            border-b
            border-slate-200/75
            dark:border-cyan-400/15
            bg-white/40
            dark:bg-white/[0.02]
            px-4
            py-3.5
          "
        >
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className="
                  flex
                  h-9 w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-500/25
                  bg-cyan-500/10
                  text-cyan-600
                  dark:border-cyan-400/25
                  dark:bg-cyan-400/10
                  dark:text-cyan-300
                "
              >
                <Snowflake
                  size={19}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2
                    id="winter-sidebar-title"
                    className="
                      truncate
                      text-sm
                      sm:text-base
                      font-extrabold
                      tracking-tight
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Qishki muhit
                  </h2>

                  <span
                    className="
                      shrink-0
                      rounded-md
                      border
                      border-cyan-500/25
                      bg-cyan-500/10
                      px-1.5
                      py-0.5
                      font-mono
                      text-[9px]
                      font-bold
                      tabular-nums
                      text-cyan-700
                      dark:text-cyan-300
                    "
                  >
                    {activeEffectsCount}/{EFFECTS_COUNT}
                  </span>
                </div>

                <p
                  id="winter-sidebar-description"
                  className="
                    truncate
                    text-[10px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  FSociety • Yangi yil 2027 boshqaruvi
                </p>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Qishki muhit oynasini yopish"
              className="
                inline-flex
                h-8 w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200/90
                bg-white/80
                text-slate-500
                transition-colors
                duration-150
                hover:border-red-400/40
                hover:bg-red-500/10
                hover:text-red-500
                dark:border-white/10
                dark:bg-white/[0.06]
                dark:text-slate-300
                dark:hover:text-red-400
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-cyan-500
              "
            >
              <X
                size={16}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </button>
          </div>
        </header>

        {/* ==============================================
            SCROLLABLE CARD BODY
        ============================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
          "
        >
          <div className="space-y-3.5 p-3.5 sm:p-4">
            {/* ==========================================
                ADAPTIVE 2026 -> 2027 MR. ROBOT BAR + SALYUT
            ========================================== */}

            <section
              aria-label="2027 yil animatsiyasi va salyut"
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-cyan-500/25
                bg-gradient-to-r
                from-sky-50/95
                via-cyan-50/90
                to-indigo-50/95
                p-3
                shadow-[0_6px_20px_rgba(14,116,144,0.10)]
                dark:border-cyan-400/25
                dark:from-[#071323]
                dark:via-[#0a1830]
                dark:to-[#12102c]
                dark:shadow-[0_8px_24px_rgba(6,182,212,0.14)]
              "
            >
              {/* SUBTLE CYBER GRID */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(6,182,212,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.16) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative flex flex-wrap items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <p
                    className="
                      font-mono
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-cyan-700/80
                      dark:text-cyan-300/80
                    "
                  >
                    YANGI YIL // 06→07
                  </p>

                  <div className="mt-0.5">
                    <MrRobotYearDisplay />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchFireworks}
                  aria-label="Saytda salyut otish"
                  className={`
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    border
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-white
                    transition-all
                    duration-200
                    active:scale-95
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cyan-400
                    motion-reduce:transition-none
                    ${
                      isFiring
                        ? "border-amber-300/60 bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.45)]"
                        : "border-cyan-400/40 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 shadow-[0_4px_14px_rgba(6,182,212,0.32)] hover:brightness-110"
                    }
                  `}
                >
                  {isFiring ? (
                    <Flame
                      size={15}
                      className="shrink-0 text-amber-200 motion-safe:animate-pulse"
                      aria-hidden="true"
                    />
                  ) : (
                    <Sparkles
                      size={15}
                      className="shrink-0 text-cyan-100"
                      aria-hidden="true"
                    />
                  )}

                  <span>
                    {isFiring ? "Otilmoqda!" : "Salyut otish"}
                  </span>
                </button>
              </div>
            </section>

            {/* ==========================================
                ENVIRONMENT & BACKGROUND TOGGLES
            ========================================== */}

            <section
              aria-label="Qishki effekt sozlamalari"
              className="space-y-2.5"
            >
              <WinterSettingToggle
                label="Qor yog‘ishi"
                description="Sayt bo‘ylab mayin qor yog‘adi"
                icon={Snowflake}
                checked={settings.snowfallEnabled}
                onChange={() =>
                  toggleSetting("snowfallEnabled")
                }
              />

              <WinterSettingToggle
                label="Navbar chiroqlari"
                description="Yuqori panelda bayram chiroqlari"
                icon={Lightbulb}
                checked={settings.lightsEnabled}
                onChange={() =>
                  toggleSetting("lightsEnabled")
                }
              />

              <WinterSettingToggle
                label="Qishki fon"
                description="Qishki aurora va 2027 foni"
                icon={ImageIcon}
                checked={Boolean(settings.winterBackgroundEnabled)}
                onChange={() =>
                  toggleSetting("winterBackgroundEnabled")
                }
              />

              {/* ==========================================
                  MUSIC TOGGLE
              ========================================== */}

              <WinterSettingToggle
                label="Qishki musiqa"
                description={
                  settings.musicEnabled
                    ? "Bayram musiqasi yoqilgan"
                    : "Bayram musiqasini yoqish"
                }
                icon={Music2}
                checked={settings.musicEnabled}
                onChange={handleMusicToggle}
              />
            </section>

            {/* ==========================================
                MUSIC SECTION
            ========================================== */}

            <section
              aria-labelledby="winter-music-title"
              className="space-y-3 pt-1"
            >
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <Music2
                    size={15}
                    className="text-cyan-600 dark:text-cyan-300"
                    aria-hidden="true"
                  />

                  <h3
                    id="winter-music-title"
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Musiqa
                  </h3>
                </div>

                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Avtomatik saqlanadi
                </span>
              </div>

              <MusicPlayer
                audioController={audio}
              />

              <VolumeControl
                volume={audio.volume}
                onChange={audio.setVolume}
              />

              <MusicPlaylist />
            </section>
          </div>

          {/* ============================================
              BOTTOM SNOWY PINES & DETAILED SNOWMAN
          ============================================ */}

          <WinterCardIllustration />
        </div>
      </aside>
    </div>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(WinterSettingsSidebar);
