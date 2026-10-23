
import React, { memo } from "react";

import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  X,
} from "lucide-react";

// =========================================================
// FSOCIETY — SHARED AUTH ERROR SUMMARY
// =========================================================
//
// Location:
// src/components/auth/shared/AuthErrorSummary.jsx
//
// Reusable for:
// - Register
// - Login
// - Password reset
//
// Props:
// - globalError
// - fieldErrors
// - fieldLabels
// - onFieldSelect
// - onDismiss
// - title
// - showFieldList
// - className
//
// Features:
// - Clear global error message
// - Field-specific errors
// - Focus callback
// - Light / Dark mode
// - Mobile responsive
// - Accessible alert
//
// IMPORTANT:
// This component only displays errors.
// Universal siteToast/authToast stays
// in the form controller.
//
// =========================================================

// =========================================================
// DEFAULT FIELD LABELS
// =========================================================

const DEFAULT_FIELD_LABELS = {
  username: "Username",
  email: "Email",
  password: "Parol",
  password2: "Parolni tasdiqlash",
};

// =========================================================
// FIELD ORDER
// =========================================================

const FIELD_ORDER = [
  "username",
  "email",
  "password",
  "password2",
];

// =========================================================
// ERROR MESSAGE HELPER
// =========================================================

const getMessage = (value) => {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map(getMessage)
      .filter(Boolean)
      .join(" ");
  }

  if (
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return getMessage(
      value.message ??
      value.detail ??
      value.error
    );
  }

  return "";
};

// =========================================================
// NORMALIZE FIELD ERRORS
// =========================================================

const normalizeFieldErrors = (
  fieldErrors,
  fieldLabels
) => {
  if (
    !fieldErrors ||
    typeof fieldErrors !== "object" ||
    Array.isArray(fieldErrors)
  ) {
    return [];
  }

  const entries = Object.entries(
    fieldErrors
  )
    .map(([field, value]) => ({
      field,
      message: getMessage(value),
    }))
    .filter(
      (item) => Boolean(item.message)
    );

  const ordered = entries.sort((a, b) => {
    const aIndex = FIELD_ORDER.indexOf(
      a.field
    );

    const bIndex = FIELD_ORDER.indexOf(
      b.field
    );

    const aOrder =
      aIndex === -1
        ? FIELD_ORDER.length
        : aIndex;

    const bOrder =
      bIndex === -1
        ? FIELD_ORDER.length
        : bIndex;

    return aOrder - bOrder;
  });

  return ordered.map((item) => ({
    ...item,

    label:
      fieldLabels?.[item.field] ||
      DEFAULT_FIELD_LABELS[
        item.field
      ] ||
      item.field,
  }));
};

// =========================================================
// SINGLE FIELD ERROR
// =========================================================

