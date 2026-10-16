
import {
    Bug,
    Heart,
    Lightbulb,
    MessageSquareText,
} from "lucide-react";

// =========================================================
// FSOCIETY — FEEDBACK CONFIGURATION
//
// - Backend type values preserved
// - FCoin reward values preserved
// - Dark / Light Mode
// - Shared styling for forms, cards and badges
// - Safe type lookup
// =========================================================

// =========================================================
// FILE CONFIG
// =========================================================

export const FEEDBACK_MAX_FILE_SIZE =
    5 * 1024 * 1024;

export const FEEDBACK_ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const FEEDBACK_ACCEPT =
    FEEDBACK_ALLOWED_FILE_TYPES.join(",");

// =========================================================
// FORM CONFIG
// =========================================================

export const FEEDBACK_DEFAULT_TYPE =
    "suggestion";

export const FEEDBACK_TITLE_MIN_LENGTH =
    4;

export const FEEDBACK_TITLE_MAX_LENGTH =
    150;

export const FEEDBACK_MESSAGE_MIN_LENGTH =
    10;

// =========================================================
// FEEDBACK TYPES
//
// Backend reward contract:
//
// bug        -> 40 FCoin
// suggestion -> 25 FCoin
// praise     -> 10 FCoin
// other      -> 10 FCoin
//
// These are configured potential rewards.
// Actual rewards depend on backend approval.
// =========================================================

export const FEEDBACK_TYPES = [
    // =====================================================
    // BUG
    // =====================================================

    {
        value: "bug",

        label: "Bug",

        shortLabel: "Bug",

        description:
            "Saytda xato yoki noto‘g‘ri ishlayotgan joy topdingiz.",

        reward: 40,

        Icon: Bug,

        activeClass: `
            border-red-400/40
            bg-red-500/[0.09]
            text-red-700

            dark:border-red-400/35
            dark:bg-red-500/[0.10]
            dark:text-red-300
        `,

        inactiveHoverClass: `
            hover:border-red-400/35
            hover:bg-red-500/[0.05]

            dark:hover:border-red-400/20
            dark:hover:bg-red-500/[0.05]
        `,

        iconClass: `
            border-red-400/25
            bg-red-500/[0.08]
            text-red-700

            dark:border-red-400/15
            dark:bg-red-500/[0.10]
            dark:text-red-300
        `,

        rewardClass: `
            border-red-400/25
            bg-red-500/[0.06]
            text-red-700

            dark:border-red-400/15
            dark:bg-red-500/[0.06]
            dark:text-red-300
        `,

        glowClass: "bg-red-500/10",
    },

    // =====================================================
    // SUGGESTION
    // =====================================================

    {
        value: "suggestion",

        label: "Taklif",

        shortLabel: "Taklif",

        description:
            "Platformani yaxshilash uchun yangi g‘oyangiz bor.",

        reward: 25,

        Icon: Lightbulb,

        activeClass: `
            border-amber-400/45
            bg-amber-500/[0.10]
            text-amber-800

            dark:border-amber-400/35
            dark:bg-amber-500/[0.10]
            dark:text-amber-300
        `,

        inactiveHoverClass: `
            hover:border-amber-400/35
            hover:bg-amber-500/[0.05]

            dark:hover:border-amber-400/20
            dark:hover:bg-amber-500/[0.05]
        `,

        iconClass: `
            border-amber-400/30
            bg-amber-500/[0.09]
            text-amber-800

            dark:border-amber-400/15
            dark:bg-amber-500/[0.10]
            dark:text-amber-300
        `,

        rewardClass: `
            border-amber-400/30
            bg-amber-500/[0.07]
            text-amber-800

            dark:border-amber-400/15
            dark:bg-amber-500/[0.06]
            dark:text-amber-300
        `,

        glowClass: "bg-amber-500/10",
    },

    // =====================================================
    // PRAISE
    // =====================================================

    {
        value: "praise",

        label: "Maqtov",

        shortLabel: "Maqtov",

        description:
            "Yoqtirgan jihatingiz yoki ijobiy fikringizni yuboring.",

        reward: 10,

        Icon: Heart,

        activeClass: `
            border-emerald-400/40
            bg-emerald-500/[0.09]
            text-emerald-700

            dark:border-emerald-400/35
            dark:bg-emerald-500/[0.10]
            dark:text-emerald-300
        `,

        inactiveHoverClass: `
            hover:border-emerald-400/35
            hover:bg-emerald-500/[0.05]

            dark:hover:border-emerald-400/20
            dark:hover:bg-emerald-500/[0.05]
        `,

        iconClass: `
            border-emerald-400/25
            bg-emerald-500/[0.08]
            text-emerald-700

            dark:border-emerald-400/15
            dark:bg-emerald-500/[0.10]
            dark:text-emerald-300
        `,

        rewardClass: `
            border-emerald-400/25
            bg-emerald-500/[0.06]
            text-emerald-700

            dark:border-emerald-400/15
            dark:bg-emerald-500/[0.06]
            dark:text-emerald-300
        `,

        glowClass: "bg-emerald-500/10",
    },

    // =====================================================
    // OTHER
    // =====================================================

    {
        value: "other",

        label: "Boshqa",

        shortLabel: "Boshqa",

        description:
            "Yuqoridagi turlarga kirmaydigan fikr yoki xabar.",

        reward: 10,

        Icon: MessageSquareText,

        activeClass: `
            border-indigo-400/40
            bg-indigo-500/[0.09]
            text-indigo-700

            dark:border-indigo-400/35
            dark:bg-indigo-500/[0.10]
            dark:text-indigo-300
        `,

        inactiveHoverClass: `
            hover:border-indigo-400/35
            hover:bg-indigo-500/[0.05]

            dark:hover:border-indigo-400/20
            dark:hover:bg-indigo-500/[0.05]
        `,

        iconClass: `
            border-indigo-400/25
            bg-indigo-500/[0.08]
            text-indigo-700

            dark:border-indigo-400/15
            dark:bg-indigo-500/[0.10]
            dark:text-indigo-300
        `,

        rewardClass: `
            border-indigo-400/25
            bg-indigo-500/[0.06]
            text-indigo-700

            dark:border-indigo-400/15
            dark:bg-indigo-500/[0.06]
            dark:text-indigo-300
        `,

        glowClass: "bg-indigo-500/10",
    },
];

