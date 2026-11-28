
// src/utils/formatEventDate.js

// =========================================================
// FSOCIETY — EVENT DATE FORMATTER
// =========================================================
//
// 2026-12-20T00:00:00+05:00
//        -> 20-dekabr 2026, 00:00
//
// Explicit Uzbek month names avoid browser-dependent
// "2026 M12 20" output from the uz-UZ Intl locale.
//
// Format in the event's timezone, not the visitor's.
// =========================================================

const MONTHS = Object.freeze([
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
]);

export const DEFAULT_EVENT_TIMEZONE = "Asia/Tashkent";

const EMPTY_DATE_LABEL = "Sana belgilanmagan";

const readDate = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const date = value instanceof Date
        ? new Date(value.getTime())
        : new Date(value);

    return Number.isFinite(date.getTime()) ? date : null;
};

const readParts = (date, timeZone) => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    });

    return Object.fromEntries(
        formatter.formatToParts(date)
            .filter(({ type }) => type !== "literal")
            .map(({ type, value }) => [type, value])
    );
};

const getParts = (value, timeZone) => {
    const date = readDate(value);
    if (!date) return null;

    try {
        return readParts(date, timeZone || DEFAULT_EVENT_TIMEZONE);
    } catch (error) {
        // Invalid timezone configured on a legacy event.
        // Use one deterministic fallback; never the browser's timezone.
        if (!(error instanceof RangeError)) throw error;
        return readParts(date, DEFAULT_EVENT_TIMEZONE);
    }
};

export const formatEventDate = (
    value,
    timeZone = DEFAULT_EVENT_TIMEZONE
) => {
    const parts = getParts(value, timeZone);
    if (!parts) return EMPTY_DATE_LABEL;

    const monthName = MONTHS[Number(parts.month) - 1];
    if (!monthName) return EMPTY_DATE_LABEL;

    return `${Number(parts.day)}-${monthName} ${parts.year}, ${parts.hour}:${parts.minute}`;
};

export const formatEventDateShort = (
    value,
    timeZone = DEFAULT_EVENT_TIMEZONE
) => {
    const parts = getParts(value, timeZone);
    if (!parts) return EMPTY_DATE_LABEL;

    const monthName = MONTHS[Number(parts.month) - 1];
    if (!monthName) return EMPTY_DATE_LABEL;

    return `${Number(parts.day)}-${monthName} ${parts.year}`;
};

export default formatEventDate;
