
// src/components/projects/create/ProjectCreateStackPreview.jsx

import React, { memo } from "react";

import {
    Code2,
    Layers3,
} from "lucide-react";

import {
    getProjectStackColor,
    withProjectStackAlpha,
} from "./ProjectCreateStackTag";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_ITEMS = [];

// =========================================================
// STACK PREVIEW TAG
//
// Shows an individual selected language or technology.
//
// Features:
// - Backend-defined color
// - Responsive text wrapping
// - Light / Dark Mode
// - Safe fallback names
//
// No selection or form state.
// =========================================================

const StackPreviewTag = memo(
    function StackPreviewTag({ item }) {
        // =================================================
        // SAFE VALUES
        // =================================================

        const name =
            String(item?.name ?? "").trim() ||
            "Noma’lum";

        const color =
            getProjectStackColor(item);

        // =================================================
        // BACKEND COLOR STYLES
        // =================================================

        const tagStyle = {
            borderColor: withProjectStackAlpha(
                color,
                "45"
            ),
            backgroundColor: withProjectStackAlpha(
                color,
                "12"
            ),
        };

        // =================================================
        // RENDER
        // =================================================

        return (
            <span
                title={name}
                style={tagStyle}
                className="
                    inline-flex

                    min-w-0
                    max-w-full

                    items-center
                    gap-1.5

                    rounded-xl
                    border

                    px-2.5
                    py-1.5

                    text-[10px]
                    font-black
                    leading-5

                    text-slate-800
                    dark:text-slate-200

                    sm:rounded-full
                    sm:text-[11px]
                "
            >
                {/* =========================================
                    COLOR INDICATOR
                ========================================== */}

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

                {/* =========================================
                    STACK NAME

                    Long names can wrap rather than
                    overflowing the preview card.
                ========================================== */}

                <span
                    className="
                        min-w-0

                        whitespace-normal
                        break-words

                        [overflow-wrap:anywhere]
                    "
                >
                    {name}
                </span>
            </span>
        );
    }
);

// =========================================================
// STACK PREVIEW GROUP
//
// Props:
// - title
// - items
// - variant: language | technology
//
// Renders nothing when no items are selected.
// =========================================================

const StackPreviewGroup = memo(
    function StackPreviewGroup({
        title,
        items = EMPTY_ITEMS,
        variant = "language",
    }) {
        // =================================================
        // SAFE ITEMS
        // =================================================

        const safeItems = Array.isArray(items)
            ? items.filter(Boolean)
            : EMPTY_ITEMS;

        // =================================================
        // VISIBILITY
        // =================================================

        if (safeItems.length === 0) {
            return null;
        }

        // =================================================
        // GROUP ICON AND COLORS
        // =================================================

        const isLanguage =
            variant === "language";

        const Icon = isLanguage
            ? Code2
            : Layers3;

        const iconClass = isLanguage
            ? "text-blue-600 dark:text-blue-400"
            : "text-purple-600 dark:text-purple-400";

        const countClass = isLanguage
            ? `
                border-blue-200
                bg-blue-50
                text-blue-700

                dark:border-blue-400/15
                dark:bg-blue-500/[0.06]
                dark:text-blue-300
            `
            : `
                border-purple-200
                bg-purple-50
                text-purple-700

                dark:border-purple-400/15
                dark:bg-purple-500/[0.06]
                dark:text-purple-300
            `;

        // =================================================
        // RENDER
        // =================================================

        return (
            <div
                className="
                    w-full
                    min-w-0
                "
            >
                {/* =========================================
                    GROUP HEADER
                ========================================== */}

                <div
                    className="
                        mb-2.5

                        flex
                        min-w-0

                        flex-wrap
                        items-center
                        justify-between

                        gap-2
                    "
                >
                    {/* =====================================
                        GROUP ICON AND TITLE
                    ====================================== */}

                    <div
                        className="
                            flex
                            min-w-0

                            items-center
                            gap-2
                        "
                    >
                        <Icon
                            size={14}
                            aria-hidden="true"
                            className={`
                                shrink-0

                                ${iconClass}
                            `}
                        />

                        <p
                            className="
                                min-w-0

                                break-words

                                text-[10px]
                                font-black

                                uppercase
                                tracking-[0.12em]

                                text-slate-600
                                dark:text-slate-300

                                sm:text-[11px]
                            "
                        >
                            {title}
                        </p>
                    </div>

                    {/* =====================================
                        GROUP COUNT
                    ====================================== */}

                    <span
                        className={`
                            inline-flex

                            shrink-0

                            items-center
                            justify-center

                            rounded-full
                            border

                            px-2
                            py-0.5

                            text-[10px]
                            font-black
                            tabular-nums

                            ${countClass}
                        `}
                    >
                        {safeItems.length} ta
                    </span>
                </div>

                {/* =========================================
                    SELECTED STACK TAGS

                    flex-wrap:
                    Moves tags to the next line.

                    max-w-full:
                    Prevents oversized tags.

                    overflow-wrap:
                    Handles long words without spaces.
                ========================================== */}

                <div
                    className="
                        flex

                        w-full
                        min-w-0
                        max-w-full

                        flex-wrap

                        items-start
                        gap-2

                        [&>*]:max-w-full
                    "
                >
                    {safeItems.map((item, index) => (
                        <StackPreviewTag
                            key={
                                item?.id ??
                                `${variant}-${index}`
                            }
                            item={item}
                        />
                    ))}
                </div>
            </div>
        );
    }
);

