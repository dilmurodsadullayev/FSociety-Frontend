
import React from "react";

import {
  Coins,
  RefreshCw,
  Rocket,
} from "lucide-react";

import {
  safePromotionPositiveNumber,
} from "../../../utils/promotion";

// =========================================================
// FSOCIETY — PROJECT PROMOTION HEADER
// =========================================================
//
// Features:
// - Light / Dark Mode
// - Responsive from 320px
// - FCoin balance
// - Refresh button
// - Accessible loading state
// - Keyboard accessibility
//
// No API / Redux logic.
// =========================================================

const formatFCoin = (value) => {
  const amount = safePromotionPositiveNumber(value);

  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 10,
  }).format(amount);
};

// =========================================================
// HEADER
// =========================================================

const ProjectPromotionHeader = ({
  currentBalance,
  balance,

  manageLoading = false,
  purchaseLoading = false,
  isRefreshing = false,

  onRefresh,

  className = "",
}) => {
  // =======================================================
  // VALUES
  // =======================================================

  const displayedBalance =
    currentBalance ?? balance ?? 0;

  const refreshing = Boolean(
    manageLoading || isRefreshing
  );

  const purchasing = Boolean(
    purchaseLoading
  );

  const canRefresh =
    !refreshing &&
    !purchasing &&
    typeof onRefresh === "function";

  // =======================================================
  // REFRESH
  // =======================================================

  const handleRefresh = () => {
    if (!canRefresh) {
      return;
    }

    onRefresh();
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <header
      className={`
        flex
        w-full
        min-w-0
        flex-col
        gap-4

        sm:flex-row
        sm:items-start
        sm:justify-between

        ${className}
      `}
    >
      {/* =====================================
          BRAND / HEADING
      ===================================== */}

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
            border-purple-200
            bg-purple-50
            text-purple-700
            shadow-sm

            dark:border-purple-400/20
            dark:bg-purple-400/[0.07]
            dark:text-purple-300
            dark:shadow-none
          "
        >
          <Rocket
            size={20}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </div>

        {/* TEXT */}

        <div className="min-w-0 flex-1">
          <p
            className="
              min-w-0
              break-words
              font-mono
              text-[10px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-purple-700

              dark:text-purple-300
            "
          >
            fsociety://promotion
          </p>

          <h2
            className="
              mt-1
              break-words
              text-lg
              font-black
              leading-6
              tracking-tight
              text-slate-900

              dark:text-white
            "
          >
            Project promotion
          </h2>

          <p
            className="
              mt-2
              max-w-lg
              break-words
              text-xs
              font-medium
              leading-5
              text-slate-600

              dark:text-slate-400
            "
          >
            Loyihangizni Projects sahifasi va
            Home reklama joylarida yuqoriga
            olib chiqing.
          </p>
        </div>
      </div>

      {/* =====================================
          BALANCE + REFRESH
      ===================================== */}

      <div
        className="
          flex
          w-full
          min-w-0
          items-center
          justify-between
          gap-2

          sm:w-auto
          sm:shrink-0
          sm:justify-end
        "
      >
        {/* FCoin BALANCE */}

        <div
          aria-label={`Joriy FCoin balans: ${formatFCoin(
            displayedBalance
          )}`}
          className="
            inline-flex
            min-h-11
            min-w-0
            max-w-full
            items-center
            gap-2
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            px-3
            py-2

            dark:border-yellow-400/15
            dark:bg-yellow-400/[0.055]
          "
        >
          <Coins
            size={17}
            className="
              shrink-0
              text-amber-700

              dark:text-yellow-300
            "
            aria-hidden="true"
          />

          <span
            className="
              min-w-0
              break-all
              text-sm
              font-black
              tabular-nums
              text-amber-800

              dark:text-yellow-300
            "
          >
            {formatFCoin(displayedBalance)}
          </span>

          <span
            className="
              shrink-0
              text-[10px]
              font-black
              uppercase
              tracking-wide
              text-amber-700

              dark:text-yellow-200/70
            "
          >
            FCoin
          </span>
        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={handleRefresh}
          disabled={!canRefresh}
          aria-label={
            refreshing
              ? "Promotion yangilanmoqda"
              : purchasing
                ? "Xarid davomida yangilash mumkin emas"
                : "Promotion ma'lumotlarini yangilash"
          }
          title={
            refreshing
              ? "Yangilanmoqda..."
              : "Yangilash"
          }
          className="
            inline-flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            text-slate-600
            transition-colors
            duration-200

            hover:border-purple-200
            hover:bg-purple-50
            hover:text-purple-700

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-purple-500
            focus-visible:ring-offset-2

            active:scale-[0.97]

            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:active:scale-100

            dark:border-white/[0.09]
            dark:bg-white/[0.035]
            dark:text-slate-400

            dark:hover:border-purple-400/20
            dark:hover:bg-purple-400/[0.07]
            dark:hover:text-purple-300

            dark:focus-visible:ring-offset-[#0b1018]
          "
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "motion-safe:animate-spin"
                : ""
            }
            aria-hidden="true"
          />
        </button>
      </div>

      {/* =====================================
          SCREEN READER STATUS
      ===================================== */}

      <span
        className="sr-only"
        role="status"
        aria-live="polite"
      >
        {refreshing
          ? "Promotion ma'lumotlari yangilanmoqda."
          : ""}
      </span>
    </header>
  );
};

export default React.memo(
  ProjectPromotionHeader
);
