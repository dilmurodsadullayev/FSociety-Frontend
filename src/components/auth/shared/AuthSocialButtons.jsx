
import React, {
  memo,
  useCallback,
} from "react";

import {
  Github,
  LoaderCircle,
} from "lucide-react";

// =========================================================
// EXISTING OAUTH CONFIG
// =========================================================

import {
  GOOGLE_AUTH_URL,
  GITHUB_AUTH_URL,
} from "../../../services/config";

// =========================================================
// EXISTING GOOGLE ICON
// =========================================================

import GoogleIcon from "../../ui/GoogleIcon";

// =========================================================
// FSOCIETY — AUTH SOCIAL BUTTONS
// =========================================================
//
// Location:
// src/components/auth/shared/AuthSocialButtons.jsx
//
// Reusable for:
// - Register
// - Login
//
// Props:
// - onSocialLogin(url, provider)
// - isLoading
// - disabled
// - googleAuthUrl
// - githubAuthUrl
// - showDivider
//
// Features:
// - Existing OAuth configuration
// - Google / GitHub login
// - Light / Dark mode
// - Tailwind CSS only
// - Responsive 320px+
// - Loading and disabled states
// - Accessible actions
//
// No direct API requests.
// No Redux dependencies.
// No duplicate toast handling.
//
// =========================================================

// =========================================================
// BUTTON STYLES
// =========================================================

const BUTTON_CLASS = [
  "group/social",

  "relative",
  "inline-flex",

  "h-12",
  "w-full min-w-0",

  "items-center",
  "justify-center",

  "gap-2",

  "overflow-hidden",

  "rounded-xl",

  "border",
  "border-slate-200",

  "bg-white",

  "px-3 py-2.5",

  "text-[12px]",
  "font-bold",

  "text-slate-700",

  "shadow-[0_3px_12px_rgba(15,23,42,0.035)]",

  "transition-[border-color,background-color,box-shadow,transform]",
  "duration-200",

  "hover:-translate-y-0.5",
  "hover:border-indigo-300",
  "hover:bg-indigo-50/60",
  "hover:text-slate-900",
  "hover:shadow-[0_6px_18px_rgba(79,70,229,0.08)]",

  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-indigo-400",
  "focus-visible:ring-offset-2",

  "active:translate-y-0",

  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "disabled:hover:translate-y-0",

  "dark:border-white/[0.11]",
  "dark:bg-[#101a2a]/90",
  "dark:text-slate-200",

  "dark:hover:border-indigo-400/30",
  "dark:hover:bg-indigo-400/[0.08]",
  "dark:hover:text-white",

  "motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(" ");

// =========================================================
// SOCIAL BUTTON
// =========================================================

const SocialButton = memo(
  function SocialButton({
    provider,
    label,
    Icon,

    onClick,

    disabled = false,
    isLoading = false,
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={`${label} orqali davom etish`}
        aria-busy={isLoading}
        className={BUTTON_CLASS}
      >
        {/* TOP HIGHLIGHT */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none

            absolute inset-x-3 top-0
            h-px

            bg-gradient-to-r
            from-transparent
            via-indigo-400/40
            to-transparent

            opacity-0

            transition-opacity

            group-hover/social:opacity-100
          "
        />

        {/* ICON */}
        <span
          className="
            flex h-6 w-6
            shrink-0

            items-center
            justify-center
          "
        >
          {isLoading ? (
            <LoaderCircle
              size={18}
              className="
                text-indigo-500
                motion-safe:animate-spin
              "
              aria-hidden="true"
            />
          ) : provider === "google" ? (
            <GoogleIcon size={19} />
          ) : (
            <Icon
              size={19}
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </span>

        {/* LABEL */}
        <span className="min-w-0 truncate">
          {label}
        </span>
      </button>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

function AuthSocialButtons({
  onSocialLogin,

  isLoading = false,
  disabled = false,

  // Existing OAuth URLs.
  googleAuthUrl = GOOGLE_AUTH_URL,
  githubAuthUrl = GITHUB_AUTH_URL,

  showDivider = true,

  className = "",
}) {
  // =====================================================
  // BUTTON STATE
  // =====================================================

  const isDisabled =
    Boolean(isLoading) ||
    Boolean(disabled) ||
    typeof onSocialLogin !== "function";

  // =====================================================
  // GOOGLE
  // =====================================================

  const handleGoogleLogin = useCallback(
    () => {
      if (isDisabled) {
        return;
      }

      // Parent handles:
      // - Missing OAuth URL
      // - Universal authToast
      // - Browser redirection

      onSocialLogin(
        googleAuthUrl,
        "google"
      );
    },
    [
      isDisabled,
      onSocialLogin,
      googleAuthUrl,
    ]
  );

  // =====================================================
  // GITHUB
  // =====================================================

  const handleGithubLogin = useCallback(
    () => {
      if (isDisabled) {
        return;
      }

      onSocialLogin(
        githubAuthUrl,
        "github"
      );
    },
    [
      isDisabled,
      onSocialLogin,
      githubAuthUrl,
    ]
  );

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
          SOCIAL LOGIN BUTTONS
         ========================================== */}

      <div
        role="group"
        aria-label="Ijtimoiy tarmoqlar orqali kirish"
        className="
          grid min-w-0
          grid-cols-2
          gap-2.5

          sm:gap-3
        "
      >
        {/* GITHUB */}
        <SocialButton
          provider="github"
          label="GitHub"
          Icon={Github}
          onClick={handleGithubLogin}
          disabled={isDisabled}
          isLoading={isLoading}
        />

        {/* GOOGLE */}
        <SocialButton
          provider="google"
          label="Google"
          onClick={handleGoogleLogin}
          disabled={isDisabled}
          isLoading={isLoading}
        />
      </div>

      {/* ==========================================
          EMAIL DIVIDER
         ========================================== */}

      {showDivider && (
        <div
          className="
            my-5

            flex min-w-0
            items-center gap-3
          "
        >
          {/* LEFT LINE */}
          <span
            aria-hidden="true"
            className="
              h-px min-w-0 flex-1

              bg-gradient-to-r
              from-transparent
              to-slate-200

              dark:to-white/[0.12]
            "
          />

          {/* LABEL */}
          <span
            className="
              shrink-0

              font-mono
              text-[10px]
              font-semibold

              text-slate-400

              dark:text-slate-500
            "
          >
            yoki email orqali
          </span>

          {/* RIGHT LINE */}
          <span
            aria-hidden="true"
            className="
              h-px min-w-0 flex-1

              bg-gradient-to-l
              from-transparent
              to-slate-200

              dark:to-white/[0.12]
            "
          />
        </div>
      )}
    </div>
  );
}

export default memo(AuthSocialButtons);
