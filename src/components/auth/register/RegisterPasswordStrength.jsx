
import React, { memo, useMemo } from "react";

import {
  Info,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  getRegisterPasswordRules,
} from "./registerValidation";

// =========================================================
// FSOCIETY — REGISTER PASSWORD STRENGTH
// =========================================================
//
// Location:
// src/components/auth/register/RegisterPasswordStrength.jsx
//
// Features:
// - Four-level strength indicator
// - Real-time updates
// - Visual progress segments
// - Password improvement suggestions
// - Light / Dark mode
// - Responsive layout
// - Reduced-motion support
// - Accessible strength meter
//
// IMPORTANT:
// Strength is advisory.
// Backend validation remains authoritative.
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const STRENGTH_LEVELS = {
  0: {
    label: "Kiritilmagan",
    color: "bg-slate-300 dark:bg-slate-600",
    text: "text-slate-500 dark:text-slate-400",
    Icon: Shield,
  },

  1: {
    label: "Zaif",
    color: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    Icon: ShieldAlert,
  },

  2: {
    label: "O‘rtacha",
    color: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    Icon: Shield,
  },

  3: {
    label: "Yaxshi",
    color: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    Icon: ShieldCheck,
  },

  4: {
    label: "Kuchli",
    color: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    Icon: ShieldCheck,
  },
};

const SEGMENT_COUNT = 4;

const COMMON_PATTERNS = [
  "password",
  "qwerty",
  "123456",
  "letmein",
  "admin123",
];

// =========================================================
// PASSWORD CHARACTER TYPES
// =========================================================

const getCharacterTypeCount = (password) => {
  let count = 0;

  if (/[a-z]/.test(password)) {
    count += 1;
  }

  if (/[A-Z]/.test(password)) {
    count += 1;
  }

  if (/\d/.test(password)) {
    count += 1;
  }

  if (/[^a-zA-Z0-9\s]/.test(password)) {
    count += 1;
  }

  return count;
};

// =========================================================
// STRENGTH CALCULATOR
// =========================================================
//
// Exported separately for future tests.
//
// Returns:
// {
//   level,
//   label,
//   suggestion,
//   requirementsPassed,
//   characterTypes
// }
//
// =========================================================

