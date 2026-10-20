
import React from "react";

import {
  Coins,
  Loader2,
  Rocket,
  AlertCircle,
} from "lucide-react";

import {
  safePromotionPositiveNumber,
} from "../../../utils/promotion";

/**
 * FSociety — Project Promotion Purchase Button
 *
 * Responsibilities:
 * - Display selected plan price
 * - Purchase button UI
 * - Loading state
 * - Disabled state
 * - Insufficient FCoin information
 * - Light / Dark Mode
 * - Mobile responsiveness
 *
 * Purchase API calls and validation
 * remain in the parent/custom hook.
 */

const ProjectPromotionPurchaseButton = ({
  selectedPlan = null,
  selectedPrice = 0,
  hasEnoughCoins = true,
  manageLoading = false,
  purchaseLoading = false,
  onPurchase,
  className = "",
}) => {
  // ==========================================
  // STATE
  // ==========================================

  const hasPlan = Boolean(selectedPlan);

  const isProcessing = Boolean(purchaseLoading);

  const isLoading = Boolean(manageLoading);

  const price = safePromotionPositiveNumber(
    selectedPrice
  );

  const isDisabled =
    isProcessing ||
    isLoading ||
    !hasPlan ||
    typeof onPurchase !== "function";

  const insufficientBalance =
    hasPlan && !hasEnoughCoins;

  // ==========================================
  // LABEL
  // ==========================================

  const buttonLabel = isProcessing
    ? "Xarid qilinmoqda..."
    : isLoading
      ? "Ma'lumotlar yuklanmoqda..."
      : "Promotion sotib olish";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div
      className={`
        mt-4
        w-full
        min-w-0
        ${className}
      `}
    >
      {/* ======================================
          PURCHASE BUTTON
      ====================================== */}

      <button
        type="button"
        onClick={onPurchase}
        disabled={isDisabled}
        aria-busy={isProcessing}
        className="
          group
          relative
          inline-flex
          min-h-[48px]
          w-full
          min-w-0
          items-center
          justify-center
          gap-2
          overflow-hidden
          rounded-xl
          border
          border-purple-500/20
          bg-purple-600
          px-3
          py-3
          text-xs
          font-black
          leading-5
          text-white
          shadow-sm
          transition-all
          duration-200

          hover:border-purple-500/30
          hover:bg-purple-500
          hover:shadow-lg
          hover:shadow-purple-500/15

          active:scale-[0.99]

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-purple-500
          focus-visible:ring-offset-2
          focus-visible:ring-offset-white

          disabled:cursor-not-allowed
          disabled:border-slate-200
          disabled:bg-slate-100
          disabled:text-slate-400
          disabled:shadow-none
          disabled:active:scale-100

          dark:focus-visible:ring-purple-400
          dark:focus-visible:ring-offset-[#0b1018]

          dark:disabled:border-white/[0.06]
          dark:disabled:bg-white/[0.035]
          dark:disabled:text-slate-600
        "
      >
        {/* BACKGROUND GLOW */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-transparent
            via-white/[0.07]
            to-transparent
            opacity-0
            transition-opacity
            duration-300

            group-hover:opacity-100
            group-disabled:opacity-0
          "
        />

        {/* BUTTON CONTENT */}

        <span
          className="
            relative
            z-10
            flex
            min-w-0
            flex-wrap
            items-center
            justify-center
            gap-x-2
            gap-y-1
            text-center
          "
        >
          {isProcessing || isLoading ? (
            <Loader2
              size={17}
              className="
                shrink-0
                motion-safe:animate-spin
              "
              aria-hidden="true"
            />
          ) : (
            <Rocket
              size={17}
              className="shrink-0"
              aria-hidden="true"
            />
          )}

          <span className="break-words">
            {buttonLabel}
          </span>

          {/* SELECTED PLAN PRICE */}

          {hasPlan && !isProcessing && !isLoading && (
            <span
              className="
                inline-flex
                min-w-0
                max-w-full
                items-center
                justify-center
                gap-1
                rounded-full
                border
                border-white/10
                bg-black/15
                px-2.5
                py-1
                text-[10px]
                font-black
                tabular-nums
                text-white
              "
            >
              <Coins
                size={12}
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
          )}
        </span>
      </button>

      {/* ======================================
          INSUFFICIENT BALANCE
      ====================================== */}

      {insufficientBalance &&
        !isProcessing &&
        !isLoading && (
          <div
            role="status"
            className="
              mt-2.5
              flex
              min-w-0
              items-start
              justify-center
              gap-2
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              px-3
              py-2.5

              dark:border-amber-400/15
              dark:bg-amber-400/[0.045]
            "
          >
            <AlertCircle
              size={15}
              className="
                mt-0.5
                shrink-0
                text-amber-600

                dark:text-amber-300
              "
              aria-hidden="true"
            />

            <p
              className="
                min-w-0
                break-words
                text-[11px]
                font-medium
                leading-5
                text-amber-800

                dark:text-amber-200
              "
            >
              FCoin balansingiz yetarli emas.
              Xaridni davom ettirish uchun
              qo'shimcha FCoin kerak.
            </p>
          </div>
        )}
    </div>
  );
};

export default React.memo(
  ProjectPromotionPurchaseButton
);
