
import React, { memo, useMemo } from "react";

import {
  CheckCircle2,
  Circle,
  CircleAlert,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import {
  getRegisterPasswordRules,
} from "./registerValidation";

// =========================================================
// FSOCIETY — REGISTER PASSWORD RULES
// =========================================================
//
// Location:
// src/components/auth/register/RegisterPasswordRules.jsx
//
// Features:
// - Existing password validation rules
// - Real-time rule evaluation
// - Animated green success states
// - Optional password confirmation
// - Light / Dark mode
// - Responsive 320px+
// - Accessible status indicators
//
// IMPORTANT:
// This component does not decide whether the
// form may be submitted.
//
// Actual validation:
// registerValidation.js
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const RULE_STYLES = {
  passed: {
    container: [
      "border-emerald-200/80",
      "bg-emerald-50/80",
      "text-emerald-700",
      "dark:border-emerald-400/20",
      "dark:bg-emerald-400/[0.08]",
      "dark:text-emerald-300",
    ].join(" "),

    icon: CheckCircle2,

    iconClass:
      "text-emerald-600 dark:text-emerald-400",
  },

  failed: {
    container: [
      "border-amber-200/70",
      "bg-amber-50/60",
      "text-amber-700",
      "dark:border-amber-400/15",
      "dark:bg-amber-400/[0.05]",
      "dark:text-amber-300",
    ].join(" "),

    icon: CircleAlert,

    iconClass:
      "text-amber-600 dark:text-amber-400",
  },

  pending: {
    container: [
      "border-slate-200/80",
      "bg-slate-50/80",
      "text-slate-500",
      "dark:border-white/[0.09]",
      "dark:bg-white/[0.025]",
      "dark:text-slate-400",
    ].join(" "),

    icon: Circle,

    iconClass:
      "text-slate-400 dark:text-slate-500",
  },
};

// =========================================================
// SINGLE RULE
// =========================================================

const PasswordRule = memo(function PasswordRule({
  label,
  state = "pending",
}) {
  const config =
    RULE_STYLES[state] ||
    RULE_STYLES.pending;

  const Icon = config.icon;

  const statusText =
    state === "passed"
      ? "Bajarilgan"
      : state === "failed"
        ? "Hali bajarilmagan"
        : "Tekshirilmagan";

  return (
    <li
      className={`
        flex min-w-0
        items-center gap-2

        rounded-lg border

        px-2.5 py-2

        transition-[background-color,border-color,color]
        duration-300

        motion-reduce:transition-none

        ${config.container}
      `}
    >
      <Icon
        size={15}
        strokeWidth={2}
        className={`
          shrink-0
          transition-transform duration-300

          ${
            state === "passed"
              ? "motion-safe:scale-105"
              : ""
          }

          ${config.iconClass}
        `}
        aria-hidden="true"
      />

      <span
        className="
          min-w-0 flex-1

          text-[10px]
          font-semibold
          leading-4

          sm:text-[11px]
        "
      >
        {label}
      </span>

      <span className="sr-only">
        {statusText}
      </span>
    </li>
  );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

function RegisterPasswordRules({
  password = "",
  username = "",

  // Optional confirmation status.
  password2 = "",
  showConfirmation = false,

  // Preserve old Register behavior:
  // rules appear after typing starts.
  showWhenEmpty = false,

  className = "",
}) {
  // =====================================================
  // SAFE VALUES
  // =====================================================

  const safePassword =
    typeof password === "string"
      ? password
      : "";

  const safeUsername =
    typeof username === "string"
      ? username
      : "";

  const safePassword2 =
    typeof password2 === "string"
      ? password2
      : "";

  const hasPassword =
    safePassword.length > 0;

  // =====================================================
  // RULES
  //
  // All actual password rules come from the
  // same validation utility used by Register.
  // =====================================================

  const rules = useMemo(() => {
    const originalRules =
      getRegisterPasswordRules(
        safePassword,
        safeUsername
      );

    return originalRules.map((rule) => {
      // We cannot claim the username-related
      // rule is verified until a username
      // has been entered.

      const usernamePending =
        rule.id ===
          "notSimilarToUsername" &&
        safeUsername.trim().length < 3;

      let state = "pending";

      if (
        hasPassword &&
        !usernamePending
      ) {
        state = rule.passed
          ? "passed"
          : "failed";
      }

      return {
        ...rule,
        state,
      };
    });
  }, [
    safePassword,
    safeUsername,
    hasPassword,
  ]);

  // =====================================================
  // PROGRESS
  // =====================================================

  const totalRules =
    rules.length;

  const passedCount =
    rules.filter(
      (rule) =>
        rule.state === "passed"
    ).length;

  const allPassed =
    totalRules > 0 &&
    passedCount === totalRules;

  const progress =
    totalRules > 0
      ? Math.round(
          (passedCount / totalRules) *
            100
        )
      : 0;

  // =====================================================
  // CONFIRMATION
  // =====================================================

  const confirmationState =
    !safePassword2
      ? "pending"
      : safePassword2 === safePassword &&
          hasPassword
        ? "passed"
        : "failed";

  // =====================================================
  // VISIBILITY
  // =====================================================

  if (
    !showWhenEmpty &&
    !hasPassword
  ) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      aria-label="Parol talablari"
      className={`
        relative mt-3
        w-full min-w-0

        overflow-hidden
        rounded-xl

        border border-slate-200/80
        bg-slate-50/70

        p-3

        dark:border-white/[0.09]
        dark:bg-[#0c1422]/70

        sm:p-3.5

        ${className}
      `}
    >
      {/* ======================================
          HEADER
         ====================================== */}

      <div
        className="
          flex min-w-0
          flex-wrap items-center
          justify-between gap-2
        "
      >
        <div
          className="
            flex min-w-0
            items-center gap-2
          "
        >
          <span
            aria-hidden="true"
            className="
              flex h-7 w-7
              shrink-0

              items-center justify-center
              rounded-lg

              border border-indigo-200
              bg-indigo-50

              text-indigo-600

              dark:border-indigo-400/20
              dark:bg-indigo-400/10
              dark:text-indigo-300
            "
          >
            <KeyRound size={14} />
          </span>

          <h3
            className="
              text-[11px] font-extrabold
              text-slate-800

              dark:text-slate-200

              sm:text-xs
            "
          >
            Parol talablari
          </h3>
        </div>

        {/* PROGRESS COUNT */}
        <span
          className={`
            rounded-md
            px-2 py-1

            font-mono text-[10px]
            font-bold tabular-nums

            ${
              allPassed
                ? [
                    "bg-emerald-100",
                    "text-emerald-700",
                    "dark:bg-emerald-400/10",
                    "dark:text-emerald-300",
                  ].join(" ")
                : [
                    "bg-slate-200/60",
                    "text-slate-600",
                    "dark:bg-white/[0.06]",
                    "dark:text-slate-300",
                  ].join(" ")
            }
          `}
        >
          {passedCount}/{totalRules}
        </span>
      </div>

      {/* ======================================
          PROGRESS BAR
         ====================================== */}

      <div
        role="progressbar"
        aria-label="Bajarilgan parol talablari"
        aria-valuemin={0}
        aria-valuemax={totalRules}
        aria-valuenow={passedCount}
        className="
          mt-3 h-1.5 w-full
          overflow-hidden rounded-full

          bg-slate-200
          dark:bg-white/[0.09]
        "
      >
        <div
          className={`
            h-full rounded-full

            transition-[width,background-color]
            duration-300

            motion-reduce:transition-none

            ${
              allPassed
                ? "bg-emerald-500"
                : "bg-indigo-500"
            }
          `}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* ======================================
          RULE LIST
         ====================================== */}

      <ul
        className="
          mt-3 grid
          min-w-0 grid-cols-1

          gap-2

          sm:grid-cols-2
        "
      >
        {rules.map((rule) => (
          <PasswordRule
            key={rule.id}
            label={rule.label}
            state={rule.state}
          />
        ))}
      </ul>

      {/* ======================================
          CONFIRMATION RULE
         ====================================== */}

      {showConfirmation && (
        <div
          className="
            mt-3 border-t
            border-slate-200/80
            pt-3

            dark:border-white/[0.08]
          "
        >
          <PasswordRule
            label="Parollar bir-biriga mos"
            state={confirmationState}
          />
        </div>
      )}

      {/* ======================================
          SUCCESS MESSAGE
         ====================================== */}

      {allPassed && (
        <div
          role="status"
          className="
            mt-3 flex min-w-0
            items-center gap-2

            rounded-lg

            border border-emerald-200
            bg-emerald-50

            px-2.5 py-2

            text-[11px]
            font-semibold
            text-emerald-700

            dark:border-emerald-400/20
            dark:bg-emerald-400/[0.08]
            dark:text-emerald-300
          "
        >
          <ShieldCheck
            size={15}
            className="shrink-0"
            aria-hidden="true"
          />

          <span>
            Asosiy parol talablari bajarildi.
          </span>
        </div>
      )}
    </section>
  );
}

export default memo(RegisterPasswordRules);
