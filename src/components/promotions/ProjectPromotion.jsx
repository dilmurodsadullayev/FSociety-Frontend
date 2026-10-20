
import React from "react";

import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

// =========================================================
// CUSTOM HOOKS
// =========================================================

import useProjectPromotionData from "./projectPromotion/hooks/useProjectPromotionData";

import useProjectPromotionPurchase from "./projectPromotion/hooks/useProjectPromotionPurchase";

// =========================================================
// PROJECT PROMOTION COMPONENTS
// =========================================================

import ProjectPromotionHeader from "./projectPromotion/ProjectPromotionHeader";

import ProjectPromotionAlert from "./projectPromotion/ProjectPromotionAlert";

import ProjectPromotionLoading from "./projectPromotion/ProjectPromotionLoading";

import ProjectPromotionEmptyActive from "./projectPromotion/ProjectPromotionEmptyActive";

import ProjectPromotionPlans from "./projectPromotion/ProjectPromotionPlans";

import ProjectPromotionPurchaseButton from "./projectPromotion/ProjectPromotionPurchaseButton";

import ProjectPromotionConfirmation from "./projectPromotion/ProjectPromotionConfirmation";

// =========================================================
// EXISTING PROMOTION COMPONENTS
// =========================================================

import PromotionActiveCard from "./PromotionActiveCard";

import PromotionQueue from "./PromotionQueue";

import PromotionHistory from "./PromotionHistory";

// =========================================================
// FSOCIETY — PROJECT PROMOTION
// =========================================================
//
// This is the main promotion container.
//
// Public props:
// - projectId
// - projectName
// - userCoins
// - onPromotionChange
//
// Responsibilities:
// - Connect Data Hook
// - Connect Purchase Hook
// - Render promotion sections
// - Handle initial loading / retry
// - Handle refresh states
// - Handle purchase status messages
// - Show uncertain purchase warning
// - Connect confirmation modal
//
// No direct API request here.
// No direct Redux dispatch here.
//
// Light / Dark Mode
// Responsive: 320px+
//
// =========================================================

// =========================================================
// STYLES
// =========================================================

const PANEL_CLASS = `
  relative
  isolate
  w-full
  min-w-0
  max-w-full
  overflow-hidden
  rounded-3xl
  border
  border-slate-200
  bg-white/95
  p-4
  shadow-[0_20px_70px_rgba(15,23,42,0.06)]

  sm:p-5

  dark:border-white/[0.07]
  dark:bg-[#0b1018]
  dark:shadow-[0_25px_80px_rgba(0,0,0,0.24)]
`;

const SECTION_CLASS = `
  mt-4
  w-full
  min-w-0
  max-w-full

  sm:mt-5
`;

// =========================================================
// UNKNOWN PURCHASE WARNING
// =========================================================

