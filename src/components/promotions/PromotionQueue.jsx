
import React from "react";

import {
  CalendarClock,
  Clock3,
  Coins,
  Layers3,
  Rocket,
} from "lucide-react";

import {
  formatPromotionDateTime,
  getPromotionDurationLabel,
  safePromotionArray,
  safePromotionPositiveNumber,
} from "../../utils/promotion";

import PromotionQueueSkeleton from "./projectPromotion/skeletons/PromotionQueueSkeleton";

// =========================================================
// FSOCIETY — PROMOTION QUEUE
// =========================================================
//
// Existing props:
// - campaigns
//
// Optional new props:
// - isLoading
// - className
//
// Preserves:
// - Queue positions
// - Plan names
// - Scheduled status
// - Start / end dates
// - FCoin price
// - Promotion duration
// - Empty state
//
// Skeleton shown only when isLoading is true.
// No API or Redux logic inside this component.
// =========================================================

// =========================================================
// QUEUE DATE ITEM
// =========================================================

const PromotionQueueDate = React.memo(
  function PromotionQueueDate({
    Icon,
    label,
    value,
  }) {
    const formattedDate =
      formatPromotionDateTime(value) || "—";

    return (
      <div
        className="
          min-w-0
          rounded-xl
          border
          border-slate-200/80
          bg-white/75
          p-3

          dark:border-white/[0.06]
          dark:bg-black/10
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-1.5
            text-slate-500

            dark:text-slate-400
          "
        >
          <Icon
            size={13}
            className="shrink-0"
            aria-hidden="true"
          />

          <span
            className="
              min-w-0
              text-[10px]
              font-black
              uppercase
              tracking-wider
            "
          >
            {label}
          </span>
        </div>

        <p
          className="
            mt-2
            min-w-0
            break-words
            [overflow-wrap:anywhere]
            text-xs
            font-semibold
            leading-5
            text-slate-800

            dark:text-slate-200
          "
        >
          {formattedDate}
        </p>
      </div>
    );
  }
);

// =========================================================
// QUEUE ITEM
// =========================================================

