
// =========================================================
// FSOCIETY — AXIOS API CLIENT
// =========================================================
//
// Location: src/services/api.js
//
// Features:
// - Django / DRF API
// - HttpOnly JWT cookie support
// - CSRF support
// - FormData compatibility
// - Automatic access-token refresh
// - Single-flight refresh requests
// - Retry original request once
// - Concurrent 401 handling
// - Safe logout notifications
// - No logout for temporary network errors
// - OAuth / Login / Register refresh exclusions
//
// Existing API endpoints remain unchanged.
// =========================================================

import axios from "axios";

import {
  API_URL,
} from "./config";

// =========================================================
// API CONFIGURATION
// =========================================================

const normalizeBaseURL = (url) => {
  if (!url) {
    return "/api";
  }

  const normalized = String(url)
    .trim()
    .replace(/\/+$/, "");

  return normalized || "/api";
};

const BASE_URL = normalizeBaseURL(API_URL);

// =========================================================
// AXIOS OPTIONS
// =========================================================
//
// Do not set a global Content-Type.
// The browser must provide the multipart
// boundary automatically for FormData.
//
// withXSRFToken helps Axios 1.x send Django's
// CSRF header when using a trusted cross-origin
// API with credentials.
//
// =========================================================

const AXIOS_OPTIONS = {
  baseURL: BASE_URL,

  withCredentials: true,

  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",

  withXSRFToken: true,
};

// =========================================================
// MAIN API INSTANCE
// =========================================================

const instance = axios.create(
  AXIOS_OPTIONS
);

// =========================================================
// REFRESH INSTANCE
// =========================================================
//
// Separate instance avoids recursive
// execution of the main response interceptor.
//
// Cookies and CSRF settings are identical.
//
// =========================================================

const refreshClient = axios.create(
  AXIOS_OPTIONS
);

// =========================================================
// AUTH ENDPOINTS
// =========================================================

const AUTH_ENDPOINTS = [
  "/users/login/",
  "/users/register/",
  "/users/logout/",
  "/users/token/refresh/",
  "/users/auth/google/",
  "/users/auth/github/",
];

// =========================================================
// LOGIN SUCCESS ENDPOINTS
// =========================================================

const AUTH_SUCCESS_ENDPOINTS = [
  "/users/login/",
  "/users/register/",
  "/users/auth/google/",
  "/users/auth/github/",
];

// =========================================================
// GET REQUEST PATH
// =========================================================
//
// Supports:
// /users/login/
// /api/users/login/
// https://domain.com/api/users/login/?next=/
//
// Query parameters cannot accidentally
// trigger an auth endpoint match.
//
// =========================================================

const getRequestPath = (url = "") => {
  try {
    const parsed = new URL(
      String(url || ""),
      "http://fsociety.local"
    );

    const path = parsed.pathname;

    return path.endsWith("/")
      ? path
      : `${path}/`;
  } catch {
    const path = String(url || "")
      .split("?")[0]
      .split("#")[0];

    return path.endsWith("/")
      ? path
      : `${path}/`;
  }
};

// =========================================================
// MATCH ENDPOINT
// =========================================================

const matchesEndpoint = (
  url,
  endpoints
) => {
  const path = getRequestPath(url);

  return endpoints.some(
    (endpoint) => path.endsWith(endpoint)
  );
};

// =========================================================
// AUTH ENDPOINT CHECK
// =========================================================

const isAuthEndpoint = (url) =>
  matchesEndpoint(
    url,
    AUTH_ENDPOINTS
  );

// =========================================================
// AUTH SUCCESS CHECK
// =========================================================

const isAuthSuccessEndpoint = (url) =>
  matchesEndpoint(
    url,
    AUTH_SUCCESS_ENDPOINTS
  );

// =========================================================
// REFRESH / SESSION STATE
// =========================================================
//
// refreshPromise:
// All concurrent 401 requests await the
// same refresh instead of sending several
// independent refresh requests.
//
// authRevision:
// Detects requests sent before a successful
// refresh or login.
//
// sessionInvalidated:
// Prevents repeated refresh attempts after
// the server confirms an invalid session.
//
// =========================================================

let refreshPromise = null;

let authRevision = 0;

let sessionInvalidated = false;

// =========================================================
// AUTH STORAGE CLEANUP
// =========================================================
//
// Do not call sessionStorage.clear().
//
// Other FSociety components may store their
// own unrelated state there.
//
// =========================================================

const clearLegacyAuthStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  const authKeys = [
    "user",
    "isLoggedIn",
    "access",
    "refresh",
    "access_token",
    "refresh_token",
    "token",
  ];

  const storages = [
    window.localStorage,
    window.sessionStorage,
  ];

  for (const storage of storages) {
    try {
      for (const key of authKeys) {
        storage.removeItem(key);
      }
    } catch {
      // Storage may be blocked.
    }
  }
};

// =========================================================
// NOTIFY SESSION LOGOUT
// =========================================================
//
// App.js already listens for:
//
// window.addEventListener(
//   "auth:logout",
//   handler
// )
//
// PrivateRoute handles navigation to Login.
//
// No window.location.href reload is needed.
//
// =========================================================

