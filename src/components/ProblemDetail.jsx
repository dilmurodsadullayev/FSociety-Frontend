
import React, { useMemo } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";


// =========================================================
// FSOCIETY — PROBLEM DETAIL COMPONENTS
// =========================================================

// New skeleton loading component

import ProblemDetailSkeleton
    from "./problem-detail/ProblemDetailSkeleton";

// Error and retry states

import ProblemDetailState
    from "./problem-detail/ProblemDetailState";

// Main detail layout

import ProblemDetailLayout
    from "./problem-detail/ProblemDetailLayout";


// =========================================================
// HOOKS
// =========================================================

import useProblemDetail
    from "./problem-detail/useProblemDetail";

import useProblemDetailActions
    from "./problem-detail/useProblemDetailActions";

import useProblemDetailSolutions
    from "./problem-detail/useProblemDetailSolutions";


// =========================================================
// HELPERS
// =========================================================

import {
    getProblemDetailViewModel,
} from "./problem-detail/problemDetailHelpers";


// =========================================================
// FSOCIETY — GLOBAL DETAIL PAGE BACKGROUND
//
// Global Winter Background is managed in App.jsx.
//
// This wrapper:
// - Keeps the global background visible
// - Does not create a duplicated WinterBackground
// - Keeps detail content above the background
// - Supports Light / Dark Mode
// - Provides horizontal overflow protection
//
// All detail states use the same page wrapper:
// - Initial loading
// - Error
// - Stale route loading
// - Successful detail
// =========================================================

