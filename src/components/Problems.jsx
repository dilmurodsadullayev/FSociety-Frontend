
import React from "react";

// =========================================================
// PROBLEM CARD
// =========================================================

import ProblemCard from "./ProblemCard";

// =========================================================
// PAGE COMPONENTS
// =========================================================

import ProblemsHeader from "./problems-page/ProblemsHeader";
import ProblemsToolbar from "./problems-page/ProblemsToolbar";
import ProblemsResultsHeader from "./problems-page/ProblemsResultsHeader";

import ProblemCardSkeleton from "./problems-page/ProblemCardSkeleton";
import ProblemsErrorState from "./problems-page/ProblemsErrorState";
import ProblemsEmptyState from "./problems-page/ProblemsEmptyState";
import ProblemsPagination from "./problems-page/ProblemsPagination";

// =========================================================
// CONTROLLER AND CONFIG
// =========================================================

import useProblemsPage from "./problems-page/useProblemsPage";

import {
    PROBLEMS_PAGE_SIZE,
} from "./problems-page/problemPageHelpers";

// =========================================================
// FSOCIETY — PROBLEMS PAGE
//
// Responsibilities:
// - Render page sections
// - Connect UI with useProblemsPage
// - Show loading, error and empty states
// - Render problem cards and pagination
// - Light / Dark Mode
// - Mobile-first responsiveness
//
// No direct Redux or API requests.
// =========================================================

