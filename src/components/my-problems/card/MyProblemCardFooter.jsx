
import React, {
  memo,
  useMemo,
} from "react";

import { Link } from "react-router-dom";

import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Coins,
  ExternalLink,
} from "lucide-react";

import {
  formatProblemCount,
  getProblemDeadlineMeta,
  getProblemStatusMeta,
  normalizeProblemCount,
  parseProblemDate,
} from "./myProblemCardHelpers";

// =========================================================
// FSOCIETY — MY PROBLEM CARD FOOTER
// =========================================================
//
// Location:
// src/components/my-problems/card/MyProblemCardFooter.jsx
//
// Responsibilities:
// - Deadline display
// - Expired deadline indication
// - Optional FCoin bounty
// - Problem detail navigation
//
// Features:
// - Light / Dark Mode
// - Responsive 320px+
// - Existing detail route compatibility
// - Solved / Unsolved CTA
// - Safe date values
// - Accessible Link
// - No duplicate API calls
//
// =========================================================

// =========================================================
// SHARED STYLES
// =========================================================

const INFO_BADGE_CLASS = [
  "inline-flex",
  "min-h-8",
  "min-w-0",
  "max-w-full",
  "items-center",
  "gap-1.5",
  "rounded-lg",
  "border",
  "px-2.5",
  "py-1.5",
  "text-[10px]",
  "font-semibold",
  "leading-4",
].join(" ");

const NORMAL_DEADLINE_CLASS = [
  "border-slate-200",
  "bg-slate-50",
  "text-slate-600",
  "dark:border-white/[0.09]",
  "dark:bg-white/[0.04]",
  "dark:text-slate-300",
].join(" ");

const EXPIRED_DEADLINE_CLASS = [
  "border-rose-200",
  "bg-rose-50",
  "text-rose-700",
  "dark:border-rose-400/20",
  "dark:bg-rose-400/10",
  "dark:text-rose-300",
].join(" ");

