
import React from "react";

// =========================================================
// SHARED COMPONENTS
// =========================================================

import SimilarProblems from "../SimilarProblems";

import DeleteConfirmationModal from "../DeleteConfirmationModal";

// =========================================================
// PROBLEM DETAIL COMPONENTS
// =========================================================

import ProblemDetailHeader from "./ProblemDetailHeader";

import ProblemDetailPriority from "./ProblemDetailPriority";

import ProblemDetailContent from "./ProblemDetailContent";

import ProblemDetailSolutions from "./ProblemDetailSolutions";

import AcceptSolutionModal from "./AcceptSolutionModal";

// =========================================================
// FSOCIETY — PROBLEM DETAIL LAYOUT
//
// Responsibilities:
// - Main page layout
// - Problem details surface
// - Solutions placement
// - Similar problems sidebar
// - Delete confirmation modal
// - Accept solution modal
//
// Features:
// - Light / Dark Mode
// - Mobile-first layout
// - Responsive main/sidebar columns
// - Sticky sidebar on wide screens
// - Accessible sections
// - Decorative background effects
//
// No direct API calls.
// No Redux logic.
// Existing props and callbacks preserved.
// =========================================================

const ProblemDetailLayout = ({
    // =====================================================
    // PROBLEM
    // =====================================================

    problemId,

    problemDetail,

    problemLanguages = [],
    problemTechnologies = [],

    responseCount = 0,
    responsesRefreshKey = 0,

    // =====================================================
    // DERIVED STATE
    // =====================================================

    isOwner = false,
    isSolved = false,
    hasStarredProblem = false,

    // =====================================================
    // LOADING
    // =====================================================

    starIsLoading = false,
    isDeleting = false,
    acceptSolutionIsLoading = false,

    // =====================================================
    // MODALS
    // =====================================================

    isDeleteModalOpen = false,
    isAcceptModalOpen = false,

    // =====================================================
    // REFS
    // =====================================================

    responsesSectionRef,
    responseFormRef,

    // =====================================================
    // OWNER ACTIONS
    // =====================================================

    onEdit,
    onOpenDelete,
    onCloseDelete,
    onConfirmDelete,

    // =====================================================
    // STAR ACTIONS
    // =====================================================

    onAddStar,
    onRemoveStar,

    // =====================================================
    // SOLUTION ACTIONS
    // =====================================================

    onWork,
    onSolutionCreated,
    onAcceptSolution,
    onCloseAccept,
    onConfirmAccept,
}) => {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const safeLanguages = Array.isArray(
        problemLanguages
    )
        ? problemLanguages
        : [];

    const safeTechnologies = Array.isArray(
        problemTechnologies
    )
        ? problemTechnologies
        : [];

    const problemTitle =
        typeof problemDetail?.problem === "string" &&
        problemDetail.problem.trim()
            ? problemDetail.problem.trim()
            : "Muammo";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <>
            {/* ==========================================
                PAGE ROOT
            ========================================== */}

            <main
                id="problem-detail-page"
                className="
                    relative
                    isolate

                    min-h-screen
                    w-full
                    min-w-0

                    bg-gradient-to-b
                    from-slate-50
                    via-white
                    to-slate-100

                    font-sans
                    text-slate-900

                    dark:from-[#070b14]
                    dark:via-[#080e19]
                    dark:to-[#050816]
                    dark:text-gray-100
                "
            >
                {/* ======================================
                    DECORATIVE BACKGROUND

                    Overflow is clipped here only,
                    NOT on main.

                    This avoids creating an overflow
                    ancestor that can interfere with
                    the sticky sidebar.
                ====================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        inset-0

                        z-0

                        overflow-hidden
                    "
                >
                    {/* ==============================
                        GRID PATTERN
                    ============================== */}

                    <div
                        className="
                            absolute
                            inset-0

                            opacity-60

                            bg-[linear-gradient(rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.025)_1px,transparent_1px)]

                            bg-[size:64px_64px]

                            [mask-image:radial-gradient(ellipse_at_top,black_0%,transparent_80%)]

                            dark:opacity-100

                            dark:bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)]
                        "
                    />

                    {/* ==============================
                        CYAN GLOW
                    ============================== */}

                    <div
                        className="
                            absolute
                            -left-40
                            top-16

                            h-[360px]
                            w-[360px]

                            rounded-full

                            bg-cyan-500/[0.045]

                            blur-[100px]

                            sm:h-[440px]
                            sm:w-[440px]

                            dark:bg-cyan-500/[0.065]
                        "
                    />

                    {/* ==============================
                        INDIGO GLOW
                    ============================== */}

                    <div
                        className="
                            absolute
                            -right-40
                            top-[32%]

                            h-[400px]
                            w-[400px]

                            rounded-full

                            bg-indigo-500/[0.045]

                            blur-[110px]

                            dark:bg-indigo-500/[0.075]
                        "
                    />

                    {/* ==============================
                        BOTTOM GLOW
                    ============================== */}

                    <div
                        className="
                            absolute
                            bottom-0
                            left-1/2

                            h-[300px]
                            w-[600px]

                            -translate-x-1/2

                            rounded-full

                            bg-purple-500/[0.025]

                            blur-[120px]

                            dark:bg-purple-500/[0.04]
                        "
                    />
                </div>

                {/* ======================================
                    PAGE CONTAINER
                ====================================== */}

                <div
                    className="
                        relative
                        z-10

                        mx-auto

                        w-full
                        max-w-[1500px]
                        min-w-0

                        px-3
                        py-6

                        sm:px-5
                        sm:py-8

                        md:px-6

                        lg:px-8
                        lg:py-10

                        xl:py-12
                    "
                >
                    {/* ==================================
                        PAGE GRID

                        Below XL:
                        Single column for better
                        content readability.

                        XL and above:
                        Main 8 / Sidebar 4.
                    ================================== */}

                    <div
                        className="
                            grid
                            w-full
                            min-w-0

                            grid-cols-1
                            items-start

                            gap-6

                            sm:gap-8

                            xl:grid-cols-12
                            xl:gap-8

                            2xl:gap-10
                        "
                    >
                        {/* ==============================
                            MAIN COLUMN
                        ============================== */}

                        <div
                            className="
                                flex
                                min-w-0

                                flex-col
                                gap-6

                                sm:gap-8

                                xl:col-span-8
                            "
                        >
                            {/* ==========================
                                PROBLEM DETAILS CARD
                            ========================== */}

                            <section
                                aria-label="Muammo tafsilotlari"
                                className="
                                    relative

                                    w-full
                                    min-w-0

                                    overflow-hidden

                                    rounded-[22px]

                                    border
                                    border-slate-200

                                    bg-white/95

                                    p-4

                                    shadow-[0_16px_45px_rgba(15,23,42,0.055)]

                                    backdrop-blur-sm

                                    sm:rounded-[28px]
                                    sm:p-6

                                    lg:p-7

                                    2xl:p-8

                                    dark:border-white/[0.09]
                                    dark:bg-[#0e1421]/95

                                    dark:shadow-[0_22px_65px_rgba(0,0,0,0.24)]
                                "
                            >
                                {/* ======================
                                    TOP ACCENT
                                ====================== */}

                                <div
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none

                                        absolute
                                        inset-x-0
                                        top-0

                                        h-[2px]

                                        bg-gradient-to-r
                                        from-cyan-500/70
                                        via-indigo-500/60
                                        to-transparent

                                        dark:from-cyan-400/65
                                        dark:via-indigo-400/50
                                    "
                                />

                                {/* ======================
                                    CARD DECORATIONS
                                ====================== */}

                                <div
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none

                                        absolute
                                        -right-28
                                        -top-28

                                        h-64
                                        w-64

                                        rounded-full

                                        bg-cyan-500/[0.045]

                                        blur-[90px]

                                        dark:bg-cyan-400/[0.075]
                                    "
                                />

                                <div
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none

                                        absolute
                                        -bottom-28
                                        -left-28

                                        h-64
                                        w-64

                                        rounded-full

                                        bg-indigo-500/[0.04]

                                        blur-[90px]

                                        dark:bg-indigo-400/[0.065]
                                    "
                                />

                                {/* ======================
                                    CARD CONTENT
                                ====================== */}

                                <div
                                    className="
                                        relative
                                        z-10

                                        w-full
                                        min-w-0
                                    "
                                >
                                    {/* HEADER */}

                                    <ProblemDetailHeader
                                        problemDetail={
                                            problemDetail
                                        }

                                        problemLanguages={
                                            safeLanguages
                                        }

                                        responseCount={
                                            responseCount
                                        }

                                        isOwner={
                                            isOwner
                                        }

                                        isDeleting={
                                            isDeleting
                                        }

                                        onEdit={
                                            onEdit
                                        }

                                        onDelete={
                                            onOpenDelete
                                        }
                                    />

                                    {/* PRIORITY */}

                                    <ProblemDetailPriority
                                        problemDetail={
                                            problemDetail
                                        }

                                        isSolved={
                                            isSolved
                                        }

                                        onWork={
                                            onWork
                                        }
                                    />

                                    {/* DESCRIPTION / CODE */}

                                    <ProblemDetailContent
                                        problemDetail={
                                            problemDetail
                                        }

                                        problemTechnologies={
                                            safeTechnologies
                                        }

                                        hasStarredProblem={
                                            hasStarredProblem
                                        }

                                        isStarLoading={
                                            starIsLoading
                                        }

                                        onAddStar={
                                            onAddStar
                                        }

                                        onRemoveStar={
                                            onRemoveStar
                                        }
                                    />
                                </div>
                            </section>

                            {/* ==========================
                                SOLUTIONS SECTION
                            ========================== */}

                            <section
                                aria-label="Muammo yechimlari"
                                className="
                                    w-full
                                    min-w-0
                                "
                            >
                                <ProblemDetailSolutions
                                    problemId={
                                        problemId
                                    }

                                    responseCount={
                                        responseCount
                                    }

                                    responsesRefreshKey={
                                        responsesRefreshKey
                                    }

                                    problemLanguages={
                                        safeLanguages
                                    }

                                    isOwner={
                                        isOwner
                                    }

                                    isSolved={
                                        isSolved
                                    }

                                    responsesSectionRef={
                                        responsesSectionRef
                                    }

                                    responseFormRef={
                                        responseFormRef
                                    }

                                    onWork={
                                        onWork
                                    }

                                    onSolutionCreated={
                                        onSolutionCreated
                                    }

                                    onAcceptSolution={
                                        onAcceptSolution
                                    }
                                />
                            </section>
                        </div>

                        {/* ==============================
                            SIDEBAR
                        ============================== */}

                        <aside
                            aria-label="O‘xshash muammolar"
                            className="
                                w-full
                                min-w-0

                                xl:col-span-4
                            "
                        >
                            {/* ======================
                                STICKY CONTAINER

                                Sticky only on wide
                                screens to prevent
                                narrow two-column UI.
                            ====================== */}

                            <div
                                className="
                                    w-full
                                    min-w-0

                                    xl:sticky
                                    xl:top-24
                                "
                            >
                                <SimilarProblems
                                    problemId={
                                        problemId
                                    }
                                />
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* ==========================================
                DELETE CONFIRMATION MODAL

                Preserve owner permission and
                original callback contract.
            ========================================== */}

            {isOwner && (
                <DeleteConfirmationModal
                    isOpen={
                        isDeleteModalOpen
                    }

                    onClose={
                        onCloseDelete
                    }

                    onConfirm={
                        onConfirmDelete
                    }

                    itemTitle={
                        problemTitle
                    }

                    isProcessing={
                        isDeleting
                    }
                />
            )}

            {/* ==========================================
                ACCEPT SOLUTION MODAL

                Existing props preserved.
            ========================================== */}

            <AcceptSolutionModal
                isOpen={
                    isAcceptModalOpen
                }

                onClose={
                    onCloseAccept
                }

                onConfirm={
                    onConfirmAccept
                }

                isProcessing={
                    acceptSolutionIsLoading
                }
            />
        </>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(ProblemDetailLayout);
