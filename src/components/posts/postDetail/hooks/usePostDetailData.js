
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

import PostService from "../../../../services/post";

import {
  getPostDetailFailure,
  getPostDetailStart,
  getPostDetailSuccess,
} from "../../../../features/posts";

import {
  getErrorMessage,
  getPostHttpStatus,
} from "../postDetailHelpers";

// =========================================================
// FSOCIETY — USE POST DETAIL DATA
// =========================================================
//
// Responsibilities:
//
// - Load Post Detail
// - Synchronize Redux
// - Detect 404 / permission / network errors
// - Prevent stale responses
// - Protect against route changes
// - Manage initial loading
// - Support manual retry
// - Avoid state updates after unmount
//
// Existing API contract:
//
// PostService.getPostDetail(username, slug)
//
// Existing Redux actions:
//
// getPostDetailStart
// getPostDetailSuccess
// getPostDetailFailure
//
// =========================================================

// =========================================================
// HELPERS
// =========================================================

const normalizeValue = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
};

const getRouteKey = (username, slug) => {
  return JSON.stringify([
    normalizeValue(username),
    normalizeValue(slug),
  ]);
};

// =========================================================
// ERROR NORMALIZATION
// =========================================================

const normalizePostDetailError = (error) => {
  const message = getErrorMessage(
    error,
    "Post ma'lumotlarini yuklab bo'lmadi."
  );

  let status = getPostHttpStatus(error);

  // PostService currently converts Axios
  // errors into ordinary Error objects.
  //
  // As a fallback, recognize the familiar
  // Django REST Framework error messages.

  if (status === null) {
    if (
      /no\s+post\s+matches\s+the\s+given\s+query/i.test(
        message
      ) ||
      /\bpost\s+(not\s+found|does\s+not\s+exist)\b/i.test(
        message
      ) ||
      /^not\s+found\.?$/i.test(message) ||
      /\bstatus\s+code\s+404\b/i.test(message)
    ) {
      status = 404;
    } else if (
      /authentication\s+credentials\s+were\s+not\s+provided/i.test(
        message
      ) ||
      /not\s+authenticated/i.test(message) ||
      /\bstatus\s+code\s+401\b/i.test(message)
    ) {
      status = 401;
    } else if (
      /permission\s+denied/i.test(message) ||
      /you\s+do\s+not\s+have\s+permission/i.test(
        message
      ) ||
      /\bstatus\s+code\s+403\b/i.test(message)
    ) {
      status = 403;
    } else if (
      /\bstatus\s+code\s+5\d\d\b/i.test(message) ||
      /internal\s+server\s+error/i.test(message)
    ) {
      status = 500;
    }
  }

  return {
    status,
    message,
  };
};

// =========================================================
// VALIDATE POST RESPONSE
// =========================================================

const isValidPostResponse = (post) => {
  return (
    post !== null &&
    typeof post === "object" &&
    !Array.isArray(post) &&
    post.id !== null &&
    post.id !== undefined
  );
};

// =========================================================
// CHECK POST / ROUTE MATCH
// =========================================================

const isPostForRoute = (
  post,
  username,
  slug
) => {
  if (!isValidPostResponse(post)) {
    return false;
  }

  const expectedSlug = normalizeValue(slug);

  const responseSlug =
    normalizeValue(post.slug);

  if (
    responseSlug &&
    responseSlug !== expectedSlug
  ) {
    return false;
  }

  const expectedUsername =
    normalizeValue(username).toLowerCase();

  const responseUsername =
    normalizeValue(
      post.user?.username
    ).toLowerCase();

  if (
    responseUsername &&
    responseUsername !== expectedUsername
  ) {
    return false;
  }

  return true;
};

// =========================================================
// MAIN HOOK
// =========================================================

