
import React, { memo } from "react";

import {
  Coins,
  Eye,
  MessageCircle,
  Star,
} from "lucide-react";

// =========================================================
// FSOCIETY — MY PROBLEM CARD STATS
// =========================================================
//
// New Design — Larger Compact Card
//
// Features:
// - Views
// - Responses
// - Stars
// - FCoin reward
// - Light / Dark Mode
// - Responsive 320px+
// - One horizontal row
// - Accessible statistics
// - Safe numeric values
// - Compact number formatting
// - No unnecessary API calls
//
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const normalizeCount = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.trunc(number)
  );
};

// =========================================================
// FULL COUNT
// =========================================================

const formatFullCount = (
  value
) => {
  return normalizeCount(
    value
  ).toLocaleString("uz-UZ");
};

// =========================================================
// COMPACT COUNT
// =========================================================
//
// 124       -> 124
// 1,200     -> 1.2K
// 12,000    -> 12K
// 1,500,000 -> 1.5M
//
// =========================================================

const formatCompactCount = (
  value
) => {
  const count = normalizeCount(
    value
  );

  if (count < 1000) {
    return String(count);
  }

  return new Intl.NumberFormat(
    "en",
    {
      notation: "compact",
      maximumFractionDigits: 1,
    }
  ).format(count);
};

// =========================================================
// STAT CONFIGURATION
// =========================================================

const STAT_CONFIG = {
  views: {
    label: "Ko‘rishlar",

    Icon: Eye,

    colorClass: [
      "text-slate-500",
      "dark:text-slate-300",
    ].join(" "),
  },

  responses: {
    label: "Yechimlar",

    Icon: MessageCircle,

    colorClass: [
      "text-slate-500",
      "dark:text-slate-300",
    ].join(" "),
  },

  stars: {
    label: "Yulduzlar",

    Icon: Star,

    colorClass: [
      "text-slate-500",
      "dark:text-slate-300",
    ].join(" "),
  },

  coins: {
    label: "FCoin mukofoti",

    Icon: Coins,

    colorClass: [
      "text-amber-500",
      "dark:text-amber-400",
    ].join(" "),
  },
};

// =========================================================
// SINGLE STAT ITEM
// =========================================================

const StatItem = memo(
  function StatItem({
    type,
    value = 0,
  }) {
    // ===================================================
    // CONFIG
    // ===================================================

    const config =
      STAT_CONFIG[type];

    if (!config) {
      return null;
    }

    const {
      label,
      Icon,
      colorClass,
    } = config;

    // ===================================================
    // VALUE
    // ===================================================

    const safeValue =
      normalizeCount(value);

    const compactValue =
      formatCompactCount(
        safeValue
      );

    const fullValue =
      formatFullCount(
        safeValue
      );

    // ===================================================
    // RENDER
    // ===================================================

    return (
      <div
        title={`${label}: ${fullValue}`}
        className="
          flex min-w-0
          items-center
          justify-center

          gap-1.5

          sm:gap-2
        "
      >
        {/* ======================================
            STAT LABEL
           ====================================== */}

        <dt className="sr-only">
          {label}
        </dt>

        {/* ======================================
            ICON + NUMBER
           ====================================== */}

        <dd
          className="
            inline-flex
            min-w-0
            items-center
            justify-center
            gap-1.5

            font-mono
            text-[11px]
            font-bold
            tabular-nums

            text-slate-700

            dark:text-slate-200

            sm:text-[12px]
          "
        >
          <Icon
            size={15}
            strokeWidth={1.9}
            className={`
              shrink-0
              ${colorClass}
            `}
            aria-hidden="true"
          />

          <span className="min-w-0 truncate">
            {compactValue}
          </span>
        </dd>
      </div>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemCardStats({
  views = 0,
  responseCount = 0,
  star = 0,
  offeredCoins = 0,

  className = "",
}) {
  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      aria-label="Muammo statistikasi"
      className={`
        relative
        mt-auto
        w-full min-w-0

        border-t
        border-slate-200/80

        bg-slate-50/30

        px-3
        py-3

        dark:border-white/[0.09]
        dark:bg-white/[0.015]

        sm:px-4

        ${className}
      `}
    >
      {/* ==========================================
          STATS ROW
         ========================================== */}

      <dl
        className="
          grid min-w-0
          grid-cols-4

          items-center

          gap-1

          sm:gap-2
        "
      >
        {/* ======================================
            VIEWS
           ====================================== */}

        <StatItem
          type="views"
          value={views}
        />

        {/* ======================================
            RESPONSES
           ====================================== */}

        <StatItem
          type="responses"
          value={responseCount}
        />

        {/* ======================================
            STARS
           ====================================== */}

        <StatItem
          type="stars"
          value={star}
        />

        {/* ======================================
            FCOIN
           ====================================== */}

        <StatItem
          type="coins"
          value={offeredCoins}
        />
      </dl>
    </section>
  );
}

export default memo(
  MyProblemCardStats
);
