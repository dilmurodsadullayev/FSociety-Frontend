
import {
    Bug,
    Megaphone,
    Newspaper,
    ShieldCheck,
    Sparkles,
    Wrench,
} from "lucide-react";

// =========================================================
// FSOCIETY — UPDATE CARD CONFIGURATION
//
// Shared by:
// - FeaturedUpdateCard
// - CompactUpdateCard
// - UpdateTypeVisuals
//
// Dark / Light Mode supported.
// =========================================================

// =========================================================
// UPDATE TYPE NORMALIZER
// =========================================================

export const normalizeUpdateType = (value) => {
    const type = String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

    if (
        [
            "feature",
            "new_feature",
            "new",
            "yangi",
            "yangi_imkoniyat",
        ].includes(type)
    ) {
        return "feature";
    }

    if (
        [
            "improvement",
            "improve",
            "enhancement",
            "upgrade",
            "yaxshilanish",
        ].includes(type)
    ) {
        return "improvement";
    }

    if (
        [
            "fix",
            "bug",
            "bug_fix",
            "bugfix",
            "fixed",
            "xato",
            "xatolik",
        ].includes(type)
    ) {
        return "fix";
    }

    if (
        [
            "security",
            "secure",
            "xavfsizlik",
        ].includes(type)
    ) {
        return "security";
    }

    if (
        [
            "announcement",
            "announce",
            "news",
            "elon",
            "e'lon",
        ].includes(type)
    ) {
        return "announcement";
    }

    return "default";
};

// =========================================================
// UPDATE TYPE CONFIG
//
// IMPORTANT:
// Keep Tailwind class names literal.
// =========================================================

export const UPDATE_TYPE_CONFIG = {
    feature: {
        label: "Yangi imkoniyat",
        shortLabel: "FEATURE",
        Icon: Sparkles,

        badgeClass: `
            border-cyan-400/30
            bg-cyan-500/[0.08]
            text-cyan-800

            dark:border-cyan-400/25
            dark:bg-cyan-400/[0.08]
            dark:text-cyan-300
        `,

        iconClass: `
            border-cyan-400/30
            bg-cyan-500/[0.10]
            text-cyan-700

            dark:border-cyan-400/25
            dark:bg-cyan-400/[0.10]
            dark:text-cyan-300
        `,

        dotClass: "bg-cyan-500 dark:bg-cyan-400",

        shortLabelClass: `
            text-cyan-700
            dark:text-cyan-400/80
        `,

        titleHoverClass: `
            group-hover/item:text-cyan-700
            dark:group-hover/item:text-cyan-200
        `,
    },

    improvement: {
        label: "Yaxshilanish",
        shortLabel: "IMPROVEMENT",
        Icon: Wrench,

        badgeClass: `
            border-indigo-400/30
            bg-indigo-500/[0.08]
            text-indigo-800

            dark:border-indigo-400/25
            dark:bg-indigo-400/[0.08]
            dark:text-indigo-300
        `,

        iconClass: `
            border-indigo-400/30
            bg-indigo-500/[0.10]
            text-indigo-700

            dark:border-indigo-400/25
            dark:bg-indigo-400/[0.10]
            dark:text-indigo-300
        `,

        dotClass: "bg-indigo-500 dark:bg-indigo-400",

        shortLabelClass: `
            text-indigo-700
            dark:text-indigo-400/80
        `,

        titleHoverClass: `
            group-hover/item:text-indigo-700
            dark:group-hover/item:text-indigo-200
        `,
    },

    fix: {
        label: "Bug fix",
        shortLabel: "FIX",
        Icon: Bug,

        badgeClass: `
            border-orange-400/30
            bg-orange-500/[0.08]
            text-orange-800

            dark:border-orange-400/25
            dark:bg-orange-400/[0.08]
            dark:text-orange-300
        `,

        iconClass: `
            border-orange-400/30
            bg-orange-500/[0.10]
            text-orange-700

            dark:border-orange-400/25
            dark:bg-orange-400/[0.10]
            dark:text-orange-300
        `,

        dotClass: "bg-orange-500 dark:bg-orange-400",

        shortLabelClass: `
            text-orange-700
            dark:text-orange-400/80
        `,

        titleHoverClass: `
            group-hover/item:text-orange-700
            dark:group-hover/item:text-orange-200
        `,
    },

    security: {
        label: "Xavfsizlik",
        shortLabel: "SECURITY",
        Icon: ShieldCheck,

        badgeClass: `
            border-emerald-400/30
            bg-emerald-500/[0.08]
            text-emerald-800

            dark:border-emerald-400/25
            dark:bg-emerald-400/[0.08]
            dark:text-emerald-300
        `,

        iconClass: `
            border-emerald-400/30
            bg-emerald-500/[0.10]
            text-emerald-700

            dark:border-emerald-400/25
            dark:bg-emerald-400/[0.10]
            dark:text-emerald-300
        `,

        dotClass: "bg-emerald-500 dark:bg-emerald-400",

        shortLabelClass: `
            text-emerald-700
            dark:text-emerald-400/80
        `,

        titleHoverClass: `
            group-hover/item:text-emerald-700
            dark:group-hover/item:text-emerald-200
        `,
    },

    announcement: {
        label: "E'lon",
        shortLabel: "ANNOUNCEMENT",
        Icon: Megaphone,

        badgeClass: `
            border-fuchsia-400/30
            bg-fuchsia-500/[0.08]
            text-fuchsia-800

            dark:border-fuchsia-400/25
            dark:bg-fuchsia-400/[0.08]
            dark:text-fuchsia-300
        `,

        iconClass: `
            border-fuchsia-400/30
            bg-fuchsia-500/[0.10]
            text-fuchsia-700

            dark:border-fuchsia-400/25
            dark:bg-fuchsia-400/[0.10]
            dark:text-fuchsia-300
        `,

        dotClass: "bg-fuchsia-500 dark:bg-fuchsia-400",

        shortLabelClass: `
            text-fuchsia-700
            dark:text-fuchsia-400/80
        `,

        titleHoverClass: `
            group-hover/item:text-fuchsia-700
            dark:group-hover/item:text-fuchsia-200
        `,
    },

    default: {
        label: "Yangilik",
        shortLabel: "UPDATE",
        Icon: Newspaper,

        badgeClass: `
            border-slate-300
            bg-slate-100
            text-slate-700

            dark:border-white/10
            dark:bg-white/[0.035]
            dark:text-gray-300
        `,

        iconClass: `
            border-slate-300
            bg-slate-100
            text-slate-700

            dark:border-white/10
            dark:bg-white/[0.05]
            dark:text-gray-300
        `,

        dotClass: "bg-slate-400 dark:bg-gray-400",

        shortLabelClass: `
            text-slate-600
            dark:text-gray-400
        `,

        titleHoverClass: `
            group-hover/item:text-indigo-700
            dark:group-hover/item:text-white
        `,
    },
};

// =========================================================
// GET UPDATE CONFIG
// =========================================================

export const getUpdateTypeConfig = (update) => {
    const type = normalizeUpdateType(
        update?.update_type
    );

    return (
        UPDATE_TYPE_CONFIG[type] ||
        UPDATE_TYPE_CONFIG.default
    );
};

// =========================================================
// UZBEK MONTH NAMES
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
// FORMAT UPDATE DATE
// =========================================================

export const formatUpdateDate = (value) => {
    if (!value) {
        return "Sana noma'lum";
    }

    const date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
        return "Sana noma'lum";
    }

    return (
        `${date.getDate()} ` +
        `${MONTHS[date.getMonth()]}, ` +
        `${date.getFullYear()}`
    );
};
