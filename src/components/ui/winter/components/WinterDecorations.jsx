
import React, { memo, useId } from "react";

import WINTER_BACKGROUND_CONFIG, {
  isWinterLayerEnabled,
} from "../data/winterBackgroundConfig";

// =========================================================
// FSOCIETY — WINTER DECORATIONS
// Premium Cyberpunk Christmas Forest
// =========================================================

const STAR_POSITIONS = [
  { x: "12%", y: "24%", delay: "0s", size: 18 },
  { x: "29%", y: "40%", delay: "1.2s", size: 14 },
  { x: "73%", y: "25%", delay: "0.7s", size: 16 },
  { x: "88%", y: "42%", delay: "1.8s", size: 13 },
  { x: "45%", y: "17%", delay: "2.2s", size: 11 },
  { x: "60%", y: "35%", delay: "0.4s", size: 12 },
];

// =========================================================
// HELPERS
// =========================================================

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const getOpacity = (value, fallback) => {
  const parsed = Number(value);

  return clamp(Number.isFinite(parsed) ? parsed : fallback);
};

const getDuration = (value, fallback) => {
  const parsed = Number(value);

  return parsed > 0 ? parsed : fallback;
};

const clampCount = (value, fallback, max) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(0, Math.min(max, Math.floor(parsed)));
};

// =========================================================
// SNOWMAN ILLUSTRATION
// =========================================================

