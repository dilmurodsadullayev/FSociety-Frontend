
import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROBLEM CARD CONFIG
//
// Design tokens, limits, status configurations.
//
// No React state.
// No API calls.
// No backend logic.
// =========================================================

// =========================================================
// LIMITS
// =========================================================

export const PROBLEM_CARD_LIMITS = Object.freeze({
    languages: 2,
    technologies: 3,
    titleLength: 80,
});

// =========================================================
// COLORS
// =========================================================

export const DEFAULT_STACK_COLOR = "#64748B";

// =========================================================
// CARD SURFACE STYLES
// =========================================================

export const PROBLEM_CARD_STYLES = Object.freeze({
    outer: `
        group
        relative

        block
        h-full
        min-w-0

        overflow-hidden

        rounded-[22px]
        border

        border-slate-200
        bg-white

        shadow-[0_10px_35px_rgba(15,23,42,0.045)]

        transition-all
        duration-200

        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-500
        focus-visible:ring-offset-2

        sm:rounded-3xl

        dark:border-white/[0.09]
        dark:bg-[#0B1020]

        dark:shadow-[0_15px_45px_rgba(0,0,0,0.16)]

        dark:hover:border-cyan-400/20
        dark:hover:shadow-[0_20px_55px_rgba(0,0,0,0.24)]

        dark:focus-visible:ring-cyan-400
        dark:focus-visible:ring-offset-[#06080d]

        motion-reduce:transform-none
        motion-reduce:transition-none
    `,

    body: `
        relative

        flex
        h-full
        min-w-0

        flex-col

        p-4

        sm:p-5
    `,

    metaBadge: `
        inline-flex
        max-w-full

        items-center
        gap-1.5

        rounded-full
        border

        border-slate-200
        bg-slate-50

        px-2.5
        py-1.5

        text-[11px]
        font-semibold

        text-slate-600

        dark:border-white/[0.09]
        dark:bg-white/[0.04]
        dark:text-gray-400
    `,

    neutralBadge: `
        inline-flex
        max-w-full

        items-center
        justify-center
        gap-1.5

        rounded-full
        border

        border-slate-200
        bg-slate-50

        px-2.5
        py-1

        text-[10px]
        font-bold

        text-slate-600

        dark:border-white/[0.10]
        dark:bg-white/[0.04]
        dark:text-gray-400
    `,
});

// =========================================================
// STATUS CONFIGURATION
//
// Status values are unchanged:
// - pending
// - solved
// - rejected
//
// Colors:
// Pending  -> Amber
// Solved   -> Emerald
// Rejected -> Rose
// =========================================================

export const PROBLEM_CARD_STATUS = Object.freeze({
    pending: Object.freeze({
        key: "pending",
        label: "JARAYONDA",
        Icon: Clock3,

        pill: `
            border-amber-300/70
            bg-amber-50
            text-amber-800

            dark:border-amber-400/25
            dark:bg-amber-400/[0.10]
            dark:text-amber-300
        `,

        dot: `
            bg-amber-500
            dark:bg-amber-400
        `,

        line: `
            from-amber-500
            via-orange-400/70
            to-transparent
        `,

        avatarBorder: `
            border-amber-400/40
            dark:border-amber-400/30
        `,

        action: `
            border-cyan-400/35
            bg-cyan-500/[0.08]
            text-cyan-800

            group-hover:bg-cyan-500
            group-hover:text-white

            dark:border-cyan-400/25
            dark:bg-cyan-400/[0.09]
            dark:text-cyan-300

            dark:group-hover:bg-cyan-400
            dark:group-hover:text-[#06101A]
        `,
    }),

    solved: Object.freeze({
        key: "solved",
        label: "YECHILGAN",
        Icon: CheckCircle2,

        pill: `
            border-emerald-300/70
            bg-emerald-50
            text-emerald-800

            dark:border-emerald-400/25
            dark:bg-emerald-400/[0.10]
            dark:text-emerald-300
        `,

        dot: `
            bg-emerald-500
            dark:bg-emerald-400
        `,

        line: `
            from-emerald-500
            via-cyan-400/75
            to-transparent
        `,

        avatarBorder: `
            border-emerald-400/45
            dark:border-emerald-400/35
        `,

        action: `
            border-emerald-400/35
            bg-emerald-500/[0.08]
            text-emerald-800

            group-hover:bg-emerald-500
            group-hover:text-white

            dark:border-emerald-400/25
            dark:bg-emerald-400/[0.09]
            dark:text-emerald-300

            dark:group-hover:bg-emerald-400
            dark:group-hover:text-[#061A14]
        `,
    }),

    rejected: Object.freeze({
        key: "rejected",
        label: "RAD ETILGAN",
        Icon: XCircle,

        pill: `
            border-rose-300/70
            bg-rose-50
            text-rose-800

            dark:border-rose-400/25
            dark:bg-rose-400/[0.09]
            dark:text-rose-300
        `,

        dot: `
            bg-rose-500
            dark:bg-rose-400
        `,

        line: `
            from-rose-500
            via-red-400/70
            to-transparent
        `,

        avatarBorder: `
            border-rose-400/40
            dark:border-rose-400/30
        `,

        action: `
            border-slate-300
            bg-slate-100
            text-slate-700

            group-hover:bg-slate-200

            dark:border-white/[0.13]
            dark:bg-white/[0.06]
            dark:text-gray-300

            dark:group-hover:bg-white/[0.12]
        `,
    }),
});

// =========================================================
// STATUS RESOLVER
//
// Rejected takes priority over isSolved.
// This matches existing ProblemCard behavior.
// =========================================================

export const getProblemCardStatusConfig = (
    status = "pending",
    isSolved = false
) => {
    const normalizedStatus =
        typeof status === "string"
            ? status.trim().toLowerCase()
            : "pending";

    if (normalizedStatus === "rejected") {
        return PROBLEM_CARD_STATUS.rejected;
    }

    if (
        normalizedStatus === "solved" ||
        isSolved === true
    ) {
        return PROBLEM_CARD_STATUS.solved;
    }

    return PROBLEM_CARD_STATUS.pending;
};
