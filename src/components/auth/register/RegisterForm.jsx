
import React, { memo } from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

// =========================================================
// SHARED AUTH COMPONENTS
// =========================================================

import AuthField from "../shared/AuthField";

import AuthErrorSummary from "../shared/AuthErrorSummary";

// =========================================================
// REGISTER COMPONENTS
// =========================================================

import RegisterPasswordRules from "./RegisterPasswordRules";

import RegisterPasswordStrength from "./RegisterPasswordStrength";

// =========================================================
// REGISTER VALIDATION
// =========================================================

import {
  REGISTER_FIELD_LABELS,
} from "./registerValidation";

// =========================================================
// FSOCIETY — REGISTER FORM
// =========================================================
//
// Location:
// src/components/auth/register/RegisterForm.jsx
//
// Props:
// - controller: useRegisterForm() result
//
// Features:
// - Controlled registration fields
// - Field-level errors
// - Error summary
// - Password visibility
// - Password rules
// - Password strength indicator
// - Password confirmation
// - Loading state
// - Keyboard navigation
// - Responsive 320px+
// - Light / Dark Mode
// - Tailwind only
//
// =========================================================

function RegisterForm({
  controller,
  className = "",
}) {
  // =====================================================
  // CONTROLLER
  // =====================================================

  const {
    values,
    formErrors,
    globalError,

    fieldRefs,

    handleChange,
    handleBlur,
    handleEnter,
    handleSubmit,

    focusField,

    isSubmitting,
  } = controller;

  // =====================================================
  // PASSWORD CONFIRMATION
  // =====================================================

  const passwordsMatch =
    values.password.length > 0 &&
    values.password2.length > 0 &&
    values.password ===
      values.password2;

  // =====================================================
  // SHARED MOBILE INPUT FONT
  //
  // 16px prevents automatic zoom on iOS.
  // =====================================================

  const inputClassName =
    "!text-base sm:!text-sm";

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
      {/* ==========================================
          ERROR SUMMARY
         ========================================== */}

      <AuthErrorSummary
        globalError={globalError}
        fieldErrors={formErrors}
        fieldLabels={
          REGISTER_FIELD_LABELS
        }
        onFieldSelect={focusField}
        title="Ro‘yxatdan o‘tishni tekshiring"
        className="mb-4"
      />

      {/* ==========================================
          REGISTER FORM
         ========================================== */}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Ro‘yxatdan o‘tish formasi"
        aria-busy={isSubmitting}
        className="
          flex w-full min-w-0
          flex-col gap-4

          sm:gap-[18px]
        "
      >
        {/* ======================================
            USERNAME
           ====================================== */}

        <AuthField
          id="username"
          name="username"

          label="Username"
          icon={UserRound}
          type="text"

          placeholder="Masalan: anakin_dev"

          value={values.username}

          onChange={handleChange}
          onBlur={handleBlur}

          onKeyDown={(event) =>
            handleEnter(
              event,
              "email"
            )
          }

          error={formErrors.username}

          hint={
            "Kamida 3 ta belgi. " +
            "Lotin harflari, raqamlar va _ ishlating."
          }

          autoComplete="username"
          autoCapitalize="none"

          inputRef={
            fieldRefs.username
          }

          inputClassName={
            inputClassName
          }

          disabled={isSubmitting}
        />

        {/* ======================================
            EMAIL
           ====================================== */}

        <AuthField
          id="email"
          name="email"

          label="Email"
          icon={Mail}
          type="email"

          placeholder="user@gmail.com"

          value={values.email}

          onChange={handleChange}
          onBlur={handleBlur}

          onKeyDown={(event) =>
            handleEnter(
              event,
              "password"
            )
          }

          error={formErrors.email}

          hint="Tasdiqlash va hisob ma’lumotlari uchun email kiriting."

          autoComplete="email"
          autoCapitalize="none"
          inputMode="email"

          inputRef={
            fieldRefs.email
          }

          inputClassName={
            inputClassName
          }

          disabled={isSubmitting}
        />

        {/* ======================================
            PASSWORD
           ====================================== */}

        <AuthField
          id="password"
          name="password"

          label="Parol"
          icon={LockKeyhole}
          type="password"

          placeholder="Xavfsiz parol yarating"

          value={values.password}

          onChange={handleChange}
          onBlur={handleBlur}

          onKeyDown={(event) =>
            handleEnter(
              event,
              "password2"
            )
          }

          error={
            formErrors.password
          }

          autoComplete="new-password"

          inputRef={
            fieldRefs.password
          }

          inputClassName={
            inputClassName
          }

          disabled={isSubmitting}
        >
          {/* PASSWORD RULES */}

          <RegisterPasswordRules
            password={values.password}
            username={values.username}

            password2={
              values.password2
            }

            showConfirmation={
              Boolean(
                values.password2
              )
            }
          />

          {/* PASSWORD STRENGTH */}

          <RegisterPasswordStrength
            password={values.password}
            username={values.username}
          />
        </AuthField>

        {/* ======================================
            CONFIRM PASSWORD
           ====================================== */}

        <AuthField
          id="password2"
          name="password2"

          label="Parolni tasdiqlash"
          icon={ShieldCheck}
          type="password"

          placeholder="Parolni qayta kiriting"

          value={values.password2}

          onChange={handleChange}
          onBlur={handleBlur}

          error={
            formErrors.password2
          }

          hint={
            passwordsMatch
              ? "Parollar bir-biriga mos."
              : "Yuqoridagi parolni qayta kiriting."
          }

          success={passwordsMatch}

          autoComplete="new-password"

          inputRef={
            fieldRefs.password2
          }

          inputClassName={
            inputClassName
          }

          disabled={isSubmitting}
        />

        {/* ======================================
            SUBMIT
           ====================================== */}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="
            group/submit

            relative mt-1
            flex min-h-12
            w-full min-w-0

            items-center
            justify-center
            gap-2

            overflow-hidden
            rounded-xl

            bg-gradient-to-r
            from-indigo-600
            to-blue-600

            px-4 py-3

            text-[13px]
            font-extrabold

            text-white

            shadow-[0_8px_24px_rgba(79,70,229,0.22)]

            transition-[transform,box-shadow,filter]
            duration-200

            hover:-translate-y-0.5
            hover:brightness-110
            hover:shadow-[0_12px_30px_rgba(79,70,229,0.28)]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-400
            focus-visible:ring-offset-2

            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:hover:translate-y-0

            dark:from-indigo-500
            dark:to-blue-500

            dark:focus-visible:ring-offset-[#0b1220]

            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          {/* BUTTON SHINE */}

          <span
            aria-hidden="true"
            className="
              pointer-events-none

              absolute inset-0

              bg-gradient-to-r
              from-transparent
              via-white/[0.08]
              to-transparent
            "
          />

          {isSubmitting ? (
            <>
              <LoaderCircle
                size={18}
                strokeWidth={2}
                className="
                  relative shrink-0
                  motion-safe:animate-spin
                "
                aria-hidden="true"
              />

              <span className="relative">
                Hisob yaratilmoqda...
              </span>
            </>
          ) : (
            <>
              <span className="relative">
                Hisob yaratish
              </span>

              <ArrowRight
                size={17}
                strokeWidth={2}
                className="
                  relative shrink-0

                  transition-transform
                  duration-200

                  group-hover/submit:translate-x-1

                  motion-reduce:transform-none
                "
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </form>

      {/* ==========================================
          LOGIN NAVIGATION
         ========================================== */}

      <div
        className="
          mt-5 flex min-w-0
          flex-wrap items-center
          justify-center gap-x-1.5 gap-y-1

          border-t
          border-slate-200/70

          pt-4

          text-[12px]
          text-slate-500

          dark:border-white/[0.08]
          dark:text-slate-400
        "
      >
        <span>
          Hisobingiz bormi?
        </span>

        <Link
          to="/login"
          className="
            rounded-md
            font-bold
            text-indigo-600

            underline-offset-4

            transition-colors

            hover:text-indigo-700
            hover:underline

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-400

            dark:text-indigo-400
            dark:hover:text-indigo-300
          "
        >
          Kirish
        </Link>
      </div>
    </div>
  );
}

export default memo(RegisterForm);
