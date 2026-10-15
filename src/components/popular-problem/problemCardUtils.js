
/**
 * FSociety — Popular Problem Card Utilities
 *
 * Pure helper functions.
 * No React hooks or API calls.
 */

// =========================================================
// NUMBER FORMATTING
// =========================================================

export const formatNumber = (value) => {
    const parsed = Number(value ?? 0);

    if (!Number.isFinite(parsed)) {
        return "0";
    }

    const number = Math.max(0, parsed);

    if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(
            number >= 10_000_000 ? 0 : 1
        )}M`;
    }

    if (number >= 1_000) {
        return `${(number / 1_000).toFixed(
            number >= 10_000 ? 0 : 1
        )}K`;
    }

    return String(number);
};

// =========================================================
// DATE FORMATTING
// =========================================================

const dateFormatter = new Intl.DateTimeFormat(
    "uz-UZ",
    {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }
);

export const formatDate = (value) => {
    if (!value) {
        return "Yaqinda";
    }

    const date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
        return "Yaqinda";
    }

    return dateFormatter.format(date);
};

// =========================================================
// USER HELPERS
// =========================================================

export const getFullName = (user) => {
    const fullName = [
        user?.first_name,
        user?.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return (
        fullName ||
        user?.username ||
        "FSociety User"
    );
};

export const getUserCoins = (user) => {
    return (
        user?.coins ??
        user?.coin ??
        user?.total_coin ??
        0
    );
};

// =========================================================
// DEVELOPER LEVEL
//
// Classes must remain literal for Tailwind.
// =========================================================

const LEVEL_CONFIG = {
    beginner: {
        label: "Beginner",
        className: `
            border-emerald-400/25
            bg-emerald-500/[0.08]
            text-emerald-700

            dark:border-emerald-400/15
            dark:bg-emerald-400/[0.055]
            dark:text-emerald-300
        `,
    },

    intermediate: {
        label: "Intermediate",
        className: `
            border-cyan-400/25
            bg-cyan-500/[0.08]
            text-cyan-700

            dark:border-cyan-400/15
            dark:bg-cyan-400/[0.055]
            dark:text-cyan-300
        `,
    },

    advanced: {
        label: "Advanced",
        className: `
            border-indigo-400/25
            bg-indigo-500/[0.08]
            text-indigo-700

            dark:border-indigo-400/15
            dark:bg-indigo-400/[0.055]
            dark:text-indigo-300
        `,
    },

    pro: {
        label: "Pro",
        className: `
            border-fuchsia-400/25
            bg-fuchsia-500/[0.08]
            text-fuchsia-700

            dark:border-fuchsia-400/15
            dark:bg-fuchsia-400/[0.055]
            dark:text-fuchsia-300
        `,
    },

    legend: {
        label: "Legend",
        className: `
            border-yellow-400/30
            bg-yellow-500/[0.09]
            text-amber-800

            dark:border-yellow-400/20
            dark:bg-yellow-400/[0.06]
            dark:text-yellow-300
        `,
    },
};

export const getLevelConfig = (user) => {
    const level = String(
        user?.level ||
        user?.skill_level ||
        "beginner"
    )
        .trim()
        .toLowerCase();

    return (
        LEVEL_CONFIG[level] ||
        LEVEL_CONFIG.beginner
    );
};

// =========================================================
// PROBLEM STATUS
// =========================================================

export const isProblemSolved = (
    status,
    isSolved = false
) => {
    return (
        Boolean(isSolved) ||
        String(status ?? "").toLowerCase() ===
            "solved"
    );
};

// =========================================================
// TECHNOLOGY TAG HELPERS
// =========================================================

const getTagName = (item) => {
    if (typeof item === "string") {
        return item.trim();
    }

    if (typeof item === "number") {
        return `#${item}`;
    }

    if (!item || typeof item !== "object") {
        return null;
    }

    const name =
        item.name ||
        item.title ||
        item.language ||
        item.technology;

    return typeof name === "string"
        ? name.trim()
        : null;
};

export const getProblemTags = (
    language,
    technology
) => {
    const languages = Array.isArray(language)
        ? language
        : language != null
            ? [language]
            : [];

    const technologies = Array.isArray(technology)
        ? technology
        : technology != null
            ? [technology]
            : [];

    const combined = [
        ...languages,
        ...technologies,
    ];

    const tags = [];
    const seen = new Set();

    for (const item of combined) {
        const name = getTagName(item);

        if (!name) continue;

        const normalized = name.toLowerCase();

        if (seen.has(normalized)) {
            continue;
        }

        seen.add(normalized);
        tags.push(name);

        if (tags.length >= 3) {
            break;
        }
    }

    return tags;
};
