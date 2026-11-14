
import React, { memo, useId } from "react";

import WINTER_BACKGROUND_CONFIG from "../data/winterBackgroundConfig";

// =========================================================
// FSOCIETY — WINTER BRAND
// Premium Cyberpunk Brand Watermark
// =========================================================

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number(value) || 0));

const sanitizeId = (value) =>
  value.replace(/[^a-zA-Z0-9_-]/g, "");

// =========================================================
// BRAND COMPONENT
// =========================================================

const WinterBrand = ({
  className = "",
  position = "top",
}) => {
  const reactId = useId();

  const safeId = sanitizeId(reactId);
  const animationId = `fs-winter-brand-${safeId}`;

  const branding =
    WINTER_BACKGROUND_CONFIG.branding ?? {};

  const watermark = branding.watermark ?? {};
  const colors = branding.colors ?? {};

  const yearConfig =
    WINTER_BACKGROUND_CONFIG.yearTransition ?? {};

  // =======================================================
  // CONFIGURATION
  // =======================================================

  const enabled =
    WINTER_BACKGROUND_CONFIG.enabled &&
    branding.enabled !== false &&
    watermark.enabled !== false;

  const brandName = branding.name || "FSOCIETY";

  const subtitle = branding.subtitle || "Fix Society";

  const tagline =
    branding.tagline || "Fix • Share • Build Together";

  const targetYear = yearConfig.toYear || "2027";

  const primaryColor = colors.primary || "#22D3EE";
  const secondaryColor = colors.secondary || "#3B82F6";
  const accentColor = colors.accent || "#8B5CF6";

  const lightOpacity = clamp(
    watermark.opacityLight ?? 0.09
  );

  const darkOpacity = clamp(
    watermark.opacityDark ?? 0.12
  );

  // =======================================================
  // BRAND POSITION
  // =======================================================

  const positionClasses =
    position === "center"
      ? "top-1/2 -translate-y-1/2"
      : position === "bottom"
        ? "bottom-[12%]"
        : "top-[10%] sm:top-[9%] lg:top-[11%]";

  if (!enabled) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none",
        "absolute inset-x-0",
        positionClasses,
        "z-[4]",
        "flex justify-center",
        "overflow-hidden",
        "px-3 sm:px-6",
        "select-none",
        className,
      ].join(" ")}
    >
      <style>
        {`
          /* ================================================
             BRAND OPACITY
          ================================================ */

          .${animationId}-root {
            opacity: ${lightOpacity};
          }

          .dark .${animationId}-root {
            opacity: ${darkOpacity};
          }

          /* ================================================
             BRAND LIGHT ANIMATION
          ================================================ */

          @keyframes ${animationId}-light {
            0%, 100% {
              filter: brightness(0.95);
            }

            50% {
              filter: brightness(1.12);
            }
          }

          .${animationId}-wordmark {
            animation: ${animationId}-light 9s ease-in-out infinite;
          }

          /* ================================================
             REDUCED MOTION
          ================================================ */

          @media (prefers-reduced-motion: reduce) {
            .${animationId}-wordmark {
              animation: none !important;
            }
          }
        `}
      </style>

      <div
        className={[
          `${animationId}-root`,
          "relative",
          "flex w-full max-w-[1100px]",
          "flex-col items-center",
          "text-center",
        ].join(" ")}
      >
        {/* =================================================
            TOP BRAND IDENTIFIER
        ================================================= */}

        <div
          className="
            mb-2
            flex
            items-center
            gap-2.5
            sm:mb-3
            sm:gap-3
          "
        >
          <span
            className="
              h-px
              w-7
              bg-gradient-to-r
              from-transparent
              to-cyan-500/70
              sm:w-12
              dark:to-cyan-300/80
            "
          />

          <span
            className="
              font-mono
              text-[8px]
              font-bold
              uppercase
              tracking-[0.24em]
              text-slate-700
              dark:text-cyan-100
              sm:text-[10px]
              sm:tracking-[0.4em]
            "
          >
            Developer Community
          </span>

          <span
            className="
              h-px
              w-7
              bg-gradient-to-l
              from-transparent
              to-indigo-500/70
              sm:w-12
              dark:to-violet-300/80
            "
          />
        </div>

        {/* =================================================
            MAIN FSOCIETY WORDMARK
        ================================================= */}

        <div className="relative max-w-full">
          {/* Soft neon aura */}
          <div
            className="
              absolute
              inset-x-[12%]
              inset-y-[20%]
              -z-10
              rounded-full
              bg-cyan-400/10
              blur-2xl
              dark:bg-cyan-300/[0.12]
              sm:blur-3xl
            "
          />

          <h2
            className={[
              `${animationId}-wordmark`,
              "bg-gradient-to-r",
              "from-slate-700",
              "via-cyan-700",
              "to-indigo-700",
              "bg-clip-text",
              "text-transparent",
              "text-[clamp(2rem,7.5vw,7.5rem)]",
              "font-black",
              "leading-[0.95]",
              "tracking-[0.055em]",
              "whitespace-nowrap",
              "dark:from-cyan-100",
              "dark:via-sky-300",
              "dark:to-violet-400",
            ].join(" ")}
            style={{
              textShadow: `
                0 0 24px ${primaryColor}20,
                0 0 48px ${secondaryColor}14
              `,
            }}
          >
            {brandName}
          </h2>

          {/* Secondary chromatic line */}
          <div
            className="
              absolute
              -bottom-1
              left-1/2
              h-px
              w-[76%]
              -translate-x-1/2
              bg-gradient-to-r
              from-transparent
              via-cyan-500/60
              to-transparent
              dark:via-cyan-300/60
            "
          />
        </div>

        {/* =================================================
            BRAND SUBTITLE
        ================================================= */}

        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            justify-center
            gap-2
            sm:mt-4
            sm:gap-3
          "
        >
          <span
            className="
              font-mono
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-slate-700
              dark:text-slate-200
              sm:text-xs
              sm:tracking-[0.4em]
            "
          >
            {subtitle}
          </span>

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-cyan-500
              shadow-[0_0_8px_rgba(34,211,238,0.8)]
              dark:bg-cyan-300
            "
          />

          <span
            className="
              font-mono
              text-[8px]
              font-bold
              tracking-[0.2em]
              text-indigo-700
              dark:text-violet-300
              sm:text-[10px]
            "
          >
            EST. FS
          </span>
        </div>

        {/* =================================================
            TAGLINE
        ================================================= */}

        <p
          className="
            mt-1.5
            max-w-full
            px-2
            font-mono
            text-[8px]
            font-medium
            tracking-[0.12em]
            text-slate-600
            dark:text-slate-300
            sm:mt-2
            sm:text-[10px]
            sm:tracking-[0.24em]
            md:text-xs
          "
        >
          {tagline}
        </p>

        {/* =================================================
            CYBER BRAND FOOTER
        ================================================= */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-center
            gap-2
            font-mono
            text-[7px]
            font-semibold
            tracking-[0.16em]
            text-cyan-800/80
            dark:text-cyan-200/80
            sm:mt-4
            sm:gap-3
            sm:text-[9px]
            sm:tracking-[0.3em]
          "
        >
          <span
            className="
              h-1
              w-1
              rounded-full
              bg-cyan-500
              dark:bg-cyan-300
            "
          />

          <span>FIX</span>

          <span className="text-slate-400 dark:text-slate-500">
            /
          </span>

          <span>SHARE</span>

          <span className="text-slate-400 dark:text-slate-500">
            /
          </span>

          <span>BUILD</span>

          <span className="text-slate-400 dark:text-slate-500">
            /
          </span>

          <span>{targetYear}</span>

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-violet-500
              dark:bg-violet-300
            "
          />
        </div>

        {/* =================================================
            BOTTOM DECORATIVE SIGNAL
        ================================================= */}

        <div
          className="
            mt-3
            flex
            h-3
            items-center
            justify-center
            gap-1
            opacity-60
            sm:mt-4
          "
        >
          <span className="h-px w-8 bg-cyan-500/60 dark:bg-cyan-300/60" />
          <span className="h-1 w-1 rotate-45 border border-cyan-500 dark:border-cyan-300" />
          <span className="h-px w-3 bg-indigo-500/60 dark:bg-indigo-300/60" />
          <span
            className="h-1 w-1 rotate-45 border"
            style={{ borderColor: accentColor }}
          />
          <span className="h-px w-8 bg-violet-500/60 dark:bg-violet-300/60" />
        </div>
      </div>
    </div>
  );
};

export default memo(WinterBrand);
