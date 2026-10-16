
import UserImage from "../../assests/userImage.jpeg";
import timeAgo from "../../utils/timeAgo";

import {
    DEFAULT_STACK_COLOR,
    PROBLEM_CARD_LIMITS,
} from "./problemCardConfig";

// =========================================================
// FSOCIETY — PROBLEM CARD HELPERS
//
// Responsibilities:
// - Normalize backend and legacy data
// - Resolve user images
// - Normalize language / technology objects
// - Validate stack colors
// - Parse boolean and numeric values
// - Handle dates and deadlines
// - Build safe detail routes
//
// Pure helpers only.
// No React hooks.
// No Redux.
// No API requests.
// =========================================================

// =========================================================
// CONFIG
// =========================================================

export const BACKEND_URL = (
    process.env.REACT_APP_BACKEND_URL ||
    "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export const MAX_LANGUAGES =
    PROBLEM_CARD_LIMITS.languages;

export const MAX_TECHNOLOGIES =
    PROBLEM_CARD_LIMITS.technologies;

// =========================================================
// SAFE NUMBER
// =========================================================

export const safeNumber = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.max(0, number);
};

// =========================================================
// SAFE BOOLEAN
// =========================================================

export const toBoolean = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) &&
            value !== 0;
    }

    if (typeof value === "string") {
        const normalized =
            value.trim().toLowerCase();

        if (
            ["true", "1", "yes", "on"].includes(
                normalized
            )
        ) {
            return true;
        }

        if (
            ["false", "0", "no", "off", ""].includes(
                normalized
            )
        ) {
            return false;
        }

        return false;
    }

    return Boolean(value);
};

// =========================================================
// CLEAN TEXT
// =========================================================

export const cleanText = (
    value,
    fallback = ""
) => {
    if (
        value === null ||
        value === undefined
    ) {
        return fallback;
    }

    const text = String(value).trim();

    return text || fallback;
};

// =========================================================
// IMAGE URL
//
// Supports:
// - HTTP / HTTPS URLs
// - Blob URLs
// - Data image URLs
// - Relative Django media paths
//
// Invalid values use the default avatar.
// =========================================================

export const getImageUrl = (image) => {
    if (typeof image !== "string") {
        return UserImage;
    }

    const value = image.trim();

    if (!value) {
        return UserImage;
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (/^blob:/i.test(value)) {
        return value;
    }

    if (
        /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i
            .test(value)
    ) {
        return value;
    }

    // Reject unsupported URL schemes.
    if (
        /^[a-z][a-z0-9+.-]*:/i.test(value) ||
        value.startsWith("//")
    ) {
        return UserImage;
    }

    const relativePath = value.startsWith("/")
        ? value
        : `/${value}`;

    return `${BACKEND_URL}${relativePath}`;
};

// =========================================================
// HEX COLOR NORMALIZATION
// =========================================================

export const normalizeHexColor = (value) => {
    if (typeof value !== "string") {
        return DEFAULT_STACK_COLOR;
    }

    const color = value.trim();

    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return color;
    }

    if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
        const [r, g, b] = color
            .slice(1)
            .split("");

        return `#${r}${r}${g}${g}${b}${b}`;
    }

    return DEFAULT_STACK_COLOR;
};

// =========================================================
// COLOR WITH ALPHA
//
// Example:
// withAlpha("#22C55E", "20")
// -> "#22C55E20"
// =========================================================

export const withAlpha = (
    color,
    alpha = "FF"
) => {
    const safeColor = normalizeHexColor(color);

    const normalizedAlpha = String(
        alpha ?? ""
    ).trim();

    const safeAlpha =
        /^[0-9A-Fa-f]{2}$/.test(normalizedAlpha)
            ? normalizedAlpha
            : "FF";

    return `${safeColor}${safeAlpha}`;
};

// =========================================================
// NORMALIZE LANGUAGE / TECHNOLOGY
//
// Supports:
// - ["Python", "Django"]
// - [{ id: 1, name: "Python", color: "#..." }]
//
// Duplicate IDs and unnamed values are filtered.
// =========================================================

