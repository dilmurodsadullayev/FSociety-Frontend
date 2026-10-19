
// src/components/projects/create/ProjectCreateStack.jsx

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
// Displayed instead of tags while the catalog loads.
// This is presentation only; request logic stays in the
// parent ProjectFormModal.
// =========================================================

const StackLoadingSkeleton = memo(
    function StackLoadingSkeleton({ type = "language" }) {
        return (
            <div
                role="status"
                aria-label={
                    type === "technology"
                        ? "Texnologiyalar yuklanmoqda"
                        : "Dasturlash tillari yuklanmoqda"
                }
                className="flex w-full min-w-0 flex-wrap gap-2"
            >
                {Array.from(
                    { length: SKELETON_COUNT },
                    (_, index) => (
                        <span
                            key={index}
                            aria-hidden="true"
                            className={`
                                h-10 max-w-full animate-pulse rounded-full
                                bg-slate-200 dark:bg-white/[0.06]
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
// Shared by languages and technologies.
// =========================================================

const StackSectionHeading = memo(
    function StackSectionHeading({
        title,
        count = 0,
        Icon,
        variant = "language",
        id,
    }) {
        const isLanguage = variant === "language";

        return (
            <div
                className="
                    mb-3 flex min-w-0 flex-wrap
                    items-center justify-between gap-2 sm:gap-3
                "
            >
                <div className="flex min-w-0 items-center gap-2">
                    <Icon
                        size={15}
                        aria-hidden="true"
                        className={`shrink-0 ${
                            isLanguage
                                ? "text-blue-600 dark:text-blue-300"
                                : "text-purple-600 dark:text-purple-300"
                        }`}
                    />

                    <span
                        id={id}
                        className="
                            min-w-0 break-words text-xs font-black
                            leading-5 text-slate-700 dark:text-slate-300
                        "
                    >
                        {title}
                    </span>

                    <span
                        aria-hidden="true"
                        className="shrink-0 text-red-500 dark:text-red-400"
                    >
                        *
                    </span>
                </div>

                {count > 0 && (
                    <span
                        className={`
                            inline-flex shrink-0 items-center rounded-full border
                            px-2 py-0.5 text-[10px] font-black tabular-nums
                            ${
                                isLanguage
                                    ? `
                                        border-blue-200 bg-blue-50 text-blue-700
                                        dark:border-blue-400/15 dark:bg-blue-500/[0.05]
                                        dark:text-blue-300
                                    `
                                    : `
                                        border-purple-200 bg-purple-50 text-purple-700
                                        dark:border-purple-400/15 dark:bg-purple-500/[0.05]
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
// Existing props:
// - languages
// - compatibleTechnologies
// - selectedLanguageIds
// - selectedTechnologyIds
// - stackLoading
// - stackError
// - isSubmitting
// - onLanguageToggle(language)
// - onTechnologyToggle(technology)
//
// All compatibility and selection logic stays in
// ProjectFormModal. This component never mutates IDs.
//
// Responsive:
// - Compact card padding on phones
// - Wrapping tags without forcing horizontal scrolling
// - Text and error messages wrap on narrow screens
// - Touch-friendly loading skeletons
// - Light / Dark Mode
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

    const safeLanguages = Array.isArray(languages)
        ? languages
        : EMPTY_ARRAY;

    const safeTechnologies = Array.isArray(compatibleTechnologies)
        ? compatibleTechnologies
        : EMPTY_ARRAY;

    // =====================================================
    // SELECTED IDS
    //
    // Backend IDs may be numbers or strings. Normalize
    // them for reliable selection checks.
    // =====================================================

    const safeLanguageIds = Array.isArray(selectedLanguageIds)
        ? selectedLanguageIds.map(String)
        : EMPTY_ARRAY;

    const safeTechnologyIds = Array.isArray(selectedTechnologyIds)
        ? selectedTechnologyIds.map(String)
        : EMPTY_ARRAY;

    const selectedLanguageSet = new Set(safeLanguageIds);
    const selectedTechnologySet = new Set(safeTechnologyIds);

    // =====================================================
    // DISABLED STATES
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
            aria-busy={stackLoading}
            className="
                w-full min-w-0 max-w-full overflow-hidden
                rounded-2xl border border-slate-200 bg-slate-50/70
                p-3.5 dark:border-white/[0.08] dark:bg-white/[0.025]
                min-[380px]:p-4 sm:rounded-[24px] sm:p-5
            "
        >
            {/* =============================================
                SECTION HEADER
            ============================================== */}

            <div className="mb-5 flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                        aria-hidden="true"
                        className="
                            grid h-9 w-9 shrink-0 place-items-center
                            rounded-xl border border-purple-200 bg-purple-50
                            text-purple-700 dark:border-purple-400/15
                            dark:bg-purple-500/[0.06] dark:text-purple-300
                        "
                    >
                        <Braces size={17} />
                    </span>

                    <div className="min-w-0 flex-1">
                        <h3
                            className="
                                break-words text-sm font-black
                                text-slate-900 dark:text-white
                            "
                        >
                            Texnologik stack
                        </h3>

                        <p
                            className="
                                mt-0.5 break-words text-[11px]
                                font-medium leading-5 text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Bir nechta til va texnologiyani
                            tanlashingiz mumkin
                        </p>
                    </div>
                </div>

                {stackLoading && (
                    <Loader2
                        size={18}
                        aria-label="Stack yuklanmoqda"
                        className="
                            shrink-0 animate-spin text-purple-600
                            dark:text-purple-300 motion-reduce:animate-none
                        "
                    />
                )}
            </div>

            {/* =============================================
                CATALOG ERROR
            ============================================== */}

            {stackError && (
                <div
                    role="alert"
                    className="
                        mb-5 min-w-0 rounded-xl border border-red-200
                        bg-red-50 p-3 text-xs font-semibold leading-5
                        text-red-700 dark:border-red-400/15
                        dark:bg-red-500/[0.05] dark:text-red-300
                    "
                >
                    <p className="break-words [overflow-wrap:anywhere]">
                        {stackError}
                    </p>
                </div>
            )}

            {/* =============================================
                LANGUAGES
            ============================================== */}

            <div className="w-full min-w-0">
                <StackSectionHeading
                    id="project-stack-languages"
                    title="Dasturlash tillari"
                    count={safeLanguageIds.length}
                    Icon={Code2}
                    variant="language"
                />

                <div
                    role="group"
                    aria-labelledby="project-stack-languages"
                    className="
                        flex w-full min-w-0 max-w-full flex-wrap
                        items-start gap-2
                        [&>*]:max-w-full
                    "
                >
                    {stackLoading ? (
                        <StackLoadingSkeleton type="language" />
                    ) : (
                        safeLanguages.map((language, index) => {
                            const active = selectedLanguageSet.has(
                                String(language?.id)
                            );

                            return (
                                <ProjectCreateStackTag
                                    key={
                                        language?.id ??
                                        `language-${index}`
                                    }
                                    item={language}
                                    active={active}
                                    disabled={languageDisabled}
                                    onClick={() =>
                                        onLanguageToggle?.(language)
                                    }
                                />
                            );
                        })
                    )}
                </div>

                {!stackLoading && safeLanguages.length === 0 && (
                    <p
                        className="
                            mt-3 break-words text-xs font-semibold
                            leading-5 text-slate-500 dark:text-slate-400
                        "
                    >
                        Dasturlash tillari topilmadi.
                    </p>
                )}
            </div>

            {/* =============================================
                DIVIDER
            ============================================== */}

            <div
                aria-hidden="true"
                className="
                    my-5 h-px w-full bg-slate-200
                    dark:bg-white/[0.08]
                "
            />

            {/* =============================================
                TECHNOLOGIES
            ============================================== */}

            <div className="w-full min-w-0">
                <StackSectionHeading
                    id="project-stack-technologies"
                    title="Texnologiyalar"
                    count={safeTechnologyIds.length}
                    Icon={Layers3}
                    variant="technology"
                />

                {safeLanguageIds.length === 0 && (
                    <p
                        className="
                            mb-3 break-words text-[11px] font-semibold
                            leading-5 text-slate-500 dark:text-slate-400
                        "
                    >
                        Avval dasturlash tilini tanlang.
                        Shundan so‘ng mos texnologiyalar
                        ko‘rsatiladi.
                    </p>
                )}

                <div
                    role="group"
                    aria-labelledby="project-stack-technologies"
                    className="
                        flex w-full min-w-0 max-w-full flex-wrap
                        items-start gap-2
                        [&>*]:max-w-full
                    "
                >
                    {stackLoading ? (
                        <StackLoadingSkeleton type="technology" />
                    ) : (
                        safeTechnologies.map((technology, index) => {
                            const active = selectedTechnologySet.has(
                                String(technology?.id)
                            );

                            return (
                                <ProjectCreateStackTag
                                    key={
                                        technology?.id ??
                                        `technology-${index}`
                                    }
                                    item={technology}
                                    active={active}
                                    showCategory
                                    disabled={technologyDisabled}
                                    onClick={() =>
                                        onTechnologyToggle?.(technology)
                                    }
                                />
                            );
                        })
                    )}
                </div>

                {!stackLoading && safeTechnologies.length === 0 && (
                    <p
                        className="
                            mt-3 break-words text-xs font-semibold
                            leading-5 text-slate-500 dark:text-slate-400
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
