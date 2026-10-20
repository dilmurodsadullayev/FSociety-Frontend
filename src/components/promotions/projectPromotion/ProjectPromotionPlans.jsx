
import React from "react";

import {
  Sparkles,
  Layers3,
} from "lucide-react";

import PromotionPlanCard from "../PromotionPlanCard";

import {
  getPromotionPlanIdentifier,
  isSamePromotionPlan,
} from "./utils/projectPromotionHelpers";

/**
 * FSociety — Project Promotion Plans
 *
 * Responsibilities:
 * - Render promotion plans
 * - Handle selected plan UI
 * - Pass FCoin balance to cards
 * - Handle disabled state
 * - Display empty state
 * - Responsive Light / Dark UI
 *
 * Business logic remains in the parent/hook.
 *
 * Existing PromotionPlanCard props:
 * - plan
 * - selected
 * - balance
 * - disabled
 * - onSelect
 */

// ============================================
// EMPTY PLANS
// ============================================

const PromotionPlansEmpty = () => {
  return (
    <div
      role="status"
      className="
        flex
        min-w-0
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50/80
        px-4
        py-8
        text-center

        dark:border-white/[0.09]
        dark:bg-white/[0.02]
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          border
          border-slate-200
          bg-white
          text-slate-400

          dark:border-white/[0.08]
          dark:bg-white/[0.035]
          dark:text-slate-500
        "
      >
        <Layers3
          size={22}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      <h4
        className="
          mt-4
          text-sm
          font-black
          text-slate-800

          dark:text-slate-200
        "
      >
        Promotion rejasi topilmadi
      </h4>

      <p
        className="
          mt-2
          max-w-xs
          break-words
          text-xs
          font-medium
          leading-5
          text-slate-500

          dark:text-slate-400
        "
      >
        Hozircha mavjud promotion rejalari yo'q.
        Keyinroq qayta urinib ko'ring.
      </p>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ProjectPromotionPlans = ({
  plans = [],
  selectedPlanCode = null,
  balance = 0,
  disabled = false,
  onSelect,
  className = "",
}) => {
  // ==========================================
  // SAFE PLANS
  // ==========================================

  const safePlans = Array.isArray(plans)
    ? plans.filter((plan) => {
        if (
          !plan ||
          typeof plan !== "object" ||
          Array.isArray(plan)
        ) {
          return false;
        }

        const identifier =
          getPromotionPlanIdentifier(plan);

        return (
          identifier !== null &&
          identifier !== undefined &&
          String(identifier).trim() !== ""
        );
      })
    : [];

  const canSelect =
    !disabled &&
    typeof onSelect === "function";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section
      aria-label="Promotion rejalari"
      className={`
        mt-6
        w-full
        min-w-0

        ${className}
      `}
    >
      {/* ======================================
          HEADER
      ====================================== */}

      <div
        className="
          mb-3
          flex
          min-w-0
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <Sparkles
            size={16}
            className="
              shrink-0
              text-purple-600

              dark:text-purple-300
            "
            aria-hidden="true"
          />

          <h3
            className="
              min-w-0
              break-words
              text-xs
              font-black
              uppercase
              tracking-[0.1em]
              text-slate-700

              dark:text-slate-300
            "
          >
            Promotion rejalari
          </h3>
        </div>

        {/* PLAN COUNT */}

        {safePlans.length > 0 && (
          <span
            className="
              inline-flex
              min-h-6
              shrink-0
              items-center
              rounded-lg
              border
              border-purple-200
              bg-purple-50
              px-2
              text-[10px]
              font-bold
              tabular-nums
              text-purple-700

              dark:border-purple-400/15
              dark:bg-purple-400/[0.06]
              dark:text-purple-300
            "
          >
            {safePlans.length} ta reja
          </span>
        )}
      </div>

      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {safePlans.length === 0 ? (
        <PromotionPlansEmpty />
      ) : (
        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-3
          "
        >
          {safePlans.map((plan) => {
            const planCode =
              getPromotionPlanIdentifier(plan);

            const selected =
              isSamePromotionPlan(
                selectedPlanCode,
                planCode
              );

            return (
              <PromotionPlanCard
                key={String(planCode)}
                plan={plan}
                selected={selected}
                balance={balance}
                disabled={!canSelect}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default React.memo(ProjectPromotionPlans);
