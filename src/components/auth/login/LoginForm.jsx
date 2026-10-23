
import React, { memo } from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
  UserRound,
} from "lucide-react";

// =========================================================
// SHARED AUTH COMPONENTS
// =========================================================

import AuthField from "../shared/AuthField";

import AuthErrorSummary from "../shared/AuthErrorSummary";

// =========================================================
// LOGIN CONFIG
// =========================================================

import {
  LOGIN_FIELD_LABELS,
} from "./loginErrorParser";

// =========================================================
// FSOCIETY — LOGIN FORM
// =========================================================
//
// Location:
// src/components/auth/login/LoginForm.jsx
//
// Features:
// - Controlled username/password inputs
// - Reusable AuthField
// - Field-level errors
// - Error summary
// - Password visibility toggle
// - Enter key navigation
// - Loading button
// - Universal toast via controller
// - Light / Dark mode
// - Responsive 320px+
// - Tailwind CSS only
//
// =========================================================

function LoginForm({
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
    handleUsernameKeyDown,
    handleSubmit,

    focusField,
    clearErrors,

    isSubmitting,
  } = controller;

  // =====================================================
  // INPUT STYLES
  //
  // 16px prevents iOS automatic input zoom.
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
          GLOBAL / SERVER ERRORS
         ========================================== */}

      <AuthErrorSummary
        globalError={globalError}
        fieldErrors={formErrors}
        fieldLabels={LOGIN_FIELD_LABELS}
        onFieldSelect={focusField}
        onDismiss={clearErrors}
        title="Tizimga kirishni tekshiring"
        className="mb-4"
      />

      {/* ==========================================
          LOGIN FORM
         ========================================== */}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Tizimga kirish formasi"
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

          placeholder="foydalanuvchi_nomi"

          value={values.username}

          onChange={handleChange}
          onBlur={handleBlur}

          onKeyDown={
            handleUsernameKeyDown
          }

          error={formErrors.username}

          autoComplete="username"
          autoCapitalize="none"

          inputRef={fieldRefs.username}

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

          placeholder="Parolingizni kiriting"

          value={values.password}

          onChange={handleChange}
          onBlur={handleBlur}

          error={formErrors.password}

          autoComplete="current-password"

          inputRef={fieldRefs.password}

          inputClassName={
            inputClassName
          }

          disabled={isSubmitting}
        />

        {/* ======================================
            SUBMIT BUTTON
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
          {/* BUTTON LIGHT EFFECT */}

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
                Kirilmoqda...
              </span>
            </>
          ) : (
            <>
              <span className="relative">
                Tizimga kirish
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
          REGISTER NAVIGATION
         ========================================== */}

      <div
        className="
          mt-5 flex min-w-0

          flex-wrap items-center
          justify-center

          gap-x-1.5 gap-y-1

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
          Hisobingiz yo‘qmi?
        </span>

        <Link
          to="/register"
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
          Ro‘yxatdan o‘ting
        </Link>
      </div>
    </div>
  );
}

export default memo(LoginForm);
