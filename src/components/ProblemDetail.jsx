
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

    const {
        user,
        isLoggedIn,
    } = useSelector(
        (state) => state.auth
    );

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
    // <ProblemDetailState variant="loading" />
    //
    // with:
    // <ProblemDetailSkeleton />
    //
    // Only show initial skeleton when the current
    // route has no detail data and no page error.
    // =====================================================

    if (
        detailLoading &&
        !hasCurrentProblemDetail &&
        !currentDetailError
    ) {
        return (
            <ProblemDetailSkeleton />
        );
    }

    // =====================================================
    // DETAIL ERROR
    //
    // Keep the existing typed error state.
    //
    // Do not replace error UI with the skeleton.
    // =====================================================

    if (
        currentDetailError &&
        !hasCurrentProblemDetail
    ) {
        return (
            <ProblemDetailState
                variant="error"

                errorState={currentDetailError}

                onRetry={retryProblemDetail}

                isRetrying={detailLoading}

                backTo="/problems"
            />
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
    // =====================================================

    if (!hasCurrentProblemDetail) {
        return (
            <ProblemDetailSkeleton />
        );
    }

    // =====================================================
    // PROBLEM DETAIL LAYOUT
    //
    // The current route's problem is available.
    //
    // Keep all existing props and callbacks.
    // =====================================================

    return (
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
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ProblemDetail;
