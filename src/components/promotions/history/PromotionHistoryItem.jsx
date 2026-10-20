
import React from "react";

import {
  AlertTriangle,
  CalendarClock,
  Clock3,
  Coins,
} from "lucide-react";
import { formatPrettyDate } from "../../../utils/formatDate"

import {
  cleanPromotionText,
  getPromotionDurationLabel,
  normalizePromotionStatus,
  safePromotionPositiveNumber,
} from "../../../utils/promotion";

import PromotionHistoryStatus from "./PromotionHistoryStatus";

// =========================================================
// FSOCIETY — PROMOTION HISTORY ITEM
// =========================================================
//
// Responsibilities:
// - Campaign plan name
// - Public campaign ID
// - Effective status
// - Start / expiration dates
// - FCoin spent
// - Promotion duration
// - Cancellation reason
// - Responsive Light / Dark UI
//
// No Redux, API or local state.
// =========================================================

// =========================================================
// HISTORY DATE FIELD
// =========================================================

const PromotionHistoryDate = React.memo(
  function PromotionHistoryDate({
    Icon,
    label,
    value,
  }) {
    const formattedDate =
      formatPrettyDate(value) || "—";

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
        {/* FIELD LABEL */}

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
              tracking-[0.08em]
            "
          >
            {label}
          </span>
        </div>

        {/* DATE VALUE */}

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
// HISTORY DETAIL BADGE
// =========================================================

const DETAIL_COLORS = {
  coins: `
    border-amber-200
    bg-amber-50
    text-amber-800

    dark:border-yellow-400/15
    dark:bg-yellow-400/[0.05]
    dark:text-yellow-300
  `,

  duration: `
    border-cyan-200
    bg-cyan-50
    text-cyan-800

    dark:border-cyan-400/15
    dark:bg-cyan-400/[0.045]
    dark:text-cyan-300
  `,
};

const PromotionHistoryDetail = React.memo(
  function PromotionHistoryDetail({
    Icon,
    label,
    value,
    variant = "coins",
  }) {
    const colorClass =
      DETAIL_COLORS[variant] ??
      DETAIL_COLORS.coins;

    return (
      <span
        aria-label={`${label}: ${value}`}
        className={`
          inline-flex
          min-h-8
          min-w-0
          max-w-full
          items-center
          gap-1.5
          rounded-lg
          border
          px-3
          py-2
          text-[11px]
          font-bold
          leading-4

          ${colorClass}
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
            [overflow-wrap:anywhere]
          "
        >
          {value}
        </span>
      </span>
    );
  }
);

// =========================================================
// MAIN HISTORY ITEM
// =========================================================

const PromotionHistoryItem = ({
  campaign,
  className = "",
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
  // CAMPAIGN STATUS
  // =======================================================

  const status = normalizePromotionStatus(
    campaign.effective_status ??
      campaign.status ??
      campaign.state
  );

  // =======================================================
  // PLAN DETAILS
  // =======================================================

  const planName = cleanPromotionText(
    campaign.plan_name,
    "Promotion"
  );

  const publicId = cleanPromotionText(
    campaign.public_id,
    `campaign-${campaign.id ?? "?"}`
  );

  // =======================================================
  // FCoin PRICE
  // =======================================================

  const price = safePromotionPositiveNumber(
    campaign.price_paid
  );

  // =======================================================
  // DURATION
  // =======================================================

  const duration = getPromotionDurationLabel({
    durationHours: campaign.duration_hours,
    days: campaign.days,
    durationLabel: campaign.duration_label,
  });

  // =======================================================
  // CANCELLATION REASON
  // =======================================================

  const cancelReason =
    typeof campaign.cancel_reason === "string"
      ? campaign.cancel_reason.trim()
      : "";

  const showCancelReason =
    status === "cancelled" &&
    Boolean(cancelReason);

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <article
      className={`
        relative
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-slate-50/75
        p-3.5
        shadow-sm
        transition-colors

        sm:p-4

        dark:border-white/[0.07]
        dark:bg-white/[0.025]
        dark:shadow-none

        ${className}
      `}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <div
        className="
          flex
          min-w-0
          flex-col
          items-start
          gap-3

          sm:flex-row
          sm:justify-between
        "
      >
        {/* PLAN NAME + PUBLIC ID */}

        <div className="min-w-0 w-full flex-1">
          <h4
            className="
              min-w-0
              break-words
              text-sm
              font-black
              leading-5
              text-slate-900

              dark:text-slate-100
            "
          >
            {planName}
          </h4>

          <p
            className="
              mt-1.5
              min-w-0
              break-all
              font-mono
              text-[10px]
              font-semibold
              leading-4
              tracking-wide
              text-slate-500

              dark:text-slate-500
            "
            title={publicId}
          >
            {publicId}
          </p>
        </div>

        {/* CAMPAIGN STATUS */}

        <PromotionHistoryStatus
          status={status}
        />
      </div>

      {/* =====================================
          CAMPAIGN DATES
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
        {/* START DATE */}

        <PromotionHistoryDate
          Icon={Clock3}
          label="Boshlangan"
          value={campaign.starts_at}
        />

        {/* EXPIRATION DATE */}

        <PromotionHistoryDate
          Icon={CalendarClock}
          label="Tugashi"
          value={campaign.expires_at}
        />
      </div>

      {/* =====================================
          PRICE + DURATION
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
        {/* FCoin SPENT */}

        <PromotionHistoryDetail
          Icon={Coins}
          label="Sarflangan"
          value={`${price} FCoin`}
          variant="coins"
        />

        {/* PROMOTION DURATION */}

        <PromotionHistoryDetail
          Icon={CalendarClock}
          label="Davomiylik"
          value={duration}
          variant="duration"
        />
      </div>

      {/* =====================================
          CANCELLATION REASON
      ===================================== */}

      {showCancelReason && (
        <div
          role="note"
          className="
            mt-3
            flex
            min-w-0
            items-start
            gap-2.5
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-3

            dark:border-red-400/15
            dark:bg-red-400/[0.045]
          "
        >
          {/* WARNING ICON */}

          <AlertTriangle
            size={16}
            className="
              mt-0.5
              shrink-0
              text-red-600

              dark:text-red-300
            "
            aria-hidden="true"
          />

          {/* REASON */}

          <div className="min-w-0 flex-1">
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-red-700

                dark:text-red-300
              "
            >
              Bekor qilish sababi
            </p>

            <p
              className="
                mt-1
                min-w-0
                whitespace-pre-wrap
                break-words
                [overflow-wrap:anywhere]
                text-[11px]
                font-medium
                leading-5
                text-red-800

                dark:text-red-200
              "
            >
              {cancelReason}
            </p>
          </div>
        </div>
      )}
    </article>
  );
};

export default React.memo(
  PromotionHistoryItem
);
