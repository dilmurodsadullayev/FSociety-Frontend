
 // src/utils/events/countdownUtils.js

// =========================================================
// FSOCIETY — EVENTS COUNTDOWN UTILITIES
// =========================================================
//
// Shared between:
// - Events
// - Daily Gift
// - Seasonal Gift
// - Holiday countdowns
//
// Backend datetime must contain a timezone.
//
// Valid:
// 2027-01-01T00:00:00+05:00
// 2026-12-31T19:00:00Z
//
// Invalid:
// 2027-01-01T00:00:00
//
// Never interpret a timezone-less backend value
// using the visitor's local timezone.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

export const DEFAULT_COUNTDOWN_INTERVAL_MS = 1000;

const MIN_INTERVAL_MS = 250;
const MAX_INTERVAL_MS = 60000;

const SECOND_MS = 1000;

const MINUTE_SECONDS = 60;
const HOUR_SECONDS = 3600;
const DAY_SECONDS = 86400;

// Explicit timezone required for ISO strings.
const TIMEZONE_AWARE_ISO =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,6})?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/i;


// =========================================================
// PARSE EVENT TIMESTAMP
// =========================================================
//
// Accepts:
// - ISO 8601 string with timezone
// - Date object
// - Unix milliseconds as number
//
// Returns:
// - Milliseconds since Unix epoch
// - null for invalid input
//
// IMPORTANT:
// Numeric timestamps are milliseconds,
// not seconds.
//
// =========================================================

export const parseEventTimestamp = (value) => {
    if (value instanceof Date) {
        const timestamp = value.getTime();

        return Number.isFinite(timestamp)
            ? timestamp
            : null;
    }

    if (typeof value === "number") {
        return Number.isFinite(value)
            ? value
            : null;
    }

    if (typeof value !== "string") {
        return null;
    }

    const normalized = value.trim();

    if (!TIMEZONE_AWARE_ISO.test(normalized)) {
        return null;
    }

    const timestamp = Date.parse(normalized);

    return Number.isFinite(timestamp)
        ? timestamp
        : null;
};


// =========================================================
// SERVER CLOCK OFFSET
// =========================================================
//
// Example:
//
// Browser clock: 11:59:40
// Server clock:  12:00:00
//
// Offset: +20 seconds
//
// The countdown uses:
// Date.now() + offset
//
// receivedAtMs should ideally be captured when
// the API response is received.
//
// =========================================================

export const getServerClockOffsetMs = (
    serverTime,
    receivedAtMs = Date.now()
) => {
    const serverTimestamp =
        parseEventTimestamp(serverTime);

    if (serverTimestamp === null) {
        return 0;
    }

    const clientTimestamp =
        Number.isFinite(receivedAtMs)
            ? receivedAtMs
            : Date.now();

    return serverTimestamp - clientTimestamp;
};


// =========================================================
// INTERVAL NORMALIZER
// =========================================================

export const normalizeCountdownInterval = (
    value
) => {
    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return DEFAULT_COUNTDOWN_INTERVAL_MS;
    }

    return Math.round(
        Math.min(
            MAX_INTERVAL_MS,
            Math.max(MIN_INTERVAL_MS, value)
        )
    );
};


// =========================================================
// FORMAT HELPERS
// =========================================================

const padNumber = (value) =>
    String(value).padStart(2, "0");

export const formatCountdown = ({
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
} = {}) => {
    return [
        padNumber(days),
        padNumber(hours),
        padNumber(minutes),
        padNumber(seconds),
    ].join(":");
};


// =========================================================
// EMPTY COUNTDOWN
// =========================================================

const createEmptyCountdown = () => ({
    isValid: false,
    isExpired: false,

    remainingMs: null,
    totalSeconds: null,

    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,

    formatted: "--:--:--:--",
});


// =========================================================
// CALCULATE COUNTDOWN
// =========================================================
//
// Always calculates from absolute timestamps.
//
// Never decrement a counter manually because
// background tabs can pause JavaScript timers.
//
// A negative remaining time becomes zero.
//
// =========================================================

export const getCountdownParts = (
    targetTime,
    {
        nowMs = Date.now(),
        serverOffsetMs = 0,
    } = {}
) => {
    const targetTimestamp =
        parseEventTimestamp(targetTime);

    if (targetTimestamp === null) {
        return createEmptyCountdown();
    }

    const safeNow =
        Number.isFinite(nowMs)
            ? nowMs
            : Date.now();

    const safeOffset =
        Number.isFinite(serverOffsetMs)
            ? serverOffsetMs
            : 0;

    const currentServerTime =
        safeNow + safeOffset;

    const remainingMs = Math.max(
        0,
        targetTimestamp - currentServerTime
    );

    // Ceil prevents showing 00 seconds
    // while a fraction of a second remains.
    const totalSeconds = Math.ceil(
        remainingMs / SECOND_MS
    );

    const days = Math.floor(
        totalSeconds / DAY_SECONDS
    );

    const afterDays =
        totalSeconds % DAY_SECONDS;

    const hours = Math.floor(
        afterDays / HOUR_SECONDS
    );

    const afterHours =
        afterDays % HOUR_SECONDS;

    const minutes = Math.floor(
        afterHours / MINUTE_SECONDS
    );

    const seconds =
        afterHours % MINUTE_SECONDS;

    return {
        isValid: true,
        isExpired: remainingMs === 0,

        remainingMs,
        totalSeconds,

        days,
        hours,
        minutes,
        seconds,

        formatted: formatCountdown({
            days,
            hours,
            minutes,
            seconds,
        }),
    };
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

const countdownUtils = {
    parseEventTimestamp,
    getServerClockOffsetMs,
    normalizeCountdownInterval,
    formatCountdown,
    getCountdownParts,
};

export default countdownUtils;