const ProblemDetailPageShell = ({
    children,
}) => {
    return (
        <main
            id="problem-detail-page"

            className="
                relative
                isolate

                min-h-screen

                w-full
                min-w-0

                overflow-x-clip

                bg-transparent

                font-sans
                text-slate-900

                dark:bg-transparent
                dark:text-gray-100
            "

            style={{
                background: "transparent",
                backgroundColor: "transparent",
                backgroundImage: "none",
            }}
        >

            {/* ======================================
                SHARED GLOBAL WINTER BACKGROUND

                Background is rendered globally in App.jsx.

                Includes:
                - Winter dark / light background
                - Snowfall
                - Aurora
                - Decorative effects
                - Theme-aware background

                No duplicated background instance.
            ====================================== */}


            {/* ======================================
                DETAIL CONTENT

                z-10 keeps the complete detail page
                above the global winter background.
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    w-full
                    min-w-0
                "
            >
                {children}
            </div>

        </main>
    );
};


// =========================================================
// FSOCIETY — PROBLEM DETAIL
//
// Responsibilities:
//
// - Read route problem ID
// - Fetch detail data
// - Show skeleton while loading
// - Protect against stale route data
// - Handle typed errors and retry
// - Normalize detail data
// - Manage solution flow
// - Manage star, edit, delete and accept actions
// - Render main detail layout
//
// Loading:
// ProblemDetailSkeleton
//
// Error:
// ProblemDetailState
//
// Success:
// ProblemDetailLayout
// =========================================================

const ProblemDetail = () => {

    // =====================================================
    // ROUTER
    // =====================================================

    const { id } = useParams();


    // =====================================================
    // DETAIL REQUEST LIFECYCLE
    //
    // Existing hook preserves:
    //
    // - GET request
    // - AbortController
    // - Typed errors
    // - Retry
    // - Request cleanup
    // - Background refresh
    // - Current route protection
    // =====================================================

    const {
        problemDetail,

        detailLoading,

        hasCurrentProblemDetail,

        currentDetailError,

        retryProblemDetail,

        refreshProblemDetail,
    } = useProblemDetail({
        problemId: id,
    });


    // =====================================================
    // AUTH
    // =====================================================

    const authState = useSelector(
        (state) => state.auth || {}
    );

    const {
        user = null,
        isLoggedIn = false,
    } = authState;


    // =====================================================
    // VIEW MODEL
    //
    // Normalize:
    //
    // - Solved / rejected state
    // - Star status
    // - Ownership
    // - Response count
    // - Languages
    // - Technologies
    // =====================================================

    const detailView = useMemo(
        () => {
            return getProblemDetailViewModel(
                problemDetail,
                user
            );
        },
        [
            problemDetail,
            user,
        ]
    );


    const {
        isSolved: isProblemSolved,

        hasStarred: hasStarredProblem,

        isOwner,

        responseCount,

        languages: problemLanguages,

        technologies: problemTechnologies,
    } = detailView;


    // =====================================================
    // SOLUTION FLOW
    //
    // Preserve:
    //
    // - Form scroll ref
    // - Solutions scroll ref
    // - Responses refresh key
    // - Work action
    // - Solution created callback
    // - Solution accepted callback
    // =====================================================

    const {
        responseFormRef,

        responsesSectionRef,

        responsesRefreshKey,

        handleWorkClick,

        handleSolutionCreated,

        handleSolutionAccepted,
    } = useProblemDetailSolutions({
        isSolved: isProblemSolved,

        refreshProblemDetail,
    });


    // =====================================================
    // MUTATION ACTIONS
    //
    // Preserve:
    //
    // - Star / Unstar
    // - Edit
    // - Delete
    // - Accept solution
    // - Modal states
    // - Loading states
    // =====================================================

    const {
        starIsLoading,

        acceptSolutionIsLoading,

        isDeleteModalOpen,
        isDeleting,

        isAcceptModalOpen,

        handleStarClick,
        handleStarDeleteClick,

        handleEditProblem,

        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmDelete,

        handleAcceptSolution,
        handleCloseAcceptModal,
        handleConfirmAcceptSolution,
    } = useProblemDetailActions({
        problemId: id,

        problemTitle: problemDetail?.problem,

        currentUser: user,

        isLoggedIn,

        isOwner,

        isSolved: isProblemSolved,

        hasStarredProblem,

        onSolutionAccepted: handleSolutionAccepted,
    });


    // =====================================================
    // INITIAL LOADING
    //
    // FIX 1:
    //
    // Replace old:
    //
    // <ProblemDetailState variant="loading" />
    //
    // with:
    //
    // <ProblemDetailSkeleton />
    //
    // Only show initial skeleton when the current
    // route has no detail data and no page error.
    //
    // The skeleton is rendered inside the shared
    // transparent page background.
    // =====================================================

    if (
        detailLoading &&
        !hasCurrentProblemDetail &&
        !currentDetailError
    ) {
        return (
            <ProblemDetailPageShell>
                <ProblemDetailSkeleton />
            </ProblemDetailPageShell>
        );
    }


    // =====================================================
    // DETAIL ERROR
    //
    // Keep the existing typed error state.
    //
    // Do not replace error UI with the skeleton.
    //
    // The error state also uses the shared
    // transparent page background.
    // =====================================================

    if (
        currentDetailError &&
        !hasCurrentProblemDetail
    ) {
        return (
            <ProblemDetailPageShell>
                <ProblemDetailState
                    variant="error"

                    errorState={currentDetailError}

                    onRetry={retryProblemDetail}

                    isRetrying={detailLoading}

                    backTo="/problems"
                />
            </ProblemDetailPageShell>
        );
    }


    // =====================================================
    // STALE DETAIL PROTECTION
    //
    // FIX 2:
    //
    // When navigating:
    //
    // /problem/1/detail
    //       ↓
    // /problem/2/detail
    //
    // Never render problem 1 on problem 2 route.
    //
    // Display the NEW skeleton while the correct
    // problem is being fetched.
    //
    // The new skeleton remains above the global
    // Winter Background.
    // =====================================================

    if (!hasCurrentProblemDetail) {
        return (
            <ProblemDetailPageShell>
                <ProblemDetailSkeleton />
            </ProblemDetailPageShell>
        );
    }


    // =====================================================
    // PROBLEM DETAIL LAYOUT
    //
    // The current route's problem is available.
    //
    // Keep all existing props and callbacks.
    //
    // The detail layout is rendered inside the shared
    // transparent page background.
    // =====================================================

    return (
        <ProblemDetailPageShell>

            <ProblemDetailLayout

                // =============================================
                // PROBLEM DATA
                // =============================================

                problemId={id}

                problemDetail={problemDetail}

                problemLanguages={
                    problemLanguages
                }

                problemTechnologies={
                    problemTechnologies
                }

                responseCount={
                    responseCount
                }

                responsesRefreshKey={
                    responsesRefreshKey
                }


                // =============================================
                // DERIVED STATE
                // =============================================

                isOwner={isOwner}

                isSolved={isProblemSolved}

                hasStarredProblem={
                    hasStarredProblem
                }


                // =============================================
                // MUTATION LOADING
                // =============================================

                starIsLoading={
                    starIsLoading
                }

                isDeleting={isDeleting}

                acceptSolutionIsLoading={
                    acceptSolutionIsLoading
                }


                // =============================================
                // MODALS
                // =============================================

                isDeleteModalOpen={
                    isDeleteModalOpen
                }

                isAcceptModalOpen={
                    isAcceptModalOpen
                }


                // =============================================
                // SOLUTION REFS
                // =============================================

                responsesSectionRef={
                    responsesSectionRef
                }

                responseFormRef={
                    responseFormRef
                }


                // =============================================
                // OWNER ACTIONS
                // =============================================

                onEdit={
                    handleEditProblem
                }

                onOpenDelete={
                    handleOpenDeleteModal
                }

                onCloseDelete={
                    handleCloseDeleteModal
                }

                onConfirmDelete={
                    handleConfirmDelete
                }


                // =============================================
                // STAR ACTIONS
                // =============================================

                onAddStar={
                    handleStarClick
                }

                onRemoveStar={
                    handleStarDeleteClick
                }


                // =============================================
                // SOLUTION ACTIONS
                // =============================================

                onWork={
                    handleWorkClick
                }

                onSolutionCreated={
                    handleSolutionCreated
                }

                onAcceptSolution={
                    handleAcceptSolution
                }

                onCloseAccept={
                    handleCloseAcceptModal
                }

                onConfirmAccept={
                    handleConfirmAcceptSolution
                }

            />

        </ProblemDetailPageShell>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default ProblemDetail;
