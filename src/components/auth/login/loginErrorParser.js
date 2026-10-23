
/**
 * FSOCIETY — LOGIN ERROR PARSER
 *
 * src/components/auth/login/loginErrorParser.js
 *
 * Supported:
 * - Django / DRF errors
 * - Custom backend errors
 * - AuthService normalized errors
 * - Username not found
 * - Incorrect password
 * - Invalid credentials
 * - Inactive accounts
 * - Rate limiting
 * - Network / server failures
 *
 * Result:
 * {
 *   fieldErrors: {},
 *   globalError: "...",
 *   firstField: null
 * }
 *
 * Generic credential errors must NOT be
 * attributed to a specific field.
 */

// =========================================================
// CONSTANTS
// =========================================================

export const LOGIN_FIELDS = Object.freeze([
  "username",
  "password",
]);

export const LOGIN_FIELD_LABELS = Object.freeze({
  username: "Username",
  password: "Parol",
});

const DEFAULT_ERROR =
  "Tizimga kirishda xatolik yuz berdi. " +
  "Qayta urinib ko‘ring.";

const INVALID_CREDENTIALS =
  "Username yoki parol noto‘g‘ri. " +
  "Ma’lumotlaringizni tekshirib, qayta urinib ko‘ring.";

const NETWORK_ERROR =
  "Server bilan bog‘lanib bo‘lmadi. " +
  "Internet aloqangizni tekshiring.";

const FIELD_ALIASES = Object.freeze({
  username: "username",
  user_name: "username",
  login: "username",

  password: "password",
  password1: "password",
});

// =========================================================
// HELPERS
// =========================================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const getFieldName = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  return FIELD_ALIASES[normalized] || null;
};

const getRawMessage = (value, depth = 0) => {
  if (depth > 5 || value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = getRawMessage(
        item,
        depth + 1
      );

      if (message) {
        return message;
      }
    }

    return "";
  }

  if (!isObject(value)) {
    return "";
  }

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

    const message = getRawMessage(
      value[key],
      depth + 1
    );

    if (message) {
      return message;
    }
  }

  return "";
};

// =========================================================
// RECOGNIZE SPECIFIC FIELD ERRORS
// =========================================================
//
// Generic errors such as "Invalid credentials"
// do NOT identify whether username or password
// is incorrect.
// =========================================================

const inferLoginField = (message) => {
  const text = message.toLowerCase();

  if (
    /username\s+(?:or|yoki)\s+(?:password|parol)/i.test(
      text
    )
  ) {
    return null;
  }

  if (
    /invalid credentials|incorrect credentials|authentication failed|no active account found|unable to log in|login failed/i.test(
      text
    )
  ) {
    return null;
  }

  if (
    /username topilmadi|foydalanuvchi topilmadi|user(?:name)? not found|unknown username|no user with/i.test(
      text
    )
  ) {
    return "username";
  }

  if (
    /incorrect password|wrong password|invalid password|parol noto|parol xato/i.test(
      text
    )
  ) {
    return "password";
  }

  return null;
};

// =========================================================
// TRANSLATE COMMON ERRORS
// =========================================================

export const normalizeLoginErrorText = (
  value,
  field = null
) => {
  const original = getRawMessage(value);

  if (!original) {
    return "";
  }

  const text = original.toLowerCase();

  const resolvedField =
    getFieldName(field) ||
    inferLoginField(original);

  // =====================================================
  // REQUIRED FIELD
  // =====================================================

  if (
    /this field is required|may not be blank|may not be null|field is required/i.test(
      text
    )
  ) {
    if (resolvedField === "username") {
      return "Username kiritish majburiy.";
    }

    if (resolvedField === "password") {
      return "Parol kiritish majburiy.";
    }

    return "Bu maydonni to‘ldiring.";
  }

  // =====================================================
  // USERNAME NOT FOUND
  // =====================================================

  if (
    /username topilmadi|foydalanuvchi topilmadi|user(?:name)? not found|unknown username|no user with/i.test(
      text
    )
  ) {
    return (
      "Bunday username bilan foydalanuvchi " +
      "topilmadi. Kiritgan nomingizni tekshiring."
    );
  }

  // =====================================================
  // INCORRECT PASSWORD
  // =====================================================

  if (
    /incorrect password|wrong password|invalid password|parol noto|parol xato/i.test(
      text
    )
  ) {
    return (
      "Parol noto‘g‘ri. " +
      "Qaytadan urinib ko‘ring."
    );
  }

  // =====================================================
  // INACTIVE ACCOUNT
  // =====================================================

  if (
    /account is inactive|user is inactive|inactive account|akkaunt faol emas|hisob faol emas|account disabled/i.test(
      text
    )
  ) {
    return (
      "Bu hisob faol emas. " +
      "Yordam olish uchun administratorga murojaat qiling."
    );
  }

  // =====================================================
  // GENERAL INVALID CREDENTIALS
  // =====================================================

  if (
    /invalid credentials|incorrect credentials|no active account found|unable to log in|authentication failed|username yoki parol noto/i.test(
      text
    )
  ) {
    return INVALID_CREDENTIALS;
  }

  // =====================================================
  // OTHER COMMON ERRORS
  // =====================================================

  if (
    /not authenticated|authentication credentials were not provided/i.test(
      text
    )
  ) {
    return "Autentifikatsiya talab qilinadi.";
  }

  if (
    /permission denied|you do not have permission/i.test(
      text
    )
  ) {
    return (
      "Ushbu amalni bajarishga ruxsat yo‘q."
    );
  }

  // Preserve unrecognized backend messages.
  return original.replace(
    /^(username|password)\s*:\s*/i,
    ""
  );
};

