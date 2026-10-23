
import React, { memo } from "react";

// =========================================================
// FSOCIETY — LOGIN PAGE
// =========================================================
//
// Location:
// src/components/Login.jsx
//
// Architecture:
//
// Login
// ├── AuthPageLayout
// │   ├── PageGridBackground
// │   ├── LoginHeader
// │   ├── AuthSocialButtons
// │   └── LoginForm
// │       ├── AuthErrorSummary
// │       └── AuthField
// │
// └── useLoginForm
//     ├── loginErrorParser
//     ├── AuthService
//     ├── Redux Auth
//     └── authToast
//
// Features:
// - FSociety Light / Dark mode
// - Shared futuristic background
// - Fully responsive layout
// - Tailwind CSS only
// - Username / password validation
// - Backend field errors
// - Password visibility toggle
// - Google / GitHub OAuth
// - JWT cookie authentication
// - Universal toast notifications
// - Independent form loading
//
// =========================================================

// =========================================================
// SHARED AUTH COMPONENTS
// =========================================================

import AuthPageLayout from "./auth/shared/AuthPageLayout";

import AuthSocialButtons from "./auth/shared/AuthSocialButtons";

// =========================================================
// LOGIN COMPONENTS
// =========================================================

import LoginHeader from "./auth/login/LoginHeader";

import LoginForm from "./auth/login/LoginForm";

// =========================================================
// LOGIN CONTROLLER
// =========================================================

import useLoginForm from "./auth/login/useLoginForm";

// =========================================================
// MAIN LOGIN COMPONENT
// =========================================================

function Login() {
  // =====================================================
  // FORM CONTROLLER
  // =====================================================

  const controller = useLoginForm();

  const {
    isSubmitting,
    handleSocialLogin,
  } = controller;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AuthPageLayout
      mode="login"
      ariaLabel="FSociety tizimga kirish sahifasi"

      showMonogram
      showCubes
      showFooter
    >
      {/* ==========================================
          LOGIN HEADER
         ========================================== */}

      <LoginHeader
        title="Xush kelibsiz"
        description={
          "Jamiyatga qaytganingiz bilan! " +
          "Hisobingizga kiring va " +
          "dasturchilar hamjamiyatidagi " +
          "faoliyatingizni davom ettiring."
        }
      />

      {/* ==========================================
          SOCIAL AUTHENTICATION
         ========================================== */}

      <section
        aria-label="Ijtimoiy tarmoqlar orqali kirish"

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
          LOGIN FORM
         ========================================== */}

      <LoginForm
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

export default memo(Login);
