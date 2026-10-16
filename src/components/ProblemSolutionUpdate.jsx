
import React from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import DeleteConfirmationModal
    from "./DeleteConfirmationModal";

// =========================================================
// SOLUTION UPDATE MODULES
// =========================================================

import ProblemSolutionUpdateHeader
    from "./problem-solution-update/ProblemSolutionUpdateHeader";

import ProblemSolutionUpdateFields
    from "./problem-solution-update/ProblemSolutionUpdateFields";

import ProblemSolutionUpdateEditor
    from "./problem-solution-update/ProblemSolutionUpdateEditor";

import ProblemSolutionUpdateActions
    from "./problem-solution-update/ProblemSolutionUpdateActions";

import {
    ProblemSolutionUpdateLoading,
    ProblemSolutionUpdateError,
} from "./problem-solution-update/ProblemSolutionUpdateStates";

import useProblemSolutionUpdate
    from "./problem-solution-update/useProblemSolutionUpdate";

// =========================================================
// FSOCIETY — PROBLEM SOLUTION UPDATE PAGE
//
// Responsibilities:
// - Read route parameters
// - Connect update hook to UI
// - Render loading / error / form
// - Render delete confirmation
//
// Business logic is in useProblemSolutionUpdate.
// Prism logic is in solutionUpdatePrism.
// =========================================================

const ProblemSolutionUpdate = () => {
    // =====================================================
    // ROUTER
    // =====================================================

    const {
        id: problemId,
        solutionId,
    } = useParams();

    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        form,
        formError,

        loading,
        error,

        isUpdating,
        isDeleting,
        isDeleteModalOpen,

        prismLanguageName,
        problemUrl,

        fetchSolution,
        updateField,

        handleUpdate,
        handleCancel,

        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleDeleteConfirm,
    } = useProblemSolutionUpdate({
        problemId,
        solutionId,
    });

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return <ProblemSolutionUpdateLoading />;
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <ProblemSolutionUpdateError
                message={error}
                onRetry={fetchSolution}
                onBack={handleCancel}
            />
        );
    }

    // =====================================================
    // FORM STATE
    // =====================================================

    const isBusy =
        isUpdating ||
        isDeleting;

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <main
            className="
                relative
                isolate
                min-h-screen
                w-full
                min-w-0
                overflow-x-clip

                bg-gradient-to-b
                from-slate-50
                via-white
                to-slate-100

                text-slate-900

                dark:from-[#070b14]
                dark:via-[#080e19]
                dark:to-[#050816]
                dark:text-gray-100
            "
        >
            {/* BACKGROUND */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        -left-32
                        top-20
                        h-72
                        w-72
                        rounded-full
                        bg-cyan-500/[0.05]
                        blur-[100px]

                        dark:bg-cyan-400/[0.06]
                    "
                />

                <div
                    className="
                        absolute
                        -right-32
                        top-[35%]
                        h-72
                        w-72
                        rounded-full
                        bg-indigo-500/[0.05]
                        blur-[100px]

                        dark:bg-indigo-400/[0.06]
                    "
                />
            </div>

            {/* PAGE CONTAINER */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    w-full
                    max-w-5xl
                    min-w-0

                    px-3
                    py-7

                    sm:px-6
                    sm:py-10

                    lg:px-8
                "
            >
                {/* TOP NAVIGATION */}

                <ProblemSolutionUpdateHeader
                    solutionId={solutionId}
                    languageName={form.languageName}
                    onBack={handleCancel}
                    disabled={isBusy}
                />

                {/* MAIN CARD */}

                <section
                    aria-label="Yechimni tahrirlash formasi"
                    className="
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

                        dark:border-white/[0.09]
                        dark:bg-[#0e1421]/95
                        dark:shadow-[0_25px_75px_rgba(0,0,0,0.22)]
                    "
                >
                    {/* TOP ACCENT */}

                    <div
                        aria-hidden="true"
                        className="
                            absolute
                            inset-x-0
                            top-0
                            h-[2px]

                            bg-gradient-to-r
                            from-cyan-500
                            via-indigo-500/70
                            to-transparent
                        "
                    />

                    {/* EDIT FORM */}

                    <form
                        onSubmit={handleUpdate}
                        className="
                            relative
                            z-10
                            min-w-0

                            p-4
                            sm:p-6
                            lg:p-7
                        "
                    >
                        <div className="space-y-7">
                            {/* TEXT FIELDS */}

                            <ProblemSolutionUpdateFields
                                answer={form.answer}
                                description={form.description}
                                error={formError}
                                disabled={isBusy}
                                onChange={updateField}
                            />

                            {/* CODE EDITOR */}

                            <ProblemSolutionUpdateEditor
                                code={form.code}
                                languageName={form.languageName}
                                prismLanguageName={
                                    prismLanguageName
                                }
                                disabled={isBusy}
                                onChange={updateField}
                            />
                        </div>

                        {/* ACTION BUTTONS */}

                        <ProblemSolutionUpdateActions
                            isUpdating={isUpdating}
                            isDeleting={isDeleting}
                            onDelete={
                                handleOpenDeleteModal
                            }
                            onCancel={handleCancel}
                        />
                    </form>
                </section>

                {/* BOTTOM NAVIGATION */}

                <div
                    className="
                        mt-5
                        text-center
                    "
                >
                    <Link
                        to={problemUrl || "/problems"}
                        aria-label="Muammo sahifasiga qaytish"
                        className="
                            text-xs
                            font-medium
                            text-slate-500

                            transition-colors

                            hover:text-cyan-700

                            dark:text-gray-400
                            dark:hover:text-cyan-300
                        "
                    >
                        Muammo sahifasiga qaytish
                    </Link>
                </div>
            </div>

            {/* DELETE CONFIRMATION */}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteConfirm}
                itemTitle={
                    form.answer ||
                    "Bu yechim"
                }
                isProcessing={isDeleting}
            />
        </main>
    );
};

export default ProblemSolutionUpdate;
