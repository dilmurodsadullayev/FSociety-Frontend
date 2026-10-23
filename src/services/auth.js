
// =========================================================
// FSOCIETY — AUTH SERVICE
// =========================================================
//
// Location: src/services/auth.js
//
// Features:
// - Login
// - Register
// - Google / GitHub OAuth
// - Logout
// - JWT cookie refresh
// - Current user
// - User profile
// - Normalized HTTP errors
// - Preserved DRF field validation errors
//
// Axios instance is imported from ./api.
// Existing cookie/auth configuration is preserved.
// =========================================================

import axios from "./api";

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_ERROR =
  "Kutilmagan xatolik yuz berdi.";

const NETWORK_ERROR =
  "Server bilan bog‘lanib bo‘lmadi. " +
  "Internet aloqangizni tekshiring.";

const TIMEOUT_ERROR =
  "Server javobi kechikmoqda. " +
  "Birozdan keyin qayta urinib ko‘ring.";

const AUTH_STORAGE_KEYS = [
  "user",
  "isLoggedIn",
  "access",
  "refresh",
  "access_token",
  "refresh_token",
  "token",
];

// =========================================================
// HELPERS
// =========================================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const isFilledString = (value) =>
  typeof value === "string" &&
  value.trim().length > 0;

// =========================================================
// EXTRACT ERROR TEXT
// =========================================================

const extractMessage = (
  value,
  depth = 0
) => {
  if (depth > 5 || value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const result = extractMessage(
        item,
        depth + 1
      );

      if (result) {
        return result;
      }
    }

    return "";
  }

  if (!isObject(value)) {
    return "";
  }

  // Common Django / DRF messages.
  for (const key of [
    "detail",
    "message",
    "msg",
    "error",
    "non_field_errors",
    "__all__",
  ]) {
    if (value[key] == null) {
      continue;
    }

    const result = extractMessage(
      value[key],
      depth + 1
    );

    if (result) {
      return result;
    }
  }

  // Prefer actual validation errors
  // over generic JSON serialization.
  for (const key of [
    "errors",
    "field_errors",
    "validation_errors",
    "username",
    "email",
    "password",
    "password1",
    "password2",
  ]) {
    if (value[key] == null) {
      continue;
    }

    const result = extractMessage(
      value[key],
      depth + 1
    );

    if (result) {
      return result;
    }
  }

  return "";
};

// =========================================================
// GET RAW SERVER DATA
// =========================================================

const getServerData = (error) =>
  error?.serverData ??
  error?.response?.data ??
  error?.originalError?.response?.data ??
  null;

// =========================================================
// HTTP ERROR MESSAGE
// =========================================================

const getHttpErrorMessage = (
  status,
  fallback
) => {
  if (status === 429) {
    return (
      "Juda ko‘p urinish amalga oshirildi. " +
      "Birozdan keyin qayta urinib ko‘ring."
    );
  }

  if (status === 502 ||
      status === 503 ||
      status === 504) {
    return (
      "Server vaqtincha ishlamayapti. " +
      "Keyinroq qayta urinib ko‘ring."
    );
  }

  if (
    typeof status === "number" &&
    status >= 500
  ) {
    return (
      "Serverda ichki xatolik yuz berdi. " +
      "Keyinroq qayta urinib ko‘ring."
    );
  }

  return fallback;
};

// =========================================================
// GET USER-FRIENDLY ERROR MESSAGE
// =========================================================

export const getAuthErrorMessage = (
  error,
  fallback = DEFAULT_ERROR
) => {
  if (!error) {
    return fallback;
  }

  const code =
    error?.code ??
    error?.originalError?.code;

  if (code === "ERR_CANCELED") {
    return "So‘rov bekor qilindi.";
  }

  if (
    code === "ERR_NETWORK" ||
    error?.message === "Network Error"
  ) {
    return NETWORK_ERROR;
  }

  if (
    code === "ECONNABORTED" ||
    code === "ETIMEDOUT"
  ) {
    return TIMEOUT_ERROR;
  }

  const data = getServerData(error);

  const status =
    error?.status ??
    error?.response?.status ??
    error?.originalError?.response?.status ??
    null;

  // Server validation should not be hidden
  // by a generic HTTP status message.
  const serverMessage = extractMessage(data);

  if (serverMessage) {
    return serverMessage;
  }

  const statusMessage =
    getHttpErrorMessage(
      status,
      ""
    );

  if (statusMessage) {
    return statusMessage;
  }

  const errorMessage =
    error?.message;

  if (
    isFilledString(errorMessage) &&
    !/^Request failed with status code \d+$/i.test(
      errorMessage.trim()
    )
  ) {
    return errorMessage.trim();
  }

  return fallback;
};

// =========================================================
// NORMALIZE FIELD ERRORS
// =========================================================
//
// Supports:
// {
//   errors: {
//     username: ["Already exists"]
//   }
// }
//
// And direct DRF format:
// {
//   username: ["Already exists"]
// }
//
// No validation information is discarded.
// =========================================================

const extractFieldErrors = (data) => {
  if (!isObject(data)) {
    return {};
  }

  const nested =
    data.errors ??
    data.field_errors ??
    data.validation_errors;

  if (isObject(nested)) {
    return nested;
  }

  const result = {};

  for (const key of [
    "username",
    "email",
    "password",
    "password1",
    "password2",
    "confirm_password",
    "non_field_errors",
  ]) {
    if (data[key] !== undefined) {
      result[key] = data[key];
    }
  }

  return result;
};

