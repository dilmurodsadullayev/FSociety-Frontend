
import {
    CheckCircle2,
    CircleHelp,
    Clock3,
    Wrench,
    XCircle,
} from "lucide-react";

// =========================================================
// FSOCIETY — FEEDBACK HELPERS
//
// - Existing exports preserved
// - Dark / Light status colors
// - Safe status lookup
// - Backend permission contract preserved
// - Reward and screenshot normalization
// - DRF error handling
// =========================================================

// =========================================================
// STATUS FILTERS
// =========================================================

export const FEEDBACK_STATUS_FILTERS = [
    {
        value: "all",
        label: "Barchasi",
    },
    {
        value: "pending",
        label: "Kutilmoqda",
    },
    {
        value: "in_progress",
        label: "Ishlanmoqda",
    },
    {
        value: "approved",
        label: "Tasdiqlangan",
    },
    {
        value: "rejected",
        label: "Rad etilgan",
    },
];

// =========================================================
// STATUS CONFIG
//
// Keep the existing object shape:
// - value
// - label
// - shortLabel
// - description
// - Icon
// - className
// =========================================================

export const FEEDBACK_STATUS_CONFIG = {
    // =====================================================
    // PENDING
    // =====================================================

    pending: {
        value: "pending",

        label: "Kutilmoqda",

        shortLabel: "Pending",

        description:
            "Admin ko‘rib chiqishini kutmoqda.",

        Icon: Clock3,

        className: `
            border-amber-400/40
            bg-amber-500/[0.09]
            text-amber-800

            dark:border-amber-400/20
            dark:bg-amber-500/[0.07]
            dark:text-amber-300
        `,
    },

    // =====================================================
    // IN PROGRESS
    // =====================================================

    in_progress: {
        value: "in_progress",

        label: "Ishlanmoqda",

        shortLabel: "In progress",

        description:
            "Admin feedback ustida ishlamoqda.",

        Icon: Wrench,

        className: `
            border-blue-400/40
            bg-blue-500/[0.09]
            text-blue-800

            dark:border-blue-400/20
            dark:bg-blue-500/[0.07]
            dark:text-blue-300
        `,
    },

    // =====================================================
    // APPROVED
    // =====================================================

    approved: {
        value: "approved",

        label: "Tasdiqlangan",

        shortLabel: "Approved",

        description:
            "Feedback admin tomonidan tasdiqlangan.",

        Icon: CheckCircle2,

        className: `
            border-emerald-400/40
            bg-emerald-500/[0.09]
            text-emerald-800

            dark:border-emerald-400/20
            dark:bg-emerald-500/[0.07]
            dark:text-emerald-300
        `,
    },

    // =====================================================
    // REJECTED
    // =====================================================

    rejected: {
        value: "rejected",

        label: "Rad etilgan",

        shortLabel: "Rejected",

        description:
            "Feedback admin tomonidan rad etilgan.",

        Icon: XCircle,

        className: `
            border-red-400/40
            bg-red-500/[0.09]
            text-red-800

            dark:border-red-400/20
            dark:bg-red-500/[0.07]
            dark:text-red-300
        `,
    },
};

// =========================================================
// FALLBACK STATUS
// =========================================================

const FALLBACK_STATUS_CONFIG = {
    value: "unknown",

    label: "Noma’lum",

    shortLabel: "Unknown",

    description:
        "Feedback holati aniqlanmadi.",

    Icon: CircleHelp,

    className: `
        border-slate-300
        bg-slate-100
        text-slate-700

        dark:border-gray-400/20
        dark:bg-gray-500/[0.07]
        dark:text-gray-400
    `,
};

// =========================================================
// SAFE NUMBER
// =========================================================

const toSafeNumber = (
    value,
    fallback = 0
) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
};

// =========================================================
// SAFE COUNT
// =========================================================

const toSafeCount = (value) => {
    return Math.max(
        0,
        Math.trunc(
            toSafeNumber(value, 0)
        )
    );
};

// =========================================================
// NORMALIZE STATUS
// =========================================================

const normalizeStatus = (value) => {
    return String(value ?? "")
        .trim()
        .toLowerCase();
};

// =========================================================
// SAFE CONFIG LOOKUP
//
// Avoid inherited object properties such as
// "constructor" or "toString" being interpreted
// as valid status configurations.
// =========================================================

