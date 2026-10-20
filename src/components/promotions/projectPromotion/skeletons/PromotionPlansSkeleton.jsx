
import React from "react";

import {
  PromotionSkeletonBlock,
  PromotionSkeletonSurface,
} from "./PromotionSkeletonParts";

// =========================================================
// FSOCIETY — PROMOTION PLANS SKELETON
// =========================================================
//
// Mirrors PromotionPlanCard.jsx:
//
// - Section header
// - Plan icon
// - Popular badge placeholder
// - Selected indicator
// - Plan name and description
// - Duration
// - FCoin price
//
// No Redux, API or local state.
// =========================================================

// =========================================================
// PLAN CARD SKELETON
// =========================================================

const PromotionPlanCardSkeleton = React.memo(
  function PromotionPlanCardSkeleton() {
    return (
      <PromotionSkeletonSurface
        className="
          relative
          w-full
          min-w-0
          overflow-hidden
          p-4
        "
      >
        {/* =====================================
            PLAN HEADER
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
          {/* PLAN ICON */}

          <PromotionSkeletonBlock
            shape="rectangle"
            tone="purple"
            className="
              h-10
              w-10
              shrink-0
            "
          />

          {/* BADGE + SELECTION */}

          <div
            className="
              flex
              min-w-0
              items-center
              justify-end
              gap-2
            "
          >
            <PromotionSkeletonBlock
              shape="rectangle"
              tone="indigo"
              className="
                h-6
                w-16
              "
            />

            <PromotionSkeletonBlock
              shape="circle"
              className="
                h-6
                w-6
                shrink-0
              "
            />
          </div>
        </div>

        {/* =====================================
            PLAN NAME
        ===================================== */}

        <PromotionSkeletonBlock
          className="
            mt-4
            h-4
            w-32
          "
        />

        {/* =====================================
            DESCRIPTION
        ===================================== */}

        <div className="mt-3 space-y-2">
          <PromotionSkeletonBlock
            className="
              h-2.5
              w-full
            "
          />

          <PromotionSkeletonBlock
            className="
              h-2.5
              w-4/5
            "
          />
        </div>

        {/* =====================================
            DURATION + PRICE
        ===================================== */}

        <div
          className="
            mt-4
            grid
            min-w-0
            grid-cols-2
            gap-3
            border-t
            border-slate-200/80
            pt-4

            dark:border-white/[0.06]
          "
        >
          {/* DURATION */}

          <div className="min-w-0">
            <PromotionSkeletonBlock
              className="
                h-2
                w-16
              "
            />

            <PromotionSkeletonBlock
              className="
                mt-2.5
                h-3
                w-24
              "
            />
          </div>

          {/* FCoin PRICE */}

          <div
            className="
              flex
              min-w-0
              flex-col
              items-end
            "
          >
            <PromotionSkeletonBlock
              className="
                h-2
                w-12
              "
            />

            <PromotionSkeletonBlock
              tone="amber"
              className="
                mt-2.5
                h-3
                w-20
              "
            />
          </div>
        </div>
      </PromotionSkeletonSurface>
    );
  }
);

// =========================================================
// MAIN PLANS SKELETON
// =========================================================

const PromotionPlansSkeleton = ({
  count = 2,
  className = "",
}) => {
  // Keep skeleton count predictable and bounded.
  const itemCount = Number.isInteger(count)
    ? Math.min(4, Math.max(1, count))
    : 2;

  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Promotion rejalari yuklanmoqda"
      className={`
        mt-6
        w-full
        min-w-0
        ${className}
      `}
    >
      <span className="sr-only">
        Promotion rejalari yuklanmoqda...
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
            mb-3
            flex
            min-w-0
            items-center
            justify-between
            gap-3
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
              tone="purple"
              className="
                h-4
                w-4
                shrink-0
              "
            />

            <PromotionSkeletonBlock
              className="
                h-3
                w-36
              "
            />
          </div>

          <PromotionSkeletonBlock
            shape="rectangle"
            tone="indigo"
            className="
              h-6
              w-16
              shrink-0
            "
          />
        </div>

        {/* =====================================
            PLAN CARDS
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
              <PromotionPlanCardSkeleton
                key={index}
              />
            )
          )}
        </div>

        {/* =====================================
            PURCHASE BUTTON PLACEHOLDER
        ===================================== */}

        <PromotionSkeletonBlock
          shape="rectangle"
          tone="purple"
          className="
            mt-4
            h-12
            w-full
          "
        />
      </div>
    </section>
  );
};

export default React.memo(
  PromotionPlansSkeleton
);
