
import React, { memo } from "react";

import {
    ArrowRight,
    Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";

// =========================================================
// FSOCIETY — SIMILAR PROBLEMS MODULES
// =========================================================

import useSimilarProblems
    from "./similar-problems/useSimilarProblems";

import SimilarProblemsHeader
    from "./similar-problems/SimilarProblemsHeader";

import SimilarProblemCard
    from "./similar-problems/SimilarProblemCard";

import {
    SimilarProblemsLoading,
    SimilarProblemsError,
    SimilarProblemsEmpty,
    SimilarProblemsRefreshError,
} from "./similar-problems/SimilarProblemsStates";

// =========================================================
// FSOCIETY — SIMILAR PROBLEMS
//
// Public contract:
// <SimilarProblems problemId={problemId} />
//
// Responsibilities:
// - Connect API/Redux controller with UI
// - Display up to five similar problems
// - Render loading/error/empty states
// - Support retry
// - Preserve problem navigation
// - Show all problems footer
//
// API logic:
// useSimilarProblems.js
//
// Cards:
// SimilarProblemCard.jsx
//
// States:
// SimilarProblemsStates.jsx
// =========================================================

const SimilarProblems = ({
    problemId,
}) => {
    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        problems,

        isLoading,
        error,

        fetchSimilarProblems,
    } = useSimilarProblems({
        problemId,
    });

    // =====================================================
    // DERIVED STATE
    // =====================================================

    const hasProblems =
        problems.length > 0;

    const showInitialLoading =
        isLoading && !hasProblems;

    const showInitialError =
        !isLoading &&
        Boolean(error) &&
        !hasProblems;

    const showEmpty =
        !isLoading &&
        !error &&
        !hasProblems;

    const showResults =
        hasProblems;

    const showRefreshError =
        Boolean(error) &&
        hasProblems;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-labelledby="similar-problems-heading"
            aria-busy={isLoading}
            className="
                relative
                w-full
                min-w-0
                overflow-hidden

                rounded-[24px]

                border
                border-slate-200

                bg-white/95

                shadow-[0_15px_45px_rgba(15,23,42,0.055)]

                backdrop-blur-sm

                sm:rounded-[28px]

                dark:border-white/[0.09]
                dark:bg-[#0b1018]/95

                dark:shadow-[0_25px_70px_rgba(0,0,0,0.25)]
            "
        >
            {/* ======================================
                DECORATIVE GLOW
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24

                    h-52
                    w-52

                    rounded-full

                    bg-indigo-500/[0.055]

                    blur-[85px]

                    dark:bg-indigo-400/[0.06]
                "
            />

            {/* ======================================
                HEADER
            ====================================== */}

            <SimilarProblemsHeader
                count={problems.length}
                isLoading={isLoading}
            />

            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    min-w-0

                    px-4

                    sm:px-5
                "
            >
                {/* INITIAL LOADING */}

                {showInitialLoading && (
                    <SimilarProblemsLoading />
                )}

                {/* INITIAL ERROR */}

                {showInitialError && (
                    <SimilarProblemsError
                        message={error}

                        onRetry={
                            fetchSimilarProblems
                        }

                        isLoading={isLoading}
                    />
                )}

                {/* EMPTY */}

                {showEmpty && (
                    <SimilarProblemsEmpty />
                )}

                {/* ==================================
                    RESULTS
                ================================== */}

                {showResults && (
                    <div>
                        {/* BACKGROUND LOADING */}

                        {isLoading && (
                            <div
                                role="status"
                                className="
                                    flex
                                    items-center
                                    justify-end
                                    gap-2

                                    border-b
                                    border-slate-200

                                    py-3

                                    font-mono
                                    text-[10px]
                                    font-bold
                                    uppercase

                                    text-slate-500

                                    dark:border-white/[0.08]
                                    dark:text-gray-400
                                "
                            >
                                <Loader2
                                    size={13}
                                    aria-hidden="true"
                                    className="
                                        animate-spin
                                        text-indigo-600

                                        motion-reduce:animate-none

                                        dark:text-indigo-400
                                    "
                                />

                                Yangilanmoqda
                            </div>
                        )}

                        {/* NON-BLOCKING ERROR */}

                        {showRefreshError && (
                            <SimilarProblemsRefreshError
                                message={error}
                                onRetry={
                                    fetchSimilarProblems
                                }
                            />
                        )}

                        {/* PROBLEM CARDS */}

                        <div
                            role="list"
                            aria-label="O‘xshash muammolar ro‘yxati"
                        >
                            {problems.map((problem, index) => (
                                <div
                                    role="listitem"

                                    key={
                                        `similar-${problemId}-${problem.id}`
                                    }
                                >
                                    <SimilarProblemCard
                                        problem={problem}
                                        index={index}

                                        isLast={
                                            index ===
                                            problems.length - 1
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ======================================
                FOOTER

                Preserve link to all problems.
            ====================================== */}

            {showResults && (
                <footer
                    className="
                        relative
                        z-10

                        border-t
                        border-slate-200

                        bg-slate-50/65

                        p-3

                        dark:border-white/[0.08]
                        dark:bg-white/[0.015]
                    "
                >
                    <Link
                        to="/problems"
                        className="
                            group
                            flex
                            min-h-11
                            w-full

                            items-center
                            justify-between
                            gap-3

                            rounded-xl

                            px-3
                            py-2.5

                            text-[11px]
                            font-black

                            text-slate-600

                            transition-colors

                            hover:bg-indigo-50
                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            dark:text-gray-400
                            dark:hover:bg-white/[0.045]
                            dark:hover:text-indigo-300
                        "
                    >
                        <span>
                            Barcha muammolarni ko‘rish
                        </span>

                        <ArrowRight
                            size={15}
                            aria-hidden="true"
                            className="
                                shrink-0

                                transition-transform
                                duration-200

                                group-hover:translate-x-1

                                motion-reduce:transform-none
                                motion-reduce:transition-none
                            "
                        />
                    </Link>
                </footer>
            )}
        </section>
    );
};

export default memo(SimilarProblems);
