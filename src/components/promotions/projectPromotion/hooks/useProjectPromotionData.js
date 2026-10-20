
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  clearProjectPromotion,
  getProjectPromotionFailure,
  getProjectPromotionStart,
  getProjectPromotionSuccess,
  selectPromotionState,
} from "../../../../features/promotions";

import PromotionService from "../../../../services/promotion";

import {
  safePromotionPositiveNumber,
} from "../../../../utils/promotion";

import {
  siteToast,
} from "../../../ui/AuthToast";

import {
  getErrorMessage,
  isCanceledRequest,
} from "../utils/projectPromotionHelpers";

// =========================================================
// FSOCIETY — USE PROJECT PROMOTION DATA
// =========================================================
//
// Responsibilities:
// - Current project identity
// - Promotion manage API
// - Redux synchronization
// - Initial loading and refresh
// - Request cancellation
// - Stale response protection
// - Error handling and retry
// - FCoin balance fallback
//
// No purchase POST is performed here.
// =========================================================

const EMPTY_ARRAY = [];

// =========================================================
// HELPERS
// =========================================================

const getProjectKey = (projectId) => {
  if (
    projectId === null ||
    projectId === undefined
  ) {
    return "";
  }

  return String(projectId).trim();
};

const getSafeArray = (value) => {
  return Array.isArray(value)
    ? value
    : EMPTY_ARRAY;
};

// =========================================================
// MAIN HOOK
// =========================================================

