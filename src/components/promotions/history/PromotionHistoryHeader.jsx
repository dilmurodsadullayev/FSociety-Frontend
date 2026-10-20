
import React from "react";

import {
  History,
  LockKeyhole,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROMOTION HISTORY HEADER
// =========================================================
//
// Responsibilities:
// - History title
// - Owner only label
// - Responsive layout
// - Light / Dark Mode
// - Accessibility
//
// No API, Redux or business logic.
// =========================================================

const PromotionHistoryHeader = ({
  className = "",
}) => {
  return (
    <div
      className={`
        flex
        w-full
        min-w-0
        items-start
        gap-3

        ${className}
      `}
    >
      {/* =====================================
          ICON
      ===================================== */}

      <div
        className="
          grid
          h-11
          w-11
          shrink-0
          place-items-center
          rounded-xl
          border
          border-purple-200
          bg-purple-50
          text-purple-700
          shadow-sm

          dark:border-purple-400/15
          dark:bg-purple-400/[0.065]
          dark:text-purple-300
          dark:shadow-none
        "
      >
        <History
          size={19}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      {/* =====================================
          HEADER CONTENT
      ===================================== */}

      <div
        className="
          min-w-0
          flex-1
        "
      >
        {/* OWNER BADGE */}

        <div
          className="
            inline-flex
            max-w-full
            items-center
            gap-1.5
            rounded-md
            border
            border-slate-200
            bg-slate-100/80
            px-2
            py-1

            dark:border-white/[0.06]
            dark:bg-white/[0.035]
          "
        >
          <LockKeyhole
            size={11}
            className="
              shrink-0
              text-slate-500

              dark:text-slate-400
            "
            aria-hidden="true"
          />

          <span
            className="
              break-words
              font-mono
              text-[9px]
              font-black
              uppercase
              tracking-[0.12em]
              text-slate-600

              dark:text-slate-400
            "
          >
            Owner only
          </span>
        </div>

        {/* TITLE */}

        <h3
          className="
            mt-1.5
            min-w-0
            break-words
            text-base
            font-black
            leading-6
            tracking-tight
            text-slate-900

            sm:text-lg

            dark:text-white
          "
        >
          Promotion tarixi
        </h3>

        {/* DESCRIPTION */}

        <p
          className="
            mt-1
            max-w-md
            min-w-0
            break-words
            text-[11px]
            font-medium
            leading-[1.7]
            text-slate-600

            dark:text-slate-400
          "
        >
          Reklama kampaniyalaringiz va
          FCoin xaridlaringiz tarixini
          kuzatib boring.
        </p>
      </div>
    </div>
  );
};

export default React.memo(
  PromotionHistoryHeader
);
