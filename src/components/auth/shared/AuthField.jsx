
import React, {
  forwardRef,
  memo,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

// =========================================================
// FSOCIETY — SHARED AUTH FIELD
// =========================================================
//
// Location:
// src/components/auth/shared/AuthField.jsx
//
// Reusable for:
// - Register
// - Login
// - Password reset
// - Other authentication forms
//
// Features:
// - Tailwind CSS only
// - Light / Dark mode
// - Responsive layout
// - Input validation display
// - Password visibility toggle
// - Input ref support
// - Keyboard accessibility
// - Screen reader support
// - Optional success state
//
// No Redux / API / toast dependency.
//
// =========================================================

// =========================================================
// INPUT CLASSES
// =========================================================

const INPUT_BASE = [
  "peer",
  "block",
  "h-12",
  "w-full",
  "min-w-0",

  "rounded-xl",
  "border",
  "outline-none",

  "bg-white/90",
  "text-slate-900",

  "text-[14px]",
  "font-medium",

  "placeholder:text-slate-400",
  "placeholder:font-normal",

  "transition-[border-color,background-color,box-shadow]",
  "duration-200",

  "disabled:cursor-not-allowed",
  "disabled:opacity-60",

  "dark:bg-[#0c1422]/90",
  "dark:text-slate-100",
  "dark:placeholder:text-slate-500",

  "motion-reduce:transition-none",
].join(" ");

const INPUT_NORMAL = [
  "border-slate-200",

  "hover:border-slate-300",

  "focus:border-indigo-500",
  "focus:bg-white",
  "focus:ring-[3px]",
  "focus:ring-indigo-500/10",

  "dark:border-white/[0.12]",
  "dark:hover:border-white/[0.22]",
  "dark:focus:border-indigo-400",
  "dark:focus:bg-[#101a2b]",
  "dark:focus:ring-indigo-400/10",
].join(" ");

const INPUT_ERROR = [
  "border-red-400",
  "bg-red-50/50",

  "hover:border-red-500",

  "focus:border-red-500",
  "focus:ring-[3px]",
  "focus:ring-red-500/10",

  "dark:border-red-400/70",
  "dark:bg-red-500/[0.06]",
  "dark:hover:border-red-400",
  "dark:focus:border-red-400",
  "dark:focus:ring-red-400/10",
].join(" ");

const INPUT_SUCCESS = [
  "border-emerald-300",

  "hover:border-emerald-400",

  "focus:border-emerald-500",
  "focus:ring-[3px]",
  "focus:ring-emerald-500/10",

  "dark:border-emerald-400/35",
  "dark:focus:border-emerald-400",
  "dark:focus:ring-emerald-400/10",
].join(" ");

// =========================================================
// ERROR TEXT
// =========================================================

const getErrorMessage = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map(getErrorMessage)
      .filter(Boolean)
      .join(" ");
  }

  if (typeof value === "object") {
    return getErrorMessage(
      value.message ??
      value.detail ??
      value.error
    );
  }

  return "";
};

// =========================================================
// SET EXTERNAL REF
// =========================================================

