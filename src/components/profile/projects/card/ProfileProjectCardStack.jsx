
import React, { memo, useMemo } from "react";

// =========================================================
// CONFIG
// =========================================================

const DEFAULT_STACK_COLOR = "#64748B";

const MAX_VISIBLE_STACK = 4;

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

// =========================================================
// STACK COLOR
//
// Uses the color returned by Django serializers.
//
// Invalid colors fall back to the default.
// =========================================================

const getStackColor = (item) => {
    const color = item?.color;

    return typeof color === "string" &&
        HEX_COLOR_PATTERN.test(color)
        ? color
        : DEFAULT_STACK_COLOR;
};

// =========================================================
// HEX COLOR WITH ALPHA
// =========================================================

const withAlpha = (color, alpha) =>
    `${getStackColor({ color })}${alpha}`;

// =========================================================
// NORMALIZE STACK ITEM
//
// Supported:
// - "Django"
// - { id: 1, name: "Django", color: "#..." }
// - { title: "Django" }
//
// Preserves language / technology type.
// =========================================================

const normalizeStackItem = (item, type, index) => {
    if (!item) {
        return null;
    }

    // STRING VALUE

    if (typeof item === "string") {
        const name = item.trim();

        return name
            ? {
                  id: `${type}-${name}-${index}`,
                  name,
                  color: DEFAULT_STACK_COLOR,
                  type,
              }
            : null;
    }

    // INVALID ITEM

    if (
        typeof item !== "object" ||
        Array.isArray(item)
    ) {
        return null;
    }

    // OBJECT VALUE

    const name = String(
        item.name || item.title || "Noma’lum"
    ).trim();

    return {
        ...item,

        id:
            item.id ??
            `${type}-${name || index}`,

        name: name || "Noma’lum",

        color: getStackColor(item),

        type,
    };
};

// =========================================================
// GET PROJECT LANGUAGES
//
// New serializer:
// - languages_data[]
//
// Legacy serializer:
// - language_data
// =========================================================

const getProjectLanguages = (project) => {
    if (
        Array.isArray(project?.languages_data) &&
        project.languages_data.length > 0
    ) {
        return project.languages_data
            .map((item, index) =>
                normalizeStackItem(
                    item,
                    "language",
                    index
                )
            )
            .filter(Boolean);
    }

    if (project?.language_data) {
        return [
            normalizeStackItem(
                project.language_data,
                "language",
                0
            ),
        ].filter(Boolean);
    }

    return [];
};

// =========================================================
// GET PROJECT TECHNOLOGIES
//
// New serializer:
// - technologies_data[]
//
// Legacy serializer:
// - technology_data
// =========================================================

const getProjectTechnologies = (project) => {
    if (
        Array.isArray(project?.technologies_data) &&
        project.technologies_data.length > 0
    ) {
        return project.technologies_data
            .map((item, index) =>
                normalizeStackItem(
                    item,
                    "technology",
                    index
                )
            )
            .filter(Boolean);
    }

    if (project?.technology_data) {
        return [
            normalizeStackItem(
                project.technology_data,
                "technology",
                0
            ),
        ].filter(Boolean);
    }

    return [];
};

// =========================================================
// REMOVE DUPLICATE STACK
//
// Examples:
//
// Django + Django -> Django
// React + React -> React
//
// Languages and technologies retain separate types.
//
// Deduplication uses names so that the same technology
// does not reappear when serializer IDs differ.
// =========================================================

const uniqueStack = (items) => {
    const map = new Map();

    items.forEach((item) => {
        if (!item) {
            return;
        }

        const key = `${
            item.type
        }-${
            String(item.name)
                .trim()
                .toLocaleLowerCase()
        }`;

        if (!map.has(key)) {
            map.set(key, item);
        }
    });

    return Array.from(map.values());
};

// =========================================================
// STACK BADGE
//
// Original technology-specific colors are preserved.
//
// Improvements:
// - Light Mode readable text
// - Dark Mode readable text
// - Colored border and background
// - Technology color dot
// - Long name truncation
// =========================================================