const PromotionQueueItem = React.memo(
  function PromotionQueueItem({
    campaign,
    index,
  }) {
    const planName =
      typeof campaign.plan_name === "string" &&
      campaign.plan_name.trim()
        ? campaign.plan_name
        : "Promotion";

    const price = safePromotionPositiveNumber(
      campaign.price_paid
    );

    const duration = getPromotionDurationLabel({
      durationHours: campaign.duration_hours,
      days: campaign.days,
      durationLabel: campaign.duration_label,
    });

    return (
      <article
        className="
          relative
          w-full
          min-w-0
          max-w-full
          overflow-hidden
          rounded-2xl
          border
          border-indigo-200
          bg-indigo-50/65
          p-3.5
          shadow-sm

          sm:p-4

          dark:border-indigo-400/15
          dark:bg-indigo-400/[0.035]
          dark:shadow-none
        "
      >
        {/* DECORATIVE GLOW */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-12
            -top-12
            h-28
            w-28
            rounded-full
            bg-indigo-300/20
            blur-3xl

            dark:bg-indigo-400/[0.08]
          "
        />

        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            relative
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
              flex-[1_1_145px]
              items-center
              gap-3
            "
          >
            {/* ICON */}

            <div
              className="
                grid
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-xl
                border
                border-indigo-200
                bg-indigo-100
                text-indigo-700

                dark:border-indigo-400/15
                dark:bg-indigo-400/[0.08]
                dark:text-indigo-300
              "
            >
              <Rocket
                size={17}
                aria-hidden="true"
              />
            </div>

            {/* PLAN INFO */}

            <div className="min-w-0 flex-1">
              <h4
                className="
                  min-w-0
                  break-words
                  text-sm
                  font-black
                  leading-5
                  text-slate-900

                  dark:text-white
                "
              >
                {planName}
              </h4>

              <p
                className="
                  mt-1
                  font-mono
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-indigo-700

                  dark:text-indigo-300/80
                "
              >
                Navbat #{index + 1}
              </p>
            </div>
          </div>

          {/* SCHEDULED STATUS */}

          <span
            className="
              inline-flex
              min-h-7
              shrink-0
              items-center
              rounded-full
              border
              border-indigo-200
              bg-indigo-100
              px-2.5
              py-1
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-indigo-700

              dark:border-indigo-400/20
              dark:bg-indigo-400/[0.08]
              dark:text-indigo-300
            "
          >
            Scheduled
          </span>
        </div>

        {/* =====================================
            SCHEDULED DATES
        ===================================== */}

        <div
          className="
            relative
            mt-4
            grid
            min-w-0
            grid-cols-1
            gap-2

            sm:grid-cols-2
          "
        >
          <PromotionQueueDate
            Icon={Clock3}
            label="Boshlanadi"
            value={campaign.starts_at}
          />

          <PromotionQueueDate
            Icon={CalendarClock}
            label="Tugaydi"
            value={campaign.expires_at}
          />
        </div>

        {/* =====================================
            PRICE + DURATION
        ===================================== */}

        <div
          className="
            relative
            mt-3
            flex
            min-w-0
            flex-wrap
            items-center
            gap-2
          "
        >
          {/* FCoin PRICE */}

          <span
            className="
              inline-flex
              min-w-0
              max-w-full
              items-center
              gap-1.5
              rounded-lg
              border
              border-amber-200
              bg-amber-50
              px-3
              py-2
              text-[11px]
              font-black
              text-amber-800

              dark:border-yellow-400/15
              dark:bg-yellow-400/[0.05]
              dark:text-yellow-300
            "
          >
            <Coins
              size={14}
              className="shrink-0"
              aria-hidden="true"
            />

            <span className="break-all">
              {price}
            </span>

            <span className="shrink-0">
              FCoin
            </span>
          </span>

          {/* DURATION */}

          <span
            className="
              inline-flex
              min-w-0
              max-w-full
              items-center
              gap-1.5
              rounded-lg
              border
              border-cyan-200
              bg-cyan-50
              px-3
              py-2
              text-[11px]
              font-black
              text-cyan-800

              dark:border-cyan-400/15
              dark:bg-cyan-400/[0.045]
              dark:text-cyan-300
            "
          >
            <Clock3
              size={14}
              className="shrink-0"
              aria-hidden="true"
            />

            <span
              className="
                min-w-0
                break-words
              "
            >
              {duration}
            </span>
          </span>
        </div>
      </article>
    );
  }
);

// =========================================================
// EMPTY QUEUE
// =========================================================

const PromotionQueueEmpty = React.memo(
  function PromotionQueueEmpty() {
    return (
      <section
        aria-label="Promotion navbati"
        className="
          w-full
          min-w-0
          rounded-2xl
          border
          border-slate-200
          bg-white/85
          p-4

          sm:p-5

          dark:border-white/[0.07]
          dark:bg-white/[0.02]
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <div
            className="
              grid
              h-11
              w-11
              shrink-0
              place-items-center
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-500

              dark:border-white/[0.07]
              dark:bg-white/[0.03]
              dark:text-slate-400
            "
          >
            <Layers3
              size={19}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="
                text-sm
                font-black
                text-slate-900

                dark:text-slate-200
              "
            >
              Promotion navbati
            </h3>

            <p
              className="
                mt-1
                break-words
                text-xs
                font-medium
                leading-5
                text-slate-600

                dark:text-slate-400
              "
            >
              Hozir navbatda boshqa
              promotion yo'q.
            </p>
          </div>
        </div>
      </section>
    );
  }
);

// =========================================================
// MAIN PROMOTION QUEUE
// =========================================================

const PromotionQueue = ({
  campaigns = [],
  isLoading = false,
  className = "",
}) => {
  const queue = safePromotionArray(
    campaigns
  ).filter(
    (campaign) =>
      campaign &&
      typeof campaign === "object" &&
      !Array.isArray(campaign)
  );

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (isLoading) {
    return (
      <PromotionQueueSkeleton
        className={className}
      />
    );
  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (queue.length === 0) {
    return (
      <div className={className}>
        <PromotionQueueEmpty />
      </div>
    );
  }

  // ==========================================
  // QUEUE CONTENT
  // ==========================================

  return (
    <section
      aria-label="Promotion navbati"
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
      {/* HEADER */}

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
        <div className="min-w-0 flex-1">
          <p
            className="
              break-words
              font-mono
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-indigo-700

              dark:text-indigo-300/80
            "
          >
            Scheduled campaigns
          </p>

          <h3
            className="
              mt-1
              text-base
              font-black
              text-slate-900

              dark:text-white
            "
          >
            Promotion navbati
          </h3>
        </div>

        {/* COUNT */}

        <span
          className="
            inline-flex
            min-h-7
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-indigo-200
            bg-indigo-50
            px-3
            text-xs
            font-black
            tabular-nums
            text-indigo-700

            dark:border-indigo-400/20
            dark:bg-indigo-400/[0.06]
            dark:text-indigo-300
          "
        >
          {queue.length}
        </span>
      </div>

      {/* CAMPAIGNS */}

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-3
        "
      >
        {queue.map((campaign, index) => (
          <PromotionQueueItem
            key={
              campaign.public_id ??
              campaign.id ??
              index
            }
            campaign={campaign}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default React.memo(PromotionQueue);