const SnowmanIllustration = memo(function SnowmanIllustration({
  id,
}) {
  return (
    <svg
      viewBox="0 0 240 330"
      className="h-full w-full overflow-visible"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient
          id={`${id}-body`}
          cx="32%"
          cy="23%"
          r="75%"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#EFFAFF" />
          <stop offset="100%" stopColor="#A4C9E5" />
        </radialGradient>

        <radialGradient
          id={`${id}-head`}
          cx="33%"
          cy="24%"
          r="72%"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="72%" stopColor="#F1FAFF" />
          <stop offset="100%" stopColor="#B7D4EB" />
        </radialGradient>

        <linearGradient
          id={`${id}-scarf`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient
          id={`${id}-hat`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <filter
          id={`${id}-shadow`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* Neon ground reflection */}
      <ellipse
        cx="120"
        cy="314"
        rx="73"
        ry="12"
        fill="#22D3EE"
        opacity="0.26"
        filter={`url(#${id}-shadow)`}
      />

      {/* Wooden arms */}
      <g
        stroke="#78350F"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M64 195L25 163L9 140" />
        <path d="M25 163L22 139" />
        <path d="M25 163L7 172" />

        <path d="M176 195L215 163L231 140" />
        <path d="M215 163L218 139" />
        <path d="M215 163L233 172" />
      </g>

      {/* Glowing arm tips */}
      <circle cx="9" cy="140" r="5" fill="#22D3EE" />
      <circle cx="231" cy="140" r="5" fill="#22D3EE" />

      {/* Bottom snowball */}
      <circle
        cx="120"
        cy="247"
        r="67"
        fill={`url(#${id}-body)`}
        stroke="#BAE6FD"
        strokeWidth="2"
        strokeOpacity="0.72"
      />

      {/* Middle snowball */}
      <circle
        cx="120"
        cy="163"
        r="47"
        fill={`url(#${id}-body)`}
        stroke="#BAE6FD"
        strokeWidth="2"
        strokeOpacity="0.75"
      />

      {/* Scarf tail */}
      <path
        d="M148 119L170 191L151 201L137 125Z"
        fill={`url(#${id}-scarf)`}
      />

      {/* Scarf collar */}
      <rect
        x="73"
        y="119"
        width="94"
        height="19"
        rx="9.5"
        fill={`url(#${id}-scarf)`}
      />

      <path
        d="M84 126H155"
        stroke="#CFFAFE"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.78"
      />

      {/* FS mark on scarf */}
      <text
        x="158"
        y="175"
        fill="#FFFFFF"
        fontSize="11"
        fontWeight="900"
        textAnchor="middle"
      >
        FS
      </text>

      {/* Head */}
      <circle
        cx="120"
        cy="79"
        r="40"
        fill={`url(#${id}-head)`}
        stroke="#BAE6FD"
        strokeWidth="2"
        strokeOpacity="0.8"
      />

      {/* Head highlight */}
      <ellipse
        cx="103"
        cy="51"
        rx="16"
        ry="7"
        fill="#FFFFFF"
        opacity="0.75"
      />

      {/* Cheeks */}
      <ellipse
        cx="91"
        cy="91"
        rx="8"
        ry="5"
        fill="#FDA4AF"
        opacity="0.7"
      />

      <ellipse
        cx="149"
        cy="91"
        rx="8"
        ry="5"
        fill="#FDA4AF"
        opacity="0.7"
      />

      {/* Eyes */}
      <circle cx="101" cy="73" r="4.5" fill="#0F172A" />
      <circle cx="139" cy="73" r="4.5" fill="#0F172A" />

      <circle cx="100" cy="71" r="1.5" fill="#FFFFFF" />
      <circle cx="138" cy="71" r="1.5" fill="#FFFFFF" />

      {/* Carrot nose */}
      <path
        d="M120 79L158 87Q163 90 157 94L120 89Z"
        fill="#F97316"
      />

      {/* Smile */}
      <path
        d="M103 99Q120 113 137 99"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Top hat */}
      <g transform="rotate(-5 120 39)">
        <path
          d="M63 52Q120 44 177 52L177 61Q120 54 63 61Z"
          fill="#1E293B"
        />

        <rect
          x="80"
          y="7"
          width="80"
          height="49"
          rx="7"
          fill={`url(#${id}-hat)`}
          stroke="#64748B"
          strokeWidth="1.5"
        />

        <path
          d="M80 43H160V50H80Z"
          fill="#22D3EE"
        />

        <path
          d="M84 17Q120 8 156 17"
          stroke="#CBD5E1"
          strokeOpacity="0.52"
          strokeWidth="2"
          fill="none"
        />

        <circle
          cx="153"
          cy="46"
          r="3"
          fill="#A5F3FC"
        />
      </g>

      {/* Snowman buttons */}
      <g fill="#334155">
        <circle cx="120" cy="164" r="4" />
        <circle cx="120" cy="190" r="4" />
        <circle cx="120" cy="233" r="5" />
        <circle cx="120" cy="257" r="5" />
      </g>

      {/* Ice reflections */}
      <g fill="#FFFFFF" opacity="0.8">
        <circle cx="78" cy="233" r="2.5" />
        <circle cx="156" cy="265" r="2" />
        <circle cx="93" cy="281" r="2" />
      </g>
    </svg>
  );
});

// =========================================================
// CHRISTMAS TREE ILLUSTRATION
// =========================================================

const ChristmasTreeIllustration = memo(
  function ChristmasTreeIllustration({ id }) {
    const bulbs = [
      { x: 81, y: 92, color: "#22D3EE" },
      { x: 138, y: 112, color: "#FDE68A" },
      { x: 62, y: 147, color: "#A78BFA" },
      { x: 164, y: 163, color: "#F472B6" },
      { x: 105, y: 184, color: "#22D3EE" },
      { x: 51, y: 214, color: "#FBBF24" },
      { x: 151, y: 235, color: "#818CF8" },
      { x: 91, y: 265, color: "#F472B6" },
      { x: 181, y: 286, color: "#22D3EE" },
    ];

    return (
      <svg
        viewBox="0 0 230 370"
        className="h-full w-full overflow-visible"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`${id}-tree`}
            x1="115"
            y1="5"
            x2="115"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0F766E" />
            <stop offset="48%" stopColor="#065F46" />
            <stop offset="100%" stopColor="#042F35" />
          </linearGradient>

          <linearGradient
            id={`${id}-garland`}
            x1="0"
            y1="0"
            x2="230"
            y2="300"
          >
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>

          <radialGradient id={`${id}-star-glow`}>
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#FDE68A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          <filter
            id={`${id}-tree-glow`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* Ground light */}
        <ellipse
          cx="115"
          cy="354"
          rx="76"
          ry="12"
          fill="#22D3EE"
          opacity="0.28"
          filter={`url(#${id}-tree-glow)`}
        />

        {/* Tree trunk */}
        <rect
          x="102"
          y="303"
          width="26"
          height="54"
          rx="3"
          fill="#475569"
        />

        {/* Main tree */}
        <path
          d="
            M115 14
            L81 78
            L98 78
            L57 138
            L79 138
            L37 207
            L62 207
            L13 285
            L217 285
            L168 207
            L193 207
            L151 138
            L173 138
            L132 78
            L149 78
            Z
          "
          fill={`url(#${id}-tree)`}
          stroke="#67E8F9"
          strokeWidth="2"
          strokeOpacity="0.52"
          strokeLinejoin="round"
        />

        {/* Snow covered branches */}
        <g
          fill="#F0F9FF"
          stroke="#BAE6FD"
          strokeWidth="1.1"
          strokeOpacity="0.7"
        >
          <path d="M115 14L101 44Q115 39 129 44Z" />

          <path
            d="M81 78Q115 65 149 78L142 67Q115 73 88 67Z"
          />

          <path
            d="M57 138Q115 120 173 138L163 126Q115 135 66 126Z"
          />

          <path
            d="M37 207Q115 184 193 207L183 194Q115 203 47 194Z"
          />

          <path
            d="M13 285Q115 261 217 285L201 272Q115 282 29 272Z"
          />
        </g>

        {/* Central cyber-circuit */}
        <path
          d="M115 17V298M78 138H152M47 207H183"
          stroke="#A5F3FC"
          strokeWidth="1.5"
          strokeOpacity="0.25"
          strokeDasharray="4 5"
        />

        {/* Glowing garland */}
        <path
          d="
            M80 92
            Q115 110 149 92
            Q178 118 169 139
            Q115 164 60 143
            Q36 173 64 200
            Q115 225 165 198
            Q196 223 173 245
            Q115 275 54 249
          "
          stroke={`url(#${id}-garland)`}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Garland lights */}
        {bulbs.map((bulb, index) => (
          <g key={index}>
            <circle
              cx={bulb.x}
              cy={bulb.y}
              r="10"
              fill={bulb.color}
              opacity="0.2"
            />

            <circle
              cx={bulb.x}
              cy={bulb.y}
              r="4.5"
              fill={bulb.color}
            />

            <circle
              cx={bulb.x - 1.2}
              cy={bulb.y - 1.2}
              r="1.4"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        ))}

        {/* Star aura */}
        <circle
          cx="115"
          cy="14"
          r="39"
          fill={`url(#${id}-star-glow)`}
          opacity="0.9"
        />

        {/* Top star */}
        <path
          d="
            M115 0
            L123 13
            L139 16
            L127 28
            L130 45
            L115 36
            L100 45
            L103 28
            L91 16
            L107 13
            Z
          "
          fill="#FDE68A"
          stroke="#FACC15"
          strokeWidth="1.4"
        />

        <circle
          cx="112"
          cy="13"
          r="3"
          fill="#FFFFFF"
        />
      </svg>
    );
  }
);