const assignRef = (ref, node) => {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(node);
  } else {
    ref.current = node;
  }
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const AuthField = memo(
  forwardRef(function AuthField(
    {
      id,
      name,

      label,
      icon: Icon = null,

      type = "text",
      placeholder = "",

      value = "",
      onChange,

      onBlur,
      onFocus,
      onKeyDown,

      // Existing Register.jsx contract.
      inputRef = null,

      error = "",
      hint = "",

      autoComplete,
      inputMode,
      autoCapitalize,

      disabled = false,
      required = true,

      // Optional visual validation.
      // Only use success=true when it is
      // actually verified by the form.
      success = false,

      ariaDescribedBy = "",
      className = "",
      inputClassName = "",

      children,
    },
    forwardedRef
  ) {
    // =====================================================
    // ID
    // =====================================================

    const generatedId = useId();

    const fieldId =
      id ||
      name ||
      `auth-field-${generatedId}`;

    const fieldName =
      name || id || fieldId;

    // =====================================================
    // PASSWORD
    // =====================================================

    const isPasswordField =
      type === "password";

    const [
      passwordVisible,
      setPasswordVisible,
    ] = useState(false);

    const inputType =
      isPasswordField &&
      passwordVisible
        ? "text"
        : type;

    // =====================================================
    // ERROR
    // =====================================================

    const errorMessage = useMemo(
      () => getErrorMessage(error),
      [error]
    );

    const hasError =
      Boolean(errorMessage);

    const hasSuccess =
      Boolean(success) &&
      !hasError;

    // =====================================================
    // DESCRIPTIONS
    // =====================================================

    const errorId =
      `${fieldId}-error`;

    const hintId =
      `${fieldId}-hint`;

    const describedBy = [
      ariaDescribedBy,

      hint ? hintId : "",

      hasError ? errorId : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    // =====================================================
    // REFS
    // =====================================================

    const setInputRef = useCallback(
      (node) => {
        assignRef(inputRef, node);
        assignRef(forwardedRef, node);
      },
      [inputRef, forwardedRef]
    );

    // =====================================================
    // PASSWORD TOGGLE
    // =====================================================

    const togglePassword = () => {
      if (disabled) {
        return;
      }

      setPasswordVisible(
        (previous) => !previous
      );
    };

    // =====================================================
    // INPUT CLASSES
    // =====================================================

    const inputStateClass = hasError
      ? INPUT_ERROR
      : hasSuccess
        ? INPUT_SUCCESS
        : INPUT_NORMAL;

    const leftPadding = Icon
      ? "pl-11"
      : "pl-3.5";

    const rightPadding =
      isPasswordField || hasSuccess
        ? "pr-12"
        : "pr-3.5";

    // =====================================================
    // RENDER
    // =====================================================

    return (
      <div
        className={`
          w-full min-w-0
          ${className}
        `}
      >
        {/* ======================================
            LABEL
           ====================================== */}

        <label
          htmlFor={fieldId}
          className="
            mb-1.5 ml-0.5
            block

            text-[11px]
            font-bold
            uppercase
            tracking-[0.065em]

            text-slate-600

            dark:text-slate-300
          "
        >
          {label}

          {required && (
            <span
              aria-hidden="true"
              className="
                ml-1
                text-indigo-500

                dark:text-indigo-400
              "
            >
              *
            </span>
          )}
        </label>

        {/* ======================================
            INPUT WRAPPER
           ====================================== */}

        <div
          className="
            group relative
            w-full min-w-0
          "
        >
          {/* LEFT ICON */}
          {Icon && (
            <Icon
              size={17}
              strokeWidth={1.9}
              aria-hidden="true"
              className={`
                pointer-events-none

                absolute left-3.5 top-1/2
                z-10

                -translate-y-1/2

                transition-colors

                ${
                  hasError
                    ? "text-red-500 dark:text-red-400"
                    : hasSuccess
                      ? "text-emerald-600 dark:text-emerald-400"
                      : [
                          "text-slate-400",
                          "group-focus-within:text-indigo-600",
                          "dark:text-slate-500",
                          "dark:group-focus-within:text-indigo-400",
                        ].join(" ")
                }
              `}
            />
          )}

          {/* INPUT */}
          <input
            ref={setInputRef}
            id={fieldId}
            name={fieldName}

            type={inputType}

            placeholder={placeholder}

            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}

            autoComplete={autoComplete}
            inputMode={inputMode}
            autoCapitalize={
              autoCapitalize ??
              (
                type === "email" ||
                type === "password"
                  ? "none"
                  : undefined
              )
            }

            spellCheck={
              type === "password"
                ? false
                : undefined
            }

            required={required}
            disabled={disabled}

            aria-invalid={
              hasError ? true : undefined
            }

            aria-describedby={describedBy}

            className={`
              ${INPUT_BASE}
              ${inputStateClass}
              ${leftPadding}
              ${rightPadding}
              ${inputClassName}
            `}
          />

          {/* ==================================
              PASSWORD VISIBILITY
             ================================== */}

          {isPasswordField && (
            <button
              type="button"
              disabled={disabled}
              onClick={togglePassword}
              aria-label={
                passwordVisible
                  ? "Parolni yashirish"
                  : "Parolni ko‘rsatish"
              }
              aria-pressed={passwordVisible}
              title={
                passwordVisible
                  ? "Parolni yashirish"
                  : "Parolni ko‘rsatish"
              }
              className="
                absolute right-1.5 top-1/2
                z-10

                flex h-9 w-9
                -translate-y-1/2

                items-center justify-center

                rounded-lg

                text-slate-400

                transition-colors

                hover:bg-slate-100
                hover:text-indigo-600

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-400

                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:text-slate-500
                dark:hover:bg-white/[0.07]
                dark:hover:text-indigo-300
              "
            >
              {passwordVisible ? (
                <EyeOff
                  size={18}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              ) : (
                <Eye
                  size={18}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              )}
            </button>
          )}

          {/* ==================================
              OPTIONAL SUCCESS INDICATOR
             ================================== */}

          {!isPasswordField &&
            hasSuccess && (
              <CheckCircle2
                size={17}
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute right-3.5
                  top-1/2

                  -translate-y-1/2

                  text-emerald-600
                  dark:text-emerald-400
                "
              />
            )}
        </div>

        {/* ======================================
            HINT
           ====================================== */}

        {hint && (
          <p
            id={hintId}
            className="
              mt-1.5 ml-0.5

              text-[11px]
              leading-[1.55]

              text-slate-500

              dark:text-slate-400
            "
          >
            {hint}
          </p>
        )}

        {/* ======================================
            FIELD ERROR
           ====================================== */}

        {hasError && (
          <p
            id={errorId}
            className="
              mt-1.5 ml-0.5

              flex min-w-0
              items-start gap-1.5

              text-[11px]
              font-semibold
              leading-[1.55]

              text-red-600

              dark:text-red-400
            "
          >
            <AlertCircle
              size={14}
              strokeWidth={2}
              className="
                mt-[1px] shrink-0
              "
              aria-hidden="true"
            />

            <span
              className="
                min-w-0
                break-words
                [overflow-wrap:anywhere]
              "
            >
              {errorMessage}
            </span>
          </p>
        )}

        {/* ======================================
            ADDITIONAL FIELD CONTENT
            (Password rules, etc.)
           ====================================== */}

        {children}
      </div>
    );
  })
);

AuthField.displayName = "AuthField";

export default AuthField;
