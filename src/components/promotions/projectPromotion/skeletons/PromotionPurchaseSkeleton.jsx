
import React from "react";

import {
  Coins,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  PromotionSkeletonBlock,
  PromotionSkeletonSurface,
} from "./PromotionSkeletonParts";

// =========================================================
// FSOCIETY — PROMOTION PURCHASE SKELETON
// =========================================================
//
// Intended to render inside the existing
// PurchaseConfirmationModal while isProcessing.
//
// - Displays current purchase context
// - Shows animated purchase placeholders
// - Does not modify FCoin balance
// - Does not call API
// - Does not assume purchase success
//
// The modal/controller must lock actions
// while purchase is processing.
// =========================================================

// =========================================================
// PURCHASE DETAIL SKELETON
// =========================================================

const PurchaseDetailSkeleton = React.memo(
  function PurchaseDetailSkeleton({
    tone = "default",
  }) {
    return (
      <PromotionSkeletonSurface
        className="
          min-w-0
          rounded-xl
          p-3
        "
      >
        <PromotionSkeletonBlock
          className="
            h-2
            w-16
          "
        />

        <PromotionSkeletonBlock
          tone={tone}
          className="
            mt-3
            h-3.5
            w-24
          "
        />
      </PromotionSkeletonSurface>
    );
  }
);

// =========================================================
// PURCHASE PROCESS INDICATOR
// =========================================================

const PurchaseProcessIndicator = React.memo(
  function PurchaseProcessIndicator() {
    return (
      <div
        className="
          flex
          min-w-0
          items-center
          gap-3
          rounded-xl
          border
          border-purple-200
          bg-purple-50
          p-3

          dark:border-purple-400/15
          dark:bg-purple-400/[0.05]
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-purple-200
            bg-white
            text-purple-700

            dark:border-purple-400/15
            dark:bg-purple-400/[0.07]
            dark:text-purple-300
          "
        >
          <Loader2
            size={19}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
              text-xs
              font-black
              text-purple-900

              dark:text-purple-100
            "
          >
            Xarid amalga oshirilmoqda
          </p>

          <p
            className="
              mt-1
              break-words
              text-[11px]
              font-medium
              leading-5
              text-purple-700

              dark:text-purple-300/80
            "
          >
            Promotion xaridi server tomonidan
            tekshirilmoqda.
          </p>
        </div>
      </div>
    );
  }
);

// =========================================================
// MAIN PURCHASE SKELETON
// =========================================================

const PromotionPurchaseSkeleton = ({
  projectName = "",
  planName = "",
  className = "",
}) => {
  const safeProjectName =
    typeof projectName === "string"
      ? projectName.trim()
      : "";

  const safePlanName =
    typeof planName === "string"
      ? planName.trim()
      : "";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Promotion xaridi amalga oshirilmoqda"
      className={`
        w-full
        min-w-0
        max-w-full
        rounded-2xl
        border
        border-slate-200
        bg-slate-50/90
        p-4

        dark:border-white/[0.08]
        dark:bg-[#0e1520]

        ${className}
      `}
    >
      <span className="sr-only">
        Promotion xaridi amalga
        oshirilmoqda. Server javobi
        kutilmoqda.
      </span>

      {/* =====================================
          PROCESS INDICATOR
      ===================================== */}

      <PurchaseProcessIndicator />

      {/* =====================================
          PURCHASE CONTEXT
      ===================================== */}

      {(safeProjectName || safePlanName) && (
        <div
          className="
            mt-4
            min-w-0
            rounded-xl
            border
            border-slate-200
            bg-white/80
            p-3.5

            dark:border-white/[0.07]
            dark:bg-white/[0.025]
          "
        >
          {safeProjectName && (
            <p
              className="
                break-words
                text-[11px]
                font-semibold
                leading-5
                text-slate-600

                dark:text-slate-400
              "
            >
              Loyiha:{" "}
              <span
                className="
                  font-black
                  text-slate-800

                  dark:text-slate-200
                "
              >
                {safeProjectName}
              </span>
            </p>
          )}

          {safePlanName && (
            <p
              className="
                mt-1
                break-words
                text-[11px]
                font-semibold
                leading-5
                text-slate-600

                dark:text-slate-400
              "
            >
              Reja:{" "}
              <span
                className="
                  font-black
                  text-purple-700

                  dark:text-purple-300
                "
              >
                {safePlanName}
              </span>
            </p>
          )}
        </div>
      )}

      {/* =====================================
          ANIMATED CONTENT
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          mt-4
          motion-safe:animate-pulse
        "
      >
        {/* FCoin SUMMARY PLACEHOLDERS */}

        <div
          className="
            grid
            grid-cols-2
            gap-2
          "
        >
          <PurchaseDetailSkeleton
            tone="amber"
          />

          <PurchaseDetailSkeleton
            tone="purple"
          />
        </div>

        {/* =====================================
            PROGRESS PLACEHOLDERS
        ===================================== */}

        <div
          className="
            mt-4
            space-y-3
            rounded-xl
            border
            border-slate-200
            bg-white/70
            p-3.5

            dark:border-white/[0.07]
            dark:bg-white/[0.025]
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Coins
              size={15}
              className="
                shrink-0
                text-amber-600

                dark:text-yellow-300
              "
            />

            <PromotionSkeletonBlock
              className="h-2.5 w-36"
            />
          </div>

          <PromotionSkeletonBlock
            tone="purple"
            className="
              h-2.5
              w-full
            "
          />

          <PromotionSkeletonBlock
            className="
              h-2.5
              w-4/5
            "
          />

          <PromotionSkeletonBlock
            className="
              h-2.5
              w-3/5
            "
          />
        </div>
      </div>

      {/* =====================================
          SECURITY NOTE
      ===================================== */}

      <div
        className="
          mt-4
          flex
          min-w-0
          items-start
          gap-2
          rounded-xl
          border
          border-slate-200
          bg-white/60
          p-3

          dark:border-white/[0.06]
          dark:bg-white/[0.025]
        "
      >
        <ShieldCheck
          size={16}
          className="
            mt-0.5
            shrink-0
            text-emerald-600

            dark:text-emerald-300
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
            text-slate-600

            dark:text-slate-400
          "
        >
          Xarid natijasi serverdan
          tasdiqlangach, FCoin balansingiz
          va promotion holati yangilanadi.
        </p>
      </div>

      {/* =====================================
          PROCESSING ACTION PLACEHOLDER
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          mt-4
          flex
          min-h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-purple-200
          bg-purple-100
          px-4
          text-xs
          font-black
          text-purple-700

          dark:border-purple-400/15
          dark:bg-purple-400/[0.08]
          dark:text-purple-300
        "
      >
        <LockKeyhole size={15} />

        Xarid qayta ishlanmoqda...
      </div>
    </div>
  );
};

export default React.memo(
  PromotionPurchaseSkeleton
);
