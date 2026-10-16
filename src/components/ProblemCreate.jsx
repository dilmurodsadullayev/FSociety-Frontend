
import React, { memo } from "react";

import { useParams } from "react-router-dom";

import {
    AlertTriangle,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";

// =========================================================
// EXISTING SHARED COMPONENTS
// =========================================================

import DeleteConfirmationModal
    from "./DeleteConfirmationModal";

import SiteAlert
    from "./SiteAlert";

// =========================================================
// PROBLEM CREATE MODULES
// =========================================================

import useProblemCreate
    from "./problem-create/useProblemCreate";

import ProblemCreateHeader
    from "./problem-create/ProblemCreateHeader";

import ProblemCreateFields
    from "./problem-create/ProblemCreateFields";

import ProblemCreatePriority
    from "./problem-create/ProblemCreatePriority";

import ProblemCreateCodeEditor
    from "./problem-create/ProblemCreateCodeEditor";

import ProblemCreateStack
    from "./problem-create/ProblemCreateStack";

import ProblemCreateSidebar
    from "./problem-create/ProblemCreateSidebar";

import ProblemCreateActions
    from "./problem-create/ProblemCreateActions";

import {
    toLocalDateTime,
} from "./problem-create/problemCreateHelpers";

// =========================================================
// SHARED STYLES
// =========================================================

const WINDOW_CLASS = `
    relative
    min-w-0
    overflow-hidden
    rounded-[24px]
    border
    border-slate-200
    bg-white/95
    shadow-[0_20px_60px_rgba(15,23,42,0.07)]
    backdrop-blur-sm

    sm:rounded-[30px]

    dark:border-white/10
    dark:bg-[#0e1421]/95
    dark:shadow-[0_25px_75px_rgba(0,0,0,0.22)]
`;

// =========================================================
// LOADING PLACEHOLDERS
// =========================================================

const SkeletonBlock = ({
    className = "",
}) => (
    <div
        aria-hidden="true"
        className={`
            rounded-lg
            bg-slate-200/90
            dark:bg-white/[0.07]
            ${className}
        `}
    />
);

// =========================================================
// EDIT LOADING
// =========================================================

const ProblemCreateLoading = memo(() => (
    <div
        role="status"
        aria-label="Muammo ma’lumotlari yuklanmoqda"
        className="
            animate-pulse p-5
            motion-reduce:animate-none
            sm:p-7
        "
    >
        <span className="sr-only">
            Muammo ma’lumotlari yuklanmoqda.
        </span>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-7">
                <div className="space-y-3">
                    <SkeletonBlock className="h-4 w-36 rounded-full" />
                    <SkeletonBlock className="h-12 w-full rounded-2xl" />
                </div>

                <div className="space-y-3">
                    <SkeletonBlock className="h-4 w-44 rounded-full" />
                    <SkeletonBlock className="h-28 w-full rounded-2xl" />
                </div>

                <div className="space-y-3">
                    <SkeletonBlock className="h-4 w-28 rounded-full" />

                    <div className="
                        space-y-4 rounded-2xl border
                        border-slate-200 bg-slate-50 p-5
                        dark:border-white/[0.07]
                        dark:bg-[#090f1b]
                    ">
                        <SkeletonBlock className="h-3 w-[46%]" />
                        <SkeletonBlock className="h-3 w-[78%]" />
                        <SkeletonBlock className="h-3 w-[67%]" />
                        <SkeletonBlock className="h-3 w-[54%]" />
                        <SkeletonBlock className="h-3 w-[82%]" />
                    </div>
                </div>

                <div className="space-y-3">
                    <SkeletonBlock className="h-4 w-40 rounded-full" />
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <SkeletonBlock
                                key={item}
                                className="h-9 w-24 rounded-full"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                    <SkeletonBlock className="h-11 w-32 rounded-xl" />
                    <SkeletonBlock className="h-11 w-36 rounded-xl" />
                </div>
            </div>

            <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="
                            space-y-3 rounded-2xl
                            border border-slate-200 p-5
                            dark:border-white/[0.08]
                        "
                    >
                        <SkeletonBlock className="h-10 w-10 rounded-xl" />
                        <SkeletonBlock className="h-4 w-36 rounded-full" />
                        <SkeletonBlock className="h-3 w-full rounded-full" />
                        <SkeletonBlock className="h-3 w-4/5 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    </div>
));

// =========================================================
// EDIT ERROR
// =========================================================

const ProblemCreateLoadError = memo(({
    message,
    onRetry,
    onBack,
}) => (
    <div
        role="alert"
        className="px-5 py-12 text-center sm:px-8"
    >
        <div className="
            mx-auto grid h-16 w-16 place-items-center
            rounded-2xl border border-rose-200
            bg-rose-50 text-rose-700
            dark:border-rose-400/20
            dark:bg-rose-400/[0.08]
            dark:text-rose-300
        ">
            <AlertTriangle size={27} aria-hidden="true" />
        </div>

        <h2 className="
            mt-5 text-xl font-black
            text-slate-900 dark:text-white
        ">
            Muammo ma’lumotlari yuklanmadi
        </h2>

        <p className="
            mx-auto mt-3 max-w-lg
            whitespace-pre-wrap break-words
            text-sm leading-6
            text-slate-600 dark:text-gray-400
        ">
            {message}
        </p>

        <div className="
            mt-6 flex flex-wrap justify-center gap-3
        ">
            <button
                type="button"
                onClick={onBack}
                className="
                    inline-flex min-h-11 items-center
                    gap-2 rounded-xl border
                    border-slate-200 bg-slate-50
                    px-4 text-xs font-bold
                    text-slate-700
                    dark:border-white/10
                    dark:bg-white/[0.04]
                    dark:text-gray-300
                "
            >
                <ArrowLeft size={16} aria-hidden="true" />
                Ortga qaytish
            </button>

            <button
                type="button"
                onClick={onRetry}
                className="
                    inline-flex min-h-11 items-center
                    gap-2 rounded-xl bg-cyan-600
                    px-4 text-xs font-bold text-white
                    hover:bg-cyan-700
                "
            >
                <RefreshCw size={16} aria-hidden="true" />
                Qayta urinish
            </button>
        </div>
    </div>
));

// =========================================================
// SUBMISSION ERROR
// =========================================================

const ProblemCreateSubmissionError = memo(({
    message,
}) => {
    if (!message) return null;

    return (
        <div
            role="alert"
            className="
                mb-7 overflow-hidden rounded-2xl
                border border-rose-200
                bg-rose-50
                dark:border-rose-400/25
                dark:bg-rose-400/[0.07]
            "
        >
            <div className="
                flex items-center gap-2
                border-b border-rose-200
                px-4 py-3
                dark:border-rose-400/15
            ">
                <AlertTriangle
                    size={16}
                    aria-hidden="true"
                    className="text-rose-700 dark:text-rose-300"
                />

                <h3 className="
                    font-mono text-xs font-black
                    uppercase tracking-wider
                    text-rose-800 dark:text-rose-200
                ">
                    Error detected
                </h3>
            </div>

            <pre className="
                max-h-64 overflow-auto
                whitespace-pre-wrap break-words
                p-4 font-mono text-xs leading-6
                text-rose-800 dark:text-rose-200
            ">
                {message}
            </pre>
        </div>
    );
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProblemCreate = () => {
    const { id } = useParams();

    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        isEdit,
        form,
        originalProblem,

        languageOptions,
        technologyOptions,
        languagesLoading,
        technologiesLoading,
        languagesError,
        technologiesError,

        selectedCodeLanguage,
        editorLanguage,

        detailLoading,
        detailError,
        fetchProblemDetail,

        submissionError,
        siteAlert,
        closeAlert,

        isSubmitting,
        isDeleting,
        isDeleteModalOpen,

        fetchLanguages,
        fetchTechnologies,

        handleFieldChange,
        handleUrgentChange,
        toggleLanguage,
        toggleTechnology,
        handleCodeLanguageChange,

        handleSubmit,
        handleCancel,
        openDeleteModal,
        closeDeleteModal,
        handleDeleteConfirm,
    } = useProblemCreate({ id });

    // =====================================================
    // DERIVED STATE
    // =====================================================

    const isBusy = isSubmitting || isDeleting;

    const originalDeadline = toLocalDateTime(
        originalProblem?.deadline
    );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <main className="
            relative isolate min-h-screen w-full
            min-w-0 overflow-x-clip

            bg-gradient-to-b
            from-slate-50 via-white to-slate-100

            px-3 py-8
            text-slate-900

            sm:px-6 sm:py-10
            lg:px-8

            dark:from-[#070b14]
            dark:via-[#080e19]
            dark:to-[#050816]
            dark:text-gray-100
        ">
            {/* ======================================
                BACKGROUND DECORATIONS
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-0
                    overflow-hidden
                "
            >
                <div className="
                    absolute -left-32 top-16
                    h-80 w-80 rounded-full
                    bg-cyan-500/[0.05] blur-[110px]
                    dark:bg-cyan-400/[0.06]
                " />

                <div className="
                    absolute -right-32 top-40
                    h-80 w-80 rounded-full
                    bg-indigo-500/[0.05] blur-[110px]
                    dark:bg-indigo-400/[0.07]
                " />

                <div className="
                    absolute bottom-0 left-1/2
                    h-72 w-72 -translate-x-1/2
                    rounded-full bg-fuchsia-500/[0.035]
                    blur-[100px]
                " />
            </div>

            {/* ======================================
                CONTENT CONTAINER
            ====================================== */}

            <div className="
                relative z-10 mx-auto w-full
                max-w-6xl min-w-0
            ">
                {/* HEADER */}

                <ProblemCreateHeader
                    isEdit={isEdit}
                    originalTitle={
                        originalProblem?.problem ||
                        originalProblem?.title ||
                        ""
                    }
                />

                {/* ==================================
                    MAIN WINDOW
                ================================== */}

                <div className={WINDOW_CLASS}>
                    {/* WINDOW TOP BAR */}

                    <div className="
                        flex items-center justify-between
                        gap-3 border-b border-slate-200
                        bg-slate-50/70 px-5 py-4
                        dark:border-white/10
                        dark:bg-white/[0.025]
                    ">
                        <div
                            aria-hidden="true"
                            className="flex items-center gap-2"
                        >
                            <span className="
                                h-2.5 w-2.5 rounded-full bg-rose-400
                            " />
                            <span className="
                                h-2.5 w-2.5 rounded-full bg-amber-400
                            " />
                            <span className="
                                h-2.5 w-2.5 rounded-full bg-emerald-400
                            " />
                        </div>

                        <p className="
                            font-mono text-[10px] font-black
                            uppercase tracking-[0.16em]
                            text-slate-500 dark:text-gray-400
                        ">
                            problem.form
                        </p>
                    </div>

                    {/* ==================================
                        EDIT INITIAL LOADING
                    ================================== */}

                    {detailLoading ? (
                        <ProblemCreateLoading />
                    ) : detailError ? (
                        /* ==============================
                            EDIT LOAD ERROR
                        ============================== */

                        <ProblemCreateLoadError
                            message={detailError}
                            onRetry={fetchProblemDetail}
                            onBack={handleCancel}
                        />
                    ) : (
                        /* ==============================
                            MAIN FORM AND SIDEBAR
                        ============================== */

                        <div className="
                            grid min-w-0
                            grid-cols-1 items-stretch
                            lg:grid-cols-[minmax(0,1fr)_320px]
                        ">
                            {/* ==========================
                                FORM COLUMN
                            ========================== */}

                            <div className="
                                min-w-0 p-4
                                sm:p-6 lg:p-8
                            ">
                                <ProblemCreateSubmissionError
                                    message={submissionError}
                                />

                                <form
                                    onSubmit={handleSubmit}
                                    aria-busy={isSubmitting}
                                    className="
                                        min-w-0 space-y-7
                                    "
                                >
                                    {/* BASIC FIELDS */}

                                    <ProblemCreateFields
                                        problemTitle={
                                            form.problemTitle
                                        }
                                        description={
                                            form.description
                                        }
                                        disabled={isBusy}
                                        onChange={handleFieldChange}
                                    />

                                    {/* URGENT SETTINGS */}

                                    <ProblemCreatePriority
                                        isUrgent={form.isUrgent}
                                        deadline={form.deadline}
                                        offeredCoins={form.offeredCoins}
                                        originalDeadline={
                                            originalDeadline
                                        }
                                        isEdit={isEdit}
                                        disabled={isBusy}
                                        onUrgentChange={
                                            handleUrgentChange
                                        }
                                        onChange={handleFieldChange}
                                    />

                                    {/* CODE EDITOR */}

                                    <ProblemCreateCodeEditor
                                        codeSnippet={
                                            form.codeSnippet
                                        }
                                        codeLanguageId={
                                            form.codeLanguageId
                                        }
                                        languageOptions={
                                            languageOptions
                                        }
                                        selectedLanguages={
                                            form.selectedLanguages
                                        }
                                        selectedCodeLanguage={
                                            selectedCodeLanguage
                                        }
                                        editorLanguage={
                                            editorLanguage
                                        }
                                        disabled={isBusy}
                                        onChange={handleFieldChange}
                                        onLanguageChange={
                                            handleCodeLanguageChange
                                        }
                                    />

                                    {/* LANGUAGE / TECHNOLOGY TAGS */}

                                    <ProblemCreateStack
                                        languageOptions={
                                            languageOptions
                                        }
                                        technologyOptions={
                                            technologyOptions
                                        }
                                        selectedLanguages={
                                            form.selectedLanguages
                                        }
                                        selectedTechnologies={
                                            form.selectedTechnologies
                                        }
                                        codeLanguageId={
                                            form.codeLanguageId
                                        }
                                        languagesLoading={
                                            languagesLoading
                                        }
                                        technologiesLoading={
                                            technologiesLoading
                                        }
                                        languagesError={
                                            languagesError
                                        }
                                        technologiesError={
                                            technologiesError
                                        }
                                        disabled={isBusy}
                                        onToggleLanguage={
                                            toggleLanguage
                                        }
                                        onToggleTechnology={
                                            toggleTechnology
                                        }
                                        onRetryLanguages={
                                            fetchLanguages
                                        }
                                        onRetryTechnologies={
                                            fetchTechnologies
                                        }
                                    />

                                    {/* FORM ACTIONS */}

                                    <ProblemCreateActions
                                        isEdit={isEdit}
                                        isSubmitting={
                                            isSubmitting
                                        }
                                        isDeleting={isDeleting}
                                        onCancel={handleCancel}
                                        onDelete={openDeleteModal}
                                    />
                                </form>
                            </div>

                            {/* ==========================
                                SIDEBAR
                            ========================== */}

                            <ProblemCreateSidebar
                                form={form}
                                isEdit={isEdit}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* ======================================
                DELETE CONFIRMATION MODAL

                Existing shared component remains.
            ====================================== */}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                itemTitle={
                    form.problemTitle ||
                    originalProblem?.problem ||
                    "ushbu muammoni"
                }
                isProcessing={isDeleting}
            />

            {/* ======================================
                SITE ALERT

                Existing alert contract preserved.
            ====================================== */}

            <SiteAlert
                alert={siteAlert}
                onClose={closeAlert}
            />
        </main>
    );
};

export default ProblemCreate;
