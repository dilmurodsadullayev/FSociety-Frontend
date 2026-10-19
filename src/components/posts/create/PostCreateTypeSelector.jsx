
// src/components/posts/create/PostCreateTypeSelector.jsx

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
// Used by PostCreateTypeSelector and PostCreatePreview.
//
// Backend category values MUST NOT change.
// =========================================================

export const POST_TYPES = [
    {
        value: "TEX",
        label: "Texnologiya",
        description: "Dasturlash, IT va texnologiyalar",

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
        description: "Sport, mashg‘ulot va faol hayot",

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
        description: "Biznes, startup va freelancing",

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
        description: "Gaming, media va qiziqarli mavzular",

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
        description: "Boshqa turdagi foydali kontent",

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
// Export kept for PostCreatePreview or other consumers.
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
// - value: selected post_type
// - onChange: callback receiving category value
// - disabled: block changes while submitting
//
// Responsive:
//
// - Narrow phones: one column
// - Tablets / desktops: two columns
//
// No xl:grid-cols-3 because the modal's left panel
// becomes narrower when the live preview appears
// beside the form on large screens.
//
// Light / Dark and category colors preserved.
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

    const isDisabled =
        disabled || !canChange;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Post kategoriyasi"
            className="w-full min-w-0"
        >
            {/* =============================================
                SECTION HEADER
            ============================================== */}

            <div
                className="
                    mb-3

                    flex
                    min-w-0
                    flex-wrap

                    items-start
                    justify-between

                    gap-2

                    sm:gap-3
                "
            >
                {/* =========================================
                    TITLE AND DESCRIPTION
                ========================================== */}

                <div className="min-w-0 flex-1">
                    <p
                        id="post-type-label"
                        className="
                            text-[11px]
                            font-black

                            uppercase
                            tracking-[0.12em]

                            text-slate-700
                            dark:text-slate-300

                            sm:text-xs
                            sm:tracking-[0.16em]
                        "
                    >
                        Post turi
                    </p>

                    <p
                        id="post-type-description"
                        className="
                            mt-1

                            break-words

                            text-xs
                            font-medium
                            leading-5

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Postingizga eng mos kategoriyani tanlang.
                    </p>
                </div>

                {/* =========================================
                    CURRENT SELECTION
                ========================================== */}

                <div
                    className="
                        inline-flex
                        max-w-full
                        shrink-0

                        items-center
                        gap-1.5

                        rounded-full
                        border

                        border-emerald-200
                        bg-emerald-50

                        px-2.5
                        py-1

                        text-[10px]
                        font-bold

                        text-emerald-700

                        dark:border-emerald-400/15
                        dark:bg-emerald-500/[0.06]
                        dark:text-emerald-300
                    "
                >
                    <Check
                        size={12}
                        aria-hidden="true"
                        className="shrink-0"
                    />

                    <span
                        className="
                            max-w-[125px]
                            truncate

                            sm:max-w-none
                        "
                    >
                        {selectedType.label}
                    </span>
                </div>
            </div>

            {/* =============================================
                CATEGORY OPTIONS

                Keep two columns at most.

                This prevents narrow cards inside the
                desktop modal's left form panel.
            ============================================== */}

            <div
                role="group"
                aria-labelledby="post-type-label"
                aria-describedby="post-type-description"
                className="
                    grid
                    w-full
                    min-w-0

                    grid-cols-1

                    gap-2.5

                    sm:grid-cols-2
                    sm:gap-3
                "
            >
                {POST_TYPES.map((item) => {
                    // =====================================
                    // CATEGORY DATA
                    // =====================================

                    const {
                        value: typeValue,
                        label,
                        description,
                        Icon,
                        activeClass,
                        iconClass,
                        glowClass,
                    } = item;

                    // =====================================
                    // SELECTED STATE
                    // =====================================

                    const active =
                        value === typeValue;

                    return (
                        <button
                            key={typeValue}
                            type="button"

                            onClick={() => {
                                if (
                                    !isDisabled &&
                                    !active
                                ) {
                                    onChange(typeValue);
                                }
                            }}

                            disabled={isDisabled}
                            aria-pressed={active}

                            className={`
                                group
                                relative
                                isolate

                                flex
                                w-full
                                min-w-0
                                min-h-[72px]

                                items-center

                                overflow-hidden

                                rounded-2xl
                                border

                                p-3
                                text-left

                                transition-colors
                                duration-200

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500/50
                                focus-visible:ring-offset-2

                                dark:focus-visible:ring-offset-[#0a0d14]

                                enabled:active:scale-[0.99]

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                motion-reduce:transform-none
                                motion-reduce:transition-none

                                sm:min-h-[88px]
                                sm:items-start
                                sm:p-3.5

                                ${
                                    active
                                        ? activeClass
                                        : `
                                            border-slate-200
                                            bg-white
                                            text-slate-700

                                            enabled:hover:border-indigo-300
                                            enabled:hover:bg-slate-50

                                            dark:border-white/[0.07]
                                            dark:bg-white/[0.025]
                                            dark:text-slate-300

                                            dark:enabled:hover:border-white/[0.14]
                                            dark:enabled:hover:bg-white/[0.045]
                                        `
                                }
                            `}
                        >
                            {/* =============================
                                CATEGORY GLOW
                            ============================== */}

                            <div
                                aria-hidden="true"
                                className={`
                                    pointer-events-none

                                    absolute
                                    -right-8
                                    -top-8

                                    h-20
                                    w-20

                                    rounded-full
                                    blur-2xl

                                    transition-opacity
                                    duration-200

                                    motion-reduce:transition-none

                                    ${
                                        active
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-60"
                                    }

                                    ${glowClass}
                                `}
                            />

                            {/* =============================
                                CATEGORY CONTENT
                            ============================== */}

                            <div
                                className="
                                    relative
                                    z-10

                                    flex
                                    w-full
                                    min-w-0

                                    items-start
                                    gap-2.5

                                    sm:gap-3
                                "
                            >
                                {/* =========================
                                    CATEGORY ICON
                                ========================== */}

                                <span
                                    aria-hidden="true"
                                    className={`
                                        flex
                                        h-10
                                        w-10

                                        shrink-0

                                        items-center
                                        justify-center

                                        rounded-xl
                                        border

                                        ${iconClass}
                                    `}
                                >
                                    <Icon size={18} />
                                </span>

                                {/* =========================
                                    CATEGORY LABEL + DESCRIPTION
                                ========================== */}

                                <span
                                    className="
                                        block
                                        min-w-0
                                        flex-1
                                    "
                                >
                                    {/* =====================
                                        LABEL ROW
                                    ====================== */}

                                    <span
                                        className="
                                            flex
                                            min-w-0

                                            items-start
                                            justify-between

                                            gap-1.5
                                        "
                                    >
                                        <span
                                            className="
                                                min-w-0

                                                break-words

                                                text-[13px]
                                                font-black
                                                leading-5

                                                text-slate-900
                                                dark:text-white

                                                sm:text-sm
                                            "
                                        >
                                            {label}
                                        </span>

                                        {/* =================
                                            SELECTED ICON
                                        ================== */}

                                        {active && (
                                            <span
                                                aria-hidden="true"
                                                className="
                                                    flex
                                                    h-5
                                                    w-5

                                                    shrink-0

                                                    items-center
                                                    justify-center

                                                    rounded-full

                                                    bg-indigo-500/10
                                                    text-indigo-700

                                                    dark:bg-white/10
                                                    dark:text-white
                                                "
                                            >
                                                <Check size={12} />
                                            </span>
                                        )}
                                    </span>

                                    {/* =====================
                                        DESCRIPTION
                                    ====================== */}

                                    <span
                                        className="
                                            mt-1
                                            block

                                            break-words

                                            text-[11px]
                                            font-medium
                                            leading-4

                                            text-slate-500
                                            dark:text-slate-400

                                            sm:text-xs
                                        "
                                    >
                                        {description}
                                    </span>
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(PostCreateTypeSelector);
