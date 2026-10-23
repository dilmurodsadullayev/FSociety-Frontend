
/**
 * FSOCIETY — REGISTER ERROR PARSER
 *
 * src/components/auth/register/registerErrorParser.js
 *
 * Handles:
 * - Django REST Framework field errors
 * - Custom backend errors
 * - AuthService normalized errors
 * - Duplicate username / email
 * - Password validation messages
 * - Non-field errors
 * - Network / HTTP errors
 *
 * Output:
 * {
 *   fieldErrors: {
 *     username: "...",
 *     email: "...",
 *     password: "...",
 *     password2: "..."
 *   },
 *   globalError: "...",
 *   firstField: "username" | null
 * }
 */

import {
  REGISTER_FIELDS,
} from "./registerValidation";

// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_ERROR =
  "Ro‘yxatdan o‘tishda xatolik yuz berdi. " +
  "Qayta urinib ko‘ring.";

const NETWORK_ERROR =
  "Server bilan bog‘lanib bo‘lmadi. " +
  "Internet aloqangizni tekshiring va qayta urinib ko‘ring.";

const FIELD_ALIASES = Object.freeze({
  username: "username",
  user_name: "username",

  email: "email",
  e_mail: "email",

  password: "password",
  password1: "password",

  password2: "password2",
  password_2: "password2",
  confirm_password: "password2",
  password_confirm: "password2",
  password_confirmation: "password2",
  re_password: "password2",
  re_password1: "password2",
});

// =========================================================
// PRIVATE HELPERS
// =========================================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const normalizeFieldName = (name) => {
  if (typeof name !== "string") {
    return null;
  }

  const key = name
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  return FIELD_ALIASES[key] || null;
};

// =========================================================
// GET RAW MESSAGE
// =========================================================
//
// Supports:
// "Error text"
// ["Error text"]
// { message: "Error text" }
// { detail: "Error text" }
//
// Only reads recognized message properties.
// =========================================================

const getRawMessage = (
  value,
  depth = 0
) => {
  if (depth > 4 || value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const text = getRawMessage(
        item,
        depth + 1
      );

      if (text) {
        return text;
      }
    }

    return "";
  }

  if (isObject(value)) {
    for (const key of [
      "message",
      "detail",
      "msg",
      "error",
    ]) {
      if (value[key] != null) {
        const text = getRawMessage(
          value[key],
          depth + 1
        );

        if (text) {
          return text;
        }
      }
    }
  }

  return "";
};

// =========================================================
// INFER FIELD FROM EXPLICIT ERROR TEXT
// =========================================================
//
// We only assign a field when the message
// itself identifies that field.
//
// An unknown generic 400 response should
// NOT be marked as a username error.
// =========================================================

const inferFieldFromMessage = (message) => {
  const text = message.toLowerCase();

  if (
    /username\s+(?:or|yoki)\s+(?:password|parol)/i.test(
      text
    )
  ) {
    return null;
  }

  if (
    /password2|confirm.password|password.confirmation|passwords?.*match|parollar.*mos kelm|parolni tasdiqlash/i.test(
      text
    )
  ) {
    return "password2";
  }

  if (
    /username|user[\s_-]*name|foydalanuvchi nomi/i.test(
      text
    )
  ) {
    return "username";
  }

  if (
    /e[\s-]?mail|elektron pochta/i.test(
      text
    )
  ) {
    return "email";
  }

  if (
    /password|parol/i.test(
      text
    )
  ) {
    return "password";
  }

  return null;
};

// =========================================================
// NORMALIZE ERROR TEXT
// =========================================================
//
// Translates common Django/DRF errors.
// Unknown backend messages remain visible
// instead of being silently discarded.
// =========================================================

