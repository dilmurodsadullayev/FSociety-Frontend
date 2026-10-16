
import React, { memo } from "react";

import {
    AlertTriangle,
} from "lucide-react";

// =========================================================
// FORM MODULES
// =========================================================

import ProblemSolutionFields
    from "./ProblemSolutionFields";

import ProblemSolutionLanguage
    from "./ProblemSolutionLanguage";

import ProblemSolutionEditor
    from "./ProblemSolutionEditor";

import ProblemSolutionProgress
    from "./ProblemSolutionProgress";

import ProblemSolutionFormFooter
    from "./ProblemSolutionFormFooter";

import useProblemSolutionForm
    from "./useProblemSolutionForm";

// =========================================================
// FSOCIETY — PROBLEM SOLUTION FORM
//
// Public props preserved:
// - id
// - problemLanguages
// - onSuccess
//
// Responsibilities:
// - Connect form hook to visual components
// - Render fields, language selector and editor
// - Show form error
// - Render responsive progress
// - Render submit action
//
// API and validation live in the hook.
// =========================================================

const ProblemSolutionForm = ({
    id,
    problemLanguages = [],
    onSuccess,
}) => {
    // =====================================================
    // FORM CONTROLLER
    // =====================================================

    const {
        shortInfo,
        description,
        code,

        languageOptions,
        selectedLanguage,
        languageSearch,
        filteredLanguages,
        isLanguagesLoading,
        languageError,

        editorLanguage,
        editorFileName,

        formStatus,
        formError,
        isSubmitting,

        fetchLanguages,
        handleFieldChange,
        handleLanguageSearch,
        handleLanguageSelect,
        handleClearCode,
        handleSubmit,
    } = useProblemSolutionForm({
        id,
        problemLanguages,
        onSuccess,
    });

    // =====================================================
    // JSX
    // =====================================================

    return (
        <form
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
            className="
                w-full
                min-w-0
            "
        >
            {/* ==========================================
                RESPONSIVE FORM GRID
            ========================================== */}

            <div
                className="
                    grid
                    min-w-0
                    grid-cols-1
                    items-start
                    gap-6

                    xl:grid-cols-[minmax(0,1fr)_260px]
                "
            >
                {/* ======================================
                    MAIN FIELDS
                ====================================== */}

                <div
                    className="
                        min-w-0
                        space-y-6
                    "
                >
                    {/* SHORT ANSWER + DESCRIPTION */}

                    <ProblemSolutionFields
                        shortInfo={shortInfo}
                        description={description}
                        disabled={isSubmitting}
                        onChange={handleFieldChange}
                    />

                    {/* LANGUAGE SELECTOR */}

                    <ProblemSolutionLanguage
                        languageOptions={languageOptions}
                        filteredLanguages={filteredLanguages}
                        selectedLanguage={selectedLanguage}
                        languageSearch={languageSearch}
                        isLanguagesLoading={isLanguagesLoading}
                        languageError={languageError}
                        isSubmitting={isSubmitting}
                        onSearchChange={handleLanguageSearch}
                        onSelect={handleLanguageSelect}
                        onRetry={fetchLanguages}
                    />

                    {/* CODE EDITOR */}

                    <ProblemSolutionEditor
                        code={code}
                        selectedLanguage={selectedLanguage}
                        editorLanguage={editorLanguage}
                        editorFileName={editorFileName}
                        isSubmitting={isSubmitting}
                        onChange={handleFieldChange}
                        onClear={handleClearCode}
                    />

                    {/* FORM ERROR */}

                    {formError && (
                        <div
                            role="alert"
                            className="
                                flex
                                min-w-0
                                items-start
                                gap-3

                                rounded-2xl
                                border
                                border-rose-200
                                bg-rose-50
                                p-4

                                dark:border-rose-400/20
                                dark:bg-rose-400/[0.055]
                            "
                        >
                            <span
                                aria-hidden="true"
                                className="
                                    grid
                                    h-9
                                    w-9
                                    shrink-0
                                    place-items-center
                                    rounded-xl
                                    bg-rose-100
                                    text-rose-700

                                    dark:bg-rose-400/[0.09]
                                    dark:text-rose-300
                                "
                            >
                                <AlertTriangle size={17} />
                            </span>

                            <div className="min-w-0">
                                <p
                                    className="
                                        text-xs
                                        font-black
                                        text-rose-800

                                        dark:text-rose-200
                                    "
                                >
                                    Yechim yuborilmadi
                                </p>

                                <p
                                    className="
                                        mt-1
                                        break-words
                                        text-xs
                                        font-medium
                                        leading-6
                                        text-rose-700

                                        dark:text-rose-200/80
                                    "
                                >
                                    {formError}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ======================================
                    DESKTOP PROGRESS SIDEBAR
                ====================================== */}

                <aside
                    aria-label="Yechimning tayyorlik holati"
                    className="
                        hidden
                        min-w-0

                        xl:block
                    "
                >
                    <div className="sticky top-24">
                        <ProblemSolutionProgress
                            formStatus={formStatus}
                            selectedLanguage={selectedLanguage}
                            editorLanguage={editorLanguage}
                            editorFileName={editorFileName}
                        />
                    </div>
                </aside>
            </div>

            {/* ==========================================
                MOBILE / TABLET PROGRESS
            ========================================== */}

            <div className="mt-6 xl:hidden">
                <ProblemSolutionProgress
                    formStatus={formStatus}
                    compact
                />
            </div>

            {/* ==========================================
                SUBMIT FOOTER
            ========================================== */}

            <ProblemSolutionFormFooter
                isSubmitting={isSubmitting}
                isLanguagesLoading={isLanguagesLoading}
            />
        </form>
    );
};

export default memo(ProblemSolutionForm);
