
import React, { memo } from "react";

import {
    BriefcaseBusiness,
    Check,
    Cpu,
    Dumbbell,
    Gamepad2,
    Layers3,
} from "lucide-react";

// =========================================================
// POST TYPES
//
// Matches original CreatePostModal categories.
//
// Used by:
// - PostCreateTypeSelector
// - PostCreatePreview
//
// Keep backend enum values unchanged.
// =========================================================

export const POST_TYPES = [
    {
        value: "TEX",
        label: "Texnologiya",
        description:
            "Dasturlash, IT va texnologiyalar",

        Icon: Cpu,

        activeClass: `
            border-indigo-300
            bg-indigo-50
            text-indigo-700

            dark:border-indigo-400/50
            dark:bg-indigo-500/15
            dark:text-indigo-200
        `,

        iconClass: `
            border-indigo-200
            bg-indigo-100
            text-indigo-700

            dark:border-indigo-400/20
            dark:bg-indigo-500/10
            dark:text-indigo-300
        `,

        glowClass: "bg-indigo-500/20",
    },

    {
        value: "SPO",
        label: "Sport",
        description:
            "Sport, mashg‘ulot va faol hayot",

        Icon: Dumbbell,

        activeClass: `
            border-emerald-300
            bg-emerald-50
            text-emerald-700

            dark:border-emerald-400/50
            dark:bg-emerald-500/15
            dark:text-emerald-200
        `,

        iconClass: `
            border-emerald-200
            bg-emerald-100
            text-emerald-700

            dark:border-emerald-400/20
            dark:bg-emerald-500/10
            dark:text-emerald-300
        `,

        glowClass: "bg-emerald-500/20",
    },

    {
        value: "BIZ",
        label: "Biznes",
        description:
            "Biznes, startup va freelancing",

        Icon: BriefcaseBusiness,

        activeClass: `
            border-amber-300
            bg-amber-50
            text-amber-700

            dark:border-amber-400/50
            dark:bg-amber-500/15
            dark:text-amber-200
        `,

        iconClass: `
            border-amber-200
            bg-amber-100
            text-amber-700

            dark:border-amber-400/20
            dark:bg-amber-500/10
            dark:text-amber-300
        `,

        glowClass: "bg-amber-500/20",
    },

    {
        value: "ENT",
        label: "O‘yin-kulgi",
        description:
            "Gaming, media va qiziqarli mavzular",

        Icon: Gamepad2,

        activeClass: `
            border-pink-300
            bg-pink-50
            text-pink-700

            dark:border-pink-400/50
            dark:bg-pink-500/15
            dark:text-pink-200
        `,

        iconClass: `
            border-pink-200
            bg-pink-100
            text-pink-700

            dark:border-pink-400/20
            dark:bg-pink-500/10
            dark:text-pink-300
        `,

        glowClass: "bg-pink-500/20",
    },

    {
        value: "OTH",
        label: "Boshqa",
        description:
            "Boshqa turdagi foydali kontent",

        Icon: Layers3,

        activeClass: `
            border-cyan-300
            bg-cyan-50
            text-cyan-700

            dark:border-cyan-400/50
            dark:bg-cyan-500/15
            dark:text-cyan-200
        `,

        iconClass: `
            border-cyan-200
            bg-cyan-100
            text-cyan-700

            dark:border-cyan-400/20
            dark:bg-cyan-500/10
            dark:text-cyan-300
        `,

        glowClass: "bg-cyan-500/20",
    },
];

// =========================================================
// GET SELECTED TYPE
//
// Used in Live Preview later.
// =========================================================

export const getPostType = (value) => {
    return (
        POST_TYPES.find(
            (item) => item.value === value
        ) || POST_TYPES[0]
    );
};

// =========================================================
// POST CREATE TYPE SELECTOR
//
// Props:
//
// value:
//   Selected post_type.
//
// onChange:
//   Parent callback receiving category value.
//
// disabled:
//   Disable changes during POST/PATCH.
//
// Features:
// - Five backend-compatible categories
// - Selected state
// - Category icon
// - Description
// - Colored glow
// - Responsive grid
// - Light / Dark Mode
//
// No Redux / API / internal form state.
// =========================================================

