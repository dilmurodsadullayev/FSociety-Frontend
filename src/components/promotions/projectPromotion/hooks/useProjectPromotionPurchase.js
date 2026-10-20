
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  clearPromotionPurchase,
  purchasePromotionFailure,
  purchasePromotionStart,
  purchasePromotionSuccess,
  selectPromotionState,
} from "../../../../features/promotions";

import {
  signUserSuccess,
} from "../../../../features/auth/Auth";

import PromotionService from "../../../../services/promotion";

import {
  safePromotionPositiveNumber,
} from "../../../../utils/promotion";

import {
  siteToast,
} from "../../../ui/AuthToast";

import {
  getErrorMessage,
} from "../utils/projectPromotionHelpers";

// =========================================================
// FSOCIETY — USE PROJECT PROMOTION PURCHASE
// =========================================================
//
// Responsibilities:
// - Select promotion plan
// - Validate FCoin balance
// - Open and close confirmation
// - Prevent duplicate purchase POST requests
// - Synchronize Redux after purchase
// - Synchronize Auth FCoin balance
// - Keep projects and users isolated
// - Distinguish purchase from refresh errors
// - Handle uncertain network outcomes
//
// The backend is authoritative for purchases.
//
// No JSX, theme or API endpoints are defined here.
// =========================================================

const EMPTY_PLANS = [];

// =========================================================
// HELPERS
// =========================================================

const getProjectKey = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const getUserKey = (user) => {
  const value =
    user?.id ??
    user?.pk ??
    user?.username;

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

const getPlanCode = (plan) => {
  if (
    !plan ||
    typeof plan !== "object" ||
    Array.isArray(plan)
  ) {
    return "";
  }

  const code = plan.code ?? plan.id;

  if (code === null || code === undefined) {
    return "";
  }

  return String(code).trim();
};

const isValidPlan = (plan) => {
  return getPlanCode(plan) !== "";
};

const isSamePlanCode = (first, second) => {
  if (
    first === null ||
    first === undefined ||
    second === null ||
    second === undefined
  ) {
    return false;
  }

  return (
    String(first).trim() ===
    String(second).trim()
  );
};

const hasValidPrice = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  const price = Number(value);

  return Number.isFinite(price) && price >= 0;
};

const isDefiniteRejection = (error) => {
  const status = Number(
    error?.response?.status
  );

  if (
    !Number.isInteger(status) ||
    status < 400 ||
    status >= 500
  ) {
    return false;
  }

  // Timeout and rate-limit responses may be
  // ambiguous when a purchase is in progress.

  return ![408, 425, 429].includes(status);
};

const UNKNOWN_PURCHASE_MESSAGE =
  "Xarid natijasini tasdiqlab bo'lmadi. " +
  "Qayta xarid qilishdan oldin FCoin balansingiz " +
  "va promotion tarixini tekshiring.";

// =========================================================
// MAIN HOOK
// =========================================================

