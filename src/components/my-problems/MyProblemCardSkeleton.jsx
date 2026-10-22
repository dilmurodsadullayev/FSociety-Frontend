
import React, { memo } from "react";

// =========================================================
// FSOCIETY — MY PROBLEM CARD SKELETON
// =========================================================
//
// Location:
// src/components/my-problems/MyProblemCardSkeleton.jsx
//
// Features:
// - Light / Dark mode
// - Responsive 320px+
// - Card-shaped skeleton loading
// - Avatar placeholder
// - Status placeholder
// - Title / Description placeholders
// - Technology chips
// - Stats placeholders
// - Footer action placeholder
// - Reduced motion support
//
// No API requests.
// No Redux dependencies.
//
// =========================================================

// =========================================================
// SHARED SKELETON STYLES
// =========================================================

const SKELETON_BASE = [
  "rounded-lg",
  "bg-slate-200/80",
  "dark:bg-white/[0.08]",
].join(" ");

// =========================================================
// SMALL SKELETON ELEMENT
// =========================================================

const Skeleton = memo(function Skeleton({
  className = "",
}) {
  return (
    <div
      aria-hidden="true"
      className={`
        ${SKELETON_BASE}
        ${className}
      `}
    />
  );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemCardSkeleton({
  className = "",
}) {
  return (
    <article
      aria-hidden="true"
      className={`
        relative isolate
        flex h-full min-w-0
        max-w-full flex-col
        overflow-hidden

        rounded-[22px]
        border border-slate-200/90
        bg-white/95

        shadow-[0_8px_28px_rgba(15,23,42,0.035)]

        dark:border-white/[0.09]
        dark:bg-[#0e1521]/95
        dark:shadow-[0_12px_36px_rgba(0,0,0,0.16)]

        motion-safe:animate-pulse

        ${className}
      `}
    >
      {/* ==========================================
          TOP ACCENT
         ========================================== */}

      <div
        className="
          h-[3px] w-full
          bg-gradient-to-r
          from-indigo-300/50
          via-cyan-300/30
          to-transparent

          dark:from-indigo-400/20
          dark:via-cyan-400/10
        "
      />

      {/* ==========================================
          CARD HEADER
         ========================================== */}

      <div
        className="
          flex min-w-0
          items-start
          justify-between
          gap-3

          border-b border-slate-100

          px-4 py-4

          dark:border-white/[0.06]

          sm:px-5
        "
      >
        {/* USER */}
        <div
          className="
            flex min-w-0 flex-1
            items-center gap-3
          "
        >
          {/* AVATAR */}
          <Skeleton
            className="
              h-10 w-10
              shrink-0
              !rounded-xl
              sm:h-11 sm:w-11
            "
          />

          {/* USERNAME */}
          <div
            className="
              flex min-w-0 flex-1
              flex-col gap-2
            "
          >
            <Skeleton className="h-3 w-24 max-w-full" />

            <Skeleton className="h-2.5 w-16 max-w-full" />
          </div>
        </div>

        {/* STATUS BADGE */}
        <Skeleton
          className="
            h-7 w-[75px]
            shrink-0
            !rounded-full
          "
        />
      </div>

      {/* ==========================================
          CARD BODY
         ========================================== */}

      <div
        className="
          flex min-w-0 flex-1
          flex-col

          px-4 py-4

          sm:px-5 sm:py-5
        "
      >
        {/* TERMINAL EYEBROW */}
        <div
          className="
            mb-4 flex
            items-center gap-2
          "
        >
          <Skeleton className="h-2 w-2 !rounded-full" />

          <Skeleton className="h-2.5 w-[100px] max-w-full" />
        </div>

        {/* ======================================
            TITLE
           ====================================== */}

        <div className="space-y-2.5">
          <Skeleton
            className="
              h-4 w-[91%]
              max-w-full
            "
          />

          <Skeleton
            className="
              h-4 w-[72%]
              max-w-full
            "
          />
        </div>

        {/* ======================================
            CONTENT PLACEHOLDER
           ====================================== */}

        <div className="mt-5 space-y-2.5">
          <Skeleton className="h-2.5 w-full" />

          <Skeleton className="h-2.5 w-[94%]" />

          <Skeleton className="h-2.5 w-[64%]" />
        </div>

        {/* ======================================
            TECHNOLOGY / LANGUAGE CHIPS
           ====================================== */}

        <div
          className="
            mt-5 flex
            min-w-0 flex-wrap
            items-center gap-2
          "
        >
          <Skeleton
            className="
              h-7 w-[72px]
              !rounded-lg
            "
          />

          <Skeleton
            className="
              h-7 w-[58px]
              !rounded-lg
            "
          />

          <Skeleton
            className="
              h-7 w-[84px]
              !rounded-lg
            "
          />
        </div>

        {/* ======================================
            SPACER
           ====================================== */}

        <div className="min-h-6 flex-1" />

        {/* ======================================
            STATS
           ====================================== */}

        <div
          className="
            mt-6
            grid grid-cols-3
            gap-2

            border-t border-slate-100
            pt-4

            dark:border-white/[0.06]
          "
        >
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="
                flex min-w-0
                flex-col
                items-center gap-2
              "
            >
              <Skeleton
                className="
                  h-3.5 w-3.5
                  !rounded-md
                "
              />

              <Skeleton
                className="
                  h-2.5 w-12
                  max-w-full
                "
              />
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================
          CARD FOOTER
         ========================================== */}

      <div
        className="
          flex min-w-0
          items-center
          justify-between gap-3

          border-t border-slate-100

          bg-slate-50/70

          px-4 py-3.5

          dark:border-white/[0.06]
          dark:bg-white/[0.025]

          sm:px-5
        "
      >
        {/* DATE */}
        <div
          className="
            flex min-w-0
            items-center gap-2
          "
        >
          <Skeleton
            className="
              h-3.5 w-3.5
              shrink-0
              !rounded-md
            "
          />

          <Skeleton className="h-2.5 w-20 max-w-full" />
        </div>

        {/* ACTION */}
        <Skeleton
          className="
            h-9 w-[95px]
            shrink-0
            !rounded-lg
          "
        />
      </div>
    </article>
  );
}

export default memo(MyProblemCardSkeleton);
