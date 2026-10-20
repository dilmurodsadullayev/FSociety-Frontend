
import React from "react";

import PromotionActiveSkeleton from "./skeletons/PromotionActiveSkeleton";
import PromotionPlansSkeleton from "./skeletons/PromotionPlansSkeleton";

// =========================================================
// FSOCIETY — PROJECT PROMOTION LOADING
// =========================================================
//
// Main promotion panel skeleton orchestrator.
//
// Responsibilities:
// - Initial promotion loading
// - Active campaign skeleton
// - Promotion plans skeleton
// - Independent section visibility
// - Responsive layout
// - Light / Dark Mode
//
// Not responsible for:
// - API / Redux logic
// - Queue / History loading
// - Purchase processing
// - FCoin calculations
//
// Each section has its own skeleton component.
// =========================================================

const ProjectPromotionLoading = ({
  showActive = true,
  showPlans = true,
  planCount = 2,
  className = "",
}) => {
  // =======================================================
  // SECTION VISIBILITY
  // =======================================================

  const hasActiveSection = Boolean(showActive);
  const hasPlansSection = Boolean(showPlans);

  if (!hasActiveSection && !hasPlansSection) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-label="Promotion ma'lumotlari yuklanmoqda"
      aria-busy="true"
      className={`
        relative
        w-full
        min-w-0
        max-w-full
        ${className}
      `}
    >
      {/* =====================================
          ACTIVE CAMPAIGN SKELETON
      ===================================== */}

      {hasActiveSection && (
        <div className="mt-5 min-w-0">
          <PromotionActiveSkeleton />
        </div>
      )}

      {/* =====================================
          PROMOTION PLANS SKELETON
      ===================================== */}

      {hasPlansSection && (
        <PromotionPlansSkeleton
          count={planCount}
        />
      )}
    </div>
  );
};

export default React.memo(
  ProjectPromotionLoading
);