export const normalizeStack = (items) => {
    if (!Array.isArray(items)) {
        return [];
    }

    const seen = new Set();
    const result = [];

    for (const item of items) {
        let normalized = null;
        let uniqueKey = "";

        if (typeof item === "string") {
            const name = cleanText(item);

            if (!name) {
                continue;
            }

            uniqueKey = `name:${name.toLowerCase()}`;

            normalized = {
                id: uniqueKey,
                name,
                color: DEFAULT_STACK_COLOR,
                iconKey: "",
            };
        } else if (
            item &&
            typeof item === "object" &&
            !Array.isArray(item)
        ) {
            const name = cleanText(
                item.name ?? item.title
            );

            if (!name) {
                continue;
            }

            const hasId =
                item.id !== null &&
                item.id !== undefined &&
                cleanText(item.id) !== "";

            uniqueKey = hasId
                ? `id:${String(item.id)}`
                : `name:${name.toLowerCase()}`;

            normalized = {
                ...item,

                id: hasId
                    ? item.id
                    : uniqueKey,

                name,

                color: normalizeHexColor(
                    item.color
                ),

                iconKey: cleanText(
                    item.icon_key ??
                    item.iconKey
                ),
            };
        }

        if (
            !normalized ||
            seen.has(uniqueKey)
        ) {
            continue;
        }

        seen.add(uniqueKey);
        result.push(normalized);
    }

    return result;
};

// =========================================================
// TIME AGO
// =========================================================

export const getTimeAgoLabel = (value) => {
    if (!value) {
        return "Sana noma’lum";
    }

    const date = new Date(value);

    if (
        Number.isNaN(date.getTime())
    ) {
        return "Sana noma’lum";
    }

    try {
        return (
            cleanText(timeAgo(value)) ||
            "Sana noma’lum"
        );
    } catch {
        return "Sana noma’lum";
    }
};

// =========================================================
// DEADLINE DATA
//
// "now" is optional for easier testing.
//
// The helper calculates a snapshot.
// A future UI component may refresh this snapshot
// periodically when the card remains mounted.
// =========================================================

export const getDeadlineData = (
    deadline,
    now = Date.now()
) => {
    if (!deadline) {
        return null;
    }

    const target = new Date(deadline);

    if (
        Number.isNaN(target.getTime())
    ) {
        return null;
    }

    const diff =
        target.getTime() - now;

    if (diff <= 0) {
        return {
            text: "Muddati tugagan",
            expired: true,
            timestamp: target.getTime(),
        };
    }

    const totalMinutes = Math.max(
        1,
        Math.ceil(diff / (1000 * 60))
    );

    const days = Math.floor(
        totalMinutes / (60 * 24)
    );

    if (days > 0) {
        return {
            text: `${days} kun qoldi`,
            expired: false,
            timestamp: target.getTime(),
        };
    }

    const hours = Math.floor(
        totalMinutes / 60
    );

    if (hours > 0) {
        return {
            text: `${hours} soat qoldi`,
            expired: false,
            timestamp: target.getTime(),
        };
    }

    return {
        text: `${totalMinutes} daqiqa qoldi`,
        expired: false,
        timestamp: target.getTime(),
    };
};

// =========================================================
// NORMALIZE PROBLEM CARD DATA
//
// Accepts:
// normalizeProblemCardData(problem)
//
// Or with legacy props:
// normalizeProblemCardData(problem, legacyProps)
//
// The original Django fields are preserved.
// =========================================================