const useProjectPromotionData = ({
  projectId,
  userCoins = 0,
} = {}) => {
  const dispatch = useDispatch();

  // =======================================================
  // AUTH STATE
  // =======================================================

  const user = useSelector(
    (state) => state.auth?.user ?? null
  );

  // =======================================================
  // PROMOTION REDUX STATE
  // =======================================================

  const promotion = useSelector(
    selectPromotionState
  );

  const {
    projectId: loadedProjectId,

    balance,
    plans,

    isPromoted,
    promotionExpiresAt,

    activeCampaign,
    queue,
    history,

    totalPurchases,
    totalSpent,

    manageLoading,
    manageError: reduxManageError,

    purchaseLoading,
  } = promotion;

  // =======================================================
  // PROJECT IDENTITY
  // =======================================================

  const projectKey = getProjectKey(projectId);

  const hasProjectId =
    projectKey !== "" &&
    projectKey !== "0";

  const latestProjectKeyRef = useRef(
    projectKey
  );

  // Update synchronously during render.
  // A late promise continuation can inspect
  // the current project even before effect
  // cleanup has run.

  latestProjectKeyRef.current = projectKey;

  // =======================================================
  // REQUEST REFS
  // =======================================================

  const activeRequestRef = useRef(null);

  const requestSequenceRef = useRef(0);

  // =======================================================
  // LOCAL REQUEST STATE
  // =======================================================

  const [
    requestState,
    setRequestState,
  ] = useState({
    projectKey,
    status: "idle",
    error: null,
  });

  // =======================================================
  // CURRENT PROJECT DATA CHECK
  // =======================================================

  const isLoadedForCurrentProject =
    hasProjectId &&
    loadedProjectId !== null &&
    loadedProjectId !== undefined &&
    String(loadedProjectId) === projectKey;

  // =======================================================
  // LOCAL REQUEST STATUS
  // =======================================================

  const requestBelongsToCurrentProject =
    requestState.projectKey === projectKey;

  const requestStatus =
    requestBelongsToCurrentProject
      ? requestState.status
      : "idle";

  const requestError =
    requestBelongsToCurrentProject
      ? requestState.error
      : null;

  // =======================================================
  // SAFE DATA
  // =======================================================

  // Never expose campaign, queue or history
  // belonging to a different project.

  const safePlans = isLoadedForCurrentProject
    ? getSafeArray(plans)
    : EMPTY_ARRAY;

  const safeQueue = isLoadedForCurrentProject
    ? getSafeArray(queue)
    : EMPTY_ARRAY;

  const safeHistory = isLoadedForCurrentProject
    ? getSafeArray(history)
    : EMPTY_ARRAY;

  const currentActiveCampaign =
    isLoadedForCurrentProject
      ? activeCampaign ?? null
      : null;

  const currentTotalPurchases =
    isLoadedForCurrentProject
      ? safePromotionPositiveNumber(
          totalPurchases
        )
      : 0;

  const currentTotalSpent =
    isLoadedForCurrentProject
      ? safePromotionPositiveNumber(
          totalSpent
        )
      : 0;

  // =======================================================
  // FCoin BALANCE
  // =======================================================

  // Manage API balance is authoritative once
  // current project data has been loaded.

  const currentBalance =
    isLoadedForCurrentProject
      ? safePromotionPositiveNumber(balance)
      : safePromotionPositiveNumber(
          user?.coins ?? userCoins
        );

  // =======================================================
  // LOADING STATES
  // =======================================================

  const isInitialLoading =
    hasProjectId &&
    !isLoadedForCurrentProject &&
    (
      requestStatus === "idle" ||
      requestStatus === "loading"
    );

  const isRefreshing =
    isLoadedForCurrentProject &&
    Boolean(manageLoading);

  // =======================================================
  // ERROR STATE
  // =======================================================

  const currentManageError =
    isLoadedForCurrentProject ||
    requestStatus === "error"
      ? requestError ??
        reduxManageError ??
        null
      : null;

  // =======================================================
  // ABORT ACTIVE REQUEST
  // =======================================================

  const cancelActiveRequest = useCallback(
    () => {
      // Invalidate any response from a
      // previous request.

      requestSequenceRef.current += 1;

      const previous =
        activeRequestRef.current;

      activeRequestRef.current = null;

      if (previous?.controller) {
        previous.controller.abort();
      }
    },
    []
  );

  // =======================================================
  // LOAD PROJECT PROMOTION
  // =======================================================

  const loadPromotionData = useCallback(
    async ({
      silent = false,
      signal,
    } = {}) => {
      if (!hasProjectId) {
        return false;
      }

      // =====================================
      // CANCEL PREVIOUS REQUEST
      // =====================================

      cancelActiveRequest();

      const controller =
        new AbortController();

      const requestId =
        requestSequenceRef.current;

      const requestedProjectKey =
        projectKey;

      activeRequestRef.current = {
        id: requestId,
        projectKey: requestedProjectKey,
        controller,
      };

      // =====================================
      // OPTIONAL EXTERNAL SIGNAL
      // =====================================

      // The hook owns an AbortController.
      // An external caller may additionally
      // cancel this particular request.

      const handleExternalAbort = () => {
        controller.abort();
      };

      if (signal?.aborted) {
        controller.abort();
      } else if (signal) {
        signal.addEventListener(
          "abort",
          handleExternalAbort,
          { once: true }
        );
      }

      // =====================================
      // REQUEST OWNERSHIP
      // =====================================

      const isCurrentRequest = () => {
        return (
          !controller.signal.aborted &&
          requestSequenceRef.current ===
            requestId &&
          latestProjectKeyRef.current ===
            requestedProjectKey
        );
      };

      // =====================================
      // START
      // =====================================

      if (!controller.signal.aborted) {
        setRequestState({
          projectKey: requestedProjectKey,
          status: "loading",
          error: null,
        });

        dispatch(
          getProjectPromotionStart()
        );
      }

      // ===================================================
      // REQUEST
      // ===================================================

      try {
        if (controller.signal.aborted) {
          return false;
        }

        const response =
          await PromotionService
            .getProjectPromotionManage(
              projectId,
              {
                signal: controller.signal,
              }
            );

        // =====================================
        // STALE RESPONSE
        // =====================================

        if (!isCurrentRequest()) {
          return false;
        }

        // =====================================
        // RESPONSE VALIDATION
        // =====================================

        if (
          !response ||
          typeof response !== "object" ||
          Array.isArray(response)
        ) {
          throw new Error(
            "Server promotion ma'lumotlarini noto'g'ri formatda qaytardi."
          );
        }

        if (
          response.project_id === null ||
          response.project_id === undefined ||
          String(response.project_id) !==
            requestedProjectKey
        ) {
          throw new Error(
            "Server boshqa loyihaning promotion ma'lumotlarini qaytardi."
          );
        }

        // =====================================
        // REDUX SUCCESS
        // =====================================

        dispatch(
          getProjectPromotionSuccess(response)
        );

        setRequestState({
          projectKey: requestedProjectKey,
          status: "success",
          error: null,
        });

        return true;
      } catch (error) {
        // =====================================
        // ABORT / STALE RESPONSE
        // =====================================

        if (
          isCanceledRequest(error) ||
          !isCurrentRequest()
        ) {
          return false;
        }

        // =====================================
        // ERROR
        // =====================================

        const message = getErrorMessage(
          error,
          "Promotion ma'lumotlarini yuklab bo'lmadi."
        );

        dispatch(
          getProjectPromotionFailure(message)
        );

        setRequestState({
          projectKey: requestedProjectKey,
          status: "error",
          error: message,
        });

        if (!silent) {
          siteToast.error(message, {
            title: "Promotion yuklanmadi",
            duration: 4500,
          });
        }

        return false;
      } finally {
        // =====================================
        // REMOVE EXTERNAL LISTENER
        // =====================================

        if (signal) {
          signal.removeEventListener(
            "abort",
            handleExternalAbort
          );
        }

        // =====================================
        // CLEAR ACTIVE REQUEST
        // =====================================

        if (
          activeRequestRef.current?.id ===
            requestId &&
          activeRequestRef.current?.controller ===
            controller
        ) {
          activeRequestRef.current = null;
        }
      }
    },
    [
      cancelActiveRequest,
      dispatch,
      hasProjectId,
      projectId,
      projectKey,
    ]
  );

  // =======================================================
  // INITIAL LOAD / PROJECT CHANGE
  // =======================================================

  useEffect(() => {
    if (!hasProjectId) {
      cancelActiveRequest();

      dispatch(
        clearProjectPromotion()
      );

      return undefined;
    }

    // Initial loading is silent.
    // The component displays the error
    // and allows a manual retry.

    loadPromotionData({
      silent: true,
    });

    return () => {
      cancelActiveRequest();

      // This Redux slice stores one current
      // project. Clear it during project
      // transition or unmount.

      dispatch(
        clearProjectPromotion()
      );
    };
  }, [
    cancelActiveRequest,
    dispatch,
    hasProjectId,
    loadPromotionData,
  ]);

  // =======================================================
  // MANUAL REFRESH / RETRY
  // =======================================================

  const handleRefresh = useCallback(
    async () => {
      // =====================================
      // GUARDS
      // =====================================

      if (
        !hasProjectId ||
        manageLoading ||
        purchaseLoading ||
        activeRequestRef.current
      ) {
        return false;
      }

      const requestedProjectKey = projectKey;

      // =====================================
      // SHOW LOADING TOAST
      // =====================================

      const toastId = siteToast.loading(
        "Promotion ma'lumotlari yangilanmoqda...",
        {
          title: "Yangilanmoqda",
        }
      );

      // =====================================
      // FETCH
      // =====================================

      const pending = loadPromotionData({
        silent: true,
      });

      const requestId =
        requestSequenceRef.current;

      const success = await pending;

      // =====================================
      // IGNORE STALE RESULT
      // =====================================

      if (
        latestProjectKeyRef.current !==
          requestedProjectKey ||
        requestSequenceRef.current !==
          requestId
      ) {
        siteToast.dismiss(toastId);

        return false;
      }

      // =====================================
      // SUCCESS
      // =====================================

      if (success) {
        siteToast.success(
          "Promotion ma'lumotlari yangilandi.",
          {
            id: toastId,
            title: "Yangilandi",
            duration: 2000,
          }
        );

        return true;
      }

      // =====================================
      // FAILURE
      // =====================================

      siteToast.error(
        "Promotion ma'lumotlarini yangilab bo'lmadi.",
        {
          id: toastId,
          title: "Xatolik",
          duration: 4500,
        }
      );

      return false;
    },
    [
      hasProjectId,
      manageLoading,
      purchaseLoading,
      projectKey,
      loadPromotionData,
    ]
  );

  // =======================================================
  // RETURN API
  // =======================================================

  return {
    // Identity
    projectId,
    hasProjectId,
    isLoadedForCurrentProject,

    // Auth
    user,

    // FCoin
    currentBalance,

    // Plans
    plans: safePlans,

    // Active promotion
    activeCampaign: currentActiveCampaign,

    isPromoted:
      isLoadedForCurrentProject
        ? Boolean(isPromoted)
        : false,

    promotionExpiresAt:
      isLoadedForCurrentProject
        ? promotionExpiresAt
        : null,

    // Queue
    queue: safeQueue,

    // History
    history: safeHistory,

    totalPurchases: currentTotalPurchases,
    totalSpent: currentTotalSpent,

    // Loading
    manageLoading: Boolean(manageLoading),
    isInitialLoading,
    isRefreshing,

    // Error
    manageError: currentManageError,

    // Request state
    requestStatus,

    // Actions
    loadPromotionData,
    handleRefresh,
  };
};

export default useProjectPromotionData;