// =========================================================
// CREATE SERVICE ERROR
// =========================================================
//
// Important: Register error parser expects:
//
// error.message
// error.status
// error.serverData
// error.fieldErrors
// error.originalError
//
// Additional Axios-compatible properties
// are preserved for existing components.
// =========================================================

export const createAuthServiceError = (
  error,
  fallback = DEFAULT_ERROR
) => {
  if (
    error?.name === "AuthServiceError"
  ) {
    return error;
  }

  const serverData =
    getServerData(error);

  const serviceError = new Error(
    getAuthErrorMessage(
      error,
      fallback
    )
  );

  serviceError.name =
    "AuthServiceError";

  serviceError.status =
    error?.status ??
    error?.response?.status ??
    null;

  serviceError.code =
    error?.code ?? null;

  serviceError.serverData =
    serverData;

  serviceError.fieldErrors =
    extractFieldErrors(
      serverData
    );

  // Compatibility with code reading
  // error.response?.status and .data.
  serviceError.response =
    error?.response ?? null;

  serviceError.originalError =
    error;

  return serviceError;
};

// =========================================================
// CLEAR LEGACY AUTH STORAGE
// =========================================================
//
// JWT cookies are managed by the backend.
// Do not attempt to read HttpOnly cookies.
//
// Only auth-related legacy keys are removed.
// Do not clear all sessionStorage because
// other FSociety features may use it.
// =========================================================

const clearLegacyAuthStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  const storages = [
    window.localStorage,
    window.sessionStorage,
  ];

  for (const storage of storages) {
    try {
      for (const key of AUTH_STORAGE_KEYS) {
        storage.removeItem(key);
      }
    } catch {
      // Storage may be inaccessible
      // in restrictive browser modes.
    }
  }
};

// =========================================================
// AUTH SERVICE
// =========================================================

const AuthService = {
  // =====================================================
  // LOGIN
  // =====================================================

  async userLogin({
    username,
    password,
  }) {
    try {
      const { data } = await axios.post(
        "/users/login/",
        {
          username,
          password,
        }
      );

      return data;
    } catch (error) {
      throw createAuthServiceError(
        error,
        "Login qilishda xatolik yuz berdi."
      );
    }
  },

  // =====================================================
  // REGISTER
  // =====================================================

  async userRegister({
    username,
    email,
    password,
    password2,
  }) {
    try {
      const { data } = await axios.post(
        "/users/register/",
        {
          username,
          email,
          password,
          password2,
        }
      );

      return data;
    } catch (error) {
      // Never log passwords, raw request
      // configs or full registration payloads.
      //
      // Preserve backend validation in the
      // thrown error for registerErrorParser.

      throw createAuthServiceError(
        error,
        "Ro‘yxatdan o‘tishda xatolik yuz berdi."
      );
    }
  },

  // =====================================================
  // GOOGLE / GITHUB SOCIAL LOGIN
  // =====================================================

  async socialLogin(
    provider,
    code
  ) {
    const safeProvider =
      typeof provider === "string"
        ? provider.trim().toLowerCase()
        : "";

    if (
      !["google", "github"].includes(
        safeProvider
      )
    ) {
      throw new Error(
        "Noto‘g‘ri social login provider."
      );
    }

    if (
      !isFilledString(code)
    ) {
      throw new Error(
        "OAuth tasdiqlash kodi topilmadi."
      );
    }

    try {
      const { data } = await axios.post(
        `/users/auth/${safeProvider}/`,
        { code }
      );

      return data;
    } catch (error) {
      throw createAuthServiceError(
        error,
        `${safeProvider} orqali kirishda xatolik yuz berdi.`
      );
    }
  },

  // =====================================================
  // LOGOUT
  // =====================================================

  async userLogout() {
    try {
      const { data } = await axios.post(
        "/users/logout/",
        {}
      );

      return data;
    } catch (error) {
      throw createAuthServiceError(
        error,
        "Tizimdan chiqishda xatolik yuz berdi."
      );
    } finally {
      // Preserve existing behavior:
      // clear frontend auth-related storage
      // even when logout request fails.
      //
      // Redux logoutUser should still be
      // dispatched by the caller.
      clearLegacyAuthStorage();
    }
  },

  // =====================================================
  // JWT TOKEN REFRESH
  // =====================================================

  async refreshToken() {
    try {
      const { data } = await axios.post(
        "/users/token/refresh/",
        {}
      );

      return data;
    } catch (error) {
      throw createAuthServiceError(
        error,
        "Tokenni yangilashda xatolik yuz berdi."
      );
    }
  },

  // =====================================================
  // CURRENT USER
  // =====================================================

  async getUser() {
    try {
      const { data } = await axios.get(
        "/users/user/"
      );

      return data;
    } catch (error) {
      // A 401 can be normal when checking
      // an unauthenticated visitor.
      // Let the caller handle checkAuthFailure.

      throw createAuthServiceError(
        error,
        "Foydalanuvchi ma’lumotlarini olishda xatolik yuz berdi."
      );
    }
  },

  // =====================================================
  // USER PROFILE
  // =====================================================

  async getProfile(
    username = null
  ) {
    try {
      if (
        username !== null &&
        username !== undefined &&
        String(username).trim() !== ""
      ) {
        const safeUsername =
          encodeURIComponent(
            String(username).trim()
          );

        const { data } = await axios.get(
          `/users/${safeUsername}/profile/`
        );

        return data;
      }

      // Existing behavior:
      // no username -> own user data.
      const { data } = await axios.get(
        "/users/user/"
      );

      return data;
    } catch (error) {
      throw createAuthServiceError(
        error,
        "Profil ma’lumotlarini olishda xatolik yuz berdi."
      );
    }
  },
};

export default AuthService;
