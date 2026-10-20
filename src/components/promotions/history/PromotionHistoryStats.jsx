
import React from "react";

import {
  Coins,
  ShoppingBag,
} from "lucide-react";

import {
  safePromotionPositiveNumber,
} from "../../../utils/promotion";

// =========================================================
// FSOCIETY — PROMOTION HISTORY STATS
// =========================================================
//
// Responsibilities:
// - Total promotion purchases
// - Total FCoin spent
// - Responsive statistics
// - Light / Dark Mode
//
// Important:
// Statistics come from the backend.
//
// Do not calculate totals from the currently
// visible campaign history array.
// =========================================================

// =========================================================
// NUMBER FORMAT
// =========================================================

const formatStatNumber = (value) => {
  const number = safePromotionPositiveNumber(
    value
  );

  return number.toLocaleString("uz-UZ", {
    maximumFractionDigits: 10,
  });
};

// =========================================================
// STAT CONFIG
// =========================================================

const STAT_STYLES = {
  purchases: {
    iconBackground: `
      border-indigo-200
      bg-indigo-100
      text-indigo-700

      dark:border-indigo-400/15
      dark:bg-indigo-400/[0.08]
      dark:text-indigo-300
    `,

    valueColor: `
      text-slate-900
      dark:text-white
    `,
  },

  spent: {
    iconBackground: `
      border-amber-200
      bg-amber-100
      text-amber-700

      dark:border-yellow-400/15
      dark:bg-yellow-400/[0.07]
      dark:text-yellow-300
    `,

    valueColor: `
      text-amber-800
      dark:text-yellow-300
    `,
  },
};

// =========================================================
// SINGLE STAT CARD
// =========================================================

const PromotionHistoryStatItem = React.memo(
  function PromotionHistoryStatItem({
    Icon,
    label,
    value,
    suffix = "",
    variant = "purchases",
  }) {
    const styles =
      STAT_STYLES[variant] ??
      STAT_STYLES.purchases;

    return (
      <div
        className="
          flex
          min-w-0
          items-center
          gap-2.5
          rounded-xl
          border
          border-slate-200
          bg-slate-50/80
          p-3
          shadow-sm

          dark:border-white/[0.07]
          dark:bg-white/[0.025]
          dark:shadow-none
        "
      >
        {/* ICON */}

        <div
          className={`
            grid
            h-9
            w-9
            shrink-0
            place-items-center
            rounded-xl
            border

            ${styles.iconBackground}
          `}
        >
          <Icon
            size={16}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </div>

        {/* STAT CONTENT */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          {/* LABEL */}

          <dt
            className="
              break-words
              text-[9px]
              font-black
              uppercase
              tracking-[0.08em]
              text-slate-500

              dark:text-slate-400
            "
          >
            {label}
          </dt>

          {/* VALUE */}

          <dd
            className={`
              mt-1
              min-w-0
              break-words
              [overflow-wrap:anywhere]
              text-sm
              font-black
              leading-5
              tabular-nums

              ${styles.valueColor}
            `}
          >
            {value}

            {suffix && (
              <span
                className="
                  ml-1
                  text-[10px]
                  font-bold
                  opacity-80
                "
              >
                {suffix}
              </span>
            )}
          </dd>
        </div>
      </div>
    );
  }
);

// =========================================================
// MAIN HISTORY STATS
// =========================================================

const PromotionHistoryStats = ({
  totalPurchases = 0,
  totalSpent = 0,
  className = "",
}) => {
  // =======================================================
  // SAFE BACKEND VALUES
  // =======================================================

  const purchases = formatStatNumber(
    totalPurchases
  );

  const spent = formatStatNumber(
    totalSpent
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <dl
      aria-label="Promotion statistikasi"
      className={`
        grid
        w-full
        min-w-0
        grid-cols-2
        gap-2

        sm:w-auto
        sm:min-w-[280px]

        ${className}
      `}
    >
      {/* TOTAL PURCHASES */}

      <PromotionHistoryStatItem
        Icon={ShoppingBag}
        label="Xaridlar"
        value={purchases}
        variant="purchases"
      />

      {/* TOTAL SPENT */}

      <PromotionHistoryStatItem
        Icon={Coins}
        label="Sarflangan"
        value={spent}
        suffix="FCoin"
        variant="spent"
      />
    </dl>
  );
};

export default React.memo(
  PromotionHistoryStats
);
