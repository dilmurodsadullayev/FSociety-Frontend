
/**
 * FSOCIETY — REGISTER VALIDATION
 *
 * src/components/auth/register/registerValidation.js
 *
 * Pure functions:
 * - validateRegisterForm
 * - validateRegisterField
 * - getRegisterPasswordRules
 *
 * No React, Redux or API dependency.
 */

// =========================================================
// CONSTANTS
// =========================================================

export const REGISTER_FIELDS = Object.freeze([
  "username",
  "email",
  "password",
  "password2",
]);

export const REGISTER_FIELD_LABELS = Object.freeze({
  username: "Username",
  email: "Email",
  password: "Parol",
  password2: "Parolni tasdiqlash",
});

export const REGISTER_LIMITS = Object.freeze({
  usernameMin: 3,
  usernameMax: 30,
  passwordMin: 8,
});

// =========================================================
// PRIVATE HELPERS
// =========================================================

const asString = (value) =>
  typeof value === "string" ? value : "";

const getUsername = (data) =>
  asString(data?.username).trim();

const getEmail = (data) =>
  asString(data?.email).trim();

const getPassword = (data) =>
  asString(data?.password);

const getPassword2 = (data) =>
  asString(data?.password2);

const isEntirelyNumeric = (value) =>
  /^\d+$/.test(value);

const hasWhitespace = (value) =>
  /\s/.test(value);

const containsUsername = (password, username) => {
  const normalizedUsername = username
    .trim()
    .toLowerCase();

  if (
    normalizedUsername.length <
    REGISTER_LIMITS.usernameMin
  ) {
    return false;
  }

  return password
    .toLowerCase()
    .includes(normalizedUsername);
};

// =========================================================
// PASSWORD RULES
// =========================================================
//
// Used by the future animated PasswordRules component.
//
// passed = true means the rule is satisfied.
//
// These are the same requirements enforced by
// validateRegisterForm.
//
// Password strength suggestions can be added later
// without silently adding new blocking requirements.
// =========================================================

export const getRegisterPasswordRules = (
  passwordValue = "",
  usernameValue = ""
) => {
  const password = asString(passwordValue);
  const username = asString(usernameValue);

  return [
    {
      id: "minLength",
      label: "Kamida 8 ta belgi",
      passed:
        password.length >=
        REGISTER_LIMITS.passwordMin,
    },
    {
      id: "notOnlyNumbers",
      label: "Faqat raqamlardan iborat emas",
      passed:
        password.length > 0 &&
        !isEntirelyNumeric(password),
    },
    {
      id: "noWhitespace",
      label: "Bo‘sh joy mavjud emas",
      passed:
        password.length > 0 &&
        !hasWhitespace(password),
    },
    {
      id: "notSimilarToUsername",
      label: "Username bilan bir xil emas",
      passed:
        password.length > 0 &&
        !containsUsername(password, username),
    },
  ];
};

// =========================================================
// VALIDATE REGISTER FORM
// =========================================================
//
// Input:
// {
//   username: "...",
//   email: "...",
//   password: "...",
//   password2: "..."
// }
//
// Output:
// {}                         -> valid
// { username: "..." }        -> invalid username
// { password2: "..." }       -> passwords mismatch
//
// The function never mutates the supplied object.
// =========================================================

export const validateRegisterForm = (
  formData = {}
) => {
  const errors = {};

  const username = getUsername(formData);
  const email = getEmail(formData);
  const password = getPassword(formData);
  const password2 = getPassword2(formData);

  // =====================================================
  // USERNAME
  // =====================================================

  if (!username) {
    errors.username =
      "Username kiritish majburiy. Masalan: anakin_dev";
  } else if (
    username.length <
    REGISTER_LIMITS.usernameMin
  ) {
    errors.username =
      "Username kamida 3 ta belgidan iborat bo‘lishi kerak.";
  } else if (
    username.length >
    REGISTER_LIMITS.usernameMax
  ) {
    errors.username =
      "Username 30 ta belgidan oshmasligi kerak.";
  } else if (
    !/^[a-zA-Z0-9_]+$/.test(username)
  ) {
    errors.username =
      "Username faqat lotin harflari, raqamlar " +
      "va pastki chiziqdan (_) iborat bo‘lishi mumkin.";
  }

  // =====================================================
  // EMAIL
  // =====================================================

  if (!email) {
    errors.email =
      "Email kiritish majburiy. Masalan: user@gmail.com";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email =
      "Email noto‘g‘ri yozilgan. " +
      "Masalan: user@gmail.com";
  }

  // =====================================================
  // PASSWORD
  // =====================================================

  if (!password) {
    errors.password =
      "Parol kiritish majburiy.";
  } else if (
    password.length <
    REGISTER_LIMITS.passwordMin
  ) {
    errors.password =
      "Parol kamida 8 ta belgidan iborat bo‘lishi kerak.";
  } else if (
    hasWhitespace(password)
  ) {
    errors.password =
      "Parolda bo‘sh joy ishlatmang.";
  } else if (
    isEntirelyNumeric(password)
  ) {
    errors.password =
      "Parol faqat raqamlardan iborat bo‘lmasin. " +
      "Harf yoki maxsus belgi ham qo‘shing.";
  } else if (
    containsUsername(password, username)
  ) {
    errors.password =
      "Parol username bilan juda o‘xshash. " +
      "Xavfsizroq parol tanlang.";
  }

  // =====================================================
  // PASSWORD CONFIRMATION
  // =====================================================

  if (!password2) {
    errors.password2 =
      "Parolni qayta kiriting.";
  } else if (password !== password2) {
    errors.password2 =
      "Parollar mos kelmadi. " +
      "Ikkala parol bir xil bo‘lishi kerak.";
  }

  return errors;
};

// =========================================================
// VALIDATE SINGLE FIELD
// =========================================================
//
// Useful for onBlur and live validation.
//
// Example:
// validateRegisterField("username", formData)
// -> "Username kamida 3 ta belgi..."
// =========================================================

export const validateRegisterField = (
  fieldName,
  formData = {}
) => {
  if (!REGISTER_FIELDS.includes(fieldName)) {
    return "";
  }

  const errors = validateRegisterForm(formData);

  return errors[fieldName] || "";
};

// =========================================================
// CHECK FORM VALIDITY
// =========================================================

export const isRegisterFormValid = (
  formData = {}
) =>
  Object.keys(
    validateRegisterForm(formData)
  ).length === 0;

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default validateRegisterForm;
