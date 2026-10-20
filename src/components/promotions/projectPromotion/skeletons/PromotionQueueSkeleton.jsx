
import React from "react";

import {
  PromotionSkeletonBlock,
  PromotionSkeletonSurface,
} from "./PromotionSkeletonParts";

// =========================================================
// FSOCIETY — PROMOTION QUEUE SKELETON
// =========================================================
//
// Mirrors PromotionQueue.jsx:
//
// - Scheduled campaigns header
// - Queue count badge
// - Campaign icon
// - Plan name and position
// - Scheduled status
// - Start date
// - End date
// - FCoin price
// - Duration
//
// No API, Redux or timers.
// =========================================================

// =========================================================
// TIME CARD SKELETON
// =========================================================

const PromotionQueueTimeSkeleton = React.memo(
  function PromotionQueueTimeSkeleton() {
    return (
      <PromotionSkeletonSurface
        className="
          min-w-0
          rounded-xl
          p-3
        "
      >
        {/* LABEL */}

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
            className="
              h-3
              w-3
              shrink-0
            "
          />

          <PromotionSkeletonBlock
            className="
              h-2
              w-20
            "
          />
        </div>

        {/* DATE AND TIME */}

        <PromotionSkeletonBlock
          className="
            mt-3
            h-3
            w-full
            max-w-32
          "
        />
      </PromotionSkeletonSurface>
    );
  }
);

// =========================================================
// QUEUE ITEM SKELETON
// =========================================================

const PromotionQueueItemSkeleton = React.memo(
  function PromotionQueueItemSkeleton() {
    return (
      <article
        className="
          relative
          w-full
          min-w-0
          overflow-hidden
          rounded-2xl
          border
          border-indigo-200/80
          bg-indigo-50/50
          p-4

          dark:border-indigo-400/10
          dark:bg-indigo-400/[0.025]
        "
      >
        {/* =====================================
            HEADER
        ===================================== */}

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
              flex-[1_1_150px]
              items-center
              gap-3
            "
          >
            {/* CAMPAIGN ICON */}

            <PromotionSkeletonBlock
              shape="rectangle"
              tone="indigo"
              className="
                h-9
                w-9
                shrink-0
              "
            />

            {/* CAMPAIGN NAME + POSITION */}

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <PromotionSkeletonBlock
                className="
                  h-3.5
                  w-28
                "
              />

              <PromotionSkeletonBlock
                tone="indigo"
                className="
                  mt-2.5
                  h-2
                  w-20
                "
              />
            </div>
          </div>

          {/* SCHEDULED BADGE */}

          <PromotionSkeletonBlock
            shape="rectangle"
            tone="indigo"
            className="
              h-6
              w-20
              shrink-0
            "
          />
        </div>

        {/* =====================================
            START + END TIMES
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
          <PromotionQueueTimeSkeleton />

          <PromotionQueueTimeSkeleton />
        </div>

        {/* =====================================
            FOOTER — PRICE + DURATION
        ===================================== */}

        <div
          className="
            mt-3
            flex
            min-w-0
            flex-wrap
            items-center
            gap-2
          "
        >
          {/* FCoin */}

          <PromotionSkeletonBlock
            shape="rectangle"
            tone="amber"
            className="
              h-7
              w-24
            "
          />

          {/* Duration */}

          <PromotionSkeletonBlock
            shape="rectangle"
            tone="purple"
            className="
              h-7
              w-24
            "
          />
        </div>
      </article>
    );
  }
);

// =========================================================
// MAIN QUEUE SKELETON
// =========================================================

const PromotionQueueSkeleton = ({
  count = 2,
  className = "",
}) => {
  const itemCount = Number.isInteger(count)
    ? Math.min(4, Math.max(1, count))
    : 2;

  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Promotion navbati yuklanmoqda"
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

        dark:border-white/[0.06]
        dark:bg-white/[0.02]

        ${className}
      `}
    >
      <span className="sr-only">
        Promotion navbati yuklanmoqda...
      </span>

      <div
        aria-hidden="true"
        className="motion-safe:animate-pulse"
      >
        {/* =====================================
            SECTION HEADER
        ===================================== */}

        <div
          className="
            mb-4
            flex
            min-w-0
            items-start
            justify-between
            gap-3
          "
        >
          <div className="min-w-0 flex-1">
            {/* SMALL LABEL */}

            <PromotionSkeletonBlock
              tone="indigo"
              className="
                h-2.5
                w-36
              "
            />

            {/* TITLE */}

            <PromotionSkeletonBlock
              className="
                mt-3
                h-4
                w-40
              "
            />
          </div>

          {/* COUNT BADGE */}

          <PromotionSkeletonBlock
            shape="rectangle"
            tone="indigo"
            className="
              h-6
              w-9
              shrink-0
            "
          />
        </div>

        {/* =====================================
            QUEUED CAMPAIGNS
        ===================================== */}

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
              <PromotionQueueItemSkeleton
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
  PromotionQueueSkeleton
);
