
/**
 * FSOCIETY — TIME UNTIL DEADLINE
 *
 * Location:
 * src/utils/timeUntilDeadline.js
 *
 * Default:
 * timeUntilDeadline(deadline)
 * -> "2 kun qoldi"
 *
 * Detailed:
 * timeUntilDeadline(deadline, {
 *   detailed: true,
 * })
 * -> "2 kun 04:15:09"
 *
 * Optional clock:
 * timeUntilDeadline(deadline, {
 *   detailed: true,
 *   now: Date.now(),
 * })
 *
 * Existing named export is preserved.
 */

// =========================================================
// CONSTANTS
// =========================================================

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const pad2 = (value) =>
  String(value).padStart(2, "0");

// =========================================================
// PARSE DEADLINE
// =========================================================
//
// ISO datetime:
// 2026-10-25T15:30:00+05:00
//
// Date only:
// 2026-10-25
//
// Date-only values are interpreted as
// the end of that local calendar day.
// =========================================================

export function parseDeadlineDate(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : new Date(value.getTime());
  }

  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();

  if (!text) {
    return null;
  }

  const dateOnlyMatch = text.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);

    const result = new Date(
      year,
      month - 1,
      day,
      23,
      59,
      59,
      999
    );

    if (
      result.getFullYear() !== year ||
      result.getMonth() !== month - 1 ||
      result.getDate() !== day
    ) {
      return null;
    }

    return result;
  }

  const result = new Date(text);

  return Number.isNaN(result.getTime())
    ? null
    : result;
}

// =========================================================
// NORMALIZE CURRENT TIME
// =========================================================

const getCurrentTimestamp = (now) => {
  const timestamp =
    now instanceof Date
      ? now.getTime()
      : Number(now);

  return Number.isFinite(timestamp)
    ? timestamp
    : Date.now();
};

// =========================================================
// TIME UNTIL DEADLINE
// =========================================================

export function timeUntilDeadline(
  deadline,
  options = {}
) {
  const end = parseDeadlineDate(deadline);

  if (!end) {
    return "Muddat belgilanmagan";
  }

  const {
    detailed = false,
    now = Date.now(),
  } = options;

  const diffMs =
    end.getTime() -
    getCurrentTimestamp(now);

  if (diffMs <= 0) {
    return "⏰ Muddat tugagan";
  }

  // Ceil prevents displaying 00:00:00
  // while some milliseconds still remain.
  const totalSeconds = Math.ceil(
    diffMs / SECOND
  );

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  // =====================================================
  // DETAILED LIVE COUNTDOWN
  // =====================================================

  if (detailed) {
    const digitalTime = [
      pad2(hours),
      pad2(minutes),
      pad2(seconds),
    ].join(":");

    return days > 0
      ? `${days} kun ${digitalTime}`
      : digitalTime;
  }

  // =====================================================
  // LEGACY HUMAN-READABLE FORMAT
  // =====================================================

  const diffYear = Math.floor(
    diffMs / (365 * DAY)
  );

  const diffMonth = Math.floor(
    diffMs / (30 * DAY)
  );

  const diffWeek = Math.floor(
    diffMs / (7 * DAY)
  );

  if (diffYear > 0) {
    return `${diffYear} yil qoldi`;
  }

  if (diffMonth > 0) {
    return `${diffMonth} oy qoldi`;
  }

  if (diffWeek > 0) {
    return `${diffWeek} hafta qoldi`;
  }

  if (days > 0) {
    return `${days} kun qoldi`;
  }

  if (hours > 0) {
    return `${hours} soat qoldi`;
  }

  if (minutes > 0) {
    return `${minutes} daqiqa qoldi`;
  }

  return `${totalSeconds} soniya qoldi`;
}

export default timeUntilDeadline;
