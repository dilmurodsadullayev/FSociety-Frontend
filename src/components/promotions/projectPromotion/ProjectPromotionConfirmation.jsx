
import React from "react";

import PurchaseConfirmationModal from "../../ui/PurchaseConfirmationModal";

import PromotionPurchaseSkeleton from "./skeletons/PromotionPurchaseSkeleton";

import {
  getPromotionDurationLabel,
  safePromotionPositiveNumber,
} from "../../../utils/promotion";

// =========================================================
// FSOCIETY — PROJECT PROMOTION CONFIRMATION
// =========================================================
//
// Adapter for PurchaseConfirmationModal.
//
// Responsibilities:
// - Selected promotion plan
// - Project information
// - FCoin price and balance
// - Promotion duration
// - Confirmation callbacks
// - Purchase skeleton integration
//
// No API requests.
// No Redux dispatch.
// No local purchase state.
//
// Purchase locking and lifecycle are managed
// by the parent custom hook.
// =========================================================

// =========================================================
// SAFE DISPLAY TEXT
// =========================================================

const getDisplayText = (
  value,
  fallback = ""
) => {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim() || fallback;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProjectPromotionConfirmation = ({
  isOpen = false,

  onClose,
  onConfirm,

  isProcessing = false,

  projectName = "Project",

  selectedPlan = null,
  selectedPrice = undefined,

  balance = 0,
}) => {
  // =======================================================
  // SAFE PROJECT
  // =======================================================

  const safeProjectName = getDisplayText(
    projectName,
    "Project"
  );

  // =======================================================
  // SELECTED PLAN
  // =======================================================

  const hasSelectedPlan = Boolean(
    selectedPlan &&
    typeof selectedPlan === "object" &&
    !Array.isArray(selectedPlan)
  );

  const planName = hasSelectedPlan
    ? getDisplayText(
        selectedPlan.name,
        "Promotion rejasi"
      )
    : "";

  // =======================================================
  // PRICE AND BALANCE
  // =======================================================

  const price = safePromotionPositiveNumber(
    selectedPrice ??
      selectedPlan?.price ??
      0
  );

  const currentBalance =
    safePromotionPositiveNumber(
      balance
    );

  // =======================================================
  // DURATION
  // =======================================================

  const duration = hasSelectedPlan
    ? getPromotionDurationLabel({
        durationHours:
          selectedPlan.duration_hours,

        days:
          selectedPlan.days,

        durationLabel:
          selectedPlan.duration_label,
      })
    : null;

  // =======================================================
  // MODAL CONTENT
  // =======================================================

  const itemName = hasSelectedPlan
    ? `${planName} — ${safeProjectName}`
    : safeProjectName;

  const description =
    `"${safeProjectName}" loyihasi uchun ` +
    "tanlangan promotion rejasini " +
    "sotib olmoqchisiz.";

  const confirmText = hasSelectedPlan
    ? `${price} FCoin sarflash`
    : "Tasdiqlash";

  const warningText = hasSelectedPlan
    ? (
        `Tasdiqlaganingizdan so'ng ${price} FCoin ` +
        "balansingizdan yechiladi. " +
        "Agar aktiv promotion mavjud bo'lsa, " +
        "yangi xarid uning ortidan navbatga qo'shiladi."
      )
    : null;

  // =======================================================
  // CONFIRM
  // =======================================================

  const handleConfirm = () => {
    if (
      !isOpen ||
      isProcessing ||
      !hasSelectedPlan ||
      currentBalance < price ||
      typeof onConfirm !== "function"
    ) {
      return;
    }

    onConfirm();
  };

  // =======================================================
  // CLOSE
  // =======================================================

  const handleClose = () => {
    if (
      isProcessing ||
      typeof onClose !== "function"
    ) {
      return;
    }

    onClose();
  };

  // =======================================================
  // PURCHASE SKELETON
  // =======================================================

  const processingContent =
    isProcessing && hasSelectedPlan ? (
      <PromotionPurchaseSkeleton
        projectName={safeProjectName}
        planName={planName}
      />
    ) : null;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <PurchaseConfirmationModal
      isOpen={Boolean(
        isOpen && hasSelectedPlan
      )}
      onClose={handleClose}
      onConfirm={handleConfirm}
      isProcessing={Boolean(isProcessing)}
      title="Promotion xaridini tasdiqlaysizmi?"
      description={description}
      itemName={itemName}
      price={price}
      balance={currentBalance}
      duration={duration}
      confirmText={confirmText}
      cancelText="Bekor qilish"
      warningText={warningText}
      processingContent={processingContent}
    />
  );
};

export default React.memo(
  ProjectPromotionConfirmation
);
