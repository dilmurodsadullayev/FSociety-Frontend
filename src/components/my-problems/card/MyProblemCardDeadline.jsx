
import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Timer,
} from "lucide-react";

import {
  parseDeadlineDate,
  timeUntilDeadline,
} from "../../../utils/timeUntilDeadline";

import formatProblemCreatedAt from "../../../utils/formatProblemCreatedAt";

// =========================================================
// FSOCIETY — MY PROBLEM CARD DEADLINE
// =========================================================
//
// Features:
// - Real-time countdown
// - Updates every second
// - Exact deadline date
// - Exact deadline clock time
// - Expired state
// - Solved state
// - Light / Dark mode
// - Responsive layout
//
// =========================================================

const REFRESH_INTERVAL = 1000;

// =========================================================
// DEADLINE CLOCK TIME
// =========================================================

const formatDeadlineTime = (
  deadline,
  parsedDate
) => {
  if (!parsedDate) {
    return "";
  }

  // Only show an explicit clock time when
  // the backend supplied a datetime.
  //
  // YYYY-MM-DD -> no clock time
  // ISO datetime -> HH:mm

  const hasClockTime =
    deadline instanceof Date ||
    (
      typeof deadline === "string" &&
      /[T\s]\d{2}:\d{2}/.test(deadline)
    );

  if (!hasClockTime) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(
      "uz-UZ",
      {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }
    ).format(parsedDate);
  } catch {
    return "";
  }
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function MyProblemCardDeadline({
  deadline = null,
  isSolved = false,
  className = "",
}) {
  // =====================================================
  // PARSE DATE
  // =====================================================

  const parsedDeadline = useMemo(
    () => parseDeadlineDate(deadline),
    [deadline]
  );

  const deadlineTimestamp =
    parsedDeadline?.getTime() ?? null;

  // =====================================================
  // LIVE CLOCK
  // =====================================================

  const [
    nowMs,
    setNowMs,
  ] = useState(() => Date.now());

  // =====================================================
  // COUNTDOWN EFFECT
  // =====================================================

  useEffect(() => {
    setNowMs(Date.now());

    if (
      deadlineTimestamp === null ||
      isSolved
    ) {
      return undefined;
    }

    if (Date.now() >= deadlineTimestamp) {
      return undefined;
    }

    const intervalId = window.setInterval(
      () => {
        const currentTime = Date.now();

        setNowMs(currentTime);

        // Stop unnecessary updates
        // after the deadline expires.

        if (currentTime >= deadlineTimestamp) {
          window.clearInterval(intervalId);
        }
      },
      REFRESH_INTERVAL
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    deadlineTimestamp,
    isSolved,
  ]);

  // =====================================================
  // FORMAT DEADLINE
  // =====================================================

  const formattedDate =
    formatProblemCreatedAt(deadline);

  const formattedTime =
    formatDeadlineTime(
      deadline,
      parsedDeadline
    );

  // =====================================================
  // COUNTDOWN
  // =====================================================

  const isExpired =
    !isSolved &&
    deadlineTimestamp !== null &&
    nowMs >= deadlineTimestamp;

  const remainingTime = isSolved
    ? "Hal qilingan"
    : timeUntilDeadline(
        deadline,
        {
          detailed: true,
          now: nowMs,
        }
      );

  // =====================================================
  // INVALID / EMPTY DEADLINE
  // =====================================================

  if (!parsedDeadline) {
    return null;
  }

  // =====================================================
  // STATUS COLORS
  // =====================================================

  const wrapperClass = isSolved
    ? [
        "border-emerald-200/80",
        "bg-emerald-50/70",
        "dark:border-emerald-400/20",
        "dark:bg-emerald-400/[0.05]",
      ].join(" ")
    : isExpired
      ? [
          "border-rose-200/80",
          "bg-rose-50/70",
          "dark:border-rose-400/20",
          "dark:bg-rose-400/[0.06]",
        ].join(" ")
      : [
          "border-orange-200/80",
          "bg-orange-50/70",
          "dark:border-orange-400/20",
          "dark:bg-orange-400/[0.06]",
        ].join(" ");

  const textClass = isSolved
    ? "text-emerald-700 dark:text-emerald-300"
    : isExpired
      ? "text-rose-700 dark:text-rose-300"
      : "text-orange-700 dark:text-orange-300";

  const CountdownIcon = isSolved
    ? CheckCircle2
    : isExpired
      ? AlertCircle
      : Timer;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      aria-label="Muammo muddati"
      className={`
        mx-3 mb-3
        min-w-0

        rounded-xl
        border

        px-3 py-2.5

        sm:mx-4

        ${wrapperClass}
        ${className}
      `}
    >
      <div
        className="
          flex min-w-0
          flex-wrap items-center
          justify-between
          gap-x-4 gap-y-2
        "
      >
        {/* ======================================
            COUNTDOWN
           ====================================== */}

        <div
          className="
            flex min-w-0
            flex-col gap-1
          "
        >
          <span
            className="
              font-mono text-[9px]
              font-bold uppercase
              tracking-[0.10em]

              text-slate-500
              dark:text-slate-400
            "
          >
            {isSolved
              ? "Muammo holati"
              : isExpired
                ? "Deadline yakunlandi"
                : "Qolgan vaqt"}
          </span>

          <span
            role="timer"
            aria-live="off"
            title={
              isSolved
                ? "Muammo hal qilingan"
                : "Deadline tugashigacha qolgan vaqt"
            }
            className={`
              inline-flex
              min-w-0 items-center
              gap-1.5

              font-mono
              text-[12px]
              font-extrabold
              tabular-nums

              sm:text-[13px]

              ${textClass}
            `}
          >
            <CountdownIcon
              size={15}
              className="shrink-0"
              aria-hidden="true"
            />

            <span
              className="
                break-words
                [overflow-wrap:anywhere]
              "
            >
              {remainingTime}
            </span>
          </span>
        </div>

        {/* ======================================
            DEADLINE DATE AND TIME
           ====================================== */}

        <div
          className="
            flex min-w-0
            flex-col gap-1

            sm:items-end
            sm:text-right
          "
        >
          <span
            className="
              font-mono text-[9px]
              font-bold uppercase
              tracking-[0.10em]

              text-slate-500
              dark:text-slate-400
            "
          >
            Deadline
          </span>

          <time
            dateTime={
              parsedDeadline.toISOString()
            }
            className="
              inline-flex
              min-w-0 items-center
              gap-1.5

              text-[11px]
              font-bold

              text-slate-700
              dark:text-slate-200
            "
          >
            <CalendarClock
              size={14}
              className="
                shrink-0
                text-slate-500
                dark:text-slate-400
              "
              aria-hidden="true"
            />

            <span
              className="
                break-words
                [overflow-wrap:anywhere]
              "
            >
              {formattedDate}

              {formattedTime && (
                <>
                  {" · "}
                  {formattedTime}
                </>
              )}
            </span>
          </time>
        </div>
      </div>
    </section>
  );
}

export default memo(MyProblemCardDeadline);
