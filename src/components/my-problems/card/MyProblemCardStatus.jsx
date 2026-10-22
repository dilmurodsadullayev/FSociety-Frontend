
import React, { memo, useMemo } from "react";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Flame,
  XCircle,
} from "lucide-react";

import {
  getProblemDeadlineMeta,
  getProblemStatusMeta,
} from "./myProblemCardHelpers";

// =========================================================
// FSOCIETY — MY PROBLEM CARD STATUS
// =========================================================
//
// Location:
// src/components/my-problems/card/MyProblemCardStatus.jsx
//
// Props:
// - status
// - isSolved
// - isUrgent
// - deadline
// - showDeadline
// - compact
// - className
//
// Features:
// - Solved / Open / Pending / Rejected
// - Urgent priority
// - Deadline information
// - Expired deadline indication
// - Light / Dark Mode
// - Responsive compact badges
// - Accessible labels
//
// =========================================================

// =========================================================
// STATUS CONFIGURATION
// =========================================================

const STATUS_CONFIG = {
  solved: {
    Icon: CheckCircle2,

    className: [
      "border-emerald-200",
      "bg-emerald-50",
      "text-emerald-700",
      "dark:border-emerald-400/20",
      "dark:bg-emerald-400/10",
      "dark:text-emerald-300",
    ].join(" "),
  },

  open: {
    Icon: CircleDashed,

    className: [
      "border-indigo-200",
      "bg-indigo-50",
      "text-indigo-700",
      "dark:border-indigo-400/20",
      "dark:bg-indigo-400/10",
      "dark:text-indigo-300",
    ].join(" "),
  },

  pending: {
    Icon: Clock3,

    className: [
      "border-amber-200",
      "bg-amber-50",
      "text-amber-700",
      "dark:border-amber-400/20",
      "dark:bg-amber-400/10",
      "dark:text-amber-300",
    ].join(" "),
  },

  rejected: {
    Icon: XCircle,

    className: [
      "border-rose-200",
      "bg-rose-50",
      "text-rose-700",
      "dark:border-rose-400/20",
      "dark:bg-rose-400/10",
      "dark:text-rose-300",
    ].join(" "),
  },
};

// =========================================================
// SHARED BADGE STYLE
// =========================================================

const BADGE_CLASS = [
  "inline-flex",
  "min-h-7",
  "max-w-full",
  "min-w-0",
  "items-center",
  "justify-center",
  "gap-1.5",
  "rounded-lg",
  "border",
  "px-2.5",
  "py-1",
  "text-[10px]",
  "font-bold",
  "leading-4",
  "transition-colors",
  "motion-reduce:transition-none",
].join(" ");

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemCardStatus({
  status = false,
  isSolved = false,
  isUrgent = false,
  deadline = null,

  showDeadline = true,
  compact = false,

  className = "",
}) {
  // =====================================================
  // STATUS
  // =====================================================

  const statusMeta = useMemo(
    () =>
      getProblemStatusMeta({
        status,
        isSolved,
      }),
    [status, isSolved]
  );

  const statusConfig =
    STATUS_CONFIG[statusMeta.key] ??
    STATUS_CONFIG.open;

  const StatusIcon =
    statusConfig.Icon;

  // =====================================================
  // DEADLINE
  // =====================================================

  const deadlineMeta = useMemo(
    () =>
      getProblemDeadlineMeta(deadline, {
        isSolved:
          statusMeta.key === "solved",
      }),
    [
      deadline,
      statusMeta.key,
    ]
  );

  // =====================================================
  // FLAGS
  // =====================================================

  const urgent = isUrgent === true;

  const expired =
    Boolean(deadlineMeta?.isExpired);

  // =====================================================
  // DEADLINE CLASSES
  // =====================================================

  const deadlineClass = expired
    ? [
        "border-red-200",
        "bg-red-50",
        "text-red-700",
        "dark:border-red-400/20",
        "dark:bg-red-400/10",
        "dark:text-red-300",
      ].join(" ")
    : [
        "border-slate-200",
        "bg-slate-50",
        "text-slate-600",
        "dark:border-white/[0.10]",
        "dark:bg-white/[0.04]",
        "dark:text-slate-300",
      ].join(" ");

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className={`
        flex min-w-0 max-w-full
        flex-wrap items-center
        gap-1.5

        ${className}
      `}
    >
      {/* ==========================================
          SOLVED / OPEN / PENDING / REJECTED
         ========================================== */}

      <span
        title={statusMeta.description}
        aria-label={`Muammo holati: ${statusMeta.label}`}
        className={`
          ${BADGE_CLASS}
          ${statusConfig.className}
        `}
      >
        <StatusIcon
          size={13}
          strokeWidth={2}
          className="shrink-0"
          aria-hidden="true"
        />

        <span className="min-w-0">
          {compact &&
          statusMeta.key === "pending"
            ? "Kutilmoqda"
            : statusMeta.label}
        </span>
      </span>

      {/* ==========================================
          URGENT
         ========================================== */}

      {urgent && (
        <span
          title="Shoshilinch muammo"
          aria-label="Muammo shoshilinch"
          className={`
            ${BADGE_CLASS}

            border-orange-200
            bg-orange-50
            text-orange-700

            dark:border-orange-400/20
            dark:bg-orange-400/10
            dark:text-orange-300
          `}
        >
          <Flame
            size={13}
            className="shrink-0"
            aria-hidden="true"
          />

          <span>
            {compact
              ? "Tezkor"
              : "Shoshilinch"}
          </span>
        </span>
      )}

      {/* ==========================================
          DEADLINE
         ========================================== */}

      {showDeadline && deadlineMeta && (
        <time
          dateTime={
            typeof deadline === "string"
              ? deadline
              : undefined
          }
          title={`Deadline: ${deadlineMeta.exactDate}`}
          aria-label={`Muddat: ${deadlineMeta.label}. ${deadlineMeta.exactDate}`}
          className={`
            ${BADGE_CLASS}
            ${deadlineClass}
          `}
        >
          {expired ? (
            <AlertCircle
              size={13}
              className="shrink-0"
              aria-hidden="true"
            />
          ) : (
            <CalendarDays
              size={13}
              className="shrink-0"
              aria-hidden="true"
            />
          )}

          <span className="min-w-0">
            {deadlineMeta.label}
          </span>
        </time>
      )}
    </div>
  );
}

export default memo(MyProblemCardStatus);