const StackBadge = memo(function StackBadge({
    item,
}) {
    const color = getStackColor(item);

    return (
        <span
            title={item.name}
            className="
                inline-flex
                max-w-[160px]
                items-center
                gap-1.5

                rounded-full
                border

                px-3
                py-1.5

                text-xs
                font-black

                text-slate-700
                dark:text-slate-200

                transition
                duration-300

                hover:-translate-y-[1px]

                motion-reduce:transform-none
            "
            style={{
                borderColor: withAlpha(
                    color,
                    "55"
                ),

                backgroundColor: withAlpha(
                    color,
                    "17"
                ),

                boxShadow: `0 0 12px ${withAlpha(
                    color,
                    "0D"
                )}`,
            }}
        >
            {/* TECHNOLOGY COLOR DOT */}

            <span
                aria-hidden="true"
                className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                "
                style={{
                    backgroundColor: color,
                }}
            />

            {/* TECHNOLOGY NAME */}

            <span className="truncate">
                {item.name}
            </span>
        </span>
    );
});

// =========================================================
// MORE STACK BADGE
//
// Example:
// +3
//
// Hover title shows hidden technologies.
// =========================================================

const MoreStackBadge = memo(
    function MoreStackBadge({ items }) {
        if (items.length === 0) {
            return null;
        }

        const title = items
            .map((item) => item.name)
            .filter(Boolean)
            .join(", ");

        return (
            <span
                title={title}
                className="
                    inline-flex
                    items-center

                    rounded-full
                    border

                    border-slate-300
                    bg-slate-100

                    px-3
                    py-1.5

                    text-xs
                    font-black
                    text-slate-600

                    transition

                    hover:border-slate-400
                    hover:text-slate-900

                    dark:border-white/15
                    dark:bg-white/[0.05]
                    dark:text-slate-400

                    dark:hover:border-white/25
                    dark:hover:text-white
                "
            >
                +{items.length}
            </span>
        );
    }
);

// =========================================================
// PROFILE PROJECT CARD STACK
//
// Receives the complete project object.
//
// Does not perform API requests.
//
// All stack normalization and rendering stays here,
// not inside ProfileProjectCard.jsx.
// =========================================================

const ProfileProjectCardStack = ({
    project,
}) => {
    // =====================================================
    // NORMALIZED STACK
    // =====================================================

    const stack = useMemo(() => {
        const languages =
            getProjectLanguages(project);

        const technologies =
            getProjectTechnologies(project);

        return uniqueStack([
            ...languages,
            ...technologies,
        ]);
    }, [project]);

    // =====================================================
    // VISIBLE AND HIDDEN STACK
    // =====================================================

    const visibleStack = stack.slice(
        0,
        MAX_VISIBLE_STACK
    );

    const hiddenStack = stack.slice(
        MAX_VISIBLE_STACK
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            aria-label="Loyiha texnologiyalari"
            className="
                mt-4

                flex
                min-h-[30px]
                min-w-0

                flex-wrap
                gap-2
            "
        >
            {/* VISIBLE TECHNOLOGIES */}

            {visibleStack.map((item) => (
                <StackBadge
                    key={`${item.type}-${item.id}`}
                    item={item}
                />
            ))}

            {/* HIDDEN TECHNOLOGIES COUNT */}

            <MoreStackBadge
                items={hiddenStack}
            />

            {/* EMPTY STACK */}

            {stack.length === 0 && (
                <span
                    className="
                        rounded-full
                        border

                        border-slate-300
                        bg-slate-100

                        px-3
                        py-1.5

                        text-xs
                        font-black
                        text-slate-500

                        dark:border-white/15
                        dark:bg-white/[0.05]
                        dark:text-slate-400
                    "
                >
                    Texnologiyalar kiritilmagan
                </span>
            )}
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileProjectCardStack);
