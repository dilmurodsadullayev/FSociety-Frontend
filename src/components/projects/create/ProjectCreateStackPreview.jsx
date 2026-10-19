
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
// Used for both:
//
// - Selected languages
// - Selected technologies
//
// Colors come from the backend catalog.
//
// Shared color helpers are imported from
// ProjectCreateStackTag.jsx.
// =========================================================

const StackPreviewTag = memo(
    function StackPreviewTag({
        item,
    }) {
        // ================================================
        // SAFE VALUES
        // ================================================

        const name = String(
            item?.name || "Noma’lum"
        );

        const color =
            getProjectStackColor(item);

        // ================================================
        // STYLES
        // ================================================

        const tagStyle = {
            borderColor:
                withProjectStackAlpha(
                    color,
                    "45"
                ),

            backgroundColor:
                withProjectStackAlpha(
                    color,
                    "12"
                ),
        };

        // ================================================
        // RENDER
        // ================================================

        return (
            <span
                title={name}
                style={tagStyle}
                className="
                    inline-flex
                    max-w-full
                    min-w-0

                    items-center
                    gap-1.5

                    rounded-full
                    border

                    px-2.5
                    py-1.5

                    text-[10px]
                    font-black

                    text-slate-800
                    dark:text-slate-200

                    transition-colors
                    duration-200
                "
            >
                {/* COLOR INDICATOR */}

                <span
                    aria-hidden="true"
                    style={{
                        backgroundColor: color,
                    }}
                    className="
                        h-1.5
                        w-1.5

                        shrink-0

                        rounded-full
                    "
                />

                {/* STACK NAME */}

                <span className="truncate">
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
//
// title:
//   Group label.
//
// items:
//   Selected catalog items.
//
// variant:
//   language | technology
//
// Renders nothing when items are empty.
// =========================================================

const StackPreviewGroup = memo(
    function StackPreviewGroup({
        title,
        items = EMPTY_ITEMS,
        variant = "language",
    }) {
        // ================================================
        // SAFE ITEMS
        // ================================================

        const safeItems =
            Array.isArray(items)
                ? items.filter(Boolean)
                : EMPTY_ITEMS;

        if (safeItems.length === 0) {
            return null;
        }

        // ================================================
        // GROUP ICON
        // ================================================

        const isLanguage =
            variant === "language";

        const Icon = isLanguage
            ? Code2
            : Layers3;

        // ================================================
        // RENDER
        // ================================================

        return (
            <div className="min-w-0">
                {/* =====================================
                    GROUP HEADER
                ====================================== */}

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
                    <div
                        className="
                            flex
                            min-w-0

                            items-center
                            gap-2
                        "
                    >
                        <Icon
                            size={13}
                            aria-hidden="true"
                            className={
                                isLanguage
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-purple-600 dark:text-purple-400"
                            }
                        />

                        <p
                            className="
                                text-[10px]
                                font-black

                                uppercase
                                tracking-[0.12em]

                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            {title}
                        </p>
                    </div>

                    {/* GROUP COUNT */}

                    <span
                        className="
                            text-[10px]
                            font-black
                            tabular-nums

                            text-slate-500
                            dark:text-slate-500
                        "
                    >
                        {safeItems.length}
                    </span>
                </div>

                {/* =====================================
                    SELECTED ITEMS
                ====================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-wrap
                        gap-2
                    "
                >
                    {safeItems.map(
                        (item, index) => (
                            <StackPreviewTag
                                key={
                                    item?.id ??
                                    `${variant}-${index}`
                                }
                                item={item}
                            />
                        )
                    )}
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
// Example:
//
// <ProjectCreateStackPreview
//     selectedLanguages={selectedLanguages}
//     selectedTechnologies={selectedTechnologies}
// />
//
// Responsibilities:
//
// - Show selected programming languages
// - Show selected technologies
// - Render category counters
// - Use backend catalog colors
// - Light / Dark Mode
//
// This component does NOT:
//
// - Fetch catalog data
// - Toggle selections
// - Validate stack choices
// - Manage form state
// - Make API calls
// =========================================================

const ProjectCreateStackPreview = ({
    selectedLanguages = EMPTY_ITEMS,
    selectedTechnologies = EMPTY_ITEMS,
}) => {
    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeLanguages =
        Array.isArray(selectedLanguages)
            ? selectedLanguages.filter(Boolean)
            : EMPTY_ITEMS;

    const safeTechnologies =
        Array.isArray(selectedTechnologies)
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
    // ORIGINAL VISIBILITY RULE
    //
    // Do not display an empty preview panel.
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
                min-w-0

                overflow-hidden

                rounded-2xl
                border

                border-slate-200
                bg-slate-50

                p-4

                dark:border-white/[0.08]
                dark:bg-black/20
            "
        >
            {/* =====================================
                BACKGROUND GLOW
            ====================================== */}

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

            {/* =====================================
                MAIN HEADER
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mb-4

                    flex
                    min-w-0

                    items-center
                    justify-between
                    gap-3
                "
            >
                {/* TITLE */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        gap-2
                    "
                >
                    <Code2
                        size={15}
                        aria-hidden="true"
                        className="
                            shrink-0

                            text-purple-600
                            dark:text-purple-300
                        "
                    />

                    <h4
                        className="
                            text-[10px]
                            font-black

                            uppercase
                            tracking-[0.15em]

                            text-slate-700
                            dark:text-slate-300
                        "
                    >
                        Stack preview
                    </h4>
                </div>

                {/* TOTAL COUNT */}

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

                        text-[9px]
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

            {/* =====================================
                STACK GROUPS
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    min-w-0
                    space-y-4
                "
            >
                {/* LANGUAGES */}

                <StackPreviewGroup
                    title="Tillar"
                    items={safeLanguages}
                    variant="language"
                />

                {/* DIVIDER */}

                {languageCount > 0 &&
                    technologyCount > 0 && (
                        <div
                            aria-hidden="true"
                            className="
                                h-px
                                bg-slate-200

                                dark:bg-white/[0.06]
                            "
                        />
                    )}

                {/* TECHNOLOGIES */}

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