const UnknownPurchaseWarning = React.memo(
  function UnknownPurchaseWarning({
    onAcknowledge,
    disabled = false,
  }) {
    return (
      <div
        role="alert"
        className="
          mt-4
          w-full
          min-w-0
          max-w-full
          overflow-hidden
          rounded-2xl
          border
          border-amber-200
          bg-amber-50
          p-4

          dark:border-amber-400/20
          dark:bg-amber-400/[0.055]
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-3
          "
        >
          {/* WARNING ICON */}

          <div
            className="
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              rounded-xl
              border
              border-amber-200
              bg-amber-100
              text-amber-700

              dark:border-amber-400/20
              dark:bg-amber-400/[0.08]
              dark:text-amber-300
            "
          >
            <ShieldAlert
              size={19}
              aria-hidden="true"
            />
          </div>

          {/* CONTENT */}

          <div className="min-w-0 flex-1">
            <h3
              className="
                break-words
                text-xs
                font-black
                leading-5
                text-amber-900

                dark:text-amber-200
              "
            >
              Oldingi xaridni tekshirish kerak
            </h3>

            <p
              className="
                mt-1.5
                break-words
                text-xs
                font-medium
                leading-5
                text-amber-800

                dark:text-amber-100/80
              "
            >
              Xarid so‘rovi yuborilgan, ammo uning
              natijasini tasdiqlashning imkoni
              bo‘lmadi. FCoin allaqachon yechilgan
              bo‘lishi mumkin.
            </p>

            {/* INSTRUCTIONS */}

            <div
              className="
                mt-3
                rounded-xl
                border
                border-amber-200
                bg-white/65
                p-3

                dark:border-amber-400/15
                dark:bg-black/10
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  leading-5
                  text-amber-900

                  dark:text-amber-100
                "
              >
                Yangi xarid qilishdan oldin:
              </p>

              <ul
                className="
                  mt-2
                  list-inside
                  list-disc
                  space-y-1
                  text-[11px]
                  font-medium
                  leading-5
                  text-amber-800

                  dark:text-amber-200/85
                "
              >
                <li>
                  Joriy FCoin balansingizni
                  tekshiring.
                </li>

                <li>
                  Promotion History bo‘limidagi
                  xaridlarni ko‘ring.
                </li>

                <li>
                  Kerak bo‘lsa sahifani yangilang.
                </li>
              </ul>
            </div>

            {/* ACKNOWLEDGE */}

            <button
              type="button"
              onClick={onAcknowledge}
              disabled={
                disabled ||
                typeof onAcknowledge !==
                  "function"
              }
              className="
                mt-3
                inline-flex
                min-h-11
                w-full
                min-w-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-amber-300
                bg-amber-200
                px-4
                py-2.5
                text-center
                text-xs
                font-black
                text-amber-950
                transition-colors

                hover:bg-amber-300

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-500
                focus-visible:ring-offset-2

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-auto

                dark:border-amber-400/25
                dark:bg-amber-400/15
                dark:text-amber-200

                dark:hover:bg-amber-400/25
                dark:focus-visible:ring-offset-[#0b1018]
              "
            >
              <CheckCircle2
                size={16}
                className="shrink-0"
                aria-hidden="true"
              />

              <span className="min-w-0 break-words">
                Balans va tarixni tekshirdim
              </span>
            </button>

            <p
              className="
                mt-2
                text-[10px]
                font-medium
                leading-4
                text-amber-700

                dark:text-amber-300/75
              "
            >
              Bu tugma xaridni takrorlamaydi.
              Faqat yangi xarid boshlashga
              qo‘yilgan vaqtinchalik
              cheklovni olib tashlaydi.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

// =========================================================
// INVALID PROJECT STATE
// =========================================================

const InvalidProjectNotice = React.memo(
  function InvalidProjectNotice() {
    return (
      <div
        role="alert"
        className="
          mt-5
          flex
          min-w-0
          items-start
          gap-3
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-4

          dark:border-red-400/20
          dark:bg-red-400/[0.05]
        "
      >
        <AlertTriangle
          size={18}
          className="
            mt-0.5
            shrink-0
            text-red-600

            dark:text-red-300
          "
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <p
            className="
              text-xs
              font-black
              text-red-800

              dark:text-red-200
            "
          >
            Project topilmadi
          </p>

          <p
            className="
              mt-1
              break-words
              text-xs
              font-medium
              leading-5
              text-red-700

              dark:text-red-300
            "
          >
            Promotion ma’lumotlarini olish
            uchun to‘g‘ri Project ID kerak.
          </p>
        </div>
      </div>
    );
  }
);

// =========================================================
// MAIN PROJECT PROMOTION
// =========================================================

const ProjectPromotion = ({
  projectId,

  projectName = "Project",

  userCoins = 0,

  onPromotionChange = null,
}) => {
  // =======================================================
  // DATA HOOK
  // =======================================================

  const promotionData = useProjectPromotionData({
    projectId,
    userCoins,
  });

  // =======================================================
  // PURCHASE HOOK
  // =======================================================

  const promotionPurchase =
    useProjectPromotionPurchase({
      projectId,
      projectName,

      plans: promotionData.plans,

      currentBalance:
        promotionData.currentBalance,

      user: promotionData.user,

      manageLoading:
        promotionData.manageLoading,

      isLoadedForCurrentProject:
        promotionData.isLoadedForCurrentProject,

      loadPromotionData:
        promotionData.loadPromotionData,

      onPromotionChange,
    });

  // =======================================================
  // PROJECT STATE
  // =======================================================

  const hasProjectId = Boolean(
    promotionData.hasProjectId
  );

  const isProjectReady =
    hasProjectId &&
    Boolean(
      promotionData.isLoadedForCurrentProject
    );

  // =======================================================
  // LOADING STATE
  // =======================================================

  const hasInitialError =
    hasProjectId &&
    !isProjectReady &&
    promotionData.requestStatus === "error";

  const isInitialLoading =
    hasProjectId &&
    !isProjectReady &&
    !hasInitialError;

  const isRefreshing =
    isProjectReady &&
    Boolean(promotionData.isRefreshing);

  const isManageLoading = Boolean(
    promotionData.manageLoading
  );

  const isPurchaseLoading = Boolean(
    promotionPurchase.purchaseLoading
  );

  const isPurchaseLocked = Boolean(
    promotionPurchase.isPurchaseLocked
  );

  // =======================================================
  // UNKNOWN PURCHASE STATE
  // =======================================================

  const isPurchaseOutcomeUnknown =
    hasProjectId &&
    Boolean(
      promotionPurchase.isPurchaseOutcomeUnknown
    );

  // =======================================================
  // INTERACTION AVAILABILITY
  // =======================================================

  const isInteractionDisabled =
    !isProjectReady ||
    isManageLoading ||
    isPurchaseLoading ||
    isPurchaseLocked ||
    isPurchaseOutcomeUnknown;

  const canRefresh =
    hasProjectId &&
    !isManageLoading &&
    !isPurchaseLoading &&
    !isPurchaseLocked;

  const canAcknowledgeUnknown =
    isPurchaseOutcomeUnknown &&
    !isManageLoading &&
    !isPurchaseLoading &&
    !isPurchaseLocked;

  // =======================================================
  // ERROR STATES
  // =======================================================

  const initialErrorMessage =
    hasInitialError
      ? (
          promotionData.manageError ||
          "Promotion ma’lumotlarini yuklab bo‘lmadi."
        )
      : "";

  const refreshErrorMessage =
    isProjectReady
      ? promotionData.manageError
      : null;

  const purchaseErrorMessage =
    isProjectReady &&
    !isPurchaseOutcomeUnknown
      ? promotionPurchase.purchaseError
      : null;

  // =======================================================
  // SUCCESS
  // =======================================================

  const successMessage =
    isProjectReady
      ? promotionPurchase.successMessage
      : "";

  // =======================================================
  // REFRESH HANDLER
  // =======================================================

  const handleRefresh = () => {
    if (!canRefresh) {
      return;
    }

    promotionData.handleRefresh();
  };

  // =======================================================
  // CONFIRMATION VISIBILITY
  // =======================================================

  const showConfirmation =
    isProjectReady &&
    Boolean(
      promotionPurchase.isConfirmOpen
    );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>
      {/* ===================================================
          MAIN PROMOTION PANEL
      =================================================== */}

      <section
        aria-label="Project promotion boshqaruvi"
        aria-busy={
          isInitialLoading ||
          isRefreshing ||
          isPurchaseLoading
        }
        className={PANEL_CLASS}
      >
        {/* =====================================
            BACKGROUND EFFECTS
        ===================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-52
            w-52
            rounded-full
            bg-purple-300/15
            blur-[90px]

            dark:bg-purple-500/[0.07]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-28
            -left-24
            h-52
            w-52
            rounded-full
            bg-indigo-300/10
            blur-[90px]

            dark:bg-indigo-500/[0.05]
          "
        />

        {/* =====================================
            CONTENT
        ===================================== */}

        <div
          className="
            relative
            z-10
            w-full
            min-w-0
          "
        >
          {/* =================================
              HEADER
          ================================= */}

          <ProjectPromotionHeader
            currentBalance={
              promotionData.currentBalance
            }
            manageLoading={
              isManageLoading
            }
            purchaseLoading={
              isPurchaseLoading
            }
            isRefreshing={
              isRefreshing
            }
            onRefresh={
              canRefresh
                ? handleRefresh
                : undefined
            }
          />

          {/* =================================
              INVALID PROJECT
          ================================= */}

          {!hasProjectId && (
            <InvalidProjectNotice />
          )}

          {/* =================================
              INITIAL ERROR + RETRY
          ================================= */}

          {hasInitialError && (
            <ProjectPromotionAlert
              variant="error"
              title="Promotion yuklanmadi"
              message={initialErrorMessage}
              onRetry={
                canRefresh
                  ? handleRefresh
                  : undefined
              }
              isRetrying={
                isManageLoading
              }
            />
          )}

          {/* =================================
              REFRESH ERROR
          ================================= */}

          {refreshErrorMessage && (
            <ProjectPromotionAlert
              variant="error"
              title="Ma’lumotlarni yangilashda xatolik"
              message={refreshErrorMessage}
              onRetry={
                canRefresh
                  ? handleRefresh
                  : undefined
              }
              isRetrying={
                isRefreshing
              }
            />
          )}

          {/* =================================
              PURCHASE ERROR
          ================================= */}

          {purchaseErrorMessage && (
            <ProjectPromotionAlert
              variant="error"
              title="Promotion xaridida xatolik"
              message={purchaseErrorMessage}
            />
          )}

          {/* =================================
              UNKNOWN PURCHASE WARNING
          ================================= */}

          {isPurchaseOutcomeUnknown && (
            <UnknownPurchaseWarning
              disabled={
                !canAcknowledgeUnknown
              }
              onAcknowledge={
                promotionPurchase
                  .handleAcknowledgeUnknown
              }
            />
          )}

          {/* =================================
              PURCHASE SUCCESS
          ================================= */}

          {successMessage && (
            <ProjectPromotionAlert
              variant="success"
              title="Promotion xarid qilindi"
              message={successMessage}
            />
          )}

          {/* =================================
              INITIAL SKELETON
          ================================= */}

          {isInitialLoading && (
            <ProjectPromotionLoading
              showActive
              showPlans
              planCount={3}
            />
          )}

          {/* =================================
              CURRENT PROJECT
          ================================= */}

          {isProjectReady && (
            <>
              {/* =============================
                  ACTIVE CAMPAIGN
              ============================= */}

              <div
                className="
                  mt-5
                  w-full
                  min-w-0
                  max-w-full
                "
              >
                {promotionData.activeCampaign ? (
                  <PromotionActiveCard
                    campaign={
                      promotionData.activeCampaign
                    }
                    promotionExpiresAt={
                      promotionData.promotionExpiresAt
                    }
                    onRefresh={
                      canRefresh
                        ? handleRefresh
                        : undefined
                    }
                    isRefreshing={
                      isRefreshing ||
                      isPurchaseLoading
                    }
                  />
                ) : (
                  <ProjectPromotionEmptyActive />
                )}
              </div>

              {/* =============================
                  PROMOTION PLANS
              ============================= */}

              <ProjectPromotionPlans
                plans={
                  promotionData.plans
                }
                selectedPlanCode={
                  promotionPurchase.selectedPlanCode
                }
                balance={
                  promotionData.currentBalance
                }
                disabled={
                  isInteractionDisabled
                }
                onSelect={
                  promotionPurchase.handleSelectPlan
                }
              />

              {/* =============================
                  PURCHASE BUTTON
              ============================= */}

              <ProjectPromotionPurchaseButton
                selectedPlan={
                  promotionPurchase.selectedPlan
                }
                selectedPrice={
                  promotionPurchase.selectedPrice
                }
                hasEnoughCoins={
                  promotionPurchase.hasEnoughCoins
                }
                manageLoading={
                  isManageLoading ||
                  isPurchaseOutcomeUnknown
                }
                purchaseLoading={
                  isPurchaseLoading
                }
                disabled={
                  isInteractionDisabled
                }
                onPurchase={
                  promotionPurchase.handlePurchaseRequest
                }
              />
            </>
          )}
        </div>
      </section>

      {/* ===================================================
          PROMOTION QUEUE
      =================================================== */}

      {(isProjectReady || isInitialLoading) && (
        <div className={SECTION_CLASS}>
          <PromotionQueue
            campaigns={
              promotionData.queue
            }
            isLoading={
              isInitialLoading
            }
          />
        </div>
      )}

      {/* ===================================================
          PROMOTION HISTORY
      =================================================== */}

      {(isProjectReady || isInitialLoading) && (
        <div className={SECTION_CLASS}>
          <PromotionHistory
            campaigns={
              promotionData.history
            }
            totalPurchases={
              promotionData.totalPurchases
            }
            totalSpent={
              promotionData.totalSpent
            }
            isLoading={
              isInitialLoading
            }
            isRefreshing={
              isRefreshing
            }
          />
        </div>
      )}

      {/* ===================================================
          PURCHASE CONFIRMATION MODAL
      =================================================== */}

      <ProjectPromotionConfirmation
        isOpen={
          showConfirmation
        }
        onClose={
          promotionPurchase.handleCloseConfirmation
        }
        onConfirm={
          promotionPurchase.handleConfirmPurchase
        }
        isProcessing={
          isPurchaseLoading
        }
        projectName={
          projectName
        }
        selectedPlan={
          promotionPurchase.selectedPlan
        }
        selectedPrice={
          promotionPurchase.selectedPrice
        }
        balance={
          promotionData.currentBalance
        }
      />
    </>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
  ProjectPromotion
);