const usePostDetailData = ({
  username,
  slug,
} = {}) => {
  const dispatch = useDispatch();

  // =======================================================
  // REDUX STATE
  // =======================================================

  const {
    postDetail: reduxPostData,
    detail_isLoading: reduxLoading,
    detail_error: reduxError,
  } = useSelector(
    (state) => state.post
  );

  // =======================================================
  // ROUTE IDENTITY
  // =======================================================

  const normalizedUsername =
    normalizeValue(username);

  const normalizedSlug =
    normalizeValue(slug);

  const routeKey = getRouteKey(
    normalizedUsername,
    normalizedSlug
  );

  const hasValidRoute = Boolean(
    normalizedUsername &&
    normalizedSlug
  );

  // =======================================================
  // REQUEST REFERENCES
  // =======================================================

  const mountedRef = useRef(false);

  const currentRouteRef = useRef(routeKey);

  const requestSequenceRef = useRef(0);

  currentRouteRef.current = routeKey;

  // =======================================================
  // LOCAL REQUEST STATE
  // =======================================================

  const [
    requestState,
    setRequestState,
  ] = useState({
    routeKey,
    status: "idle",
    error: null,
  });

  // =======================================================
  // MOUNT / UNMOUNT
  // =======================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      // Invalidate requests belonging to the
      // component being unmounted.

      requestSequenceRef.current += 1;
    };
  }, []);

  // =======================================================
  // CURRENT ROUTE REQUEST STATE
  // =======================================================

  const requestBelongsToCurrentRoute =
    requestState.routeKey === routeKey;

  const requestStatus =
    requestBelongsToCurrentRoute
      ? requestState.status
      : "idle";

  // =======================================================
  // CURRENT POST
  // =======================================================

  // A Redux post from another route must
  // never be displayed as the current post.

  const isCurrentPost =
    hasValidRoute &&
    requestStatus === "success" &&
    isPostForRoute(
      reduxPostData,
      normalizedUsername,
      normalizedSlug
    );

  const postData =
    isCurrentPost
      ? reduxPostData
      : null;

  // =======================================================
  // LOADING
  // =======================================================

  const isLoading =
    hasValidRoute &&
    (
      requestStatus === "idle" ||
      requestStatus === "loading"
    );

  // =======================================================
  // ERROR
  // =======================================================

  const invalidRouteError = {
    status: 400,
    message:
      "Post manzili noto'g'ri. " +
      "Muallif yoki post identifikatori topilmadi.",
  };

  const error = !hasValidRoute
    ? invalidRouteError
    : requestStatus === "error"
      ? requestState.error
      : (
          requestStatus === "success" &&
          !isCurrentPost
        )
        ? {
            status: null,
            message:
              "Post ma'lumotlarini ko'rsatib bo'lmadi.",
          }
        : null;

  const errorStatus =
    error?.status ?? null;

  // =======================================================
  // LOAD POST DETAIL
  // =======================================================

  const getDetail = useCallback(
    async () => {
      const requestedRouteKey = routeKey;

      const requestId =
        ++requestSequenceRef.current;

      // =====================================
      // REQUEST OWNERSHIP
      // =====================================

      const isCurrentRequest = () => {
        return (
          mountedRef.current &&
          currentRouteRef.current ===
            requestedRouteKey &&
          requestSequenceRef.current ===
            requestId
        );
      };

      // =====================================
      // INVALID ROUTE
      // =====================================

      if (!hasValidRoute) {
        const invalidError = {
          status: 400,
          message:
            "Post manzili noto'g'ri.",
        };

        setRequestState({
          routeKey: requestedRouteKey,
          status: "error",
          error: invalidError,
        });

        dispatch(
          getPostDetailStart()
        );

        dispatch(
          getPostDetailFailure(
            invalidError.message
          )
        );

        return false;
      }

      // =====================================
      // START LOADING
      // =====================================

      setRequestState({
        routeKey: requestedRouteKey,
        status: "loading",
        error: null,
      });

      dispatch(
        getPostDetailStart()
      );

      try {
        // ===================================
        // SERVICE API
        // ===================================

        const response =
          await PostService.getPostDetail(
            normalizedUsername,
            normalizedSlug
          );

        // ===================================
        // IGNORE STALE RESPONSE
        // ===================================

        if (!isCurrentRequest()) {
          return false;
        }

        // ===================================
        // VALIDATE RESPONSE
        // ===================================

        if (!isValidPostResponse(response)) {
          throw new Error(
            "Server post ma'lumotlarini noto'g'ri formatda qaytardi."
          );
        }

        if (
          !isPostForRoute(
            response,
            normalizedUsername,
            normalizedSlug
          )
        ) {
          throw new Error(
            "Server boshqa postning ma'lumotlarini qaytardi."
          );
        }

        // ===================================
        // REDUX SUCCESS
        // ===================================

        dispatch(
          getPostDetailSuccess(response)
        );

        setRequestState({
          routeKey: requestedRouteKey,
          status: "success",
          error: null,
        });

        return true;
      } catch (requestError) {
        // ===================================
        // STALE ERROR
        // ===================================

        if (!isCurrentRequest()) {
          return false;
        }

        // ===================================
        // NORMALIZE ERROR
        // ===================================

        const normalizedError =
          normalizePostDetailError(
            requestError
          );

        // ===================================
        // REDUX FAILURE
        // ===================================

        // Existing reducer expects a string.
        // Preserve this contract.

        dispatch(
          getPostDetailFailure(
            normalizedError.message
          )
        );

        // ===================================
        // LOCAL STRUCTURED ERROR
        // ===================================

        // The new ErrorState can identify
        // a 404 without requiring a Redux
        // slice contract change.

        setRequestState({
          routeKey: requestedRouteKey,
          status: "error",
          error: normalizedError,
        });

        return false;
      }
    },
    [
      dispatch,
      hasValidRoute,
      normalizedUsername,
      normalizedSlug,
      routeKey,
    ]
  );

  // =======================================================
  // INITIAL LOAD / ROUTE CHANGE
  // =======================================================

  useEffect(() => {
    getDetail();

    return () => {
      // The existing PostService doesn't
      // accept an AbortController signal.
      //
      // Prevent obsolete responses from
      // changing Redux instead.

      requestSequenceRef.current += 1;
    };
  }, [getDetail]);

  // =======================================================
  // RETURN API
  // =======================================================

  return {
    // Route
    username: normalizedUsername,
    slug: normalizedSlug,
    hasValidRoute,

    // Post
    postData,
    isCurrentPost,

    // Loading
    isLoading,

    // Error
    error,
    errorStatus,

    // Request
    requestStatus,

    // Existing Redux state (diagnostics)
    reduxLoading,
    reduxError,

    // Actions
    getDetail,
    reload: getDetail,
  };
};

export default usePostDetailData;