const Problems = () => {
    // =====================================================
    // PAGE CONTROLLER
    // =====================================================

    const {
        // Data
        problemList,
        problemCount,

        languages,
        technologies,

        languagesIsLoading,
        technologiesIsLoading,

        // Request state
        loading,
        currentError,

        // Search
        searchTerm,
        setSearchTerm,
        debouncedSearchTerm,

        // Filters
        statusFilter,
        urgentFilter,
        languageFilter,
        technologyFilter,
        ordering,
        hasActiveFilters,

        // Pagination
        currentPage,
        totalPages,
        resultStart,
        resultEnd,

        // UI state
        isCurrentQueryResolved,
        showInitialSkeleton,
        showCards,
        showEmptyState,
        showPaginationArea,

        // Actions
        handleClearSearch,
        handleResetFilters,
        handleRetry,

        handleStatusChange,
        handleUrgentChange,
        handleLanguageChange,
        handleTechnologyChange,
        handleOrderingChange,

        handlePageChange,
    } = useProblemsPage();

    // =====================================================
    // DERIVED UI VALUES
    // =====================================================

    const searchPending =
        searchTerm.trim() !==
        debouncedSearchTerm;

    const isSearching = Boolean(
        (loading || searchPending) &&
        (
            searchTerm.trim() ||
            debouncedSearchTerm
        )
    );

    const isPageLoading =
        loading || showInitialSkeleton;

    const visibleCount =
        isCurrentQueryResolved
            ? problemCount
            : 0;

    const hasVisibleData =
        showCards &&
        problemList.length > 0;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <main
            id="problems-hero"

            className="
                relative
                isolate

                min-h-screen

                w-full
                min-w-0

                overflow-x-hidden

                bg-gradient-to-b
                from-slate-50
                via-white
                to-slate-50

                px-3
                pb-20
                pt-8

                font-sans
                text-slate-900

                transition-colors
                duration-200

                sm:px-6
                sm:pb-24
                sm:pt-12

                lg:px-8

                dark:from-gray-900
                dark:via-[#0b0e14]
                dark:to-black
                dark:text-gray-100
            "
        >
            {/* ======================================
                BACKGROUND DECORATION
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-0

                    h-[420px]
                    w-[650px]
                    max-w-none

                    -translate-x-1/2

                    rounded-full

                    bg-indigo-500/[0.035]

                    blur-[110px]

                    dark:bg-indigo-500/[0.06]
                "
            />

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    -right-32
                    top-[520px]

                    h-[320px]
                    w-[320px]

                    rounded-full

                    bg-cyan-500/[0.025]

                    blur-[100px]

                    dark:bg-cyan-500/[0.04]
                "
            />

            {/* ======================================
                CONTENT CONTAINER
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    w-full
                    max-w-7xl
                    min-w-0
                "
            >
                {/* ==============================
                    PAGE HEADER
                ============================== */}

                <ProblemsHeader />

                {/* ==============================
                    SEARCH / FILTERS / SORT
                ============================== */}

                <ProblemsToolbar
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSearchClear={handleClearSearch}
                    isSearching={isSearching}

                    status={statusFilter}
                    urgent={urgentFilter}
                    language={languageFilter}
                    technology={technologyFilter}
                    ordering={ordering}

                    languages={languages}
                    technologies={technologies}

                    languagesIsLoading={
                        languagesIsLoading
                    }

                    technologiesIsLoading={
                        technologiesIsLoading
                    }

                    onStatusChange={
                        handleStatusChange
                    }

                    onUrgentChange={
                        handleUrgentChange
                    }

                    onLanguageChange={
                        handleLanguageChange
                    }

                    onTechnologyChange={
                        handleTechnologyChange
                    }

                    onOrderingChange={
                        handleOrderingChange
                    }

                    hasActiveFilters={
                        hasActiveFilters
                    }

                    onResetFilters={
                        handleResetFilters
                    }
                />

                {/* ==============================
                    RESULTS HEADER
                ============================== */}

                <ProblemsResultsHeader
                    count={visibleCount}
                    start={resultStart}
                    end={resultEnd}

                    isLoading={isPageLoading}

                    isResolved={
                        isCurrentQueryResolved
                    }
                />

                {/* ==============================
                    ERROR STATE
                ============================== */}

                {currentError && !loading && (
                    <ProblemsErrorState
                        message={currentError}

                        onRetry={handleRetry}

                        isRetrying={loading}

                        hasData={hasVisibleData}
                    />
                )}

                {/* ==============================
                    PROBLEMS GRID
                ============================== */}

                <div
                    aria-busy={isPageLoading}

                    className="
                        grid
                        w-full
                        min-w-0

                        grid-cols-1
                        gap-4

                        sm:gap-5

                        md:grid-cols-2

                        xl:grid-cols-3
                        xl:gap-6
                    "
                >
                    {/* ==========================
                        LOADING SKELETONS
                    ========================== */}

                    {showInitialSkeleton && (
                        <>
                            <span
                                role="status"
                                className="sr-only"
                            >
                                Muammolar yuklanmoqda...
                            </span>

                            {Array.from({
                                length: PROBLEMS_PAGE_SIZE,
                            }).map((_, index) => (
                                <ProblemCardSkeleton
                                    key={
                                        `problem-skeleton-${index}`
                                    }
                                />
                            ))}
                        </>
                    )}

                    {/* ==========================
                        PROBLEM CARDS
                    ========================== */}

                    {hasVisibleData &&
                        problemList.map((
                            problem,
                            index
                        ) => (
                            <div
                                key={
                                    problem?.id ??
                                    `problem-${index}`
                                }

                                className="
                                    h-full
                                    min-w-0
                                "
                            >
                                <ProblemCard
                                    problem={problem}
                                />
                            </div>
                        ))}

                    {/* ==========================
                        EMPTY RESULTS
                    ========================== */}

                    {showEmptyState && (
                        <div
                            className="
                                col-span-full
                                w-full
                                min-w-0
                            "
                        >
                            <ProblemsEmptyState
                                hasActiveFilters={
                                    hasActiveFilters
                                }

                                onResetFilters={
                                    handleResetFilters
                                }
                            />
                        </div>
                    )}
                </div>

                {/* ==============================
                    PAGINATION
                ============================== */}

                {showPaginationArea && (
                    <ProblemsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        count={problemCount}

                        onPageChange={
                            handlePageChange
                        }

                        disabled={loading}
                    />
                )}
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(Problems);
