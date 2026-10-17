
/**
 * FSociety — Compact Number Formatter
 *
 * Used for:
 * - FCoin balances
 * - User ratings/statistics
 * - Views
 * - Likes
 * - Followers
 *
 * Examples:
 * 1000       -> 1K
 * 1500       -> 1.5K
 * 1000000    -> 1M
 * 1250000000 -> 1.3B
 *
 * Does not modify backend values.
 */

const NUMBER_UNITS = [
    { value: 1e18, suffix: "Qi" },
    { value: 1e15, suffix: "Qa" },
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
];

const regularFormatter = new Intl.NumberFormat(
    "en-US",
    {
        maximumFractionDigits: 0,
    }
);

const compactFormatter = new Intl.NumberFormat(
    "en-US",
    {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }
);

// =========================================================
// NORMALIZE NUMBER
// =========================================================

const normalizeNumber = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        typeof value === "boolean"
    ) {
        return 0;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
};

// =========================================================
// COMPACT NUMBER
// =========================================================

export const formatCompactNumber = (value) => {
    const number = normalizeNumber(value);
    const absolute = Math.abs(number);

    // Numbers below 1000 remain normal.
    if (absolute < 1000) {
        return regularFormatter.format(number);
    }

    let unitIndex = NUMBER_UNITS.findIndex(
        (unit) => absolute >= unit.value
    );

    if (unitIndex === -1) {
        return regularFormatter.format(number);
    }

    let compactValue =
        absolute / NUMBER_UNITS[unitIndex].value;

    let rounded =
        Math.round(compactValue * 10) / 10;

    // Example:
    // 999950 -> 1M instead of 1000K.
    if (
        rounded >= 1000 &&
        unitIndex > 0
    ) {
        unitIndex -= 1;

        compactValue =
            absolute / NUMBER_UNITS[unitIndex].value;

        rounded =
            Math.round(compactValue * 10) / 10;
    }

    const sign = number < 0 ? "-" : "";

    const formatted = compactFormatter.format(
        rounded
    );

    return (
        `${sign}${formatted}${NUMBER_UNITS[unitIndex].suffix}`
    );
};

// =========================================================
// FULL NUMBER
//
// Useful for profile pages and tooltips.
// =========================================================

export const formatFullNumber = (value) => {
    return regularFormatter.format(
        normalizeNumber(value)
    );
};

export default formatCompactNumber;
