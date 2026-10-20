
import React from "react";

import {
  CalendarClock,
  Coins,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Zap,
} from "lucide-react";

import CountdownTimer from "../../utils/countdowntimer";

import { formatPrettyDate } from "../../utils/formatDate"
import {
  getPromotionDurationLabel,
  safePromotionPositiveNumber,
} from "../../utils/promotion";

// =========================================================
// FSOCIETY — ACTIVE PROMOTION CARD
// =========================================================

// =========================================================
// INFO ITEM
// =========================================================

const PromotionInfoItem = ({
  Icon,
  label,
  value,
  iconClassName = "",
  valueClassName = "",
}) => {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-slate-200/80
        bg-white/75
        p-3.5

        dark:border-white/[0.055]
        dark:bg-white/[0.02]
      "
    >
      <div
        className={`
          flex
          min-w-0
          items-center
          gap-2

          ${iconClassName}
        `}
      >
        <Icon
          size={14}
          className="shrink-0"
          aria-hidden="true"
        />

        <span
          className="
            min-w-0
            break-words
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
        className={`
          mt-2
          min-w-0
          break-words
          text-sm
          font-black
          leading-5
          text-slate-900

          dark:text-white

          ${valueClassName}
        `}
      >
        {value}
      </p>
    </div>
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const PromotionActiveCard = ({
  campaign,
  promotionExpiresAt = null,
  onRefresh = null,
  isRefreshing = false,
}) => {
  // =======================================================
  // VALIDATION
  // =======================================================

  if (
    !campaign ||
    typeof campaign !== "object" ||
    Array.isArray(campaign)
  ) {
    return null;
  }

  // =======================================================
  // CAMPAIGN DATA
  // =======================================================

  const expiresAt =
    promotionExpiresAt ??
    campaign.expires_at ??
    null;

  const startsAt =
    campaign.starts_at ?? null;

  const planName =
    typeof campaign.plan_name === "string" &&
    campaign.plan_name.trim()
      ? campaign.plan_name
      : "Promotion";

  const duration = getPromotionDurationLabel({
    durationHours: campaign.duration_hours,
    days: campaign.days,
    durationLabel: campaign.duration_label,
  });

  const price = safePromotionPositiveNumber(
    campaign.price_paid
  );

  const priority = safePromotionPositiveNumber(
    campaign.priority
  );

  const formattedStart =
    formatPrettyDate(startsAt) || "—";

  const canRefresh =
    typeof onRefresh === "function";

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section
      aria-label="Aktiv promotion"
      className="
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
        shadow-[0_20px_60px_rgba(16,185,129,0.06)]

        sm:p-5

        dark:border-emerald-400/15
        dark:from-emerald-500/[0.065]
        dark:via-[#0b1018]
        dark:to-cyan-500/[0.035]
        dark:shadow-[0_20px_70px_rgba(16,185,129,0.06)]
      "
    >
      {/* =====================================
          DECORATION
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-44
          w-44
          rounded-full
          bg-emerald-400/10
          blur-3xl

          dark:bg-emerald-400/[0.06]
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
          items-start
          justify-between
          gap-3
        "
      >
        {/* HEADER CONTENT */}

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

          <div
            className="
              grid
              h-11
              w-11
              shrink-0
              place-items-center
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-100
              text-emerald-700

              dark:border-emerald-400/15
              dark:bg-emerald-400/[0.07]
              dark:text-emerald-300
            "
          >
            <Rocket
              size={20}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>

          {/* CAMPAIGN INFO */}

          <div className="min-w-0 flex-1">
            {/* ACTIVE BADGE */}

            <div
              className="
                inline-flex
                max-w-full
                items-center
                gap-1.5
                rounded-full
                border
                border-emerald-200
                bg-emerald-100
                px-2.5
                py-1
                text-[9px]
                font-black
                uppercase
                tracking-wider
                text-emerald-800

                dark:border-emerald-400/15
                dark:bg-emerald-400/[0.05]
                dark:text-emerald-300
              "
            >
              <ShieldCheck
                size={12}
                className="shrink-0"
                aria-hidden="true"
              />

              <span className="break-words">
                Active promotion
              </span>
            </div>

            {/* PLAN NAME */}

            <h3
              className="
                mt-2
                min-w-0
                break-words
                text-lg
                font-black
                leading-6
                text-slate-900

                dark:text-white
              "
            >
              {planName}
            </h3>
          </div>
        </div>

        {/* REFRESH BUTTON */}

        {canRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label={
              isRefreshing
                ? "Promotion yangilanmoqda"
                : "Promotion ma'lumotlarini yangilash"
            }
            aria-busy={Boolean(isRefreshing)}
            title="Promotion ma'lumotlarini yangilash"
            className="
              grid
              h-11
              w-11
              shrink-0
              place-items-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-500
              transition-colors

              hover:border-emerald-300
              hover:bg-emerald-50
              hover:text-emerald-700

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
              focus-visible:ring-offset-2

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:border-white/[0.08]
              dark:bg-white/[0.025]
              dark:text-slate-400

              dark:hover:border-emerald-400/15
              dark:hover:bg-emerald-400/[0.045]
              dark:hover:text-emerald-300

              dark:focus-visible:ring-emerald-400
              dark:focus-visible:ring-offset-[#0b1018]
            "
          >
            <RefreshCw
              size={16}
              className={
                isRefreshing
                  ? "motion-safe:animate-spin"
                  : ""
              }
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* =====================================
          COUNTDOWN TIMER
      ===================================== */}

      {expiresAt && (
        <div
          className="
            relative
            mt-5
            min-w-0
            overflow-hidden
            rounded-2xl
            border
            border-emerald-400/15
            bg-slate-950
            p-3.5

            sm:p-4

            dark:border-emerald-400/10
            dark:bg-black/15
          "
        >
          <p
            className="
              mb-3
              font-mono
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-emerald-300
            "
          >
            Reklama tugashigacha
          </p>

          <CountdownTimer
            targetDate={expiresAt}
            variant="cards"
            tone="emerald"
            size="sm"
            showLabel={false}
            showIcon={false}
            expiredText="Promotion tugagan"
          />
        </div>
      )}

      {/* =====================================
          CAMPAIGN STATISTICS
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
        {/* PRICE */}

        <PromotionInfoItem
          Icon={Coins}
          label="Sarflandi"
          value={`${price} FCoin`}
          iconClassName="
            text-amber-700
            dark:text-yellow-300
          "
        />

        {/* DURATION */}

        <PromotionInfoItem
          Icon={CalendarClock}
          label="Davomiylik"
          value={duration}
          iconClassName="
            text-cyan-700
            dark:text-cyan-300
          "
        />

        {/* PRIORITY */}

        <PromotionInfoItem
          Icon={Zap}
          label="Priority"
          value={priority}
          iconClassName="
            text-indigo-700
            dark:text-indigo-300
          "
        />

        {/* START DATE */}

        <PromotionInfoItem
          Icon={CalendarClock}
          label="Boshlangan"
          value={formattedStart}
          iconClassName="
            text-slate-600
            dark:text-slate-400
          "
          valueClassName="
            text-xs
            font-bold
            leading-5
            text-slate-700

            dark:text-slate-300
          "
        />
      </div>
    </section>
  );
};

export default React.memo(PromotionActiveCard);