export const getRegisterPasswordStrength = (
  passwordValue = "",
  usernameValue = ""
) => {
  const password =
    typeof passwordValue === "string"
      ? passwordValue
      : "";

  const username =
    typeof usernameValue === "string"
      ? usernameValue
      : "";

  if (!password) {
    return {
      level: 0,
      label: STRENGTH_LEVELS[0].label,
      suggestion:
        "Parol yozishni boshlang.",
      requirementsPassed: false,
      characterTypes: 0,
    };
  }

  // =====================================================
  // EXISTING VALIDATION REQUIREMENTS
  // =====================================================

  const requirements =
    getRegisterPasswordRules(
      password,
      username
    );

  const requirementsPassed =
    requirements.every(
      (rule) => rule.passed
    );

  // =====================================================
  // CHARACTER VARIETY
  // =====================================================

  const characterTypes =
    getCharacterTypeCount(password);

  // =====================================================
  // ADVISORY SCORE
  // =====================================================

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (password.length >= 16) {
    score += 1;
  }

  if (characterTypes >= 2) {
    score += 1;
  }

  if (characterTypes >= 3) {
    score += 1;
  }

  if (characterTypes >= 4) {
    score += 1;
  }

  // =====================================================
  // COMMON PASSWORD PATTERNS
  // =====================================================

  const lowerPassword =
    password.toLowerCase();

  const hasCommonPattern =
    COMMON_PATTERNS.some(
      (pattern) =>
        lowerPassword.includes(pattern)
    );

  // =====================================================
  // CONVERT SCORE TO LEVEL
  // =====================================================

  let level;

  if (score <= 1) {
    level = 1;
  } else if (score <= 3) {
    level = 2;
  } else if (score === 4) {
    level = 3;
  } else {
    level = 4;
  }

  // Do not show the highest strength level
  // for passwords that fail existing rules.

  if (!requirementsPassed) {
    level = Math.min(level, 1);
  }

  if (hasCommonPattern) {
    level = Math.min(level, 1);
  }

  if (
    password.length < 12 ||
    characterTypes < 3
  ) {
    level = Math.min(level, 3);
  }

  // =====================================================
  // SUGGESTION
  // =====================================================

  let suggestion = "";

  if (!requirementsPassed) {
    suggestion =
      "Avval parolning asosiy talablarini bajaring.";
  } else if (hasCommonPattern) {
    suggestion =
      "Parolda keng tarqalgan so‘z yoki ketma-ketlik bor. " +
      "Taxmin qilish qiyinroq parol tanlang.";
  } else if (password.length < 12) {
    suggestion =
      "Parolni 12 yoki undan ko‘p belgigacha uzaytirish tavsiya etiladi.";
  } else if (characterTypes < 3) {
    suggestion =
      "Parolni murakkablashtirish uchun turli xil belgilar qo‘shing.";
  } else if (level >= 4) {
    suggestion =
      "Yaxshi! Parolingiz uzun va turli xil belgilardan iborat.";
  } else {
    suggestion =
      "Yaxshi natija. Parolni yanada uzunroq qilish mumkin.";
  }

  return {
    level,
    label: STRENGTH_LEVELS[level].label,
    suggestion,
    requirementsPassed,
    characterTypes,
  };
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function RegisterPasswordStrength({
  password = "",
  username = "",

  // Preserve previous UX:
  // hide until the user begins typing.
  showWhenEmpty = false,

  className = "",
}) {
  // =====================================================
  // STRENGTH DATA
  // =====================================================

  const strength = useMemo(
    () =>
      getRegisterPasswordStrength(
        password,
        username
      ),
    [password, username]
  );

  // =====================================================
  // VISIBILITY
  // =====================================================

  if (
    !password &&
    !showWhenEmpty
  ) {
    return null;
  }

  const config =
    STRENGTH_LEVELS[strength.level];

  const StrengthIcon =
    config.Icon;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      aria-label="Parol kuchliligi"
      className={`
        mt-3
        w-full min-w-0

        rounded-xl

        border border-slate-200/80
        bg-white/70

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
          <StrengthIcon
            size={16}
            strokeWidth={1.9}
            className={`
              shrink-0
              ${config.text}
            `}
            aria-hidden="true"
          />

          <h3
            className="
              text-[11px]
              font-extrabold

              text-slate-700
              dark:text-slate-200

              sm:text-xs
            "
          >
            Parol kuchliligi
          </h3>
        </div>

        {/* LIVE STRENGTH LABEL */}
        <span
          aria-live="polite"
          aria-atomic="true"
          className={`
            font-mono
            text-[11px]
            font-extrabold

            ${config.text}
          `}
        >
          {strength.label}
        </span>
      </div>

      {/* ======================================
          STRENGTH BAR
         ====================================== */}

      <div
        role="meter"
        aria-label="Taxminiy parol kuchliligi"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={strength.level}
        aria-valuetext={strength.label}
        className="
          mt-3 grid w-full
          grid-cols-4 gap-1.5
        "
      >
        {Array.from(
          { length: SEGMENT_COUNT },
          (_, index) => {
            const filled =
              index < strength.level;

            return (
              <div
                key={index}
                aria-hidden="true"
                className={`
                  h-1.5
                  rounded-full

                  transition-colors
                  duration-300

                  motion-reduce:transition-none

                  ${
                    filled
                      ? config.color
                      : [
                          "bg-slate-200",
                          "dark:bg-white/[0.10]",
                        ].join(" ")
                  }
                `}
              />
            );
          }
        )}
      </div>

      {/* ======================================
          SUGGESTION
         ====================================== */}

      <div
        className="
          mt-3 flex min-w-0
          items-start gap-2
        "
      >
        <Info
          size={14}
          className="
            mt-0.5 shrink-0

            text-slate-400
            dark:text-slate-500
          "
          aria-hidden="true"
        />

        <p
          className="
            min-w-0
            break-words

            text-[11px]
            leading-[1.6]

            text-slate-500

            dark:text-slate-400
          "
        >
          {strength.suggestion}
        </p>
      </div>

      {/* ======================================
          ADVISORY NOTE
         ====================================== */}

      {strength.level === 4 && (
        <p
          className="
            mt-2
            text-[10px]
            leading-5

            text-emerald-600

            dark:text-emerald-400
          "
        >
          Parol kuchi taxminiy baholandi.
          Yakuniy tekshiruv serverda bajariladi.
        </p>
      )}
    </section>
  );
}

export default memo(
  RegisterPasswordStrength
);