const useProjectPromotionPurchase = ({
  projectId,
  projectName = "Project",

  plans = EMPTY_PLANS,
  currentBalance = 0,

  user = null,

  manageLoading = false,
  isLoadedForCurrentProject = false,

  loadPromotionData,
  onPromotionChange = null,
} = {}) => {
  const dispatch = useDispatch();

  // =======================================================
  // REDUX PURCHASE STATE
  // =======================================================

  const {
    purchaseLoading: reduxPurchaseLoading,
    purchaseError: reduxPurchaseError,
  } = useSelector(selectPromotionState);

  // =======================================================
  // PROJECT / USER IDENTITIES
  // =======================================================

  const projectKey = getProjectKey(projectId);
  const userKey = getUserKey(user);

  const hasProjectId =
    projectKey !== "" &&
    projectKey !== "0";

  // =======================================================
  // REFS
  // =======================================================

  const mountedRef = useRef(false);

  const purchaseLockRef = useRef(null);

  const currentContextRef = useRef({
    projectKey,
    userKey,
    user,
  });

  // A pending response must verify the current
  // project and user before updating their UI.

  currentContextRef.current = {
    projectKey,
    userKey,
    user,
  };

  // =======================================================
  // MOUNT / UNMOUNT
  // =======================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // =======================================================
  // LOCAL STATE
  // =======================================================

  const [
    selectedPlanState,
    setSelectedPlanState,
  ] = useState({
    projectKey: "",
    code: null,
  });

  const [
    confirmationState,
    setConfirmationState,
  ] = useState({
    projectKey: "",
    open: false,
  });

  const [
    processingState,
    setProcessingState,
  ] = useState({
    projectKey: "",
    active: false,
  });

  const [
    successState,
    setSuccessState,
  ] = useState({
    projectKey: "",
    message: "",
  });

  const [
    uncertainState,
    setUncertainState,
  ] = useState({
    projectKey: "",
    active: false,
  });

  // =======================================================
  // SAFE PLANS
  // =======================================================

  const safePlans = useMemo(() => {
    if (
      !isLoadedForCurrentProject ||
      !Array.isArray(plans)
    ) {
      return EMPTY_PLANS;
    }

    return plans.filter(isValidPlan);
  }, [
    plans,
    isLoadedForCurrentProject,
  ]);

  // =======================================================
  // SELECTED PLAN
  // =======================================================

  const selectedPlan = useMemo(() => {
    if (safePlans.length === 0) {
      return null;
    }

    const selectedCode =
      selectedPlanState.projectKey === projectKey
        ? selectedPlanState.code
        : null;

    // -------------------------------------
    // EXISTING SELECTION
    // -------------------------------------

    if (
      selectedCode !== null &&
      selectedCode !== undefined
    ) {
      const existingPlan = safePlans.find(
        (plan) =>
          isSamePlanCode(
            getPlanCode(plan),
            selectedCode
          )
      );

      if (existingPlan) {
        return existingPlan;
      }
    }

    // -------------------------------------
    // DEFAULT: PREMIUM
    // -------------------------------------

    const premium = safePlans.find(
      (plan) =>
        isSamePlanCode(
          getPlanCode(plan),
          "premium"
        )
    );

    return premium ?? safePlans[0];
  }, [
    safePlans,
    selectedPlanState,
    projectKey,
  ]);

  // =======================================================
  // SELECTED PLAN DETAILS
  // =======================================================

  const selectedPlanCode = selectedPlan
    ? getPlanCode(selectedPlan)
    : null;

  const selectedPrice =
    safePromotionPositiveNumber(
      selectedPlan?.price
    );

  const validSelectedPrice =
    Boolean(selectedPlan) &&
    hasValidPrice(selectedPlan.price);

  // =======================================================
  // FCoin VALIDATION
  // =======================================================

  const balance =
    safePromotionPositiveNumber(
      currentBalance
    );

  const hasEnoughCoins =
    validSelectedPrice &&
    balance >= selectedPrice;

  const missingCoins =
    validSelectedPrice
      ? Math.max(
          0,
          selectedPrice - balance
        )
      : 0;

  // =======================================================
  // PURCHASE STATES
  // =======================================================

  const isProcessingCurrentProject =
    processingState.projectKey === projectKey &&
    processingState.active;

  const purchaseLoading =
    Boolean(purchaseLockRef.current) ||
    isProcessingCurrentProject ||
    (
      isLoadedForCurrentProject &&
      Boolean(reduxPurchaseLoading)
    );

  const isPurchaseLocked = purchaseLoading;

  const isConfirmOpen =
    confirmationState.projectKey === projectKey &&
    confirmationState.open &&
    Boolean(selectedPlan);

  const successMessage =
    successState.projectKey === projectKey
      ? successState.message
      : "";

  const purchaseError =
    isLoadedForCurrentProject
      ? reduxPurchaseError
      : null;

  const isPurchaseOutcomeUnknown =
    uncertainState.projectKey === projectKey &&
    uncertainState.active;

  // =======================================================
  // CONTEXT CHECK
  // =======================================================

  const isCurrentContext = useCallback(
    (request) => {
      return (
        mountedRef.current &&
        currentContextRef.current.projectKey ===
          request.projectKey &&
        currentContextRef.current.userKey ===
          request.userKey
      );
    },
    []
  );

  // =======================================================
  // SELECT PLAN
  // =======================================================

  const handleSelectPlan = useCallback(
    (plan) => {
      if (
        !hasProjectId ||
        !isLoadedForCurrentProject ||
        manageLoading ||
        isPurchaseLocked ||
        isConfirmOpen ||
        !isValidPlan(plan)
      ) {
        return;
      }

      const code = getPlanCode(plan);

      // Only accept a plan that belongs
      // to the current server-provided list.

      const exists = safePlans.some(
        (item) =>
          isSamePlanCode(
            getPlanCode(item),
            code
          )
      );

      if (!exists) {
        return;
      }

      setSelectedPlanState({
        projectKey,
        code,
      });

      setSuccessState({
        projectKey,
        message: "",
      });
    },
    [
      hasProjectId,
      isLoadedForCurrentProject,
      manageLoading,
      isPurchaseLocked,
      isConfirmOpen,
      safePlans,
      projectKey,
    ]
  );

  // =======================================================
  // OPEN CONFIRMATION
  // =======================================================

  const handlePurchaseRequest = useCallback(
    () => {
      if (isPurchaseLocked) {
        return;
      }

      // -------------------------------------
      // UNKNOWN PREVIOUS PURCHASE
      // -------------------------------------

      if (isPurchaseOutcomeUnknown) {
        siteToast.warning(
          UNKNOWN_PURCHASE_MESSAGE,
          {
            title: "Oldingi xaridni tekshiring",
            duration: 6500,
          }
        );

        return;
      }

      // -------------------------------------
      // PROJECT
      // -------------------------------------

      if (!hasProjectId) {
        siteToast.error(
          "Project ID topilmadi.",
          {
            title: "Promotion boshlanmadi",
          }
        );

        return;
      }

      // -------------------------------------
      // DATA READY
      // -------------------------------------

      if (
        manageLoading ||
        !isLoadedForCurrentProject
      ) {
        siteToast.info(
          "Promotion ma'lumotlari yuklanmoqda.",
          {
            title: "Biroz kuting",
          }
        );

        return;
      }

      // -------------------------------------
      // PLAN
      // -------------------------------------

      if (!selectedPlan) {
        siteToast.warning(
          "Avval promotion rejasini tanlang.",
          {
            title: "Reja tanlanmagan",
          }
        );

        return;
      }

      // -------------------------------------
      // PRICE
      // -------------------------------------

      if (!validSelectedPrice) {
        siteToast.error(
          "Tanlangan promotion narxi noto'g'ri.",
          {
            title: "Promotion boshlanmadi",
          }
        );

        return;
      }

      // -------------------------------------
      // BALANCE
      // -------------------------------------

      if (!hasEnoughCoins) {
        siteToast.warning(
          `Balansingiz yetarli emas. Yana ${missingCoins} FCoin kerak.`,
          {
            title: "FCoin yetarli emas",
            duration: 4500,
          }
        );

        return;
      }

      // -------------------------------------
      // SUCCESS MESSAGE RESET
      // -------------------------------------

      setSuccessState({
        projectKey,
        message: "",
      });

      // -------------------------------------
      // OPEN
      // -------------------------------------

      setConfirmationState({
        projectKey,
        open: true,
      });
    },
    [
      isPurchaseLocked,
      isPurchaseOutcomeUnknown,
      hasProjectId,
      manageLoading,
      isLoadedForCurrentProject,
      selectedPlan,
      validSelectedPrice,
      hasEnoughCoins,
      missingCoins,
      projectKey,
    ]
  );

  // =======================================================
  // CLOSE CONFIRMATION
  // =======================================================

  const handleCloseConfirmation = useCallback(
    () => {
      if (isPurchaseLocked) {
        return;
      }

      setConfirmationState({
        projectKey,
        open: false,
      });
    },
    [
      isPurchaseLocked,
      projectKey,
    ]
  );

  // =======================================================
  // ACKNOWLEDGE UNCERTAIN PURCHASE
  // =======================================================

  // Call this only after the user has checked
  // their FCoin balance and promotion history.
  //
  // Do not automatically retry the POST.

  const handleAcknowledgeUnknown = useCallback(
    () => {
      if (isPurchaseLocked) {
        return;
      }

      setUncertainState({
        projectKey,
        active: false,
      });

      dispatch(
        clearPromotionPurchase()
      );
    },
    [
      isPurchaseLocked,
      projectKey,
      dispatch,
    ]
  );

  // =======================================================
  // CONFIRM PURCHASE
  // =======================================================

  const handleConfirmPurchase = useCallback(
    async () => {
      // -------------------------------------
      // GUARDS
      // -------------------------------------

      if (
        purchaseLockRef.current ||
        reduxPurchaseLoading ||
        isPurchaseOutcomeUnknown ||
        !isConfirmOpen ||
        !hasProjectId ||
        !isLoadedForCurrentProject ||
        manageLoading ||
        !selectedPlan ||
        !validSelectedPrice
      ) {
        return false;
      }

      if (!hasEnoughCoins) {
        setConfirmationState({
          projectKey,
          open: false,
        });

        siteToast.warning(
          "FCoin balansingiz yetarli emas.",
          {
            title: "Promotion sotib olinmadi",
          }
        );

        return false;
      }

      // ===================================================
      // REQUEST SNAPSHOT
      // ===================================================

      const request = {
        token: {},

        projectId,
        projectKey,
        userKey,

        planCode: getPlanCode(selectedPlan),

        planName:
          selectedPlan.name || "Promotion",

        projectName:
          projectName || "Project",

        onPromotionChange,
      };

      if (!request.planCode) {
        return false;
      }

      // ===================================================
      // SYNCHRONOUS LOCK
      // ===================================================

      // Set before the first await.
      // Double clicking cannot create
      // a second POST in this hook instance.

      purchaseLockRef.current = request;

      setProcessingState({
        projectKey: request.projectKey,
        active: true,
      });

      setSuccessState({
        projectKey: request.projectKey,
        message: "",
      });

      let toastId = null;

      let purchaseConfirmed = false;

      // ===================================================
      // FULL LIFECYCLE
      // ===================================================

      try {
        dispatch(
          purchasePromotionStart()
        );

        toastId = siteToast.loading(
          `"${request.projectName}" uchun promotion xarid qilinmoqda...`,
          {
            title:
              `${request.planName} xarid qilinmoqda`,
          }
        );

        let response;

        // =================================================
        // PURCHASE REQUEST
        // =================================================

        try {
          response =
            await PromotionService
              .purchaseProjectPromotion(
                request.projectId,
                request.planCode
              );

          // The POST returned successfully.
          purchaseConfirmed = true;
        } catch (error) {
          // ===============================================
          // PURCHASE REQUEST ERROR
          // ===============================================

          if (!isCurrentContext(request)) {
            siteToast.dismiss(toastId);
            return false;
          }

          const definiteRejection =
            isDefiniteRejection(error);

          const message = definiteRejection
            ? getErrorMessage(
                error,
                "Promotion xaridi rad etildi."
              )
            : UNKNOWN_PURCHASE_MESSAGE;

          dispatch(
            purchasePromotionFailure(message)
          );

          setConfirmationState({
            projectKey: request.projectKey,
            open: false,
          });

          if (definiteRejection) {
            siteToast.error(message, {
              id: toastId,
              title: "Promotion xarid qilinmadi",
              duration: 5000,
            });
          } else {
            setUncertainState({
              projectKey: request.projectKey,
              active: true,
            });

            siteToast.warning(message, {
              id: toastId,
              title: "Xarid holati noma'lum",
              duration: 7000,
            });
          }

          // ===============================================
          // RESYNC AFTER ERROR
          // ===============================================

          // Refresh GET is safe; do not retry
          // the purchase POST automatically.

          if (
            typeof loadPromotionData === "function"
          ) {
            try {
              await loadPromotionData({
                silent: true,
              });
            } catch {
              // Preserve purchase error.
            }
          }

          return false;
        }

        // =================================================
        // PURCHASE CONFIRMED BY API
        // =================================================

        if (!isCurrentContext(request)) {
          siteToast.dismiss(toastId);
          return true;
        }

        // =================================================
        // RESPONSE PROJECT VALIDATION
        // =================================================

        if (
          response?.project_id === null ||
          response?.project_id === undefined ||
          String(response.project_id) !==
            request.projectKey
        ) {
          // The POST returned successfully, but
          // the response is inconsistent.
          //
          // Never write this response into the
          // current project's Redux state.

          const message =
            "Server xarid javobini boshqa loyiha " +
            "bilan bog'ladi. Balans va tarixni " +
            "tekshiring.";

          setConfirmationState({
            projectKey: request.projectKey,
            open: false,
          });

          setUncertainState({
            projectKey: request.projectKey,
            active: true,
          });

          dispatch(
            purchasePromotionFailure(message)
          );

          siteToast.warning(message, {
            id: toastId,
            title: "Xaridni tekshirish kerak",
            duration: 7000,
          });

          if (
            typeof loadPromotionData === "function"
          ) {
            try {
              await loadPromotionData({
                silent: true,
              });
            } catch {
              // Do not retry purchase.
            }
          }

          return true;
        }

        // =================================================
        // POST-PURCHASE SYNCHRONIZATION
        // =================================================

        // The purchase is already successful.
        // Errors below must not trigger another
        // purchase request or purchase failure.

        let syncWarning = false;

        // -----------------------------------------------
        // PROMOTION REDUX
        // -----------------------------------------------

        try {
          dispatch(
            purchasePromotionSuccess(response)
          );
        } catch {
          syncWarning = true;
        }

        // -----------------------------------------------
        // AUTH FCoin BALANCE
        // -----------------------------------------------

        const latestUser =
          currentContextRef.current.user;

        if (
          latestUser &&
          request.userKey !== "" &&
          getUserKey(latestUser) ===
            request.userKey &&
          response.new_balance !== null &&
          response.new_balance !== undefined
        ) {
          try {
            dispatch(
              signUserSuccess({
                ...latestUser,
                coins:
                  safePromotionPositiveNumber(
                    response.new_balance
                  ),
              })
            );
          } catch {
            syncWarning = true;
          }
        }

        // -----------------------------------------------
        // CLOSE CONFIRMATION
        // -----------------------------------------------

        setConfirmationState({
          projectKey: request.projectKey,
          open: false,
        });

        // -----------------------------------------------
        // SUCCESS MESSAGE
        // -----------------------------------------------

        const message =
          typeof response.detail === "string" &&
          response.detail.trim()
            ? response.detail.trim()
            : `${request.planName} muvaffaqiyatli sotib olindi.`;

        setSuccessState({
          projectKey: request.projectKey,
          message,
        });

        siteToast.success(message, {
          id: toastId,
          title: "Promotion xarid qilindi",
          duration: 4200,
        });

        // =================================================
        // REFRESH PROMOTION DATA
        // =================================================

        if (
          typeof loadPromotionData === "function"
        ) {
          try {
            const refreshed =
              await loadPromotionData({
                silent: true,
              });

            if (!refreshed) {
              syncWarning = true;
            }
          } catch {
            syncWarning = true;
          }
        }

        // =================================================
        // REFRESH PROJECT DETAIL
        // =================================================

        if (
          isCurrentContext(request) &&
          typeof request.onPromotionChange ===
            "function"
        ) {
          try {
            await request.onPromotionChange();
          } catch {
            syncWarning = true;
          }
        }

        // =================================================
        // REFRESH WARNING
        // =================================================

        if (
          syncWarning &&
          isCurrentContext(request)
        ) {
          siteToast.warning(
            "Promotion xarid qilindi, ammo ayrim " +
            "ma'lumotlarni yangilab bo'lmadi. " +
            "Sahifani qayta yangilang.",
            {
              title: "Yangilash yakunlanmadi",
              duration: 5500,
            }
          );
        }

        return true;
      } catch (error) {
        // =================================================
        // UNEXPECTED ERROR
        // =================================================

        if (!isCurrentContext(request)) {
          siteToast.dismiss(toastId);
          return purchaseConfirmed;
        }

        if (purchaseConfirmed) {
          // Never mark a confirmed purchase
          // as a failed purchase.

          siteToast.warning(
            "Promotion xarid qilindi, ammo " +
            "interfeysni yangilashda muammo yuz berdi.",
            {
              id: toastId,
              title: "Yangilash xatosi",
              duration: 5500,
            }
          );

          return true;
        }

        const message = getErrorMessage(
          error,
          "Promotion xaridida xatolik yuz berdi."
        );

        dispatch(
          purchasePromotionFailure(message)
        );

        setConfirmationState({
          projectKey: request.projectKey,
          open: false,
        });

        siteToast.error(message, {
          id: toastId,
          title: "Xarid bajarilmadi",
          duration: 5000,
        });

        return false;
      } finally {
        // =================================================
        // ALWAYS RELEASE THE LOCK
        // =================================================

        if (
          purchaseLockRef.current?.token ===
          request.token
        ) {
          purchaseLockRef.current = null;
        }

        if (mountedRef.current) {
          setProcessingState({
            projectKey: request.projectKey,
            active: false,
          });
        }
      }
    },
    [
      dispatch,
      reduxPurchaseLoading,
      isPurchaseOutcomeUnknown,
      isConfirmOpen,
      hasProjectId,
      isLoadedForCurrentProject,
      manageLoading,
      selectedPlan,
      validSelectedPrice,
      hasEnoughCoins,
      projectId,
      projectKey,
      userKey,
      projectName,
      onPromotionChange,
      loadPromotionData,
      isCurrentContext,
    ]
  );

  // =========================================================
  // RETURN API
  // =========================================================

  return {
    // Selected plan
    selectedPlan,
    selectedPlanCode,
    selectedPrice,

    // Balance validation
    hasEnoughCoins,
    missingCoins,

    // Confirmation
    isConfirmOpen,

    // Purchase status
    purchaseLoading,
    isPurchaseLocked,
    purchaseError,
    successMessage,

    // Unknown result safety
    isPurchaseOutcomeUnknown,
    handleAcknowledgeUnknown,

    // Actions
    handleSelectPlan,
    handlePurchaseRequest,
    handleCloseConfirmation,
    handleConfirmPurchase,
  };
};

export default useProjectPromotionPurchase;
