// src/components/FCoinHistory.jsx

import React, { memo } from "react";

// =========================================================
// FSOCIETY — SHARED FUTURISTIC BACKGROUND
// =========================================================

import PageGridBackground from "./ui/PageGridBackground";

// =========================================================
// FCOIN HISTORY COMPONENTS
// =========================================================

import FCoinHistoryHeader from "./fcoin-history/FCoinHistoryHeader";

import FCoinHistorySummary from "./fcoin-history/FCoinHistorySummary";

import FCoinHistoryList from "./fcoin-history/FCoinHistoryList";

import FCoinHistoryState from "./fcoin-history/FCoinHistoryState";

import FCoinHistoryPagination from "./fcoin-history/FCoinHistoryPagination";

// =========================================================
// FCOIN HISTORY CONTROLLER
// =========================================================

import useCoinHistory from "./fcoin-history/useCoinHistory";

// =========================================================
// SHARED PAGE STYLES
// =========================================================

const PAGE_CLASS = `
    relative
    isolate

    min-h-screen
    w-full
    min-w-0

    overflow-x-clip

    bg-[#edf4ff]
    text-slate-900

    px-3
    pb-16
    pt-10

    sm:px-6
    sm:pb-20
    sm:pt-14

    lg:px-8

    dark:bg-[#060b15]
    dark:text-white
`;

const CONTENT_CLASS = `
    relative
    z-10

    mx-auto

    w-full
    min-w-0
    max-w-6xl
`;

// =========================================================
// HISTORY PANEL
//
// IMPORTANT:
//
// Old version always used a dark background.
// All child components now support Light/Dark Mode.
//
// This panel follows the active theme.
//
// No forced dark color scheme.
// =========================================================

const HISTORY_PANEL_CLASS = `
    relative
    isolate

    min-w-0
    overflow-hidden

    rounded-[24px]

    border
    border-slate-200/90

    bg-white/75

    p-4

    text-slate-900

    shadow-[0_24px_70px_rgba(15,23,42,0.09)]

    backdrop-blur-xl

    sm:rounded-[28px]
    sm:p-6

    lg:p-8

    dark:border-white/[0.07]
    dark:bg-[#070a0f]/90
    dark:text-white

    dark:shadow-[0_30px_90px_rgba(0,0,0,0.25)]
`;

// =========================================================
// DECORATIVE COMPONENTS
// =========================================================

const HistoryPanelDecorations = memo(
    function HistoryPanelDecorations() {
        return (
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
                {/* GOLD AMBIENT GLOW */}
                <div
                    className="
                        absolute
                        -right-32
                        -top-32

                        h-80
                        w-80

                        rounded-full

                        bg-amber-400/[0.07]
                        blur-[100px]

                        dark:bg-amber-400/[0.04]
                    "
                />

                {/* INDIGO AMBIENT GLOW */}
                <div
                    className="
                        absolute
                        -bottom-40
                        -left-32

                        h-80
                        w-80

                        rounded-full

                        bg-indigo-500/[0.07]
                        blur-[100px]

                        dark:bg-indigo-500/[0.04]
                    "
                />

                {/* TOP ACCENT LINE */}
                <div
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-px

                        bg-gradient-to-r
                        from-transparent
                        via-amber-400/40
                        to-transparent

                        dark:via-amber-400/30
                    "
                />

                {/* SUBTLE TECHNICAL GRID */}
                <div
                    className="
                        absolute
                        inset-0

                        opacity-[0.13]
                        dark:opacity-[0.07]
                    "
                    style={{
                        backgroundImage: `
                            linear-gradient(
                                to right,
                                rgba(99, 102, 241, 0.12) 1px,
                                transparent 1px
                            ),
                            linear-gradient(
                                to bottom,
                                rgba(99, 102, 241, 0.12) 1px,
                                transparent 1px
                            )
                        `,
                        backgroundSize: "44px 44px",
                        maskImage:
                            "linear-gradient(to bottom, black, transparent 65%)",
                        WebkitMaskImage:
                            "linear-gradient(to bottom, black, transparent 65%)",
                    }}
                />
            </div>
        );
    }
);

