
import React, { memo } from "react";

import {
    Loader2,
} from "lucide-react";

import ProblemSolutionCard from "./ProblemSolutionCard";

import {
    ProblemSolutionsLoading,
    ProblemSolutionsError,
    ProblemSolutionsEmpty,
    ProblemSolutionsRefreshWarning,
} from "./ProblemSolutionsStates";

import {
    sameSolutionId,
} from "./problemSolutionsHelpers";

import useProblemSolutions from "./useProblemSolutions";

// =========================================================
// FSOCIETY — PROBLEM SOLUTIONS
//
// Responsibilities:
// - Connect controller to UI
// - Render loading / error / empty states
// - Render ordered solution cards
// - Show background refresh status
//
// Original ProblemResponse props are supported.
//
// No direct API calls.
// =========================================================

const ProblemSolutions = ({
    id,

    isOwner = false,
    isSolved = false,

    onAcceptSolution,

    newResponse = null,
    refreshKey = 0,
}) => {
    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        authUser,

        responses,
        sortedSolutions,

        isLoading,
        fetchError,

        freshResponseId,
        starLoadingIds,

        fetchSolutions,
        handleStarClick,
        handleCopyCode,
    } = useProblemSolutions({
        id,
        isSolved,
        refreshKey,
        newResponse,
    });

    // =====================================================
    // INITIAL LOADING
    // =====================================================

    if (isLoading && responses.length === 0) {
        return <ProblemSolutionsLoading count={3} />;
    }

    // =====================================================
    // EMPTY / ERROR
    // =====================================================

    if (responses.length === 0) {
        if (fetchError) {
            return (
                <ProblemSolutionsError
                    message={fetchError}
                    onRetry={() =>
                        fetchSolutions({ silent: false })
                    }
                    isRetrying={isLoading}
                />
            );
        }

        return <ProblemSolutionsEmpty />;
    }

    // =====================================================
    // SOLUTIONS
    // =====================================================

    return (
        <div
            aria-busy={isLoading}
            className="
                w-full
                min-w-0
                space-y-4
            "
        >
            {/* BACKGROUND REFRESH */}

            {isLoading && (
                <div
                    role="status"
                    className="
                        flex
                        items-center
                        justify-end
                        gap-2
                        px-1
                        font-mono
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    <Loader2
                        size={13}
                        aria-hidden="true"
                        className="
                            animate-spin
                            text-cyan-600
                            motion-reduce:animate-none

                            dark:text-cyan-400
                        "
                    />

                    Yangilanmoqda
                </div>
            )}

            {/* NON-BLOCKING FETCH ERROR */}

            {fetchError && (
                <ProblemSolutionsRefreshWarning
                    onRetry={() =>
                        fetchSolutions({ silent: true })
                    }
                    isRetrying={isLoading}
                />
            )}

            {/* SOLUTION CARDS */}

            {sortedSolutions.map((response, index) => {
                const responseId = response?.id;

                return (
                    <ProblemSolutionCard
                        key={
                            responseId != null
                                ? `solution-${id}-${responseId}`
                                : `solution-${id}-index-${index}`
                        }
                        response={response}
                        index={index}

                        problemId={id}
                        authUser={authUser}

                        isOwner={isOwner}
                        isSolved={isSolved}

                        isFresh={
                            sameSolutionId(
                                freshResponseId,
                                responseId
                            )
                        }

                        isStarLoading={Boolean(
                            starLoadingIds[
                                String(responseId ?? "")
                            ]
                        )}

                        onAcceptSolution={
                            onAcceptSolution
                        }

                        onStar={
                            handleStarClick
                        }

                        onCopyCode={
                            handleCopyCode
                        }
                    />
                );
            })}
        </div>
    );
};

export default memo(ProblemSolutions);