const PostCreateTypeSelector = ({
    value = "TEX",
    onChange,
    disabled = false,
}) => {
    // =====================================================
    // SELECTED TYPE
    // =====================================================

    const selectedType = getPostType(value);

    const canChange =
        typeof onChange === "function";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Post kategoriyasi"
            className="min-w-0"
        >
            {/* =====================================
                SECTION HEADER
            ====================================== */}

            <div
                className="
                    mb-3 flex flex-wrap
                    items-center justify-between
                    gap-3
                "
            >
                {/* SECTION TITLE */}

                <div>
                    <p
                        id="post-type-label"
                        className="
                            text-xs font-black
                            uppercase tracking-[0.16em]

                            text-slate-700
                            dark:text-slate-400
                        "
                    >
                        Post turi
                    </p>

                    <p
                        className="
                            mt-1 text-xs
                            font-medium
                            text-slate-500

                            dark:text-slate-500
                        "
                    >
                        Postingizga eng mos kategoriyani tanlang.
                    </p>
                </div>

                {/* CURRENT SELECTION */}

                <div
                    className="
                        hidden items-center gap-1.5
                        rounded-full border

                        border-emerald-200
                        bg-emerald-50

                        px-3 py-1

                        text-[10px] font-bold
                        text-emerald-700

                        dark:border-emerald-400/15
                        dark:bg-emerald-500/[0.06]
                        dark:text-emerald-300

                        sm:flex
                    "
                >
                    <Check
                        size={12}
                        aria-hidden="true"
                    />

                    {selectedType.label}
                </div>
            </div>

            {/* =====================================
                CATEGORY OPTIONS
            ====================================== */}

            <div
                role="group"
                aria-labelledby="post-type-label"
                className="
                    grid min-w-0 gap-3

                    sm:grid-cols-2
                    xl:grid-cols-3
                "
            >
                {POST_TYPES.map((item) => {
                    const {
                        value: typeValue,
                        label,
                        description,
                        Icon,
                        activeClass,
                        iconClass,
                        glowClass,
                    } = item;

                    const active =
                        value === typeValue;

                    return (
                        <button
                            key={typeValue}
                            type="button"
                            onClick={() =>
                                onChange?.(typeValue)
                            }
                            disabled={
                                disabled || !canChange
                            }
                            aria-pressed={active}
                            className={`
                                group relative
                                min-w-0 overflow-hidden

                                rounded-2xl border
                                p-3.5 text-left

                                transition-all duration-300
                                active:scale-[0.98]

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500/50

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                motion-reduce:transform-none

                                ${
                                    active
                                        ? activeClass
                                        : `
                                            border-slate-200
                                            bg-white
                                            text-slate-700

                                            hover:border-indigo-300
                                            hover:bg-slate-50

                                            dark:border-white/[0.07]
                                            dark:bg-white/[0.025]
                                            dark:text-slate-300

                                            dark:hover:border-white/[0.12]
                                            dark:hover:bg-white/[0.045]
                                        `
                                }
                            `}
                        >
                            {/* CATEGORY GLOW */}

                            <div
                                aria-hidden="true"
                                className={`
                                    pointer-events-none
                                    absolute -right-8 -top-8

                                    h-20 w-20
                                    rounded-full blur-2xl

                                    transition-opacity

                                    ${
                                        active
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-60"
                                    }

                                    ${glowClass}
                                `}
                            />

                            {/* CATEGORY CONTENT */}

                            <div
                                className="
                                    relative z-10
                                    flex min-w-0
                                    items-start gap-3
                                "
                            >
                                {/* ICON */}

                                <div
                                    aria-hidden="true"
                                    className={`
                                        flex h-10 w-10 shrink-0
                                        items-center justify-center

                                        rounded-xl border

                                        ${iconClass}
                                    `}
                                >
                                    <Icon size={18} />
                                </div>

                                {/* TEXT */}

                                <div
                                    className="min-w-0 flex-1"
                                >
                                    {/* LABEL */}

                                    <div
                                        className="
                                            flex items-center
                                            justify-between gap-2
                                        "
                                    >
                                        <p
                                            className="
                                                text-sm font-black
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {label}
                                        </p>

                                        {/* SELECTED ICON */}

                                        {active && (
                                            <span
                                                aria-hidden="true"
                                                className="
                                                    flex h-5 w-5 shrink-0
                                                    items-center justify-center

                                                    rounded-full
                                                    bg-indigo-500/10
                                                    text-indigo-700

                                                    dark:bg-white/10
                                                    dark:text-white
                                                "
                                            >
                                                <Check
                                                    size={12}
                                                />
                                            </span>
                                        )}
                                    </div>

                                    {/* DESCRIPTION */}

                                    <p
                                        className="
                                            mt-1 text-[10px]
                                            font-medium leading-4

                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default memo(PostCreateTypeSelector);
