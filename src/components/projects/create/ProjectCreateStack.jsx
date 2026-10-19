
import React, { memo } from "react";

import {
    Braces,
    Code2,
    Layers3,
    Loader2,
} from "lucide-react";

import ProjectCreateStackTag from "./ProjectCreateStackTag";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_ARRAY = [];

const SKELETON_COUNT = 5;

// =========================================================
// STACK LOADING SKELETON
//
// Used for both:
// - Languages
// - Technologies
// =========================================================

const StackLoadingSkeleton = memo(
    function StackLoadingSkeleton({
        type = "language",
    }) {
        return (
            <div
                role="status"
                aria-label="Stack katalogi yuklanmoqda"
                className="
                    flex
                    flex-wrap
                    gap-2
                "
            >
                {Array.from(
                    {
                        length: SKELETON_COUNT,
                    },
                    (_, index) => (
                        <div
                            key={index}
                            aria-hidden="true"
                            className={`
                                h-9

                                animate-pulse

                                rounded-full

                                bg-slate-200

                                dark:bg-white/[0.06]

                                motion-reduce:animate-none

                                ${
                                    type === "technology"
                                        ? "w-28"
                                        : "w-24"
                                }
                            `}
                        />
                    )
                )}

                <span className="sr-only">
                    Katalog yuklanmoqda...
                </span>
            </div>
        );
    }
);

// =========================================================
// STACK SECTION HEADING
//
// Shared by:
// - Languages
// - Technologies
// =========================================================

const StackSectionHeading = memo(
    function StackSectionHeading({
        title,
        count = 0,
        Icon,
        variant = "language",
        id,
    }) {
        const isLanguage =
            variant === "language";

        return (
            <div
                className="
                    mb-3

                    flex
                    min-w-0

                    items-center
                    justify-between
                    gap-3
                "
            >
                {/* =====================================
                    HEADING
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
                        size={15}
                        aria-hidden="true"
                        className={
                            isLanguage
                                ? `
                                    shrink-0
                                    text-blue-600
                                    dark:text-blue-300
                                `
                                : `
                                    shrink-0
                                    text-purple-600
                                    dark:text-purple-300
                                `
                        }
                    />

                    <span
                        id={id}
                        className="
                            text-xs
                            font-black

                            text-slate-700
                            dark:text-slate-300
                        "
                    >
                        {title}
                    </span>

                    {/* REQUIRED INDICATOR */}

                    <span
                        aria-hidden="true"
                        className="
                            text-red-500
                            dark:text-red-400
                        "
                    >
                        *
                    </span>
                </div>

                {/* =====================================
                    SELECTED COUNT
                ====================================== */}

                {count > 0 && (
                    <span
                        className={`
                            inline-flex
                            shrink-0
                            items-center

                            rounded-full
                            border

                            px-2
                            py-0.5

                            text-[9px]
                            font-black
                            tabular-nums

                            ${
                                isLanguage
                                    ? `
                                        border-blue-200
                                        bg-blue-50
                                        text-blue-700

                                        dark:border-blue-400/15
                                        dark:bg-blue-500/[0.05]
                                        dark:text-blue-300
                                    `
                                    : `
                                        border-purple-200
                                        bg-purple-50
                                        text-purple-700

                                        dark:border-purple-400/15
                                        dark:bg-purple-500/[0.05]
                                        dark:text-purple-300
                                    `
                            }
                        `}
                    >
                        {count} ta
                    </span>
                )}
            </div>
        );
    }
);

// =========================================================
// PROJECT CREATE STACK
//
// Props:
//
// languages:
//   Full language catalog.
//
// compatibleTechnologies:
//   Technologies already filtered by selected
//   languages in parent component.
//
// selectedLanguageIds:
//   Selected language IDs (as strings).
//
// selectedTechnologyIds:
//   Selected technology IDs (as strings).
//
// stackLoading:
//   Catalog loading state.
//
// stackError:
//   Error while loading catalog.
//
// isSubmitting:
//   Disable selection while submitting.
//
// onLanguageToggle:
//   Parent handleLanguageToggle(language).
//
// onTechnologyToggle:
//   Parent handleTechnologyToggle(technology).
//
// IMPORTANT:
//
// Compatibility rules remain in the parent:
//
// technologyMatchesLanguages(...)
//
// When a language is removed, incompatible selected
// technologies are removed in the parent.
//
// This component does not mutate selections.
// =========================================================

