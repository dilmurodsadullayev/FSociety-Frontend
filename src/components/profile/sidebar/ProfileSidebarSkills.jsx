
 // src/components/profile/sidebar/ProfileSidebarSkills.jsx

import React, { memo, useMemo } from "react";

import {
    getTechColorClass,
    getTechnologyColor,
} from "../../../utils/colorUtils";

// =========================================================
// CONSTANTS
// =========================================================

const COLOR_NAMES = new Set([
    "sky",
    "orange",
    "green",
    "blue",
    "purple",
    "yellow",
    "red",
]);

// =========================================================
// NORMALIZE SKILL NAME
//
// Supported values:
//
// "Python"
// { name: "Python" }
// { title: "Python" }
//
// Invalid or empty values are ignored.
//
// Prevents [object Object] from appearing in the UI.
// =========================================================

const normalizeSkillName = (skill) => {
    const raw =
        typeof skill === "string" ||
        typeof skill === "number"
            ? skill
            : skill && typeof skill === "object"
                ? skill.name ?? skill.title ?? ""
                : "";

    return String(raw ?? "").trim();
};

// =========================================================
// TECHNOLOGY COLORS
//
// Existing color utilities are reused.
//
// getTechColorClass:
// - Legacy colors: green, blue, purple...
//
// getTechnologyColor:
// - Python, React, Django, JavaScript, etc.
// =========================================================

const getSkillTone = (name) => {
    const firstWord = name
        .toLowerCase()
        .split(/\s+/)[0];

    if (COLOR_NAMES.has(firstWord)) {
        return getTechColorClass(firstWord);
    }

    return getTechnologyColor(name);
};

// =========================================================
// SKILL CHIP
//
// - Technology-specific background
// - Readable text in Light / Dark Mode
// - Long names wrap without horizontal overflow
// =========================================================

const SkillChip = memo(function SkillChip({
    name,
}) {
    return (
        <span
            title={name}
            className={`
                inline-flex
                max-w-full
                min-w-0
                items-center

                rounded-full
                border
                border-slate-200/60

                px-3
                py-1.5

                text-xs
                font-black
                leading-5

                whitespace-normal
                break-words
                [overflow-wrap:anywhere]

                !text-slate-800

                dark:border-white/[0.08]
                dark:!text-slate-100

                ${getSkillTone(name)}
            `}
        >
            {name}
        </span>
    );
});

// =========================================================
// PROFILE SIDEBAR SKILLS
//
// Preserves:
//
// - Skills heading
// - Technology count
// - Colored technology chips
// - Empty state
// - Light / Dark Mode
// - Responsive layout
//
// No API calls or Redux subscriptions.
//
// Skills are provided by ProfileSidebar.
// =========================================================

const ProfileSidebarSkills = ({
    skills = [],
}) => {
    // =====================================================
    // SAFE SKILLS
    // =====================================================

    const normalizedSkills = useMemo(() => {
        if (!Array.isArray(skills)) {
            return [];
        }

        return skills
            .map(normalizeSkillName)
            .filter(Boolean);
    }, [skills]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Foydalanuvchi ko‘nikmalari"
            className="
                min-w-0
                rounded-3xl
                border

                border-slate-200
                bg-white/95
                p-4

                shadow-[0_12px_35px_rgba(15,23,42,0.055)]

                dark:border-white/[0.08]
                dark:bg-[#0d1117]
                dark:shadow-[0_15px_35px_rgba(0,0,0,0.2)]

                sm:p-5
            "
        >
            {/* =====================================
                HEADER
            ====================================== */}

            <header
                className="
                    mb-5
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div className="min-w-0">
                    <h2
                        className="
                            text-xl
                            font-black

                            text-slate-900
                            dark:text-white
                        "
                    >
                        Ko‘nikmalar
                    </h2>

                    <p
                        className="
                            text-xs
                            font-semibold

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Texnologiyalar va stack
                    </p>
                </div>

                {/* SKILLS COUNT */}

                <span
                    aria-label={`${normalizedSkills.length} ta ko‘nikma`}
                    className="
                        shrink-0
                        rounded-full
                        border

                        border-indigo-200
                        bg-indigo-50

                        px-3
                        py-1

                        text-xs
                        font-black
                        tabular-nums

                        text-indigo-700

                        dark:border-indigo-400/25
                        dark:bg-indigo-500/10
                        dark:text-indigo-300
                    "
                >
                    {normalizedSkills.length} ta
                </span>
            </header>

            {/* =====================================
                SKILLS LIST
            ====================================== */}

            {normalizedSkills.length > 0 ? (
                <div
                    className="
                        flex
                        min-w-0
                        flex-wrap
                        gap-2
                    "
                >
                    {normalizedSkills.map(
                        (name, index) => (
                            <SkillChip
                                key={`${name}-${index}`}
                                name={name}
                            />
                        )
                    )}
                </div>
            ) : (
                /* =================================
                    EMPTY SKILLS STATE
                ================================== */

                <div
                    className="
                        rounded-2xl
                        border
                        border-dashed

                        border-slate-300
                        bg-slate-50

                        p-5
                        text-center

                        dark:border-white/[0.09]
                        dark:bg-white/[0.025]
                    "
                >
                    <p
                        className="
                            text-sm
                            font-semibold

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Hali ko‘nikmalar qo‘shilmagan
                    </p>
                </div>
            )}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileSidebarSkills);
