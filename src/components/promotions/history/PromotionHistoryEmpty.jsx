
import React from "react";

import {
  History,
  Rocket,
  Sparkles,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROMOTION HISTORY EMPTY
// =========================================================
//
// Responsibilities:
// - Empty promotion history
// - Distinguish no purchases from empty results
// - Light / Dark Mode
// - Responsive layout
// - Accessibility
//
// No Redux, API or business logic.
// =========================================================

const PromotionHistoryEmpty = ({
  hasPastPurchases = false,
  className = "",
}) => {
  // =======================================================
  // DISPLAY CONTENT
  // =======================================================

  const title = hasPastPurchases
    ? "Tarix yozuvlari topilmadi"
    : "Hali promotion xaridi mavjud emas";

  const description = hasPastPurchases
    ? (
        "Hozir ko'rsatish uchun promotion " +
        "kampaniyalari mavjud emas."
      )
    : (
        "Loyihangizni reklama qilish uchun " +
        "promotion rejasini tanlang. " +
        "Xaridlaringiz tarixi shu yerda " +
        "ko'rinadi."
      );

  const Icon = hasPastPurchases
    ? History
    : Rocket;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      role="status"
      className={`
        relative
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50/80
        px-4
        py-8
        text-center

        sm:px-6
        sm:py-10

        dark:border-white/[0.09]
        dark:bg-white/[0.018]

        ${className}
      `}
    >
      {/* =====================================
          BACKGROUND DECORATION
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-32
          w-48
          -translate-x-1/2
          rounded-full
          bg-purple-300/15
          blur-3xl

          dark:bg-purple-500/[0.055]
        "
      />

      {/* =====================================
          CONTENT
      ===================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          max-w-sm
          flex-col
          items-center
        "
      >
        {/* ICON */}

        <div
          className="
            relative
            grid
            h-14
            w-14
            place-items-center
            rounded-2xl
            border
            border-purple-200
            bg-white
            text-purple-600
            shadow-sm

            dark:border-purple-400/15
            dark:bg-purple-400/[0.055]
            dark:text-purple-300
            dark:shadow-none
          "
        >
          <Icon
            size={25}
            strokeWidth={1.7}
            aria-hidden="true"
          />

          <div
            aria-hidden="true"
            className="
              absolute
              -right-2
              -top-2
              grid
              h-6
              w-6
              place-items-center
              rounded-lg
              border
              border-indigo-200
              bg-indigo-50
              text-indigo-600

              dark:border-indigo-400/15
              dark:bg-[#151a2a]
              dark:text-indigo-300
            "
          >
            <Sparkles size={12} />
          </div>
        </div>

        {/* LABEL */}

        <p
          className="
            mt-4
            font-mono
            text-[10px]
            font-black
            uppercase
            tracking-[0.15em]
            text-purple-600

            dark:text-purple-300/70
          "
        >
          fsociety://history
        </p>

        {/* TITLE */}

        <h4
          className="
            mt-2
            break-words
            text-sm
            font-black
            leading-6
            text-slate-900

            dark:text-slate-200
          "
        >
          {title}
        </h4>

        {/* DESCRIPTION */}

        <p
          className="
            mt-2
            max-w-xs
            break-words
            text-xs
            font-medium
            leading-5
            text-slate-600

            dark:text-slate-400
          "
        >
          {description}
        </p>

        {/* DECORATIVE INDICATOR */}

        <div
          aria-hidden="true"
          className="
            mt-5
            flex
            items-center
            gap-1.5
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-purple-400/50
            "
          />

          <span
            className="
              h-1.5
              w-5
              rounded-full
              bg-purple-500/30
            "
          />

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-purple-400/50
            "
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(
  PromotionHistoryEmpty
);
