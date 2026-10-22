
/**
 * FSOCIETY — FORMAT PROBLEM CREATED AT
 *
 * Location:
 * src/utils/formatProblemCreatedAt.js
 *
 * Backend field:
 * created_at
 *
 * Examples:
 * 2026-10-23
 * -> 23 oktabr 2026
 *
 * 2024-06-05T14:30:00
 * -> 05 iyun 2024
 */

// =========================================================
// MONTHS — UZBEK
// =========================================================

const MONTHS = [
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
];

// =========================================================
// FORMAT PROBLEM CREATED AT
// =========================================================

const formatProblemCreatedAt = (
    createdAt
) => {
    // =====================================================
    // EMPTY VALUE
    // =====================================================

    if (!createdAt) {
        return "";
    }

    // =====================================================
    // DATE-ONLY STRINGS
    //
    // Prevent timezone shifts for YYYY-MM-DD.
    // =====================================================

    let date;

    if (
        typeof createdAt === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            createdAt.trim()
        )
    ) {
        const [
            year,
            month,
            day,
        ] = createdAt
            .trim()
            .split("-")
            .map(Number);

        date = new Date(
            year,
            month - 1,
            day
        );

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return "";
        }
    } else {
        date = new Date(
            createdAt
        );
    }

    // =====================================================
    // INVALID DATE
    // =====================================================

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    // =====================================================
    // DAY
    // =====================================================

    const day = String(
        date.getDate()
    ).padStart(
        2,
        "0"
    );

    // =====================================================
    // MONTH
    // =====================================================

    const month = MONTHS[
        date.getMonth()
    ];

    // =====================================================
    // YEAR
    // =====================================================

    const year =
        date.getFullYear();

    // =====================================================
    // RESULT
    //
    // 23 oktabr 2026
    // =====================================================

    return `${day} ${month} ${year}`;
};

// =========================================================
// EXPORT
// =========================================================

export default formatProblemCreatedAt;