// =========================================================
// SNOWY PINE BRANCHES
// =========================================================

const PineBranches = memo(function PineBranches({
  className = "",
  id,
  flip = false,
}) {
  return (
    <svg
      viewBox="0 0 420 190"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={flip ? "translate(420 0) scale(-1 1)" : undefined}>
        {/* Main branch */}
        <path
          d="M-5 8Q130 35 420 180"
          stroke="#5B4637"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Pine needles */}
        {Array.from({ length: 18 }, (_, index) => {
          const x = index * 24;
          const y = 12 + index * 9;

          return (
            <g key={index}>
              <path
                d={`M${x} ${y}L${x - 26} ${y - 23}`}
                stroke="#0F766E"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <path
                d={`M${x} ${y}L${x + 7} ${y - 28}`}
                stroke="#0D9488"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <path
                d={`M${x} ${y}L${x + 30} ${y + 1}`}
                stroke="#065F46"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <path
                d={`M${x - 4} ${y - 2}L${x - 20} ${y - 16}`}
                stroke="#F0F9FF"
                strokeOpacity="0.8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Warm fairy lights */}
        {[70, 155, 240, 330].map((x, index) => (
          <g key={index}>
            <circle
              cx={x}
              cy={35 + index * 31}
              r="13"
              fill="#FBBF24"
              opacity="0.14"
            />

            <circle
              cx={x}
              cy={35 + index * 31}
              r="4"
              fill="#FDE68A"
            />
          </g>
        ))}

        {/* Hanging ornament */}
        <path
          d="M155 56V83"
          stroke="#CBD5E1"
          strokeWidth="1.4"
        />

        <circle
          cx="155"
          cy="94"
          r="10"
          fill="#DC2626"
          stroke="#FDE68A"
          strokeWidth="1.5"
        />

        <circle
          cx="152"
          cy="91"
          r="3"
          fill="#FFFFFF"
          opacity="0.72"
        />

        <path
          d="M300 120V143"
          stroke="#CBD5E1"
          strokeWidth="1.4"
        />

        <circle
          cx="300"
          cy="153"
          r="8"
          fill="#2563EB"
          stroke="#BAE6FD"
          strokeWidth="1.4"
        />
      </g>
    </svg>
  );
});

// =========================================================
// GIFT BOX
// =========================================================

const GIFT_COLORS = {
  cyan: {
    body: "#0891B2",
    ribbon: "#FDE68A",
    border: "#67E8F9",
  },

  violet: {
    body: "#6D28D9",
    ribbon: "#F9A8D4",
    border: "#C4B5FD",
  },

  rose: {
    body: "#BE185D",
    ribbon: "#FDE68A",
    border: "#FDA4AF",
  },

  gold: {
    body: "#B45309",
    ribbon: "#FFFFFF",
    border: "#FCD34D",
  },
};

const GiftBox = memo(function GiftBox({
  color = "cyan",
  className = "",
}) {
  const colors = GIFT_COLORS[color] ?? GIFT_COLORS.cyan;

  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="40"
        cy="74"
        rx="30"
        ry="5"
        fill="#020617"
        opacity="0.3"
      />

      {/* Main box */}
      <rect
        x="10"
        y="33"
        width="60"
        height="37"
        rx="3"
        fill={colors.body}
        stroke={colors.border}
        strokeWidth="1.6"
      />

      {/* Lid */}
      <rect
        x="6"
        y="25"
        width="68"
        height="12"
        rx="3"
        fill={colors.body}
        stroke={colors.border}
        strokeWidth="1.6"
      />

      {/* Ribbons */}
      <rect
        x="35"
        y="25"
        width="10"
        height="45"
        fill={colors.ribbon}
      />

      <rect
        x="6"
        y="28"
        width="68"
        height="5"
        fill={colors.ribbon}
      />

      {/* Bow */}
      <path
        d="M40 26Q13 3 13 18Q16 33 40 28"
        stroke={colors.ribbon}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M40 26Q67 3 67 18Q64 33 40 28"
        stroke={colors.ribbon}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <circle
        cx="40"
        cy="27"
        r="5"
        fill={colors.ribbon}
      />

      {/* Highlight */}
      <path
        d="M16 43H31"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeOpacity="0.38"
        strokeLinecap="round"
      />
    </svg>
  );
});

// =========================================================
// LANTERN
// =========================================================

const WinterLantern = memo(function WinterLantern({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 70 110"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="fs-winter-lantern-glow">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        cx="35"
        cy="59"
        r="32"
        fill="url(#fs-winter-lantern-glow)"
      />

      <path
        d="M22 28Q35 4 48 28"
        stroke="#64748B"
        strokeWidth="3"
        fill="none"
      />

      <rect
        x="15"
        y="29"
        width="40"
        height="62"
        rx="5"
        fill="#1E293B"
        stroke="#94A3B8"
        strokeWidth="2"
      />

      <path
        d="M23 39H47L44 80H26Z"
        fill="#FDE68A"
        opacity="0.75"
      />

      <path
        d="M35 40V79M23 60H47"
        stroke="#92400E"
        strokeWidth="2"
        opacity="0.55"
      />

      <path
        d="M15 39H55M15 82H55"
        stroke="#64748B"
        strokeWidth="3"
      />

      <circle
        cx="35"
        cy="59"
        r="5"
        fill="#FFF7AE"
      />
    </svg>
  );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const WinterDecorations = ({ className = "" }) => {
  const reactId = useId();
  const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");

  const animationId = `fs-winter-decor-${safeId}`;

  const config = WINTER_BACKGROUND_CONFIG.decorations ?? {};

  const snowmen = config.snowmen ?? {};
  const christmasTree = config.christmasTree ?? {};
  const ornaments = config.ornaments ?? {};
  const stars = config.stars ?? {};
  const gifts = config.gifts ?? {};
  const iceCrystals = config.iceCrystals ?? {};

  const responsive = WINTER_BACKGROUND_CONFIG.responsive ?? {};
  const performance = WINTER_BACKGROUND_CONFIG.performance ?? {};

  // =======================================================
  // VISIBILITY
  // =======================================================

  const snowmanEnabled = snowmen.enabled !== false;
  const treeEnabled = christmasTree.enabled !== false;
  const ornamentsEnabled = ornaments.enabled !== false;
  const starsEnabled = stars.enabled !== false;
  const giftsEnabled = gifts.enabled !== false;
  const crystalsEnabled = iceCrystals.enabled !== false;

  const snowmanCount = clampCount(snowmen.count, 1, 2);
  const treeCount = clampCount(christmasTree.count, 1, 2);
  const ornamentCount = clampCount(ornaments.count, 2, 2);
  const starCount = clampCount(stars.count, 5, STAR_POSITIONS.length);
  const giftCount = clampCount(gifts.count, 3, 4);

  const hasDecorations =
    (snowmanEnabled && snowmanCount > 0) ||
    (treeEnabled && treeCount > 0) ||
    (ornamentsEnabled && ornamentCount > 0) ||
    (starsEnabled && starCount > 0) ||
    (giftsEnabled && giftCount > 0) ||
    crystalsEnabled;

  if (
    !isWinterLayerEnabled("decorations") ||
    !config.enabled ||
    !hasDecorations
  ) {
    return null;
  }

  // =======================================================
  // ANIMATION CONFIGURATION
  // =======================================================

  const snowmanDuration = getDuration(snowmen.floatDuration, 7000);
  const treeDuration = getDuration(christmasTree.floatDuration, 6500);
  const swingDuration = getDuration(ornaments.swingDuration, 6000);
  const twinkleDuration = getDuration(stars.twinkleDuration, 3200);

  const respectReducedMotion =
    performance.respectReducedMotion !== false;

  const snowmanAnimation = snowmen.animation !== false;
  const treeAnimation = christmasTree.animation !== false;
  const ornamentAnimation = ornaments.animation !== false;
  const starAnimation = stars.twinkle !== false;

  // =======================================================
  // THEME OPACITY
  // =======================================================

  const lightOpacity = getOpacity(
    WINTER_BACKGROUND_CONFIG.light?.decorationOpacity,
    0.78
  );

  const darkOpacity = getOpacity(
    WINTER_BACKGROUND_CONFIG.dark?.decorationOpacity,
    0.85
  );

  // =======================================================
  // RESPONSIVE SETTINGS
  // =======================================================

  const mobileSnowman = snowmen.mobile?.enabled !== false;
  const mobileTree = christmasTree.mobile?.enabled !== false;

  const mobileDecorations =
    responsive.mobile?.decorations !== false;

  // =======================================================
  // GIFT LAYOUT
  // =======================================================

  const giftLayout = [
    {
      color: "violet",
      position: "bottom-3 right-[13%]",
      size: "h-10 w-10 sm:h-16 sm:w-16 lg:h-20 lg:w-20",
      delay: "0s",
      layer: "z-[5]",
    },
    {
      color: "cyan",
      position: "bottom-1 right-[23%]",
      size: "h-9 w-9 sm:h-14 sm:w-14 lg:h-16 lg:w-16",
      delay: "0.6s",
      layer: "z-[4]",
    },
    {
      color: "rose",
      position: "bottom-2 left-[20%]",
      size: "h-8 w-8 sm:h-12 sm:w-12 lg:h-14 lg:w-14",
      delay: "1.1s",
      layer: "z-[4]",
    },
    {
      color: "gold",
      position: "bottom-4 right-[31%]",
      size: "h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16",
      delay: "1.5s",
      layer: "z-[3]",
    },
  ];

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-[3]",
        "overflow-hidden select-none",
        className,
      ].join(" ")}
    >
      <style>
        {`
          /* ================================================
             SNOWMAN FLOAT
          ================================================ */

          @keyframes ${animationId}-snowman-float {
            0%, 100% {
              transform: translate3d(0, 0, 0) rotate(-1deg);
            }

            50% {
              transform: translate3d(0, -9px, 0) rotate(1deg);
            }
          }

          /* ================================================
             CHRISTMAS TREE FLOAT
          ================================================ */

          @keyframes ${animationId}-tree-float {
            0%, 100% {
              transform: translate3d(0, 0, 0);
            }

            50% {
              transform: translate3d(0, -7px, 0);
            }
          }

          /* ================================================
             TWINKLING LIGHTS
          ================================================ */

          @keyframes ${animationId}-twinkle {
            0%, 100% {
              opacity: 0.55;
              filter: brightness(0.9);
            }

            50% {
              opacity: 1;
              filter: brightness(1.4);
            }
          }

          /* ================================================
             ORNAMENT SWING
          ================================================ */

          @keyframes ${animationId}-swing {
            0%, 100% {
              transform: rotate(-4deg);
            }

            50% {
              transform: rotate(4deg);
            }
          }

          /* ================================================
             THEME OPACITY
          ================================================ */

          .${animationId}-snowman,
          .${animationId}-tree {
            opacity: ${lightOpacity};
          }

          .dark .${animationId}-snowman,
          .dark .${animationId}-tree {
            opacity: ${darkOpacity};
          }

          /* ================================================
             ANIMATIONS
          ================================================ */

          .${animationId}-snowman-float {
            animation: ${
              snowmanAnimation
                ? `${animationId}-snowman-float ${snowmanDuration}ms ease-in-out infinite`
                : "none"
            };
            transform-origin: center bottom;
          }

          .${animationId}-tree-float {
            animation: ${
              treeAnimation
                ? `${animationId}-tree-float ${treeDuration}ms ease-in-out infinite`
                : "none"
            };
          }

          .${animationId}-twinkle {
            animation: ${
              starAnimation
                ? `${animationId}-twinkle ${twinkleDuration}ms ease-in-out infinite`
                : "none"
            };
          }

          .${animationId}-swing {
            animation: ${
              ornamentAnimation
                ? `${animationId}-swing ${swingDuration}ms ease-in-out infinite`
                : "none"
            };
            transform-origin: top center;
          }

          @media (prefers-reduced-motion: reduce) {
            ${
              respectReducedMotion
                ? `
                  .${animationId}-snowman-float,
                  .${animationId}-tree-float,
                  .${animationId}-twinkle,
                  .${animationId}-swing {
                    animation: none !important;
                  }
                `
                : ""
            }
          }
        `}
      </style>

      {/* ===================================================
          LAYER 1 — UPPER LEFT CHRISTMAS BRANCH
      =================================================== */}

      {ornamentsEnabled && (
        <>
          <PineBranches
            id={`${safeId}-left-branch`}
            className="
              absolute
              -left-3
              -top-2
              h-24
              w-[48%]
              sm:h-36
              lg:h-48
            "
          />

          <PineBranches
            id={`${safeId}-right-branch`}
            flip
            className="
              absolute
              -right-3
              -top-2
              h-24
              w-[48%]
              sm:h-36
              lg:h-48
            "
          />
        </>
      )}

      {/* ===================================================
          LAYER 2 — LEFT SNOWMAN
      =================================================== */}

      {snowmanEnabled && snowmanCount > 0 && (
        <div
          className={[
            `${animationId}-snowman-float`,
            `${animationId}-snowman`,
            "absolute bottom-0 left-0 z-[4]",
            "h-28 w-24",
            "sm:bottom-2 sm:left-2 sm:h-48 sm:w-40",
            "md:h-60 md:w-48",
            "lg:bottom-3 lg:left-5 lg:h-72 lg:w-56",
            "xl:left-10 xl:h-80 xl:w-64",
            !mobileDecorations || !mobileSnowman
              ? "hidden sm:block"
              : "",
          ].join(" ")}
        >
          <SnowmanIllustration id={`${safeId}-snowman`} />
        </div>
      )}

      {/* ===================================================
          LAYER 3 — MAIN CHRISTMAS TREE
      =================================================== */}

      {treeEnabled && treeCount > 0 && (
        <div
          className={[
            `${animationId}-tree-float`,
            `${animationId}-tree`,
            "absolute bottom-0 right-0 z-[4]",
            "h-40 w-24",
            "sm:h-64 sm:w-40",
            "md:h-80 md:w-52",
            "lg:h-96 lg:w-60",
            "xl:h-[440px] xl:w-[275px]",
            !mobileDecorations || !mobileTree
              ? "hidden sm:block"
              : "",
          ].join(" ")}
          style={{
            animationDelay: "1.4s",
          }}
        >
          <ChristmasTreeIllustration id={`${safeId}-tree`} />
        </div>
      )}

      {/* ===================================================
          LAYER 4 — HANGING CHRISTMAS ORNAMENTS
      =================================================== */}

      {ornamentsEnabled && (
        <>
          {ornamentCount >= 1 && (
            <div
              className={[
                `${animationId}-swing`,
                "absolute left-[13%] top-0 z-[4]",
                "hidden h-36 w-10 md:block",
              ].join(" ")}
            >
              <div className="mx-auto h-12 w-px bg-gradient-to-b from-cyan-200/80 to-cyan-300/10" />

              <div className="mx-auto h-1.5 w-3 rounded-t bg-cyan-200" />

              <div
                className="
                  h-8 w-8 mx-auto
                  rounded-full
                  border border-cyan-100/80
                  bg-gradient-to-br
                  from-cyan-200
                  via-sky-400
                  to-blue-800
                  shadow-[0_0_24px_rgba(34,211,238,0.65)]
                "
              >
                <span className="ml-2 mt-1.5 block h-2 w-2 rounded-full bg-white/90 blur-[1px]" />
              </div>
            </div>
          )}

          {ornamentCount >= 2 && (
            <div
              className={[
                `${animationId}-swing`,
                "absolute right-[13%] top-0 z-[4]",
                "hidden h-40 w-10 md:block",
              ].join(" ")}
              style={{ animationDelay: "2s" }}
            >
              <div className="mx-auto h-16 w-px bg-gradient-to-b from-violet-200/80 to-violet-300/10" />

              <div className="mx-auto h-1.5 w-3 rounded-t bg-violet-200" />

              <div
                className="
                  h-9 w-9 mx-auto
                  rounded-full
                  border border-violet-100/80
                  bg-gradient-to-br
                  from-violet-200
                  via-indigo-500
                  to-indigo-950
                  shadow-[0_0_26px_rgba(139,92,246,0.6)]
                "
              >
                <span className="ml-2 mt-2 block h-2 w-2 rounded-full bg-white/90 blur-[1px]" />
              </div>
            </div>
          )}
        </>
      )}

      {/* ===================================================
          LAYER 5 — TWINKLING CYBER STARS
      =================================================== */}

      {starsEnabled &&
        STAR_POSITIONS.slice(0, starCount).map((star, index) => (
          <svg
            key={index}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={[
              `${animationId}-twinkle`,
              "absolute z-[2]",
              "text-cyan-500 dark:text-cyan-200",
              "drop-shadow-[0_0_9px_rgba(34,211,238,0.65)]",
            ].join(" ")}
            style={{
              left: star.x,
              top: star.y,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
          >
            <path d="M12 1L14.6 9.4L23 12L14.6 14.6L12 23L9.4 14.6L1 12L9.4 9.4L12 1Z" />
          </svg>
        ))}

      {/* ===================================================
          LAYER 6 — GIFT BOXES
      =================================================== */}

      {giftsEnabled &&
        giftLayout.slice(0, giftCount).map((gift, index) => (
          <GiftBox
            key={index}
            color={gift.color}
            className={[
              "absolute",
              gift.position,
              gift.size,
              gift.layer,
              "drop-shadow-[0_4px_12px_rgba(2,6,23,0.35)]",
              index === 2 ? "hidden sm:block" : "",
            ].join(" ")}
          />
        ))}

      {/* ===================================================
          LAYER 7 — WARM WINTER LANTERNS
      =================================================== */}

      <WinterLantern
        className="
          absolute
          bottom-2
          left-[15%]
          z-[5]
          h-14
          w-10
          sm:bottom-4
          sm:left-[19%]
          sm:h-20
          sm:w-14
          lg:h-28
          lg:w-20
        "
      />

      <WinterLantern
        className="
          absolute
          bottom-2
          right-[21%]
          z-[5]
          h-12
          w-8
          sm:bottom-4
          sm:right-[23%]
          sm:h-20
          sm:w-14
          lg:h-24
          lg:w-16
        "
      />

      {/* ===================================================
          LAYER 8 — FOREGROUND ICE CRYSTALS
      =================================================== */}

      {crystalsEnabled && (
        <>
          <svg
            viewBox="0 0 100 100"
            className="
              absolute
              left-[6%]
              top-[47%]
              h-7
              w-7
              text-cyan-300
              opacity-65
              sm:h-12
              sm:w-12
            "
            fill="none"
          >
            <path
              d="
                M50 5V95
                M10 28L90 72
                M10 72L90 28
                M50 5L42 17
                M50 5L58 17
                M50 95L42 83
                M50 95L58 83
              "
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <svg
            viewBox="0 0 100 100"
            className="
              absolute
              right-[8%]
              top-[37%]
              h-6
              w-6
              rotate-12
              text-violet-300
              opacity-60
              sm:h-10
              sm:w-10
            "
            fill="none"
          >
            <path
              d="
                M50 5V95
                M10 28L90 72
                M10 72L90 28
                M50 5L42 17
                M50 5L58 17
                M50 95L42 83
                M50 95L58 83
              "
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </>
      )}
    </div>
  );
};

export default memo(WinterDecorations);