const ProjectCreateStack = ({
    languages = EMPTY_ARRAY,
    compatibleTechnologies = EMPTY_ARRAY,

    selectedLanguageIds = EMPTY_ARRAY,
    selectedTechnologyIds = EMPTY_ARRAY,

    stackLoading = false,
    stackError = "",

    isSubmitting = false,

    onLanguageToggle,
    onTechnologyToggle,
}) => {
    // =====================================================
    // SAFE CATALOGS
    // =====================================================

    const safeLanguages =
        Array.isArray(languages)
            ? languages
            : EMPTY_ARRAY;

    const safeTechnologies =
        Array.isArray(compatibleTechnologies)
            ? compatibleTechnologies
            : EMPTY_ARRAY;

    // =====================================================
    // SAFE SELECTED IDS
    // =====================================================

    const safeLanguageIds =
        Array.isArray(selectedLanguageIds)
            ? selectedLanguageIds.map(String)
            : EMPTY_ARRAY;

    const safeTechnologyIds =
        Array.isArray(selectedTechnologyIds)
            ? selectedTechnologyIds.map(String)
            : EMPTY_ARRAY;

    // =====================================================
    // PERMISSIONS
    // =====================================================

    const languageDisabled =
        isSubmitting ||
        stackLoading ||
        typeof onLanguageToggle !== "function";

    const technologyDisabled =
        isSubmitting ||
        stackLoading ||
        typeof onTechnologyToggle !== "function";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Loyihaning texnologik stacki"
            className="
                min-w-0

                rounded-[24px]
                border

                border-slate-200
                bg-slate-50/70

                p-5

                dark:border-white/[0.06]
                dark:bg-white/[0.018]
            "
        >
            {/* =====================================
                MAIN SECTION HEADER
            ====================================== */}

            <div
                className="
                    mb-5

                    flex
                    min-w-0

                    items-start
                    justify-between
                    gap-3
                "
            >
                {/* =================================
                    ICON + TITLE
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0

                        items-center
                        gap-3
                    "
                >
                    {/* ICON */}

                    <div
                        aria-hidden="true"
                        className="
                            grid
                            h-9
                            w-9
                            shrink-0

                            place-items-center

                            rounded-xl
                            border

                            border-purple-200
                            bg-purple-50

                            text-purple-700

                            dark:border-purple-400/15
                            dark:bg-purple-500/[0.06]
                            dark:text-purple-300
                        "
                    >
                        <Braces size={17} />
                    </div>

                    {/* HEADING */}

                    <div className="min-w-0">
                        <h3
                            className="
                                text-sm
                                font-black

                                text-slate-900
                                dark:text-white
                            "
                        >
                            Texnologik stack
                        </h3>

                        <p
                            className="
                                mt-0.5

                                text-[10px]
                                font-medium
                                leading-5

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Bir nechta til va texnologiyani
                            tanlashingiz mumkin
                        </p>
                    </div>
                </div>

                {/* =================================
                    CATALOG LOADING ICON
                ================================== */}

                {stackLoading && (
                    <Loader2
                        size={17}
                        aria-label="Stack yuklanmoqda"
                        className="
                            shrink-0

                            animate-spin

                            text-purple-600
                            dark:text-purple-300

                            motion-reduce:animate-none
                        "
                    />
                )}
            </div>

            {/* =====================================
                STACK ERROR

                Catalog errors do not disappear
                silently.
            ====================================== */}

            {stackError && (
                <div
                    role="alert"
                    className="
                        mb-5

                        rounded-xl
                        border

                        border-red-200
                        bg-red-50

                        p-3

                        text-xs
                        font-semibold
                        leading-5

                        text-red-700

                        dark:border-red-400/15
                        dark:bg-red-500/[0.05]
                        dark:text-red-300
                    "
                >
                    {stackError}
                </div>
            )}

            {/* =====================================
                LANGUAGES
            ====================================== */}

            <div>
                {/* =================================
                    LANGUAGE HEADING
                ================================== */}

                <StackSectionHeading
                    id="project-stack-languages"
                    title="Dasturlash tillari"
                    count={
                        safeLanguageIds.length
                    }
                    Icon={Code2}
                    variant="language"
                />

                {/* =================================
                    LANGUAGE OPTIONS
                ================================== */}

                <div
                    role="group"
                    aria-labelledby="project-stack-languages"
                    className="
                        flex
                        min-w-0
                        flex-wrap
                        gap-2
                    "
                >
                    {stackLoading ? (
                        <StackLoadingSkeleton
                            type="language"
                        />
                    ) : (
                        safeLanguages.map(
                            (language, index) => {
                                // =========================
                                // CHECK SELECTED
                                // =========================

                                const active =
                                    safeLanguageIds.includes(
                                        String(
                                            language.id
                                        )
                                    );

                                // =========================
                                // LANGUAGE TAG
                                // =========================

                                return (
                                    <ProjectCreateStackTag
                                        key={
                                            language.id ??
                                            `language-${index}`
                                        }
                                        item={language}
                                        active={active}
                                        disabled={
                                            languageDisabled
                                        }
                                        onClick={() =>
                                            onLanguageToggle?.(
                                                language
                                            )
                                        }
                                    />
                                );
                            }
                        )
                    )}
                </div>

                {/* =================================
                    EMPTY LANGUAGE CATALOG
                ================================== */}

                {!stackLoading &&
                    safeLanguages.length === 0 && (
                        <p
                            className="
                                mt-3

                                text-xs
                                font-semibold

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Dasturlash tillari topilmadi.
                        </p>
                    )}
            </div>

            {/* =====================================
                DIVIDER
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    my-5
                    h-px

                    bg-slate-200

                    dark:bg-white/[0.06]
                "
            />

            {/* =====================================
                TECHNOLOGIES
            ====================================== */}

            <div>
                {/* =================================
                    TECHNOLOGY HEADING
                ================================== */}

                <StackSectionHeading
                    id="project-stack-technologies"
                    title="Texnologiyalar"
                    count={
                        safeTechnologyIds.length
                    }
                    Icon={Layers3}
                    variant="technology"
                />

                {/* =================================
                    LANGUAGE HELP MESSAGE

                    Original informational behavior:
                    encourage selecting a language
                    before a technology.
                ================================== */}

                {safeLanguageIds.length === 0 && (
                    <p
                        className="
                            mb-3

                            text-[10px]
                            font-semibold
                            leading-5

                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Avval dasturlash tilini tanlang.
                        Shundan so‘ng mos texnologiyalar
                        ko‘rsatiladi.
                    </p>
                )}

                {/* =================================
                    TECHNOLOGY OPTIONS

                    compatibleTechnologies comes
                    from the parent useMemo.
                ================================== */}

                <div
                    role="group"
                    aria-labelledby="project-stack-technologies"
                    className="
                        flex
                        min-w-0
                        flex-wrap
                        gap-2
                    "
                >
                    {stackLoading ? (
                        <StackLoadingSkeleton
                            type="technology"
                        />
                    ) : (
                        safeTechnologies.map(
                            (technology, index) => {
                                // =========================
                                // CHECK SELECTED
                                // =========================

                                const active =
                                    safeTechnologyIds.includes(
                                        String(
                                            technology.id
                                        )
                                    );

                                // =========================
                                // TECHNOLOGY TAG
                                // =========================

                                return (
                                    <ProjectCreateStackTag
                                        key={
                                            technology.id ??
                                            `technology-${index}`
                                        }
                                        item={technology}
                                        active={active}
                                        showCategory
                                        disabled={
                                            technologyDisabled
                                        }
                                        onClick={() =>
                                            onTechnologyToggle?.(
                                                technology
                                            )
                                        }
                                    />
                                );
                            }
                        )
                    )}
                </div>

                {/* =================================
                    NO COMPATIBLE TECHNOLOGIES
                ================================== */}

                {!stackLoading &&
                    safeTechnologies.length === 0 && (
                        <p
                            className="
                                mt-3

                                text-xs
                                font-semibold
                                leading-5

                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Tanlangan tillar uchun mos
                            texnologiya topilmadi.
                        </p>
                    )}
            </div>
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProjectCreateStack);