export const normalizeRegisterErrorText = (
  value,
  field = null
) => {
  const raw = getRawMessage(value);

  if (!raw) {
    return "";
  }

  const text = raw.toLowerCase();

  const resolvedField =
    normalizeFieldName(field) ||
    inferFieldFromMessage(raw);

  // =====================================================
  // REQUIRED FIELD
  // =====================================================

  if (
    /this field is required|this field may not be blank|this field may not be null|required field|may not be empty/i.test(
      text
    )
  ) {
    return "Bu maydonni to‘ldirish majburiy.";
  }

  // =====================================================
  // USERNAME ALREADY EXISTS
  // =====================================================

  if (
    resolvedField === "username" &&
    /already exists|already taken|already in use|already registered|all(aqachon)? mavjud|band|mavjud|ishlatilmoqda|is not unique|must be unique/i.test(
      text
    )
  ) {
    return (
      "Bu username band. " +
      "Boshqa username tanlang."
    );
  }

  // =====================================================
  // EMAIL ALREADY EXISTS
  // =====================================================

  if (
    resolvedField === "email" &&
    /already exists|already registered|already in use|already taken|all(aqachon)? mavjud|band|mavjud|is not unique|must be unique/i.test(
      text
    )
  ) {
    return (
      "Bu email allaqachon ro‘yxatdan o‘tgan. " +
      "Boshqa email kiriting."
    );
  }

  // =====================================================
  // INVALID EMAIL
  // =====================================================

  if (
    /enter a valid email|invalid email|valid e-mail|email noto|email.*invalid/i.test(
      text
    )
  ) {
    return (
      "Email noto‘g‘ri yozilgan. " +
      "Masalan: user@gmail.com"
    );
  }

  // =====================================================
  // PASSWORD TOO SHORT
  // =====================================================

  if (
    /password is too short|password.*too short|parol.*qisqa/i.test(
      text
    )
  ) {
    return (
      "Parol juda qisqa. " +
      "Kamida 8 ta belgi kiriting."
    );
  }

  // =====================================================
  // PASSWORD TOO COMMON
  // =====================================================

  if (
    /password is too common|password.*common|parol.*oddiy/i.test(
      text
    )
  ) {
    return (
      "Bu parol juda oddiy. " +
      "Murakkabroq parol tanlang."
    );
  }

  // =====================================================
  // ENTIRELY NUMERIC PASSWORD
  // =====================================================

  if (
    /entirely numeric|only numbers|faqat raqam/i.test(
      text
    )
  ) {
    return (
      "Parol faqat raqamlardan iborat bo‘lmasin. " +
      "Harf yoki maxsus belgi ham qo‘shing."
    );
  }

  // =====================================================
  // PASSWORD SIMILAR TO USER DATA
  // =====================================================

  if (
    /password is too similar|password.*similar|parol.*o‘xshash|parol.*o'xshash/i.test(
      text
    )
  ) {
    return (
      "Parol shaxsiy ma’lumotlaringizga juda o‘xshash. " +
      "Boshqacha parol tanlang."
    );
  }

  // =====================================================
  // PASSWORD MISMATCH
  // =====================================================

  if (
    resolvedField === "password2" &&
    /do not match|don't match|does not match|mismatch|mos kelm/i.test(
      text
    )
  ) {
    return (
      "Parollar mos kelmadi. " +
      "Ikkala parolni bir xil kiriting."
    );
  }

  // =====================================================
  // WHITESPACE
  // =====================================================

  if (
    /whitespace|bo‘sh joy|bo'sh joy/i.test(
      text
    )
  ) {
    return "Bu maydonda bo‘sh joy ishlatmang.";
  }

  // =====================================================
  // UNKNOWN MESSAGE
  // =====================================================

  return raw.replace(
    /^(username|email|password|password2)\s*:\s*/i,
    ""
  );
};

// =========================================================
// HTTP / NETWORK ERROR MESSAGE
// =========================================================

