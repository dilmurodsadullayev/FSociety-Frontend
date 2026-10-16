
import React, { useMemo } from "react";

import {
    Code2,
    Tags,
} from "lucide-react";

import {
    PROBLEM_CARD_LIMITS,
} from "./problemCardConfig";

import {
    normalizeStack,
    normalizeHexColor,
    withAlpha,
} from "./problemCardHelpers";

// =========================================================
// FSOCIETY — PROBLEM CARD STACK
//
// Responsibilities:
// - Programming languages
// - Technologies
// - Colored badges
// - Additional items (+N)
// - Empty stack states
//
// Features:
// - Light / Dark Mode
// - Responsive badge wrapping
// - Accessible labels
// - Safe stack normalization
// - Backend / legacy data compatibility
//
// No Redux or API requests.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_STACK = [];

// =========================================================
// STACK BADGE
// =========================================================

const StackBadge = React.memo(({
    item,
    type = "language",
}) => {
    // =====================================================
    // SAFE DATA
    // =====================================================

    const name =
        typeof item?.name === "string"
            ? item.name.trim()
            : "";

    const color = normalizeHexColor(
        item?.color
    );

    const Icon =
        type === "language"
            ? Code2
            : Tags;

    if (!name) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <span
            title={name}

            style={{
                borderColor: withAlpha(
                    color,
                    "40"
                ),
            }}

            className="
                inline-flex
                min-h-7
                max-w-full
                min-w-0

                items-center
                justify-center
                gap-1.5

                rounded-full
                border

                bg-slate-50

                px-2.5
                py-1

                text-[10px]
                font-bold
                leading-4

                text-slate-700

                transition-colors
                duration-150

                group-hover:bg-white

                dark:bg-white/[0.035]
                dark:text-gray-200

                dark:group-hover:bg-white/[0.055]
            "
        >
            {/* STACK COLOR INDICATOR */}

            <span
                aria-hidden="true"

                style={{
                    backgroundColor: color,
                }}

                className="
                    h-2
                    w-2
                    shrink-0

                    rounded-full
                "
            />

            {/* STACK ICON */}

            <Icon
                size={12}
                strokeWidth={1.8}
                aria-hidden="true"

                className="
                    shrink-0

                    text-slate-400

                    dark:text-gray-500
                "
            />

            {/* NAME */}

            <span
                className="
                    min-w-0
                    truncate
                "
            >
                {name}
            </span>
        </span>
    );
});

// =========================================================
// MORE BADGE
//
// Shows how many items are hidden.
//
// Example:
// Python, Django, +3
// =========================================================

const MoreBadge = React.memo(({
    items = EMPTY_STACK,
    type = "language",
}) => {
    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return null;
    }

    const names = items
        .map((item) => item?.name)
        .filter(Boolean)
        .join(", ");

    const category =
        type === "language"
            ? "dasturlash tili"
            : "texnologiya";

    return (
        <span
            title={
                names ||
                `${items.length} ta qo‘shimcha ${category}`
            }

            aria-label={
                `${items.length} ta qo‘shimcha ${category}`
            }

            className="
                inline-flex
                min-h-7

                shrink-0

                items-center
                justify-center

                rounded-full
                border
                border-slate-200

                bg-slate-100

                px-2.5
                py-1

                font-mono
                text-[10px]
                font-black

                text-slate-600

                transition-colors

                dark:border-white/[0.10]
                dark:bg-white/[0.06]
                dark:text-gray-300
            "
        >
            +{items.length}
        </span>
    );
});

// =========================================================
// EMPTY STACK LABEL
// =========================================================

const EmptyStackLabel = React.memo(({
    type = "language",
}) => {
    const message =
        type === "language"
            ? "Til belgilanmagan"
            : "Tag yo‘q";

    return (
        <span
            className="
                inline-flex
                min-h-7

                items-center

                rounded-full
                border
                border-dashed
                border-slate-200

                bg-slate-50/70

                px-3
                py-1

                text-[10px]
                font-medium

                text-slate-500

                dark:border-white/[0.09]
                dark:bg-white/[0.025]
                dark:text-gray-500
            "
        >
            {message}
        </span>
    );
});

