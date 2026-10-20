
import React from "react";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  X,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROJECT PROMOTION ALERT
// =========================================================
//
// Supported variants:
// - error
// - success
// - warning
// - info
//
// Features:
// - Light / Dark Mode
// - Accessible statuses
// - Responsive text
// - Optional retry action
// - Optional dismiss action
//
// No Redux or API logic.
// =========================================================

// =========================================================
// VARIANT CONFIG
// =========================================================

const ALERT_CONFIG = {
  error: {
    title: "Xatolik",
    Icon: AlertCircle,

    wrapper: `
      border-red-200
      bg-red-50
      text-red-800

      dark:border-red-400/20
      dark:bg-red-400/[0.055]
      dark:text-red-200
    `,

    icon: `
      text-red-600
      dark:text-red-300
    `,

    titleColor: `
      text-red-800
      dark:text-red-200
    `,

    button: `
      border-red-200
      bg-white/75
      text-red-700

      hover:bg-red-100

      dark:border-red-400/15
      dark:bg-red-400/[0.07]
      dark:text-red-200
      dark:hover:bg-red-400/[0.13]
    `,
  },

  success: {
    title: "Muvaffaqiyatli",
    Icon: CheckCircle2,

    wrapper: `
      border-emerald-200
      bg-emerald-50
      text-emerald-800

      dark:border-emerald-400/20
      dark:bg-emerald-400/[0.055]
      dark:text-emerald-200
    `,

    icon: `
      text-emerald-600
      dark:text-emerald-300
    `,

    titleColor: `
      text-emerald-800
      dark:text-emerald-200
    `,

    button: `
      border-emerald-200
      bg-white/75
      text-emerald-700

      hover:bg-emerald-100

      dark:border-emerald-400/15
      dark:bg-emerald-400/[0.07]
      dark:text-emerald-200
      dark:hover:bg-emerald-400/[0.13]
    `,
  },

  warning: {
    title: "Ogohlantirish",
    Icon: AlertTriangle,

    wrapper: `
      border-amber-200
      bg-amber-50
      text-amber-800

      dark:border-amber-400/20
      dark:bg-amber-400/[0.055]
      dark:text-amber-200
    `,

    icon: `
      text-amber-600
      dark:text-amber-300
    `,

    titleColor: `
      text-amber-800
      dark:text-amber-200
    `,

    button: `
      border-amber-200
      bg-white/75
      text-amber-700

      hover:bg-amber-100

      dark:border-amber-400/15
      dark:bg-amber-400/[0.07]
      dark:text-amber-200
      dark:hover:bg-amber-400/[0.13]
    `,
  },

  info: {
    title: "Ma'lumot",
    Icon: Info,

    wrapper: `
      border-blue-200
      bg-blue-50
      text-blue-800

      dark:border-blue-400/20
      dark:bg-blue-400/[0.055]
      dark:text-blue-200
    `,

    icon: `
      text-blue-600
      dark:text-blue-300
    `,

    titleColor: `
      text-blue-800
      dark:text-blue-200
    `,

    button: `
      border-blue-200
      bg-white/75
      text-blue-700

      hover:bg-blue-100

      dark:border-blue-400/15
      dark:bg-blue-400/[0.07]
      dark:text-blue-200
      dark:hover:bg-blue-400/[0.13]
    `,
  },
};

// =========================================================
// SAFE MESSAGE
// =========================================================

const getAlertMessage = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  if (
    typeof value?.message === "string"
  ) {
    return value.message.trim();
  }

  if (
    typeof value?.detail === "string"
  ) {
    return value.detail.trim();
  }

  return "";
};

// =========================================================
// ALERT COMPONENT
// =========================================================

const ProjectPromotionAlert = ({
  variant = "info",
  type,

  title,

  message,

  className = "",

  onRetry,
  isRetrying = false,

  onDismiss,
}) => {
  // =======================================================
  // VALIDATE CONTENT
  // =======================================================

  const text = getAlertMessage(message);

  if (!text) {
    return null;
  }

  // =======================================================
  // RESOLVE VARIANT
  // =======================================================

  const normalizedVariant = String(
    type ?? variant
  ).toLowerCase();

  const config =
    ALERT_CONFIG[normalizedVariant] ??
    ALERT_CONFIG.info;

  const {
    Icon,
    wrapper,
    icon,
    titleColor,
    button,
  } = config;

  const resolvedTitle =
    typeof title === "string" &&
    title.trim()
      ? title.trim()
      : config.title;

  const isAlert =
    normalizedVariant === "error" ||
    normalizedVariant === "warning";

  const canRetry =
    typeof onRetry === "function";

  const canDismiss =
    typeof onDismiss === "function";

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      role={isAlert ? "alert" : "status"}
      aria-live={
        isAlert ? "assertive" : "polite"
      }
      aria-atomic="true"
      className={`
        relative
        mt-4
        flex
        w-full
        min-w-0
        items-start
        gap-3
        rounded-2xl
        border
        p-3.5

        sm:p-4

        ${wrapper}
        ${className}
      `}
    >
      {/* =====================================
          ICON
      ===================================== */}

      <Icon
        size={19}
        strokeWidth={1.9}
        className={`
          mt-0.5
          shrink-0

          ${icon}
        `}
        aria-hidden="true"
      />

      {/* =====================================
          CONTENT
      ===================================== */}

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className={`
            break-words
            text-xs
            font-black
            leading-5

            ${titleColor}
          `}
        >
          {resolvedTitle}
        </p>

        <p
          className="
            mt-1
            whitespace-pre-wrap
            break-words
            [overflow-wrap:anywhere]
            text-xs
            font-medium
            leading-5
          "
        >
          {text}
        </p>

        {/* =================================
            OPTIONAL RETRY
        ================================= */}

        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className={`
              mt-3
              inline-flex
              min-h-10
              min-w-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              px-3
              py-2
              text-xs
              font-bold
              transition-colors

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-current

              disabled:cursor-not-allowed
              disabled:opacity-50

              ${button}
            `}
          >
            <RefreshCw
              size={14}
              className={
                isRetrying
                  ? "motion-safe:animate-spin"
                  : ""
              }
              aria-hidden="true"
            />

            {isRetrying
              ? "Qayta yuklanmoqda..."
              : "Qayta urinish"}
          </button>
        )}
      </div>

      {/* =====================================
          OPTIONAL DISMISS
      ===================================== */}

      {canDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Xabarni yopish"
          className="
            -mr-1
            -mt-1
            grid
            h-10
            w-10
            shrink-0
            place-items-center
            rounded-lg
            text-current
            opacity-70
            transition-colors

            hover:bg-black/5
            hover:opacity-100

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-current

            dark:hover:bg-white/10
          "
        >
          <X
            size={16}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};

export default React.memo(
  ProjectPromotionAlert
);