const CTA_CLASS = [
  "group/cta",
  "inline-flex",
  "min-h-11",
  "min-w-0",
  "w-full",
  "shrink-0",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-xl",
  "border",
  "border-indigo-200",
  "bg-indigo-50",
  "px-3.5",
  "py-2.5",
  "text-[11px]",
  "font-extrabold",
  "text-indigo-700",
  "transition-all",
  "duration-200",
  "hover:border-indigo-300",
  "hover:bg-indigo-600",
  "hover:text-white",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-indigo-400",
  "active:scale-[0.98]",
  "dark:border-indigo-400/20",
  "dark:bg-indigo-400/10",
  "dark:text-indigo-300",
  "dark:hover:border-indigo-400/40",
  "dark:hover:bg-indigo-500",
  "dark:hover:text-white",
  "sm:w-auto",
  "motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(" ");

// =========================================================
// DEADLINE BADGE
// =========================================================

const DeadlineBadge = memo(
  function DeadlineBadge({
    deadline,
    isSolved,
  }) {
    const deadlineMeta = useMemo(
      () =>
        getProblemDeadlineMeta(
          deadline,
          { isSolved }
        ),
      [deadline, isSolved]
    );

    // -----------------------------------------------
    // NO DEADLINE
    // -----------------------------------------------

    if (!deadlineMeta) {
      return (
        <span
          className={`
            ${INFO_BADGE_CLASS}
            ${NORMAL_DEADLINE_CLASS}
          `}
        >
          <CalendarDays
            size={13}
            className="shrink-0"
            aria-hidden="true"
          />

          <span className="min-w-0">
            Muddat belgilanmagan
          </span>
        </span>
      );
    }

    // -----------------------------------------------
    // DEADLINE STATUS
    // -----------------------------------------------

    const isExpired =
      deadlineMeta.isExpired;

    const isToday =
      deadlineMeta.isToday;

    const parsedDeadline =
      parseProblemDate(deadline, {
        endOfDay: true,
      });

    // -----------------------------------------------
    // RENDER
    // -----------------------------------------------

    return (
      <time
        dateTime={
          parsedDeadline
            ? parsedDeadline.toISOString()
            : undefined
        }
        title={`Deadline: ${deadlineMeta.exactDate}`}
        className={`
          ${INFO_BADGE_CLASS}

          ${
            isExpired
              ? EXPIRED_DEADLINE_CLASS
              : NORMAL_DEADLINE_CLASS
          }
        `}
      >
        {isExpired ? (
          <AlertCircle
            size={13}
            className="shrink-0"
            aria-hidden="true"
          />
        ) : isSolved ? (
          <CheckCircle2
            size={13}
            className="
              shrink-0
              text-emerald-600
              dark:text-emerald-400
            "
            aria-hidden="true"
          />
        ) : (
          <CalendarDays
            size={13}
            className={`
              shrink-0
              ${
                isToday
                  ? "text-amber-600 dark:text-amber-400"
                  : ""
              }
            `}
            aria-hidden="true"
          />
        )}

        <span className="min-w-0">
          {deadlineMeta.label}
        </span>
      </time>
    );
  }
);

// =========================================================
// FCOIN BADGE
// =========================================================

const FCoinBadge = memo(
  function FCoinBadge({
    amount = 0,
  }) {
    const safeAmount =
      normalizeProblemCount(amount);

    if (safeAmount <= 0) {
      return null;
    }

    return (
      <span
        title={`Mukofot: ${formatProblemCount(safeAmount)} FCoin`}
        className={`
          ${INFO_BADGE_CLASS}

          border-amber-200
          bg-amber-50

          text-amber-700

          dark:border-amber-400/20
          dark:bg-amber-400/10
          dark:text-amber-300
        `}
      >
        <Coins
          size={13}
          className="shrink-0"
          aria-hidden="true"
        />

        <span
          className="
            font-mono font-bold
            tabular-nums
          "
        >
          {formatProblemCount(safeAmount)}
        </span>

        <span>FCoin</span>
      </span>
    );
  }
);

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemCardFooter({
  id = null,

  status = false,
  isSolved = false,

  deadline = null,
  isUrgent = false,

  offeredCoins = 0,

  detailUrl = null,

  showDeadline = true,
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

  const solved =
    statusMeta.key === "solved";

  // =====================================================
  // DETAIL URL
  // =====================================================

  const hasValidId =
    id !== null &&
    id !== undefined &&
    id !== "";

  const resolvedDetailUrl =
    detailUrl ||
    (
      hasValidId
        ? `/problem/${encodeURIComponent(
            String(id)
          )}/detail`
        : null
    );

  // =====================================================
  // ACTION LABEL
  // =====================================================

  const actionLabel = solved
    ? "Yechimni ko‘rish"
    : "Muammoni ko‘rish";

  // =====================================================
  // FCOIN
  // =====================================================

  const coins =
    normalizeProblemCount(
      offeredCoins
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <footer
      className={`
        relative mt-auto
        w-full min-w-0

        border-t
        border-slate-200/80

        bg-slate-50/70

        px-3.5 py-3.5

        dark:border-white/[0.07]
        dark:bg-white/[0.025]

        sm:px-4

        ${className}
      `}
    >
      <div
        className="
          flex min-w-0
          flex-col gap-3

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* ======================================
            LEFT — DEADLINE & REWARD
           ====================================== */}

        <div
          className="
            flex min-w-0
            flex-wrap items-center
            gap-1.5
          "
        >
          {/* DEADLINE */}
          {showDeadline && (
            <DeadlineBadge
              deadline={deadline}
              isSolved={solved}
            />
          )}

          {/* FCOIN */}
          {coins > 0 && (
            <FCoinBadge
              amount={coins}
            />
          )}
        </div>

        {/* ======================================
            RIGHT — DETAIL ACTION
           ====================================== */}

        {resolvedDetailUrl ? (
          <Link
            to={resolvedDetailUrl}
            aria-label={`${actionLabel} — ${id ?? "muammo"}`}
            className={CTA_CLASS}
          >
            <span className="truncate">
              {actionLabel}
            </span>

            <ArrowUpRight
              size={15}
              className="
                shrink-0
                transition-transform
                duration-200

                group-hover/cta:translate-x-0.5
                group-hover/cta:-translate-y-0.5

                motion-reduce:transform-none
              "
              aria-hidden="true"
            />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={`
              ${CTA_CLASS}
              cursor-not-allowed
              opacity-50
            `}
          >
            {actionLabel}

            <ExternalLink
              size={14}
              aria-hidden="true"
            />
          </span>
        )}
      </div>

      {/* ==========================================
          OPTIONAL TERMINAL FOOTER
         ========================================== */}

      <div
        className="
          mt-3
          flex min-w-0
          flex-wrap items-center
          justify-between
          gap-x-3 gap-y-1.5

          border-t
          border-slate-200/70
          pt-2.5

          dark:border-white/[0.06]
        "
      >
        <span
          className="
            min-w-0
            truncate

            font-mono
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.08em]

            text-slate-400

            dark:text-slate-500
          "
        >
          FSOCIETY://PROBLEM
        </span>

        <span
          className="
            inline-flex
            items-center gap-1

            font-mono text-[9px]
            font-semibold

            text-slate-400
            dark:text-slate-500
          "
        >
          {isUrgent ? (
            "PRIORITY: HIGH"
          ) : (
            "PRIORITY: NORMAL"
          )}

          <ChevronRight
            size={11}
            aria-hidden="true"
          />
        </span>
      </div>
    </footer>
  );
}

export default memo(MyProblemCardFooter);