const FieldErrorItem = memo(
  function FieldErrorItem({
    field,
    label,
    message,
    onFieldSelect,
  }) {
    const canFocus =
      typeof onFieldSelect === "function";

    const content = (
      <>
        <AlertCircle
          size={13}
          strokeWidth={2}
          className="
            mt-0.5 shrink-0
            text-red-500
            dark:text-red-400
          "
          aria-hidden="true"
        />

        <span
          className="
            min-w-0 flex-1
            break-words
            [overflow-wrap:anywhere]
          "
        >
          <strong
            className="
              font-extrabold
              text-red-800

              dark:text-red-200
            "
          >
            {label}:
          </strong>

          {" "}

          <span
            className="
              font-medium
              text-red-700/90

              dark:text-red-200/85
            "
          >
            {message}
          </span>
        </span>

        {canFocus && (
          <ArrowUpRight
            size={13}
            className="
              mt-0.5 shrink-0

              text-red-500
              dark:text-red-400
            "
            aria-hidden="true"
          />
        )}
      </>
    );

    const itemClass = [
      "flex w-full min-w-0",
      "items-start gap-2",
      "rounded-lg",
      "border border-red-200/70",
      "bg-white/75",
      "px-3 py-2.5",
      "text-left",
      "text-[11px]",
      "leading-[1.6]",
      "dark:border-red-400/15",
      "dark:bg-white/[0.035]",
    ].join(" ");

    if (canFocus) {
      return (
        <button
          type="button"
          onClick={() =>
            onFieldSelect(field)
          }
          aria-label={`${label} maydoniga o'tish: ${message}`}
          className={`
            ${itemClass}

            cursor-pointer
            transition-colors

            hover:border-red-300
            hover:bg-red-50

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-red-400

            dark:hover:border-red-400/30
            dark:hover:bg-red-400/[0.07]
          `}
        >
          {content}
        </button>
      );
    }

    return (
      <div className={itemClass}>
        {content}
      </div>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

function AuthErrorSummary({
  globalError = "",
  fieldErrors = {},

  fieldLabels = DEFAULT_FIELD_LABELS,

  onFieldSelect,
  onDismiss,

  title = "Ma’lumotlarni tekshiring",

  showFieldList = true,

  className = "",
}) {
  // =====================================================
  // GLOBAL MESSAGE
  // =====================================================

  const globalMessage =
    getMessage(globalError);

  // =====================================================
  // FIELD ERRORS
  // =====================================================

  const errors = normalizeFieldErrors(
    fieldErrors,
    fieldLabels
  );

  const errorCount =
    errors.length;

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (
    !globalMessage &&
    errorCount === 0
  ) {
    return null;
  }

  // =====================================================
  // AVOID DUPLICATE MESSAGES
  //
  // Example:
  //
  // globalError:
  // "Bu username band."
  //
  // fieldErrors.username:
  // "Bu username band."
  //
  // Do not print the same message twice.
  // =====================================================

  const hasDuplicateGlobalMessage =
    errorCount === 1 &&
    globalMessage.trim() ===
      errors[0].message.trim();

  const displayGlobalMessage =
    hasDuplicateGlobalMessage
      ? ""
      : globalMessage;

  // =====================================================
  // DEFAULT DESCRIPTION
  // =====================================================

  const fallbackDescription =
    errorCount > 0
      ? (
          "Quyidagi maydonlarni " +
          "tekshirib, xatolarni tuzating."
        )
      : (
          "Amalni yakunlab bo‘lmadi. " +
          "Xatolik tafsilotlarini tekshiring."
        );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      role="alert"
      aria-label="Autentifikatsiya xatoliklari"
      className={`
        relative isolate
        w-full min-w-0
        overflow-hidden

        rounded-2xl
        border border-red-200

        bg-red-50/85

        shadow-[0_8px_24px_rgba(220,38,38,0.04)]

        dark:border-red-400/20
        dark:bg-[#24151e]/90

        ${className}
      `}
    >
      {/* ======================================
          TOP ACCENT
         ====================================== */}

      <div
        aria-hidden="true"
        className="
          absolute inset-x-0 top-0
          h-[2px]

          bg-gradient-to-r
          from-red-500
          via-orange-400
          to-transparent
        "
      />

      {/* ======================================
          HEADER
         ====================================== */}

      <div
        className="
          relative
          flex min-w-0
          items-start gap-3

          px-3.5 pt-3.5

          sm:px-4 sm:pt-4
        "
      >
        {/* ICON */}
        <span
          aria-hidden="true"
          className="
            flex h-9 w-9
            shrink-0

            items-center justify-center

            rounded-xl

            border border-red-200
            bg-red-100

            text-red-600

            dark:border-red-400/20
            dark:bg-red-400/10
            dark:text-red-300
          "
        >
          <AlertTriangle
            size={18}
            strokeWidth={2}
          />
        </span>

        {/* TEXT */}
        <div
          className="
            min-w-0 flex-1
          "
        >
          <h3
            className="
              text-[13px]
              font-extrabold
              leading-5

              text-red-900

              dark:text-red-100

              sm:text-[14px]
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              break-words
              [overflow-wrap:anywhere]

              text-[11px]
              font-medium
              leading-[1.6]

              text-red-700/90

              dark:text-red-200/85
            "
          >
            {displayGlobalMessage ||
              fallbackDescription}
          </p>
        </div>

        {/* DISMISS */}
        {typeof onDismiss ===
          "function" && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Xatolik xabarini yopish"
            title="Yopish"
            className="
              flex h-8 w-8
              shrink-0 items-center
              justify-center

              rounded-lg

              text-red-500

              transition-colors

              hover:bg-red-100
              hover:text-red-700

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400

              dark:text-red-300
              dark:hover:bg-red-400/10
            "
          >
            <X
              size={17}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* ======================================
          FIELD ERRORS
         ====================================== */}

      {showFieldList &&
        errorCount > 0 && (
          <div
            className="
              relative

              space-y-2

              px-3.5
              pb-3.5
              pt-3

              sm:px-4
              sm:pb-4
            "
          >
            {errors.map((item) => (
              <FieldErrorItem
                key={item.field}
                field={item.field}
                label={item.label}
                message={item.message}
                onFieldSelect={
                  onFieldSelect
                }
              />
            ))}
          </div>
        )}

      {/* ======================================
          BOTTOM HINT
         ====================================== */}

      {errorCount === 0 && (
        <div
          className="
            relative

            mt-3
            border-t border-red-200/60

            px-3.5 py-2.5

            font-mono
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.07em]

            text-red-500/80

            dark:border-red-400/10
            dark:text-red-300/65

            sm:px-4
          "
        >
          FSOCIETY / AUTH / REQUEST_FAILED
        </div>
      )}
    </section>
  );
}

export default memo(AuthErrorSummary);