const getTransportError = (error) => {
  const status =
    error?.status ??
    error?.response?.status ??
    error?.originalError?.response?.status;

  const code =
    error?.code ??
    error?.originalError?.code;

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

  if (status === 429) {
    return (
      "Juda ko‘p urinish amalga oshirildi. " +
      "Birozdan keyin qayta urinib ko‘ring."
    );
  }

  if (status >= 500) {
    return (
      "Serverda vaqtinchalik xatolik yuz berdi. " +
      "Keyinroq qayta urinib ko‘ring."
    );
  }

  if (status === 403) {
    return (
      "Bu amalni bajarishga ruxsat yo‘q. " +
      "Sahifani yangilab, qayta urinib ko‘ring."
    );
  }

  return "";
};

// =========================================================
// MAIN ERROR PARSER
// =========================================================

export const extractServerErrors = (
  error
) => {
  const fieldErrors = {};

  const data =
    error?.serverData ??
    error?.response?.data ??
    error?.originalError?.response?.data ??
    null;

  const extraMessages = [];

  // =====================================================
  // COLLECT FIELD ERRORS
  // =====================================================

  const sources = [
    error?.fieldErrors,
    isObject(data) ? data.errors : null,
    isObject(data) ? data.field_errors : null,
    isObject(data) ? data.validation_errors : null,
    data,
  ];

  for (const source of sources) {
    if (!isObject(source)) {
      continue;
    }

    for (const [key, value] of Object.entries(
      source
    )) {
      const field = normalizeFieldName(key);

      if (field) {
        const message =
          normalizeRegisterErrorText(
            value,
            field
          );

        if (
          message &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] = message;
        }

        continue;
      }

      if (
        [
          "non_field_errors",
          "__all__",
        ].includes(key)
      ) {
        const message = getRawMessage(value);

        if (message) {
          extraMessages.push(message);
        }
      }
    }
  }

  // =====================================================
  // GLOBAL ERROR CANDIDATES
  // =====================================================

  const candidates = [
    ...extraMessages,

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

    isObject(data) && !isObject(data.errors)
      ? data.errors
      : null,

    typeof data === "string" ||
    Array.isArray(data)
      ? data
      : null,

    error?.message,
  ];

  let explicitGlobalError = "";

  for (const candidate of candidates) {
    const rawMessage =
      getRawMessage(candidate);

    if (!rawMessage) {
      continue;
    }

    // Ignore generic Axios messages when the
    // backend gives no useful explanation.
    if (
      /^request failed with status code \d+$/i.test(
        rawMessage
      )
    ) {
      continue;
    }

    const field =
      inferFieldFromMessage(rawMessage);

    const translatedMessage =
      normalizeRegisterErrorText(
        rawMessage,
        field
      );

    // A detailed server message mentioning
    // a specific field should mark that field.
    if (
      field &&
      !fieldErrors[field]
    ) {
      fieldErrors[field] =
        translatedMessage;
    }

    if (!explicitGlobalError) {
      explicitGlobalError =
        translatedMessage;
    }
  }

  // =====================================================
  // FIRST INVALID FIELD
  //
  // Keep the same order as Register form.
  // =====================================================

  const firstField =
    REGISTER_FIELDS.find(
      (field) => Boolean(fieldErrors[field])
    ) || null;

  const errorCount =
    Object.keys(fieldErrors).length;

  // =====================================================
  // TRANSPORT ERROR
  // =====================================================

  const transportError =
    getTransportError(error);

  // =====================================================
  // FINAL GLOBAL MESSAGE
  // =====================================================

  let globalError = "";

  if (transportError) {
    globalError = transportError;
  } else if (errorCount === 1) {
    // Show the actual field error in the toast.
    // Example: "Bu username band..."
    globalError =
      fieldErrors[firstField];
  } else if (errorCount > 1) {
    globalError =
      "Formada bir nechta xatolik bor. " +
      "Qizil maydonlarni tekshiring.";
  } else {
    globalError =
      explicitGlobalError ||
      DEFAULT_ERROR;
  }

  // =====================================================
  // RESULT
  // =====================================================

  return {
    fieldErrors,
    globalError,
    firstField,
  };
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default extractServerErrors;