const notifySessionExpired = () => {
  if (sessionInvalidated) {
    return;
  }

  sessionInvalidated = true;

  ++authRevision;

  clearLegacyAuthStorage();

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("auth:logout")
    );
  }
};

// =========================================================
// REFRESH FAILURE CLASSIFICATION
// =========================================================
//
// 400 / 401 from the refresh endpoint
// generally indicates an invalid or
// expired refresh token.
//
// Do not log the user out because of:
// - Network Error
// - Request timeout
// - Server 500 / 502 / 503 / 504
// - Rate limiting
//
// 403 can also be a CSRF or configuration
// issue, so it is not treated as definitive
// session expiration here.
//
// =========================================================

const isInvalidRefreshSession = (
  error
) => {
  const status =
    error?.response?.status;

  return status === 400 ||
    status === 401;
};

// =========================================================
// REFRESH SESSION
// =========================================================
//
// Only one refresh request may be in
// progress at a time.
//
// Every request waiting for a refresh
// receives the same promise.
//
// =========================================================

const refreshSession = () => {
  if (sessionInvalidated) {
    return Promise.reject(
      new Error(
        "Autentifikatsiya sessiyasi tugagan."
      )
    );
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshClient
    .post(
      "/users/token/refresh/",
      {}
    )
    .then((response) => {
      // New access cookie should now be
      // available to subsequent requests.
      ++authRevision;

      sessionInvalidated = false;

      return response;
    })
    .catch((error) => {
      if (
        isInvalidRefreshSession(error)
      ) {
        notifySessionExpired();
      }

      // Preserve the original Axios error
      // including status, code and response.
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================
//
// Attach an internal auth revision so that
// a late 401 response from an older request
// does not cause a redundant refresh.
//
// Do not change Content-Type or payload.
//
// =========================================================

instance.interceptors.request.use(
  (config) => {
    if (
      config._authRevision === undefined
    ) {
      config._authRevision =
        authRevision;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

instance.interceptors.response.use(
  // =====================================================
  // SUCCESS
  // =====================================================

  (response) => {
    const url =
      response?.config?.url || "";

    // Login / Register / OAuth success
    // can establish a new session.
    //
    // Re-enable refresh for the new session
    // after a previous logout.
    if (isAuthSuccessEndpoint(url)) {
      sessionInvalidated = false;

      ++authRevision;
    }

    // A successful logout invalidates
    // the previous browser session.
    if (
      matchesEndpoint(
        url,
        ["/users/logout/"]
      )
    ) {
      sessionInvalidated = true;

      ++authRevision;
    }

    return response;
  },

  // =====================================================
  // ERROR
  // =====================================================

  async (error) => {
    const originalRequest =
      error?.config;

    const status =
      error?.response?.status;

    const url =
      originalRequest?.url || "";

    // ===================================================
    // NO REQUEST CONFIG
    // ===================================================

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ===================================================
    // ONLY HANDLE HTTP 401
    // ===================================================

    if (status !== 401) {
      return Promise.reject(error);
    }

    // ===================================================
    // SKIP AUTH ENDPOINTS
    //
    // Login errors must reach LoginForm.
    // Register errors must reach RegisterForm.
    // OAuth errors must reach SocialCallback.
    // Logout/refresh must not recurse.
    // ===================================================

    if (
      isAuthEndpoint(url)
    ) {
      return Promise.reject(error);
    }

    // ===================================================
    // OPTIONAL EXPLICIT OPT-OUT
    // ===================================================

    if (
      originalRequest.skipAuthRefresh === true
    ) {
      return Promise.reject(error);
    }

    // ===================================================
    // DO NOT RETRY TWICE
    // ===================================================

    if (
      originalRequest._retry === true
    ) {
      return Promise.reject(error);
    }

    // ===================================================
    // SESSION ALREADY INVALIDATED
    // ===================================================

    if (sessionInvalidated) {
      return Promise.reject(error);
    }

    // ===================================================
    // MARK RETRY
    // ===================================================

    originalRequest._retry = true;

    // ===================================================
    // LATE 401 RESPONSE
    //
    // Another request may have already
    // refreshed the access token.
    //
    // If this request was sent before that
    // refresh, retry with the new cookie
    // without refreshing a second time.
    // ===================================================

    const requestRevision =
      originalRequest._authRevision ??
      authRevision;

    if (
      requestRevision < authRevision
    ) {
      return instance(originalRequest);
    }

    // ===================================================
    // REFRESH ACCESS TOKEN
    // ===================================================

    try {
      await refreshSession();

      // Cookies are automatically sent by
      // Axios because withCredentials=true.
      //
      // Retry original request exactly once.
      return instance(originalRequest);
    } catch (refreshError) {
      // If refresh failed with a confirmed
      // invalid session, notifySessionExpired
      // has already dispatched auth:logout.
      //
      // Temporary network/server failures
      // do not clear authentication state.
      //
      // All callers receive the error.

      return Promise.reject(
        refreshError
      );
    }
  }
);

// =========================================================
// EXPORT
// =========================================================

export default instance;
