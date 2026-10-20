
import React from "react";

import {
  Check,
  Flame,
  Gem,
  Rocket,
  Sparkles,
} from "lucide-react";

import {
  getPromotionDurationLabel,
  safePromotionPositiveNumber,
} from "../../utils/promotion";

// =========================================================
// FSOCIETY — PROMOTION PLAN CARD
// =========================================================

// Faqat UI konfiguratsiyasi.
// Plan narxi, muddati va boshqa biznes ma'lumotlari
// backenddan kelgan plan obyektidan olinadi.

const PLAN_UI = {
  basic: {
    Icon: Rocket,

    border:
      "border-cyan-200 dark:border-cyan-400/20",

    selectedBorder:
      "border-cyan-500/70 dark:border-cyan-300/60",

    background:
      "bg-cyan-50/70 dark:bg-cyan-400/[0.045]",

    selectedBackground:
      "bg-cyan-50 dark:bg-cyan-400/[0.09]",

    icon:
      "text-cyan-700 dark:text-cyan-300",

    iconBackground:
      "bg-cyan-100 dark:bg-cyan-400/[0.08]",

    iconBorder:
      "border-cyan-200 dark:border-cyan-400/15",

    glow: "shadow-cyan-500/10",

    popular: false,
  },

  premium: {
    Icon: Gem,

    border:
      "border-indigo-200 dark:border-indigo-400/20",

    selectedBorder:
      "border-indigo-500/70 dark:border-indigo-300/60",

    background:
      "bg-indigo-50/70 dark:bg-indigo-400/[0.045]",

    selectedBackground:
      "bg-indigo-50 dark:bg-indigo-400/[0.09]",

    icon:
      "text-indigo-700 dark:text-indigo-300",

    iconBackground:
      "bg-indigo-100 dark:bg-indigo-400/[0.08]",

    iconBorder:
      "border-indigo-200 dark:border-indigo-400/15",

    glow: "shadow-indigo-500/10",

    popular: true,
  },

  ultra: {
    Icon: Flame,

    border:
      "border-orange-200 dark:border-orange-400/20",

    selectedBorder:
      "border-orange-500/70 dark:border-orange-300/60",

    background:
      "bg-orange-50/70 dark:bg-orange-400/[0.045]",

    selectedBackground:
      "bg-orange-50 dark:bg-orange-400/[0.09]",

    icon:
      "text-orange-700 dark:text-orange-300",

    iconBackground:
      "bg-orange-100 dark:bg-orange-400/[0.08]",

    iconBorder:
      "border-orange-200 dark:border-orange-400/15",

    glow: "shadow-orange-500/10",

    popular: false,
  },
};

// =========================================================
// FALLBACK UI
// =========================================================

const DEFAULT_UI = {
  Icon: Sparkles,

  border:
    "border-slate-200 dark:border-white/[0.07]",

  selectedBorder:
    "border-purple-500/70 dark:border-purple-300/50",

  background:
    "bg-white dark:bg-white/[0.022]",

  selectedBackground:
    "bg-purple-50 dark:bg-purple-400/[0.07]",

  icon:
    "text-purple-700 dark:text-purple-300",

  iconBackground:
    "bg-purple-100 dark:bg-purple-400/[0.07]",

  iconBorder:
    "border-purple-200 dark:border-purple-400/15",

  glow: "shadow-purple-500/10",

  popular: false,
};

// =========================================================
// PROMOTION PLAN CARD
// =========================================================

