
import React, {
  memo,
  useSyncExternalStore,
} from "react";

import {
  Clock3,
  Pencil,
} from "lucide-react";

import timeAgo from "../../../../utils/timeAgo";

// =========================================================
// FSOCIETY — COMMENT TIME
// =========================================================
//
// Features:
// - Existing timeAgo utility
// - Created at
// - Updated at
// - Automatic relative-time refresh
// - One shared timer for all comments
// - Light / Dark Mode
// - Accessible exact timestamps
//
// =========================================================

// =========================================================
// SHARED CLOCK STORE
// =========================================================

const CLOCK_INTERVAL = 30000;

const listeners = new Set();

let timer = null;
let clockVersion = 0;

const notifyClockSubscribers = () => {
  clockVersion += 1;

  listeners.forEach((listener) => {
    listener();
  });
};

const subscribeToClock = (listener) => {
  listeners.add(listener);

  if (timer === null) {
    timer = setInterval(
      notifyClockSubscribers,
      CLOCK_INTERVAL
    );
  }

  return () => {
    listeners.delete(listener);

    if (
      listeners.size === 0 &&
      timer !== null
    ) {
      clearInterval(timer);
      timer = null;
    }
  };
};

const getClockSnapshot = () => clockVersion;

const getServerClockSnapshot = () => 0;

// =========================================================
// DATE HELPERS
// =========================================================

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return null;
  }

  return date;
};

const formatExactDate = (value) => {
  const date = parseDate(value);

  if (!date) return "";

  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatRelativeDate = (value) => {
  if (!parseDate(value)) {
    return "";
  }

  try {
    return (
      timeAgo(value) ||
      formatExactDate(value)
    );
  } catch {
    return formatExactDate(value);
  }
};

const wasEdited = (createdAt, updatedAt) => {
  const created = parseDate(createdAt);
  const updated = parseDate(updatedAt);

  if (!created || !updated) {
    return false;
  }

  return (
    updated.getTime() -
      created.getTime() >
    2000
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function CommentTime({
  createdAt,
  updatedAt,
  compact = false,
}) {
  // All CommentTime instances share one timer.
  useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getServerClockSnapshot
  );

  const edited = wasEdited(
    createdAt,
    updatedAt
  );

  const createdLabel =
    formatRelativeDate(createdAt);

  const updatedLabel = edited
    ? formatRelativeDate(updatedAt)
    : "";

  if (
    !createdLabel &&
    !updatedLabel
  ) {
    return null;
  }

  return (
    <div
      className="
        flex min-w-0
        flex-wrap items-center
        gap-x-2 gap-y-1
      "
    >
      {/* CREATED AT */}
      {createdLabel && (
        <time
          dateTime={createdAt}
          title={`Yozilgan: ${formatExactDate(createdAt)}`}
          aria-label={`Yozilgan: ${formatExactDate(createdAt)}`}
          className="
            inline-flex min-w-0
            items-center gap-1

            text-[10px]
            text-slate-400

            dark:text-slate-500
          "
        >
          <Clock3
            size={11}
            className="shrink-0"
            aria-hidden="true"
          />

          <span className="min-w-0">
            {createdLabel}
          </span>
        </time>
      )}

      {/* UPDATED AT */}
      {edited && (
        <time
          dateTime={updatedAt}
          title={`Tahrirlangan: ${formatExactDate(updatedAt)}`}
          aria-label={`Tahrirlangan: ${formatExactDate(updatedAt)}`}
          className="
            inline-flex min-w-0
            items-center gap-1.5

            rounded-md
            border border-amber-200
            bg-amber-50

            px-1.5 py-0.5

            text-[9px]
            font-semibold
            text-amber-700

            dark:border-amber-400/20
            dark:bg-amber-400/10
            dark:text-amber-300
          "
        >
          <Pencil
            size={10}
            className="shrink-0"
            aria-hidden="true"
          />

          <span>
            {compact
              ? "Tahrirlangan"
              : `Tahrirlangan · ${updatedLabel}`}
          </span>
        </time>
      )}
    </div>
  );
}

export default memo(CommentTime);