const hasStatusConfig = (status) => {
    return Object.prototype.hasOwnProperty.call(
        FEEDBACK_STATUS_CONFIG,
        status
    );
};

// =========================================================
// GET STATUS CONFIG
// =========================================================

export const getFeedbackStatusConfig = (
    status
) => {
    const normalizedStatus =
        normalizeStatus(status);

    return hasStatusConfig(normalizedStatus)
        ? FEEDBACK_STATUS_CONFIG[normalizedStatus]
        : FALLBACK_STATUS_CONFIG;
};

// =========================================================
// VALID STATUS
// =========================================================

export const isValidFeedbackStatus = (
    status
) => {
    const normalizedStatus =
        normalizeStatus(status);

    if (normalizedStatus === "all") {
        return true;
    }

    return hasStatusConfig(normalizedStatus);
};

// =========================================================
// STATUS HELPERS
// =========================================================

export const isFeedbackPending = (
    feedback
) => {
    return feedback?.status === "pending";
};

export const isFeedbackInProgress = (
    feedback
) => {
    return feedback?.status === "in_progress";
};

export const isFeedbackApproved = (
    feedback
) => {
    return feedback?.status === "approved";
};

export const isFeedbackRejected = (
    feedback
) => {
    return feedback?.status === "rejected";
};

export const isFeedbackFinal = (
    feedback
) => {
    return (
        isFeedbackApproved(feedback) ||
        isFeedbackRejected(feedback)
    );
};

// =========================================================
// CAN USER MODIFY
//
// Backend source of truth:
//   can_user_modify
//
// Only when that field is absent do we use
// the frontend pending-status fallback.
//
// Backend must independently enforce permissions.
// =========================================================

export const canModifyFeedback = (
    feedback
) => {
    if (
        !feedback ||
        typeof feedback !== "object"
    ) {
        return false;
    }

    // Explicit backend permission wins.
    if (
        typeof feedback.can_user_modify ===
        "boolean"
    ) {
        return feedback.can_user_modify;
    }

    // Frontend fallback.
    return isFeedbackPending(feedback);
};

// =========================================================
// REWARD AMOUNT
//
// Display only the amount returned by backend.
//
// Do not calculate an awarded amount from
// feedback type alone.
// =========================================================

export const getFeedbackRewardAmount = (
    feedback
) => {
    return toSafeCount(
        feedback?.reward_amount
    );
};

// =========================================================
// IS REWARDED
// =========================================================

export const isFeedbackRewarded = (
    feedback
) => {
    if (!feedback) {
        return false;
    }

    return (
        Boolean(feedback.rewarded_at) ||
        getFeedbackRewardAmount(feedback) > 0
    );
};

// =========================================================
// SCREENSHOT URL VALIDATION
//
// Feedback screenshots may originate from
// Django media URLs or external image storage.
//
// Reject dangerous executable URL schemes.
// =========================================================

const normalizeScreenshotUrl = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    const url = value.trim();

    if (!url) {
        return null;
    }

    // Reject control characters.
    if (/[\u0000-\u001f\u007f]/.test(url)) {
        return null;
    }

    // Reject executable or unsafe inline content.
    if (
        /^(javascript|vbscript|data):/i.test(url)
    ) {
        return null;
    }

    // Permit HTTP(S), blob previews, and
    // relative URLs without a scheme.
    const schemeMatch = url.match(
        /^([a-z][a-z0-9+.-]*):/i
    );

    if (schemeMatch) {
        const scheme =
            schemeMatch[1].toLowerCase();

        if (
            scheme !== "http" &&
            scheme !== "https" &&
            scheme !== "blob"
        ) {
            return null;
        }
    }

    return url;
};

// =========================================================
// GET SCREENSHOT
//
// Supported response formats:
//
// screenshot_url: "/media/file.webp"
// screenshot: "/media/file.webp"
// screenshot: { url: "..." }
// screenshot: { src: "..." }
// =========================================================

export const getFeedbackScreenshot = (
    feedback
) => {
    if (
        !feedback ||
        typeof feedback !== "object"
    ) {
        return null;
    }

    const candidates = [
        feedback.screenshot_url,
        feedback.screenshot,
    ];

    for (const candidate of candidates) {
        if (typeof candidate === "string") {
            const url =
                normalizeScreenshotUrl(candidate);

            if (url) {
                return url;
            }
        }

        if (
            candidate &&
            typeof candidate === "object"
        ) {
            const url =
                normalizeScreenshotUrl(
                    candidate.url
                ) ||
                normalizeScreenshotUrl(
                    candidate.src
                );

            if (url) {
                return url;
            }
        }
    }

    return null;
};