// =========================================================
// TRANSPORT ERRORS
// =========================================================

const getTransportError = (error) => {
  const code =
    error?.code ??
    error?.originalError?.code;

  const status =
    error?.status ??
    error?.response?.status ??
    error?.originalError?.response?.status;

  const message = String(
    error?.message || ""
  ).toLowerCase();

  if (
    code === "ERR_NETWORK" ||
    message.includes("network error") ||
    message.includes("failed to fetch")
  ) {
    return NETWORK_ERROR;
  }

  if (
    code === "ECONNABORTED" ||
    code === "ETIMEDOUT"
  ) {
    return (
      "Server javobi kechikmoqda. " +
      "Qayta urinib ko‘ring."
    );
  }

  if (status === 429) {
    return (
      "Juda ko‘p urinish amalga oshirildi. " +
      "Birozdan keyin qayta urinib ko‘ring."
    );
  }

  if (
    typeof status === "number" &&
    status >= 500
  ) {
    return (
      "Serverda vaqtinchalik xatolik yuz berdi. " +
      "Keyinroq urinib ko‘ring."
    );
  }

  return "";
};

// =========================================================
// EXTRACT LOGIN ERRORS
// =========================================================

export const extractLoginErrors = (error) => {
  const fieldErrors = {};

  const data =
    error?.serverData ??
    error?.response?.data ??
    error?.originalError?.response?.data ??
    null;

  // =====================================================
  // COLLECT EXPLICIT FIELD ERRORS
  // =====================================================

  const sources = [
    error?.fieldErrors,

    isObject(data)
      ? data.errors
      : null,

    isObject(data)
      ? data.field_errors
      : null,

    isObject(data)
      ? data.validation_errors
      : null,

    data,
  ];

  for (const source of sources) {
    if (!isObject(source)) {
      continue;
    }

    for (const [key, value] of Object.entries(
      source
    )) {
      const field = getFieldName(key);

      if (
        !field ||
        fieldErrors[field]
      ) {
        continue;
      }

      const message =
        normalizeLoginErrorText(
          value,
          field
        );

      if (message) {
        fieldErrors[field] = message;
      }
    }
  }

  // =====================================================
  // NON-FIELD ERRORS
  // =====================================================

  const candidates = [
    isObject(data)
      ? data.non_field_errors
      : null,

    isObject(data)
      ? data.__all__
      : null,

    isObject(data) && isObject(data.errors)
      ? data.errors.non_field_errors
      : null,

    isObject(data) && isObject(data.errors)
      ? data.errors.__all__
      : null,

    isObject(data)
      ? data.detail
      : null,

    isObject(data)
      ? data.message
      : null,

    isObject(data)
      ? data.msg
      : null,

    isObject(data)
      ? data.error
      : null,

    typeof data === "string" ||
    Array.isArray(data)
      ? data
      : null,

    error?.message,
  ];

  let globalMessage = "";

  for (const candidate of candidates) {
    const raw = getRawMessage(candidate);

    if (!raw) {
      continue;
    }

    if (
      /^request failed with status code \d+$/i.test(
        raw
      )
    ) {
      continue;
    }

    const field = inferLoginField(raw);

    const normalized =
      normalizeLoginErrorText(
        raw,
        field
      );

    if (
      field &&
      !fieldErrors[field]
    ) {
      fieldErrors[field] = normalized;
    }

    if (!globalMessage) {
      globalMessage = normalized;
    }
  }

  // =====================================================
  // FIRST INVALID FIELD
  // =====================================================

  const firstField =
    LOGIN_FIELDS.find(
      (field) => Boolean(fieldErrors[field])
    ) || null;

  const errorCount =
    Object.keys(fieldErrors).length;

  // =====================================================
  // FINAL GLOBAL ERROR
  // =====================================================

  const transportError =
    getTransportError(error);

  let globalError;

  if (transportError) {
    globalError = transportError;
  } else if (errorCount === 1) {
    globalError =
      fieldErrors[firstField];
  } else if (errorCount > 1) {
    globalError =
      "Bir nechta maydon noto‘g‘ri to‘ldirilgan. " +
      "Qizil maydonlarni tekshiring.";
  } else {
    const status =
      error?.status ??
      error?.response?.status ??
      null;

    globalError =
      globalMessage ||
      (
        status === 401
          ? INVALID_CREDENTIALS
          : DEFAULT_ERROR
      );
  }

  return {
    fieldErrors,
    globalError,
    firstField,
  };
};

// =========================================================
// COMPATIBILITY HELPER
// =========================================================

export const getLoginErrorMessage = (
  error
) =>
  extractLoginErrors(error).globalError;

export default extractLoginErrors;
