
import React from "react";

import {
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  safePromotionArray,
  safePromotionPositiveNumber,
} from "../../utils/promotion";

// =========================================================
// HISTORY COMPONENTS
// =========================================================

import PromotionHistoryHeader from "./history/PromotionHistoryHeader";

import PromotionHistoryStats from "./history/PromotionHistoryStats";

import PromotionHistoryItem from "./history/PromotionHistoryItem";

import PromotionHistoryEmpty from "./history/PromotionHistoryEmpty";

// =========================================================
// HISTORY SKELETON
// =========================================================

import PromotionHistorySkeleton from "./projectPromotion/skeletons/PromotionHistorySkeleton";

// =========================================================
// FSOCIETY — PROMOTION HISTORY
// =========================================================
//
// Existing props:
// - campaigns
// - totalSpent
// - totalPurchases
//
// Optional new props:
// - isLoading
// - isRefreshing
// - error
// - className
//
// Features:
// - Modular history components
// - Backend authoritative statistics
// - Campaign status and history
// - Skeleton loading
// - Background refresh indicator
// - Error / Empty states
// - Responsive Light / Dark Mode
//
// No API requests or Redux dispatch here.
// =========================================================

// =========================================================
// ERROR STATE
// =========================================================

const PromotionHistoryError = React.memo(
  function PromotionHistoryError({
    message,
  }) {
    return (
      <div
        role="alert"
        className="
          mt-5
          flex
          min-w-0
          items-start
          gap-3
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-4

          dark:border-red-400/15
          dark:bg-red-400/[0.045]
        "
      >
        <AlertTriangle
          size={18}
          className="
            mt-0.5
            shrink-0
            text-red-600

            dark:text-red-300
          "
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <p
            className="
              text-xs
              font-black
              text-red-800

              dark:text-red-200
            "
          >
            Promotion tarixi yuklanmadi
          </p>

          <p
            className="
              mt-1
              whitespace-pre-wrap
              break-words
              [overflow-wrap:anywhere]
              text-[11px]
              font-medium
              leading-5
              text-red-700

              dark:text-red-300
            "
          >
            {message}
          </p>
        </div>
      </div>
    );
  }
);

// =========================================================
// REFRESH INDICATOR
// =========================================================

const PromotionHistoryRefreshIndicator = React.memo(
  function PromotionHistoryRefreshIndicator() {
    return (
      <div
        role="status"
        aria-live="polite"
        className="
          mt-4
          flex
          min-w-0
          items-center
          gap-2
          rounded-xl
          border
          border-purple-200
          bg-purple-50
          px-3
          py-2.5

          dark:border-purple-400/15
          dark:bg-purple-400/[0.045]
        "
      >
        <Loader2
          size={15}
          className="
            shrink-0
            text-purple-600
            motion-safe:animate-spin

            dark:text-purple-300
          "
          aria-hidden="true"
        />

        <span
          className="
            min-w-0
            break-words
            text-[11px]
            font-semibold
            text-purple-800

            dark:text-purple-200
          "
        >
          Promotion tarixi yangilanmoqda...
        </span>
      </div>
    );
  }
);

// =========================================================
// MAIN PROMOTION HISTORY
// =========================================================

const PromotionHistory = ({
  campaigns = [],
  totalSpent = 0,
  totalPurchases = 0,

  isLoading = false,
  isRefreshing = false,

  error = null,

  className = "",
}) => {
  // =======================================================
  // SAFE HISTORY DATA
  // =======================================================

  const history = safePromotionArray(
    campaigns
  ).filter((campaign) => {
    return (
      campaign !== null &&
      typeof campaign === "object" &&
      !Array.isArray(campaign)
    );
  });

  // =======================================================
  // BACKEND STATISTICS
  // =======================================================

  const purchases =
    safePromotionPositiveNumber(
      totalPurchases
    );

  const spent =
    safePromotionPositiveNumber(
      totalSpent
    );

  const hasHistory = history.length > 0;

  const hasPastPurchases =
    purchases > 0;

  // =======================================================
  // ERROR MESSAGE
  // =======================================================

  const errorMessage =
    typeof error === "string"
      ? error.trim()
      : typeof error?.message === "string"
        ? error.message.trim()
        : "";

  // =======================================================
  // LOADING
  // =======================================================

  // Parent must pass isLoading for the initial
  // request only. Background refresh uses
  // isRefreshing so existing content remains.

  if (isLoading) {
    return (
      <PromotionHistorySkeleton
        count={3}
        className={className}
      />
    );
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section
      aria-label="Promotion tarixi"
      aria-busy={Boolean(isRefreshing)}
      className={`
        relative
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white/90
        p-4
        shadow-sm

        sm:p-5

        dark:border-white/[0.07]
        dark:bg-white/[0.02]
        dark:shadow-none

        ${className}
      `}
    >
      {/* =====================================
          HEADER + STATISTICS
      ===================================== */}

      <div
        className="
          flex
          min-w-0
          flex-col
          gap-4
        "
      >
        {/* HEADER */}

        <PromotionHistoryHeader />

        {/* STATISTICS */}

        <PromotionHistoryStats
          totalPurchases={purchases}
          totalSpent={spent}
        />
      </div>

      {/* =====================================
          BACKGROUND REFRESH
      ===================================== */}

      {isRefreshing && (
        <PromotionHistoryRefreshIndicator />
      )}

      {/* =====================================
          ERROR STATE
      ===================================== */}

      {errorMessage && (
        <PromotionHistoryError
          message={errorMessage}
        />
      )}

      {/* =====================================
          HISTORY CONTENT
      ===================================== */}

      {!hasHistory ? (
        !errorMessage && (
          <PromotionHistoryEmpty
            hasPastPurchases={hasPastPurchases}
            className="mt-5"
          />
        )
      ) : (
        <div
          className="
            mt-5
            grid
            min-w-0
            grid-cols-1
            gap-3
          "
        >
          {history.map((campaign, index) => {
            const campaignId =
              campaign.public_id ??
              campaign.id;

            const key =
              campaignId !== null &&
              campaignId !== undefined &&
              String(campaignId) !== ""
                ? String(campaignId)
                : `history-${index}`;

            return (
              <PromotionHistoryItem
                key={key}
                campaign={campaign}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default React.memo(PromotionHistory);