// =========================================================
// GET TYPE CONFIG
//
// Keep previous fallback behavior:
// Unknown types use the default suggestion config.
// =========================================================

export const getFeedbackTypeConfig = (value) => {
    const normalizedValue =
        typeof value === "string"
            ? value.trim().toLowerCase()
            : "";

    return (
        FEEDBACK_TYPES.find(
            (item) =>
                item.value === normalizedValue
        ) ||
        FEEDBACK_TYPES.find(
            (item) =>
                item.value === FEEDBACK_DEFAULT_TYPE
        ) ||
        FEEDBACK_TYPES[0]
    );
};

// =========================================================
// GET REWARD
//
// Preserve the original API and default-type fallback.
// =========================================================

export const getFeedbackReward = (value) => {
    const reward = Number(
        getFeedbackTypeConfig(value)?.reward
    );

    return Number.isFinite(reward)
        ? Math.max(0, Math.trunc(reward))
        : 0;
};

// =========================================================
// FORMAT FILE SIZE
//
// Keep the existing MB-based output contract.
// =========================================================

export const formatFeedbackFileSize = (bytes) => {
    const size = Number(bytes);

    if (
        !Number.isFinite(size) ||
        size <= 0
    ) {
        return "0 MB";
    }

    const sizeInMB =
        size / (1024 * 1024);

    return `${sizeInMB.toFixed(2)} MB`;
};

// =========================================================
// FILE VALIDATION
//
// New optional helper for create/edit forms.
// The backend must independently validate files.
// =========================================================

export const validateFeedbackFile = (file) => {
    if (!file) {
        return {
            valid: true,
            error: "",
        };
    }

    const size = Number(file.size);

    if (
        !Number.isFinite(size) ||
        size <= 0
    ) {
        return {
            valid: false,
            error: "Tanlangan fayl bo‘sh yoki noto‘g‘ri.",
        };
    }

    if (
        !FEEDBACK_ALLOWED_FILE_TYPES.includes(
            file.type
        )
    ) {
        return {
            valid: false,
            error:
                "Faqat JPG, PNG yoki WEBP rasmlarini yuklash mumkin.",
        };
    }

    if (size > FEEDBACK_MAX_FILE_SIZE) {
        return {
            valid: false,
            error:
                "Rasm hajmi 5 MB dan oshmasligi kerak.",
        };
    }

    return {
        valid: true,
        error: "",
    };
};