const PromotionPlanCard = ({
  plan,
  selected = false,
  disabled = false,
  balance = 0,
  onSelect,
}) => {
  // =======================================================
  // VALIDATION
  // =======================================================

  if (
    !plan ||
    typeof plan !== "object" ||
    Array.isArray(plan)
  ) {
    return null;
  }

  // =======================================================
  // PLAN DATA
  // =======================================================

  const planCode = String(
    plan.code ?? plan.id ?? ""
  );

  const ui = PLAN_UI[planCode] ?? DEFAULT_UI;

  const { Icon } = ui;

  const planName =
    typeof plan.name === "string" &&
    plan.name.trim()
      ? plan.name
      : "Promotion rejasi";

  const description =
    typeof plan.description === "string"
      ? plan.description.trim()
      : "";

  const price = safePromotionPositiveNumber(
    plan.price
  );

  const currentBalance =
    safePromotionPositiveNumber(balance);

  const hasEnoughCoins =
    currentBalance >= price;

  const duration = getPromotionDurationLabel({
    durationHours: plan.duration_hours,
    days: plan.days,
    durationLabel: plan.duration_label,
  });

  // =======================================================
  // INTERACTION
  // =======================================================

  const isDisabled =
    Boolean(disabled) ||
    typeof onSelect !== "function";

  const handleClick = () => {
    if (isDisabled) {
      return;
    }

    onSelect(plan);
  };

  // =======================================================
  // CARD STYLES
  // =======================================================

  const borderClass = selected
    ? ui.selectedBorder
    : ui.border;

  const backgroundClass = selected
    ? ui.selectedBackground
    : ui.background;

  const shadowClass = selected
    ? `shadow-lg ${ui.glow}`
    : "shadow-sm dark:shadow-lg";

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-pressed={Boolean(selected)}
      aria-label={`${planName}, ${price} FCoin, ${duration}${
        selected ? ", tanlangan" : ""
      }`}
      className={`
        group/plan
        relative
        block
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-2xl
        border
        p-4
        text-left
        transition-all
        duration-200

        ${borderClass}
        ${backgroundClass}
        ${shadowClass}

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-purple-500
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white

        dark:focus-visible:ring-purple-400
        dark:focus-visible:ring-offset-[#0b1018]

        ${
          isDisabled
            ? "cursor-not-allowed opacity-50"
            : `
              cursor-pointer
              motion-safe:hover:-translate-y-0.5
              hover:shadow-xl
              dark:hover:brightness-110
            `
        }
      `}
    >
      {/* =====================================
          DECORATIVE GLOW
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-14
          -top-14
          h-32
          w-32
          rounded-full
          bg-purple-300/15
          blur-3xl
          transition-transform
          duration-500

          group-hover/plan:scale-125

          dark:bg-white/[0.025]
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
        {/* PLAN ICON */}

        <div
          className={`
            grid
            h-10
            w-10
            shrink-0
            place-items-center
            rounded-xl
            border

            ${ui.iconBorder}
            ${ui.iconBackground}
            ${ui.icon}
          `}
        >
          <Icon
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        {/* POPULAR + SELECTED */}

        <div
          className="
            flex
            min-w-0
            flex-wrap
            items-center
            justify-end
            gap-2
          "
        >
          {ui.popular && (
            <span
              className="
                rounded-full
                border
                border-indigo-200
                bg-indigo-100/80
                px-2
                py-1
                text-[9px]
                font-black
                uppercase
                tracking-wider
                text-indigo-700

                dark:border-indigo-300/15
                dark:bg-indigo-400/[0.06]
                dark:text-indigo-300
              "
            >
              Popular
            </span>
          )}

          <div
            aria-hidden="true"
            className={`
              grid
              h-6
              w-6
              shrink-0
              place-items-center
              rounded-full
              border
              transition-all

              ${
                selected
                  ? `
                    border-emerald-400
                    bg-emerald-100
                    text-emerald-700

                    dark:border-emerald-300/40
                    dark:bg-emerald-400/15
                    dark:text-emerald-300
                  `
                  : `
                    border-slate-300
                    bg-white/70
                    text-transparent

                    dark:border-white/[0.08]
                    dark:bg-white/[0.02]
                  `
              }
            `}
          >
            <Check
              size={12}
              strokeWidth={3}
            />
          </div>
        </div>
      </div>

      {/* =====================================
          PLAN NAME
      ===================================== */}

      <h3
        className="
          relative
          mt-4
          min-w-0
          break-words
          text-base
          font-black
          leading-6
          text-slate-900

          dark:text-white
        "
      >
        {planName}
      </h3>

      {/* =====================================
          DESCRIPTION
      ===================================== */}

      {description && (
        <p
          className="
            relative
            mt-1.5
            line-clamp-2
            min-w-0
            break-words
            text-[11px]
            font-medium
            leading-5
            text-slate-600

            dark:text-slate-400
          "
        >
          {description}
        </p>
      )}

      {/* =====================================
          PRICE AND DURATION
      ===================================== */}

      <div
        className="
          relative
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
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-500

              dark:text-slate-500
            "
          >
            Davomiylik
          </p>

          <p
            className="
              mt-1
              break-words
              text-xs
              font-black
              leading-5
              text-slate-800

              dark:text-slate-200
            "
          >
            {duration}
          </p>
        </div>

        {/* PRICE */}

        <div className="min-w-0 text-right">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-500

              dark:text-slate-500
            "
          >
            Narxi
          </p>

          <p
            className={`
              mt-1
              break-words
              text-sm
              font-black
              leading-5
              tabular-nums

              ${
                hasEnoughCoins
                  ? `
                    text-amber-700
                    dark:text-yellow-300
                  `
                  : `
                    text-red-600
                    dark:text-red-300
                  `
              }
            `}
          >
            {price} FCoin
          </p>
        </div>
      </div>

      {/* =====================================
          INSUFFICIENT BALANCE
      ===================================== */}

      {!hasEnoughCoins && (
        <div
          className="
            relative
            mt-3
            flex
            min-w-0
            items-center
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-2
            text-[10px]
            font-bold
            text-red-700

            dark:border-red-400/15
            dark:bg-red-400/[0.045]
            dark:text-red-300
          "
        >
          Balans yetarli emas
        </div>
      )}
    </button>
  );
};

export default React.memo(PromotionPlanCard);