// =========================================================
// FOOTER COMPONENT
// =========================================================

const HistoryFooter = memo(function HistoryFooter() {
    return (
        <footer
            className="
                relative
                mt-10

                border-t
                border-slate-200/90

                pt-5
                text-center

                dark:border-white/[0.07]
            "
        >
            <p
                className="
                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.13em]

                    text-slate-500
                    dark:text-gray-400
                "
            >
                FSociety FCoin Ledger
                {" • "}
                Structured transaction history
            </p>
        </footer>
    );
});

// =========================================================
// FSOCIETY — FCOIN HISTORY
//
// MAIN RESPONSIBILITIES:
//
// 1. Current user
// 2. Current FCoin balance
// 3. Transaction history
// 4. Transaction statistics
// 5. Refresh / retry
// 6. Page size selection
// 7. Server-side pagination
// 8. Loading skeleton
// 9. Full error state
// 10. Refresh error state
// 11. Empty state
// 12. Light / Dark Mode
// 13. Responsive design
//
// IMPORTANT:
//
// Django API and Redux are managed by useCoinHistory.
//
// No direct API calls are made in this component.
//
// Coin amounts remain in full format.
//
// No K / M / B conversion.
// =========================================================

const FCoinHistory = () => {
    // =====================================================
    // HISTORY CONTROLLER
    // =====================================================

    const {
        // ---------------------------------------------
        // CURRENT USER
        // ---------------------------------------------

        username,

        // ---------------------------------------------
        // TRANSACTION DATA
        // ---------------------------------------------

        coins,

        balance,

        count,

        hasTransactions,

        // ---------------------------------------------
        // REQUEST STATUS
        // ---------------------------------------------

        isLoading,

        isInitialLoading,

        isRefreshing,

        hasLoaded,

        error,

        // ---------------------------------------------
        // PAGINATION
        // ---------------------------------------------

        currentPage,

        pageSize,

        totalPages,

        range,

        paginationPages,

        pageSizeOptions,

        canGoPrevious,

        canGoNext,

        // ---------------------------------------------
        // ACTIONS
        // ---------------------------------------------

        refresh,

        handlePageChange,

        handlePreviousPage,

        handleNextPage,

        handlePageSizeChange,

    } = useCoinHistory();

    // =====================================================
    // SAFE TRANSACTION ARRAY
    //
    // Preserve the original backend objects.
    //
    // No filtering, sorting or amount changes here.
    // =====================================================

    const safeCoins = Array.isArray(coins)
        ? coins
        : [];

    // =====================================================
    // TRANSACTION FLAGS
    // =====================================================

    const hasVisibleTransactions =
        safeCoins.length > 0;

    const hasHistoryData = Boolean(
        hasTransactions ||
        hasVisibleTransactions
    );

    // =====================================================
    // SHOW SUMMARY
    //
    // Do not show misleading zero statistics during
    // the initial API request.
    //
    // Keep statistics visible if previously loaded
    // data exists.
    // =====================================================

    const showSummary = Boolean(
        hasLoaded ||
        hasHistoryData
    );

    // =====================================================
    // SHOW TRANSACTION LIST
    //
    // Keep previous transactions visible during:
    //
    // - Manual refresh
    // - Page loading
    // - Recoverable API errors
    //
    // Do not hide existing data unnecessarily.
    // =====================================================

    const showList = Boolean(
        !isInitialLoading &&
        hasHistoryData &&
        hasVisibleTransactions
    );

    // =====================================================
    // SHOW PAGINATION
    //
    // Keep pagination available for multiple pages.
    //
    // Individual navigation buttons are disabled
    // while loading.
    // =====================================================

    const showPagination = Boolean(
        showList &&
        Number(totalPages) > 1
    );

    // =====================================================
    // ACCESSIBILITY
    // =====================================================

    const isPageBusy = Boolean(
        isInitialLoading ||
        isRefreshing
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            id="fcoin-history-page"
            className={PAGE_CLASS}
            aria-label="FCoin tranzaksiyalar tarixi"
        >
            {/* ==========================================
                SHARED FUTURISTIC BACKGROUND

                Existing FSociety background.

                Includes:
                - Blueprint grid
                - Geometric connections
                - Floating glass cubes
                - Glowing network nodes
                - FS watermark
                - Light / Dark Mode

                Decorative only.

                Background remains behind all content.
            ========================================== */}

            <PageGridBackground
                showMonogram
                showCubes
            />

            {/* ==========================================
                PAGE CONTENT
            ========================================== */}

            <div className={CONTENT_CLASS}>
                {/* ======================================
                    MAIN HISTORY PANEL
                ====================================== */}

                <div className={HISTORY_PANEL_CLASS}>
                    {/* ==================================
                        BACKGROUND DECORATIONS
                    ================================== */}

                    <HistoryPanelDecorations />

                    {/* ==================================
                        INTERACTIVE CONTENT

                        Higher z-index ensures buttons,
                        links and form controls remain
                        interactive.
                    ================================== */}

                    <div
                        className="
                            relative
                            z-10
                            min-w-0
                        "
                    >
                        {/* ==============================
                            HEADER

                            - Username
                            - Title
                            - Transaction count
                            - Structured Ledger badge
                            - Full FCoin balance
                            - FCoin icon
                            - Refresh button
                            - Loading animation
                        ============================== */}

                        <FCoinHistoryHeader
                            username={username}
                            balance={balance}
                            count={count}
                            isRefreshing={isRefreshing}
                            onRefresh={refresh}
                        />

                        {/* ==============================
                            SUMMARY

                            - Total records
                            - Current page
                            - Visible records
                            - Page size selection
                            - Loading progress
                        ============================== */}

                        {showSummary && (
                            <FCoinHistorySummary
                                count={count}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                range={range}
                                pageSizeOptions={pageSizeOptions}
                                isLoading={isLoading}
                                onPageSizeChange={
                                    handlePageSizeChange
                                }
                            />
                        )}

                        {/* ==============================
                            TRANSACTION CONTENT
                        ============================== */}

                        <section
                            aria-label="FCoin tranzaksiyalari"
                            aria-busy={isPageBusy}
                            className="
                                relative
                                mt-6
                                min-w-0
                            "
                        >
                            {/* ==========================
                                TRANSACTION STATES

                                Original states:
                                - Initial loading
                                - Error
                                - Refresh error
                                - Empty state
                                - Retry

                                Existing loaded items
                                remain visible during
                                refresh errors.
                            ========================== */}

                            <FCoinHistoryState
                                isInitialLoading={
                                    isInitialLoading
                                }
                                isLoading={isLoading}
                                error={error}
                                hasLoaded={hasLoaded}
                                hasTransactions={
                                    hasHistoryData
                                }
                                onRetry={refresh}
                            />

                            {/* ==========================
                                TRANSACTION LIST

                                All backend transaction
                                objects are passed without
                                changing their fields.

                                FCoin values are displayed
                                in full by HistoryItem.

                                Refresh indicator and
                                transaction animations are
                                managed by HistoryList.
                            ========================== */}

                            {showList && (
                                <FCoinHistoryList
                                    coins={safeCoins}
                                    isRefreshing={
                                        isRefreshing
                                    }
                                />
                            )}

                            {/* ==========================
                                PAGINATION

                                Props remain compatible
                                with useCoinHistory.

                                Previous / Next
                                Numbered pages
                                Ellipsis
                                Mobile progress indicator
                            ========================== */}

                            {showPagination && (
                                <FCoinHistoryPagination
                                    currentPage={
                                        currentPage
                                    }
                                    totalPages={
                                        totalPages
                                    }
                                    paginationPages={
                                        paginationPages
                                    }
                                    canGoPrevious={
                                        canGoPrevious
                                    }
                                    canGoNext={
                                        canGoNext
                                    }
                                    isLoading={
                                        isLoading
                                    }
                                    onPageChange={
                                        handlePageChange
                                    }
                                    onPrevious={
                                        handlePreviousPage
                                    }
                                    onNext={
                                        handleNextPage
                                    }
                                />
                            )}
                        </section>

                        {/* ==============================
                            FOOTER
                        ============================== */}

                        <HistoryFooter />
                    </div>
                </div>
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(FCoinHistory);