// =========================================================
// USERNAME
// =========================================================

export const getFeedbackUsername = (
    feedback
) => {
    if (
        !feedback ||
        typeof feedback !== "object"
    ) {
        return "unknown";
    }

    const username =
        feedback?.user?.username ??
        feedback?.username ??
        feedback?.user_username ??
        "unknown";

    return (
        String(username).trim() ||
        "unknown"
    );
};

// =========================================================
// NORMALIZE FEEDBACK LIST
//
// Supported formats:
//
// []
// { results: [] }
// { data: [] }
// { data: { results: [] } }
// =========================================================

export const normalizeFeedbackList = (
    payload
) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.results)) {
        return payload.results;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (
        Array.isArray(payload?.data?.results)
    ) {
        return payload.data.results;
    }

    return [];
};

// =========================================================
// NORMALIZE STATS
//
// Preserve all existing backend stat keys.
// =========================================================

export const normalizeFeedbackStats = (
    payload
) => {
    const source =
        payload &&
        typeof payload === "object"
            ? payload
            : {};

    return {
        total: toSafeCount(
            source.total
        ),

        pending: toSafeCount(
            source.pending
        ),

        in_progress: toSafeCount(
            source.in_progress
        ),

        approved: toSafeCount(
            source.approved
        ),

        rejected: toSafeCount(
            source.rejected
        ),

        earned_fcoin: toSafeCount(
            source.earned_fcoin
        ),

        approved_bugs: toSafeCount(
            source.approved_bugs
        ),
    };
};

// =========================================================
// FIRST DRF ERROR
//
// Supports nested serializer field errors.
//
// Depth is limited to avoid excessive recursion.
// =========================================================

const getFirstErrorValue = (
    value,
    depth = 0
) => {
    if (
        value == null ||
        depth > 6
    ) {
        return null;
    }

    if (typeof value === "string") {
        return value.trim() || null;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const message =
                getFirstErrorValue(
                    item,
                    depth + 1
                );

            if (message) {
                return message;
            }
        }

        return null;
    }

    if (typeof value === "object") {
        const preferredKeys = [
            "detail",
            "message",
            "error",
            "non_field_errors",
        ];

        for (const key of preferredKeys) {
            if (value[key] == null) {
                continue;
            }

            const message =
                getFirstErrorValue(
                    value[key],
                    depth + 1
                );

            if (message) {
                return message;
            }
        }

        for (
            const [key, item]
            of Object.entries(value)
        ) {
            if (preferredKeys.includes(key)) {
                continue;
            }

            const message =
                getFirstErrorValue(
                    item,
                    depth + 1
                );

            if (message) {
                return message;
            }
        }
    }

    return null;
};

// =========================================================
// GET ERROR MESSAGE
//
// Supports:
// - Plain error strings
// - Axios errors
// - DRF detail / message / error
// - DRF field errors
// - Generic JavaScript errors
// =========================================================

export const getFeedbackErrorMessage = (
    error,
    fallback =
        "Feedback bilan ishlashda xatolik yuz berdi."
) => {
    if (!error) {
        return fallback;
    }

    // Plain string errors.
    if (
        typeof error === "string" &&
        error.trim()
    ) {
        return error.trim();
    }

    const serverData =
        error?.serverData ??
        error?.response?.data ??
        null;

    // Backend response.
    const serverMessage =
        getFirstErrorValue(serverData);

    if (serverMessage) {
        return serverMessage;
    }

    // Some actions return error payloads.
    const payloadMessage =
        getFirstErrorValue(
            error?.payload
        );

    if (payloadMessage) {
        return payloadMessage;
    }

    // JavaScript Error.
    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message.trim();
    }

    return fallback;
};

// =========================================================
// STATUS FILTER LABEL
// =========================================================

export const getFeedbackStatusFilterLabel = (
    status
) => {
    if (
        normalizeStatus(status) === "all"
    ) {
        return "Barchasi";
    }

    return getFeedbackStatusConfig(
        status
    ).label;
};
