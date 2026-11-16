import React from "react";

// =========================================================
// FSOCIETY — SHARED PAGE BACKGROUND
//
// Global Winter Background is managed in App.jsx.
// This page uses the global background.
// =========================================================


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
// Shared futuristic background:
// - Managed globally in App.jsx
// - Winter Background supports Light / Dark Mode
// - No duplicated local background
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
    // SAFE DATA
    // =====================================================

    const safeProblemList = Array.isArray(problemList)
        ? problemList
        : [];


    // =====================================================
    // DERIVED UI VALUES
    // =====================================================

    const searchPending =
        searchTerm.trim() !== debouncedSearchTerm;

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
        safeProblemList.length > 0;


    // =====================================================
    // PAGINATION VISIBILITY
    //
    // Pagination must only be displayed after the
    // current query has successfully resolved.
    //
    // The total count must be greater than zero.
    //
    // The pagination component itself handles the
    // distinction between a single page and multiple pages.
    // =====================================================

    const shouldRenderPagination =
        Boolean(
            isCurrentQueryResolved &&
            !currentError &&
            problemCount > 0 &&
            showPaginationArea &&
            totalPages >= 1
        );


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

                overflow-x-clip

                bg-transparent

                px-3
                pb-20
                pt-8

                font-sans
                text-slate-900

                sm:px-6
                sm:pb-24
                sm:pt-12

                lg:px-8

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
                SHARED FUTURISTIC BACKGROUND

                Global background is rendered in App.jsx.

                Includes:
                - Winter dark / light image
                - Theme-aware background switching
                - Global background visibility settings
                - Existing fallback background

                No local background instance is needed.
            ====================================== */}


            {/* ======================================
                CONTENT CONTAINER

                z-10 keeps all interactive content
                above the global background.
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
                        safeProblemList.map((
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
                        ))
                    }


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

                    - Rendered below the problems grid.
                    - Remains above the global background.
                    - Responsive on mobile and desktop.
                    - Loading state disables page controls.
                ============================== */}

                {shouldRenderPagination && (
                    <section
                        id="problems-pagination"
                        aria-label="Muammolar sahifalari"

                        className="
                            relative
                            z-20
                            isolate

                            mt-8

                            block
                            w-full
                            min-w-0

                            sm:mt-10
                            lg:mt-12
                        "
                    >
                        <ProblemsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            count={problemCount}

                            onPageChange={
                                handlePageChange
                            }

                            disabled={loading}
                        />
                    </section>
                )}

            </div>

        </main>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default React.memo(Problems);