export const normalizeProblemCardData = (
    problem = null,
    legacyProps = {}
) => {
    const source =
        problem &&
        typeof problem === "object" &&
        !Array.isArray(problem)
            ? problem
            : {};

    const legacy =
        legacyProps &&
        typeof legacyProps === "object"
            ? legacyProps
            : {};

    // =====================================================
    // USER
    // =====================================================

    const sourceUser =
        source.user &&
        typeof source.user === "object"
            ? source.user
            : {};

    const resolvedUsername = cleanText(
        sourceUser.username ??
        (
            typeof source.user === "string"
                ? source.user
                : undefined
        ) ??
        legacy.username,
        "unknown"
    );

    const resolvedFirstName = cleanText(
        sourceUser.first_name ??
        sourceUser.firstName ??
        legacy.firstName
    );

    const resolvedLastName = cleanText(
        sourceUser.last_name ??
        sourceUser.lastName ??
        legacy.lastName
    );

    const fullName = cleanText(
        `${resolvedFirstName} ${resolvedLastName}`
    ) || (
        resolvedUsername !== "unknown"
            ? resolvedUsername
            : "Anonymous"
    );

    const avatar = getImageUrl(
        sourceUser.image ??
        legacy.image
    );

    // =====================================================
    // PROBLEM ID AND TITLE
    // =====================================================

    const rawId =
        source.id ??
        legacy.id;

    const hasValidId =
        rawId !== null &&
        rawId !== undefined &&
        cleanText(rawId) !== "";

    const id = hasValidId
        ? String(rawId)
        : null;

    const title = cleanText(
        source.problem ??
        source.name ??
        source.title ??
        legacy.name,
        "Nomsiz muammo"
    );

    const detailPath = hasValidId
        ? `/problem/${encodeURIComponent(id)}/detail`
        : null;

    // =====================================================
    // CREATION DATE
    // =====================================================

    const createdAt =
        source.created_at ??
        source.createdAt ??
        legacy.createdAt ??
        null;

    // =====================================================
    // STACK
    // =====================================================

    const languages = normalizeStack(
        source.language_data ??
        source.languages ??
        legacy.languages
    );

    const technologies = normalizeStack(
        source.technology_data ??
        source.technologies ??
        legacy.technologies
    );

    // =====================================================
    // STATUS
    // =====================================================

    const status = cleanText(
        source.status ??
        legacy.status,
        "pending"
    ).toLowerCase();

    const solved =
        status !== "rejected" &&
        (
            status === "solved" ||
            toBoolean(
                source.is_solved ??
                source.isSolved ??
                legacy.isSolved
            )
        );

    const rejected =
        status === "rejected";

    // =====================================================
    // PRIORITY
    // =====================================================

    const urgent = toBoolean(
        source.is_urgent ??
        source.isUrgent ??
        legacy.isUrgent
    );

    const deadline =
        source.deadline ??
        legacy.deadline ??
        null;

    const offeredCoins = safeNumber(
        source.offered_coins ??
        source.offeredCoins ??
        legacy.offeredCoins
    );

    const deadlineData =
        getDeadlineData(deadline);

    const hasPriorityMeta =
        offeredCoins > 0 ||
        Boolean(deadlineData);

    // =====================================================
    // STATISTICS
    // =====================================================

    const views = safeNumber(
        source.total_views ??
        source.views ??
        legacy.views
    );

    const stars = safeNumber(
        source.star ??
        legacy.star
    );

    const responseCount = safeNumber(
        source.response_count ??
        source.responseCount ??
        legacy.responseCount
    );

    // =====================================================
    // CTA
    // =====================================================

    const ctaText = rejected
        ? "Tafsilotni ko‘rish"
        : solved
            ? "Yechimni ko‘rish"
            : "Muammoni ko‘rish";

    // =====================================================
    // NORMALIZED RESULT
    // =====================================================

    return {
        id,
        hasValidId,
        detailPath,

        title,

        author: {
            username: resolvedUsername,
            firstName: resolvedFirstName,
            lastName: resolvedLastName,
            fullName,
            avatar,
            createdAt,
            createdLabel:
                getTimeAgoLabel(createdAt),
        },

        status,
        solved,
        rejected,

        priority: {
            urgent,
            deadline,
            deadlineData,
            offeredCoins,
            hasPriorityMeta,
        },

        languages,
        technologies,

        stats: {
            views,
            stars,
            responseCount,
        },

        ctaText,
    };
};