// =========================================================
// PROJECT CREATE STACK PREVIEW
//
// Props:
//
// selectedLanguages:
//   Array of selected language objects.
//
// selectedTechnologies:
//   Array of selected technology objects.
//
// Features:
// - Live selected language preview
// - Live selected technology preview
// - Language count
// - Technology count
// - Total selected stack count
// - Backend category colors
// - Responsive mobile layout
// - Light / Dark Mode
//
// Visibility:
// - Returns null if nothing is selected.
//
// No API calls.
// No form state.
// No selection mutation.
// =========================================================

const ProjectCreateStackPreview = ({
    selectedLanguages = EMPTY_ITEMS,
    selectedTechnologies = EMPTY_ITEMS,
}) => {
    // =====================================================
    // SAFE ARRAYS
    // =====================================================

    const safeLanguages = Array.isArray(
        selectedLanguages
    )
        ? selectedLanguages.filter(Boolean)
        : EMPTY_ITEMS;

    const safeTechnologies = Array.isArray(
        selectedTechnologies
    )
        ? selectedTechnologies.filter(Boolean)
        : EMPTY_ITEMS;

    // =====================================================
    // COUNTERS
    // =====================================================

    const languageCount =
        safeLanguages.length;

    const technologyCount =
        safeTechnologies.length;

    const totalCount =
        languageCount + technologyCount;

    // =====================================================
    // VISIBILITY
    //
    // Preserve original behavior.
    // Do not show an empty preview card.
    // =====================================================

    if (totalCount === 0) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Tanlangan texnologik stack"
            className="
                relative

                w-full
                min-w-0
                max-w-full

                overflow-hidden

                rounded-2xl
                border

                border-slate-200
                bg-slate-50

                p-3.5

                dark:border-white/[0.08]
                dark:bg-black/20

                min-[380px]:p-4
            "
        >
            {/* =============================================
                BACKGROUND GLOW
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    -right-12
                    -top-12

                    h-32
                    w-32

                    rounded-full

                    bg-purple-500/[0.07]
                    blur-[50px]
                "
            />

            {/* =============================================
                MAIN HEADER
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    mb-4

                    flex
                    min-w-0

                    flex-wrap

                    items-center
                    justify-between

                    gap-2.5
                "
            >
                {/* =========================================
                    HEADER ICON AND TITLE
                ========================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        gap-2
                    "
                >
                    <Code2
                        size={16}
                        aria-hidden="true"
                        className="
                            shrink-0

                            text-purple-600
                            dark:text-purple-300
                        "
                    />

                    <h4
                        className="
                            min-w-0

                            break-words

                            text-[10px]
                            font-black

                            uppercase
                            tracking-[0.12em]

                            text-slate-700
                            dark:text-slate-300

                            sm:text-[11px]
                            sm:tracking-[0.15em]
                        "
                    >
                        Stack preview
                    </h4>
                </div>

                {/* =========================================
                    TOTAL SELECTED COUNT
                ========================================== */}

                <span
                    className="
                        inline-flex

                        shrink-0

                        items-center
                        justify-center

                        rounded-full
                        border

                        border-purple-200
                        bg-purple-50

                        px-2.5
                        py-1

                        text-[10px]
                        font-black
                        tabular-nums

                        text-purple-700

                        dark:border-purple-400/15
                        dark:bg-purple-500/[0.07]
                        dark:text-purple-300
                    "
                >
                    {totalCount} ta
                </span>
            </div>

            {/* =============================================
                STACK GROUPS
            ============================================== */}

            <div
                className="
                    relative
                    z-10

                    w-full
                    min-w-0

                    space-y-4
                "
            >
                {/* =========================================
                    SELECTED LANGUAGES
                ========================================== */}

                <StackPreviewGroup
                    title="Tillar"
                    items={safeLanguages}
                    variant="language"
                />

                {/* =========================================
                    DIVIDER

                    Only show when both groups contain
                    selected items.
                ========================================== */}

                {languageCount > 0 &&
                    technologyCount > 0 && (
                        <div
                            aria-hidden="true"
                            className="
                                h-px
                                w-full

                                bg-slate-200

                                dark:bg-white/[0.08]
                            "
                        />
                    )}

                {/* =========================================
                    SELECTED TECHNOLOGIES
                ========================================== */}

                <StackPreviewGroup
                    title="Texnologiyalar"
                    items={safeTechnologies}
                    variant="technology"
                />
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateStackPreview);
