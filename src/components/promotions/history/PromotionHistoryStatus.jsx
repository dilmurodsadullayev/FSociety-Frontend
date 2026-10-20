
import React from "react";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  TimerOff,
  XCircle,
} from "lucide-react";

import {
  normalizePromotionStatus,
} from "../../../utils/promotion";

// =========================================================
// FSOCIETY — PROMOTION HISTORY STATUS
// =========================================================
//
// Responsibilities:
// - Campaign status badge
// - Active / Scheduled / Expired / Cancelled
// - Unknown status fallback
// - Light / Dark Mode
// - Responsive layout
// - Accessibility
//
// No Redux, API or local state.
// =========================================================

// =========================================================
// STATUS CONFIGURATION
// =========================================================

const STATUS_CONFIG = {
  active: {
    label: "Active",

    Icon: CheckCircle2,

    className: `
      border-emerald-200
      bg-emerald-50
      text-emerald-700

      dark:border-emerald-400/20
      dark:bg-emerald-400/[0.07]
      dark:text-emerald-300
    `,
  },

  scheduled: {
    label: "Scheduled",

    Icon: Clock3,

    className: `
      border-indigo-200
      bg-indigo-50
      text-indigo-700

      dark:border-indigo-400/20
      dark:bg-indigo-400/[0.07]
      dark:text-indigo-300
    `,
  },

  expired: {
    label: "Expired",

    Icon: TimerOff,

    className: `
      border-slate-200
      bg-slate-100
      text-slate-600

      dark:border-white/[0.09]
      dark:bg-white/[0.045]
      dark:text-slate-400
    `,
  },

  cancelled: {
    label: "Cancelled",

    Icon: XCircle,

    className: `
      border-red-200
      bg-red-50
      text-red-700

      dark:border-red-400/20
      dark:bg-red-400/[0.065]
      dark:text-red-300
    `,
  },

  unknown: {
    label: "Unknown",

    Icon: AlertCircle,

    className: `
      border-amber-200
      bg-amber-50
      text-amber-700

      dark:border-amber-400/20
      dark:bg-amber-400/[0.06]
      dark:text-amber-300
    `,
  },
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const PromotionHistoryStatus = ({
  status = "unknown",
  className = "",
}) => {
  // =======================================================
  // NORMALIZE STATUS
  // =======================================================

  const normalizedStatus =
    normalizePromotionStatus(status);

  const config =
    STATUS_CONFIG[normalizedStatus] ??
    STATUS_CONFIG.unknown;

  const { Icon, label } = config;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <span
      aria-label={`Kampaniya holati: ${label}`}
      className={`
        inline-flex
        min-h-7
        w-fit
        max-w-full
        shrink-0
        items-center
        justify-center
        gap-1.5
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        font-black
        uppercase
        tracking-[0.08em]
        leading-4
        transition-colors

        ${config.className}
        ${className}
      `}
    >
      {/* STATUS ICON */}

      <Icon
        size={13}
        strokeWidth={2}
        className="shrink-0"
        aria-hidden="true"
      />

      {/* STATUS LABEL */}

      <span className="min-w-0 break-words">
        {label}
      </span>
    </span>
  );
};

export default React.memo(
  PromotionHistoryStatus
);