// =========================================================
// STACK SECTION
// =========================================================

const StackSection = React.memo(({
    type = "language",
    items = EMPTY_STACK,
    limit = 2,
}) => {
    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeItems = Array.isArray(items)
        ? items
        : EMPTY_STACK;

    const safeLimit =
        Number.isSafeInteger(limit) &&
        limit > 0
            ? limit
            : 2;

    const visibleItems =
        safeItems.slice(0, safeLimit);

    const hiddenItems =
        safeItems.slice(safeLimit);

    const isLanguage =
        type === "language";

    const Icon =
        isLanguage
            ? Code2
            : Tags;

    const label =
        isLanguage
            ? "Dasturlash tillari"
            : "Texnologiyalar";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-label={label}

            className="
                w-full
                min-w-0
            "
        >
            {/* SECTION HEADER */}

            <div
                className="
                    mb-2

                    flex
                    min-w-0

                    items-center
                    justify-between
                    gap-2
                "
            >
                {/* LABEL */}

                <div
                    className="
                        inline-flex
                        min-w-0

                        items-center
                        gap-1.5

                        font-mono
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.10em]

                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    <Icon
                        size={13}
                        strokeWidth={1.9}
                        aria-hidden="true"

                        className={`
                            shrink-0

                            ${
                                isLanguage
                                    ? `
                                        text-cyan-600
                                        dark:text-cyan-400
                                    `
                                    : `
                                        text-indigo-600
                                        dark:text-indigo-400
                                    `
                            }
                        `}
                    />

                    <span className="truncate">
                        {isLanguage
                            ? "Til"
                            : "Taglar"}
                    </span>
                </div>

                {/* TOTAL COUNT */}

                {safeItems.length > 0 && (
                    <span
                        title={
                            `Jami ${safeItems.length} ta`
                        }

                        className="
                            shrink-0

                            font-mono
                            text-[10px]
                            font-semibold
                            tabular-nums

                            text-slate-400

                            dark:text-gray-500
                        "
                    >
                        {safeItems.length}
                    </span>
                )}
            </div>

            {/* BADGES */}

            <div
                className="
                    flex
                    min-h-7
                    min-w-0

                    flex-wrap
                    items-center
                    gap-1.5
                "
            >
                {visibleItems.length > 0 ? (
                    <>
                        {visibleItems.map(
                            (item, index) => (
                                <StackBadge
                                    key={
                                        `${type}-${item.id ?? index}`
                                    }

                                    item={item}
                                    type={type}
                                />
                            )
                        )}

                        <MoreBadge
                            items={hiddenItems}
                            type={type}
                        />
                    </>
                ) : (
                    <EmptyStackLabel
                        type={type}
                    />
                )}
            </div>
        </section>
    );
});

// =========================================================
// MAIN STACK COMPONENT
// =========================================================

const ProblemCardStack = ({
    languages = EMPTY_STACK,
    technologies = EMPTY_STACK,
}) => {
    // =====================================================
    // NORMALIZE INPUT
    //
    // Supports raw backend data as well as
    // already-normalized card data.
    // =====================================================

    const normalizedLanguages = useMemo(
        () => normalizeStack(languages),
        [languages]
    );

    const normalizedTechnologies = useMemo(
        () => normalizeStack(technologies),
        [technologies]
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                mb-5

                flex
                w-full
                min-w-0

                flex-col
                gap-4
            "
        >
            {/* PROGRAMMING LANGUAGES */}

            <StackSection
                type="language"

                items={normalizedLanguages}

                limit={
                    PROBLEM_CARD_LIMITS.languages
                }
            />

            {/* TECHNOLOGIES */}

            <StackSection
                type="technology"

                items={normalizedTechnologies}

                limit={
                    PROBLEM_CARD_LIMITS.technologies
                }
            />
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemCardStack);
