
import React, { memo } from "react";

// =========================================================
// FSOCIETY — REGISTER PAGE
// =========================================================
//
// Location:
// src/components/Register.jsx
//
// Architecture:
//
// Register
// ├── AuthPageLayout
// │   ├── PageGridBackground
// │   ├── RegisterHeader
// │   ├── AuthSocialButtons
// │   └── RegisterForm
// │       ├── AuthErrorSummary
// │       ├── AuthField
// │       ├── RegisterPasswordRules
// │       └── RegisterPasswordStrength
// │
// └── useRegisterForm
//     ├── registerValidation
//     ├── registerErrorParser
//     ├── AuthService
//     ├── Redux Auth
//     └── authToast
//
// Features:
// - Light / Dark mode
// - Shared FSociety background
// - Tailwind CSS only
// - Responsive 320px+
// - Django / DRF validation
// - Username and email duplicate errors
// - Password strength and rule indicators
// - Google and GitHub OAuth
// - Independent loading state
// - Universal toast
//
// =========================================================

// =========================================================
// SHARED AUTH COMPONENTS
// =========================================================

import AuthPageLayout from "./auth/shared/AuthPageLayout";

import AuthSocialButtons from "./auth/shared/AuthSocialButtons";

// =========================================================
// REGISTER COMPONENTS
// =========================================================

import RegisterHeader from "./auth/register/RegisterHeader";

import RegisterForm from "./auth/register/RegisterForm";

// =========================================================
// REGISTER CONTROLLER
// =========================================================

import useRegisterForm from "./auth/register/useRegisterForm";

// =========================================================
// MAIN COMPONENT
// =========================================================

function Register() {
  // =====================================================
  // CONTROLLER
  // =====================================================

  const controller = useRegisterForm();

  const {
    isSubmitting,
    handleSocialLogin,
  } = controller;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AuthPageLayout
      mode="register"
      ariaLabel="FSociety ro‘yxatdan o‘tish sahifasi"

      showMonogram
      showCubes

      showFooter
    >
      {/* ==========================================
          REGISTER HEADER
         ========================================== */}

      <RegisterHeader
        title="Yangi hisob yaratish"
        description={
          "Dasturchilar hamjamiyatiga " +
          "qo‘shiling, muammolarni birgalikda " +
          "hal qiling va loyihalaringizni ulashing."
        }
      />

      {/* ==========================================
          SOCIAL AUTHENTICATION
         ========================================== */}

      <section
        aria-label="Ijtimoiy tarmoqlar orqali ro‘yxatdan o‘tish"
        className="
          mt-6
          w-full min-w-0

          sm:mt-7
        "
      >
        <AuthSocialButtons
          onSocialLogin={
            handleSocialLogin
          }

          disabled={
            isSubmitting
          }

          isLoading={false}

          showDivider
        />
      </section>

      {/* ==========================================
          REGISTER FORM
         ========================================== */}

      <RegisterForm
        controller={controller}
        className="
          w-full min-w-0
        "
      />
    </AuthPageLayout>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(Register);
