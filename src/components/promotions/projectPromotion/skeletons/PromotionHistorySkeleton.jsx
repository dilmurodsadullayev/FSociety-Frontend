
import React from "react";

import {
  PromotionSkeletonBlock,
  PromotionSkeletonSurface,
} from "./PromotionSkeletonParts";

// =========================================================
// FSOCIETY — PROMOTION HISTORY SKELETON
// =========================================================
//
// Structure:
// - Promotion history header
// - Total purchases
// - Total FCoin spent
// - Campaign history cards
//
// Presentational component.
// No Redux, API, or business logic.
// =========================================================

// =========================================================
// HISTORY STATS SKELETON
// =========================================================

const PromotionHistoryStatSkeleton = React.memo(
  function PromotionHistoryStatSkeleton({
    tone = "default",
  }) {
    return (
      <PromotionSkeletonSurface
        className="
          min-w-0
          rounded-2xl
          p-3.5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <PromotionSkeletonBlock
            shape="rectangle"
            tone={tone}
            className="
              h-8
              w-8
              shrink-0
            "
          />

          <div
            className="
              min-w-0
              flex-1
              space-y-2
            "
          >
            <PromotionSkeletonBlock
              className="h-2 w-20"
            />

            <PromotionSkeletonBlock
              tone={tone}
              className="h-4 w-16"
            />
          </div>
        </div>
      </PromotionSkeletonSurface>
    );
  }
);

// =========================================================
// HISTORY ITEM SKELETON
// =========================================================

const PromotionHistoryItemSkeleton = React.memo(
  function PromotionHistoryItemSkeleton({
    index = 0,
  }) {
    return (
      <article
        aria-hidden="true"
        className="
          w-full
          min-w-0
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-slate-50/70
          p-3.5

          sm:p-4

          dark:border-white/[0.07]
          dark:bg-white/[0.025]
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            min-w-0
            flex-wrap
            items-start
            justify-between
            gap-3
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-[1_1_140px]
              items-start
              gap-3
            "
          >
            {/* PLAN ICON */}

            <PromotionSkeletonBlock
              shape="rectangle"
              tone={
                index % 2 === 0
                  ? "purple"
                  : "indigo"
              }
              className="
                h-10
                w-10
                shrink-0
              "
            />

            {/* PLAN NAME + DATE */}

            <div
              className="
                min-w-0
                flex-1
                space-y-2.5
              "
            >
              <PromotionSkeletonBlock
                className="
                  h-3.5
                  w-32
                "
              />

              <PromotionSkeletonBlock
                className="
                  h-2
                  w-28
                "
              />
            </div>
          </div>

          {/* STATUS BADGE */}

          <PromotionSkeletonBlock
            shape="rectangle"
            tone="emerald"
            className="
              h-6
              w-20
              shrink-0
            "
          />
        </div>

        {/* DETAILS */}

        <div
          className="
            mt-4
            grid
            min-w-0
            grid-cols-2
            gap-2
          "
        >
          {/* FCoin */}

          <PromotionSkeletonSurface
            className="
              rounded-xl
              p-3
            "
          >
            <PromotionSkeletonBlock
              className="
                h-2
                w-14
              "
            />

            <PromotionSkeletonBlock
              tone="amber"
              className="
                mt-2.5
                h-3.5
                w-20
              "
            />
          </PromotionSkeletonSurface>

          {/* DURATION */}

          <PromotionSkeletonSurface
            className="
              rounded-xl
              p-3
            "
          >
            <PromotionSkeletonBlock
              className="
                h-2
                w-16
              "
            />

            <PromotionSkeletonBlock
              tone="purple"
              className="
                mt-2.5
                h-3.5
                w-20
              "
            />
          </PromotionSkeletonSurface>
        </div>

        {/* FOOTER */}

        <div
          className="
            mt-4
            flex
            min-w-0
            flex-wrap
            items-center
            justify-between
            gap-3
            border-t
            border-slate-200/80
            pt-3

            dark:border-white/[0.06]
          "
        >
          <PromotionSkeletonBlock
            className="
              h-2
              w-28
            "
          />

          <PromotionSkeletonBlock
            className="
              h-2
              w-16
            "
          />
        </div>
      </article>
    );
  }
);

// =========================================================
// MAIN HISTORY SKELETON
// =========================================================

const PromotionHistorySkeleton = ({
  count = 3,
  className = "",
}) => {
  const itemCount = Number.isInteger(count)
    ? Math.min(6, Math.max(1, count))
    : 3;

  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Promotion tarixi yuklanmoqda"
      className={`
        w-full
        min-w-0
        max-w-full
        rounded-3xl
        border
        border-slate-200
        bg-white/90
        p-4

        sm:p-5

        dark:border-white/[0.07]
        dark:bg-white/[0.02]

        ${className}
      `}
    >
      <span className="sr-only">
        Promotion xaridlari tarixi
        yuklanmoqda...
      </span>

      <div
        aria-hidden="true"
        className="motion-safe:animate-pulse"
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            mb-4
            flex
            min-w-0
            items-center
            justify-between
            gap-3
          "
        >
          <div
            className="
              min-w-0
              flex-1
              space-y-2.5
            "
          >
            <PromotionSkeletonBlock
              tone="purple"
              className="h-2.5 w-32"
            />

            <PromotionSkeletonBlock
              className="h-4 w-40"
            />
          </div>

          <PromotionSkeletonBlock
            shape="rectangle"
            className="
              h-8
              w-8
              shrink-0
            "
          />
        </div>

        {/* =====================================
            HISTORY STATISTICS
        ===================================== */}

        <div
          className="
            grid
            min-w-0
            grid-cols-2
            gap-2
          "
        >
          <PromotionHistoryStatSkeleton
            tone="indigo"
          />

          <PromotionHistoryStatSkeleton
            tone="amber"
          />
        </div>

        {/* =====================================
            SECTION DIVIDER
        ===================================== */}

        <div
          className="
            my-5
            border-t
            border-slate-200/80

            dark:border-white/[0.06]
          "
        />

        {/* HISTORY ITEMS */}

        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-3
          "
        >
          {Array.from(
            { length: itemCount },
            (_, index) => (
              <PromotionHistoryItemSkeleton
                key={index}
                index={index}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(
  PromotionHistorySkeleton
);
