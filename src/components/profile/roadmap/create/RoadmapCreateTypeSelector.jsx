
import React, { memo } from "react";

import {
    BriefcaseBusiness,
    Check,
    GraduationCap,
} from "lucide-react";

// =========================================================
// ROADMAP TYPES
//
// Shared with RoadmapCreateModal.
//
// The parent modal can use this array for:
// - selected type
// - preview icon
// - type label
// - type description
// =========================================================

export const ROADMAP_TYPES = [
    {
        value: "learning",
        label: "O‘rganish",
        shortLabel: "Learning",

        description:
            "Yangi texnologiya, dasturlash tili yoki skillni o‘rganish yo‘li.",

        Icon: GraduationCap,

        activeClass: `
            border-indigo-300
            bg-indigo-50
            text-indigo-700

            dark:border-indigo-400/35
            dark:bg-indigo-500/[0.10]
            dark:text-indigo-200
        `,

        iconClass: `
            border-indigo-300
            bg-indigo-100
            text-indigo-700

            dark:border-indigo-400/20
            dark:bg-indigo-500/[0.10]
            dark:text-indigo-300
        `,

        glowClass:
            "bg-indigo-500/[0.12]",
    },

    {
        value: "experience",
        label: "Tajriba",
        shortLabel: "Experience",

        description:
            "Ish, loyiha, kompaniya yoki professional tajriba bosqichi.",

        Icon: BriefcaseBusiness,

        activeClass: `
            border-emerald-300
            bg-emerald-50
            text-emerald-700

            dark:border-emerald-400/35
            dark:bg-emerald-500/[0.10]
            dark:text-emerald-200
        `,

        iconClass: `
            border-emerald-300
            bg-emerald-100
            text-emerald-700

            dark:border-emerald-400/20
            dark:bg-emerald-500/[0.10]
            dark:text-emerald-300
        `,

        glowClass:
            "bg-emerald-500/[0.12]",
    },
];

// =========================================================
// ROADMAP CREATE TYPE SELECTOR
//
// Props:
//
// value:
//   Current roadmap type.
//
// onChange:
//   Callback from RoadmapCreateModal.
//
// disabled:
//   Prevents changing type during submission.
//
// Responsibilities:
//
// - Display available roadmap types.
// - Highlight selected type.
// - Notify parent on selection.
//
// No internal form state.
// No Redux or API calls.
// =========================================================

const RoadmapCreateTypeSelector = ({
    value = "learning",
    onChange,
    disabled = false,
}) => {
    const canChange =
        typeof onChange === "function";

    return (
        <section
            aria-label="Roadmap turini tanlash"
            className="min-w-0"
        >
            {/* =====================================
                SECTION HEADING
            ====================================== */}

            <div className="mb-3">
                <p
                    className="
                        text-xs
                        font-black

                        uppercase
                        tracking-[0.14em]

                        text-slate-700
                        dark:text-gray-400
                    "
                >
                    Roadmap turi
                </p>

                <p
                    className="
                        mt-1
                        text-[10px]
                        font-medium

                        text-slate-500
                        dark:text-gray-500
                    "
                >
                    Roadmap nimani ifodalashini tanlang.
                </p>
            </div>

            {/* =====================================
                TYPE OPTIONS
            ====================================== */}

            <div
                role="group"
                aria-label="Roadmap turlari"
                className="
                    grid
                    min-w-0
                    gap-3

                    sm:grid-cols-2
                "
            >
                {ROADMAP_TYPES.map((item) => {
                    const {
                        value: typeValue,
                        label,
                        description,
                        Icon,
                        activeClass,
                        iconClass,
                        glowClass,
                    } = item;

                    const isActive =
                        value === typeValue;

                    return (
                        <button
                            key={typeValue}
                            type="button"
                            disabled={
                                disabled || !canChange
                            }
                            aria-pressed={isActive}
                            onClick={() =>
                                onChange?.(typeValue)
                            }
                            className={`
                                group
                                relative
                                min-w-0

                                overflow-hidden

                                rounded-2xl
                                border

                                p-4
                                text-left

                                transition-all
                                duration-200

                                active:scale-[0.98]

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500/50

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                motion-reduce:transform-none

                                ${
                                    isActive
                                        ? activeClass
                                        : `
                                            border-slate-200
                                            bg-white
                                            text-slate-600

                                            hover:border-indigo-300
                                            hover:bg-slate-50

                                            dark:border-white/[0.07]
                                            dark:bg-white/[0.018]
                                            dark:text-gray-400

                                            dark:hover:border-white/[0.12]
                                            dark:hover:bg-white/[0.035]
                                        `
                                }
                            `}
                        >
                            {/* BACKGROUND GLOW */}

                            <div
                                aria-hidden="true"
                                className={`
                                    pointer-events-none

                                    absolute
                                    -right-10
                                    -top-10

                                    h-24
                                    w-24

                                    rounded-full
                                    blur-[35px]

                                    transition-opacity

                                    ${
                                        isActive
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-50"
                                    }

                                    ${glowClass}
                                `}
                            />

                            {/* OPTION CONTENT */}

                            <div
                                className="
                                    relative
                                    z-10

                                    flex
                                    min-w-0

                                    items-start
                                    gap-3
                                "
                            >
                                {/* ICON */}

                                <div
                                    className={`
                                        flex
                                        h-11
                                        w-11
                                        shrink-0

                                        items-center
                                        justify-center

                                        rounded-xl
                                        border

                                        ${iconClass}
                                    `}
                                >
                                    <Icon
                                        size={19}
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* TEXT */}

                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >
                                    {/* LABEL + CHECK */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-2
                                        "
                                    >
                                        <p
                                            className="
                                                text-sm
                                                font-black

                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {label}
                                        </p>

                                        {isActive && (
                                            <span
                                                aria-hidden="true"
                                                className="
                                                    grid
                                                    h-5
                                                    w-5
                                                    shrink-0

                                                    place-items-center

                                                    rounded-full

                                                    bg-indigo-500/10
                                                    text-indigo-700

                                                    dark:bg-white/[0.08]
                                                    dark:text-white
                                                "
                                            >
                                                <Check
                                                    size={11}
                                                />
                                            </span>
                                        )}
                                    </div>

                                    {/* DESCRIPTION */}

                                    <p
                                        className="
                                            mt-1.5

                                            break-words

                                            text-[10px]
                                            font-medium
                                            leading-5

                                            text-slate-500
                                            dark:text-gray-500
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

// =========================================================
// EXPORT
// =========================================================

export default memo(RoadmapCreateTypeSelector);
