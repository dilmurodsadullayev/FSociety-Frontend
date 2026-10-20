
import React from "react";

import {
  PromotionSkeletonBlock,
  PromotionSkeletonSurface,
} from "./PromotionSkeletonParts";

// =========================================================
// FSOCIETY — ACTIVE PROMOTION SKELETON
// =========================================================
//
// Matches PromotionActiveCard.jsx structure:
//
// - Campaign header
// - Active status
// - Plan name
// - Countdown
// - FCoin spent
// - Duration
// - Priority
// - Start date
//
// Responsive + Light / Dark Mode.
// =========================================================

// =========================================================
// STAT ITEM SKELETON
// =========================================================

const PromotionActiveStatSkeleton = React.memo(
  function PromotionActiveStatSkeleton() {
    return (
      <PromotionSkeletonSurface>
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <PromotionSkeletonBlock
            shape="circle"
            className="h-4 w-4 shrink-0"
          />

          <PromotionSkeletonBlock
            className="h-2.5 w-20"
          />
        </div>

        <PromotionSkeletonBlock
          className="mt-3 h-4 w-28"
        />
      </PromotionSkeletonSurface>
    );
  }
);

// =========================================================
// COUNTDOWN SKELETON
// =========================================================

const PromotionActiveCountdownSkeleton = React.memo(
  function PromotionActiveCountdownSkeleton() {
    return (
      <div
        aria-hidden="true"
        className="
          mt-5
          min-w-0
          rounded-2xl
          border
          border-emerald-200
          bg-emerald-50/80
          p-3.5

          sm:p-4

          dark:border-emerald-400/10
          dark:bg-black/15
        "
      >
        <PromotionSkeletonBlock
          tone="emerald"
          className="mb-4 h-2.5 w-36"
        />

        <div
          className="
            grid
            grid-cols-4
            gap-1.5

            sm:gap-2
          "
        >
          {Array.from(
            { length: 4 },
            (_, index) => (
              <div
                key={index}
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-emerald-200/80
                  bg-white/60
                  px-1.5
                  py-3

                  dark:border-emerald-400/10
                  dark:bg-emerald-500/[0.045]
                "
              >
                <PromotionSkeletonBlock
                  tone="emerald"
                  className="
                    mx-auto
                    h-4
                    w-7
                  "
                />

                <PromotionSkeletonBlock
                  className="
                    mx-auto
                    mt-2
                    h-1.5
                    w-5
                  "
                />
              </div>
            )
          )}
        </div>
      </div>
    );
  }
);

// =========================================================
// MAIN ACTIVE SKELETON
// =========================================================

const PromotionActiveSkeleton = ({
  className = "",
}) => {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`
        relative
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-3xl
        border
        border-emerald-200
        bg-gradient-to-br
        from-emerald-50
        via-white
        to-cyan-50/70
        p-4

        sm:p-5

        dark:border-emerald-400/15
        dark:from-emerald-500/[0.065]
        dark:via-[#0b1018]
        dark:to-cyan-500/[0.035]

        ${className}
      `}
    >
      <span className="sr-only">
        Aktiv promotion ma'lumotlari
        yuklanmoqda...
      </span>

      {/* =====================================
          ANIMATED SKELETON CONTENT
      ===================================== */}

      <div
        aria-hidden="true"
        className="motion-safe:animate-pulse"
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-3
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-1
              items-start
              gap-3
            "
          >
            {/* ICON */}

            <PromotionSkeletonBlock
              shape="rectangle"
              tone="emerald"
              className="
                h-11
                w-11
                shrink-0
              "
            />

            {/* TITLE AND BADGE */}

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <PromotionSkeletonBlock
                tone="emerald"
                className="
                  h-6
                  w-28
                "
              />

              <PromotionSkeletonBlock
                className="
                  mt-3
                  h-4
                  w-40
                "
              />

              <PromotionSkeletonBlock
                className="
                  mt-2
                  h-2.5
                  w-24
                "
              />
            </div>
          </div>

          {/* REFRESH PLACEHOLDER */}

          <PromotionSkeletonBlock
            shape="rectangle"
            className="
              h-11
              w-11
              shrink-0
            "
          />
        </div>

        {/* =====================================
            COUNTDOWN
        ===================================== */}

        <PromotionActiveCountdownSkeleton />

        {/* =====================================
            STATISTICS
        ===================================== */}

        <div
          className="
            mt-4
            grid
            min-w-0
            grid-cols-1
            gap-2

            sm:grid-cols-2
          "
        >
          {Array.from(
            { length: 4 },
            (_, index) => (
              <PromotionActiveStatSkeleton
                key={index}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(
  PromotionActiveSkeleton
);
