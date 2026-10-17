// src/components/NotificationsPage.jsx

import React, { memo } from "react";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    AlertTriangle,
    Loader2,
    RefreshCw,
} from "lucide-react";

// =========================================================
// SHARED BACKGROUND
// =========================================================

import PageGridBackground from "./ui/PageGridBackground";

// =========================================================
// NOTIFICATION COMPONENTS
// =========================================================

import NotificationHeader from "./notifications/NotificationHeader";

import NotificationStats from "./notifications/NotificationStats";

import NotificationToolbar from "./notifications/NotificationToolbar";

import NotificationCard from "./notifications/NotificationCard";

import NotificationPageSkeleton from "./notifications/NotificationPageSkeleton";

import NotificationPagination, {
    NotificationEmptyState,
} from "./notifications/NotificationPagination";

// =========================================================
// PAGE CONTROLLER
// =========================================================

import useNotificationsPage from "./notifications/useNotificationsPage";

// =========================================================
// NOTIFICATIONS PAGE
//
// - Shared futuristic background
// - Header
// - Initial skeleton loading
// - Three statistics cards
// - Filters / WebSocket
// - Mark as read
// - Notification list
// - Soft loading
// - Loading error / Retry
// - Empty state
// - Pagination
// - Light / Dark Mode
// =========================================================

const NotificationsPage = () => {
    const reduceMotion = useReducedMotion();

    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        currentUser,

        wsConnected,
        wsError,

        filter,

        currentPage,
        perPage,

        totalCount,
        unreadCount,
        readCount,

        totalFiltered,
        totalPages,
        startItem,
        endItem,

        paginatedNotifications,

        isInitialLoading,
        isInitialError,
        initialErrorMessage,
        isSoftLoading,

        retryInitialLoad,

        markNotificationAsReadAction,
        markAllAsReadAction,

        handlePageChange,
        handlePerPageChange,
        handleFilterChange,

        getFilterCount,
    } = useNotificationsPage();

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            id="notifications-page"
            aria-label="Bildirishnomalar markazi"
            className="
                relative isolate min-h-screen
                min-w-0 overflow-x-clip

                bg-[#f3f7ff]
                px-3 py-10
                text-slate-900

                dark:bg-[#05070a]
                dark:text-white

                sm:px-6
                lg:px-8
            "
        >
            {/* ==========================================
                SHARED FUTURISTIC BACKGROUND
            ========================================== */}

            <PageGridBackground
                showMonogram
                showCubes
            />

            {/* ==========================================
                AMBIENT LIGHTING
            ========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    left-1/2 top-20

                    h-[360px]
                    w-[min(90vw,440px)]

                    -translate-x-1/2
                    rounded-full

                    bg-indigo-400/[0.09]
                    blur-[110px]

                    dark:bg-indigo-600/[0.12]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    -right-32 top-1/3

                    h-[320px] w-80
                    rounded-full

                    bg-amber-400/[0.07]
                    blur-[110px]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    -left-32 bottom-20

                    h-[300px] w-80
                    rounded-full

                    bg-purple-500/[0.06]
                    blur-[110px]
                "
            />

            {/* ==========================================
                PAGE CONTENT
            ========================================== */}

            <div
                className="
                    relative z-10 mx-auto
                    w-full min-w-0 max-w-5xl
                "
            >
                {/* ======================================
                    NOTIFICATION HEADER

                    Header always remains visible.
                ====================================== */}

                <NotificationHeader />

                {/* ======================================
                    INITIAL SKELETON LOADING

                    Stats + toolbar + cards.

                    Real components are not shown
                    with misleading zero counts.
                ====================================== */}

                {isInitialLoading ? (
                    <NotificationPageSkeleton
                        count={perPage}
                    />
                ) : (
                    <>
                        {/* ==============================
                            STATISTICS
                        ============================== */}

                        <NotificationStats
                            total={totalCount}
                            unread={unreadCount}
                            read={readCount}
                        />

                        {/* ==============================
                            TOOLBAR
                        ============================== */}

                        <NotificationToolbar
                            filter={filter}
                            getFilterCount={
                                getFilterCount
                            }
                            handleFilterChange={
                                handleFilterChange
                            }
                            wsConnected={
                                wsConnected
                            }
                            wsError={
                                wsError
                            }
                            unreadCount={
                                unreadCount
                            }
                            markAllAsReadAction={
                                markAllAsReadAction
                            }
                        />

                        {/* ==============================
                            INITIAL LOAD ERROR

                            Prevent infinite skeleton.
                        ============================== */}

                        {isInitialError ? (
                            <section
                                role="alert"
                                className="
                                    rounded-3xl border
                                    border-amber-200

                                    bg-amber-50/90
                                    px-5 py-10 text-center

                                    dark:border-amber-400/20
                                    dark:bg-amber-500/[0.06]
                                "
                            >
                                <AlertTriangle
                                    size={27}
                                    aria-hidden="true"
                                    className="
                                        mx-auto
                                        text-amber-700
                                        dark:text-amber-300
                                    "
                                />

                                <h2
                                    className="
                                        mt-4 text-lg font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Bildirishnomalarni yuklab bo‘lmadi
                                </h2>

                                <p
                                    className="
                                        mx-auto mt-2 max-w-lg
                                        break-words text-sm

                                        text-slate-600
                                        dark:text-slate-400
                                    "
                                >
                                    {initialErrorMessage}
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        retryInitialLoad
                                    }
                                    className="
                                        mt-5 inline-flex min-h-10
                                        items-center justify-center
                                        gap-2 rounded-xl border

                                        border-indigo-300
                                        bg-indigo-600

                                        px-4 py-2.5
                                        text-xs font-bold
                                        text-white

                                        transition-colors
                                        hover:bg-indigo-700

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-indigo-500/60
                                    "
                                >
                                    <RefreshCw
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Qayta urinish
                                </button>
                            </section>
                        ) : (
                            /* ==========================
                                NOTIFICATION LIST
                            ========================== */

                            <motion.section
                                layout={
                                    !reduceMotion
                                }
                                aria-label="Bildirishnomalar ro‘yxati"
                                aria-busy={
                                    isSoftLoading
                                }
                                className="
                                    relative min-w-0
                                    space-y-4
                                "
                            >
                                {/* ======================
                                    SOFT LOADING

                                    Old data remains
                                    visible on refresh.
                                ====================== */}

                                {isSoftLoading && (
                                    <div
                                        role="status"
                                        aria-live="polite"
                                        className="
                                            mb-4 flex min-w-0
                                            items-center gap-2

                                            rounded-xl border
                                            border-indigo-200

                                            bg-indigo-50/90
                                            px-4 py-3

                                            text-xs font-semibold
                                            text-indigo-700

                                            dark:border-indigo-400/20
                                            dark:bg-indigo-500/[0.06]
                                            dark:text-indigo-300
                                        "
                                    >
                                        <Loader2
                                            size={15}
                                            aria-hidden="true"
                                            className={
                                                reduceMotion
                                                    ? ""
                                                    : "animate-spin"
                                            }
                                        />

                                        Bildirishnomalar yangilanmoqda...
                                    </div>
                                )}

                                {/* ======================
                                    NOTIFICATION CARDS
                                ====================== */}

                                <AnimatePresence
                                    initial={false}
                                    mode={
                                        reduceMotion
                                            ? "sync"
                                            : "popLayout"
                                    }
                                >
                                    {paginatedNotifications.length > 0 ? (
                                        paginatedNotifications.map(
                                            (notification) => (
                                                <NotificationCard
                                                    key={
                                                        notification.id
                                                    }
                                                    notification={
                                                        notification
                                                    }
                                                    currentUser={
                                                        currentUser
                                                    }
                                                    onMarkRead={
                                                        markNotificationAsReadAction
                                                    }
                                                />
                                            )
                                        )
                                    ) : (
                                        <NotificationEmptyState
                                            key="empty"
                                            filter={
                                                filter
                                            }
                                            onShowAll={() =>
                                                handleFilterChange(
                                                    "all"
                                                )
                                            }
                                        />
                                    )}
                                </AnimatePresence>

                                {/* ======================
                                    PAGINATION
                                ====================== */}

                                <NotificationPagination
                                    currentPage={
                                        currentPage
                                    }
                                    totalPages={
                                        totalPages
                                    }
                                    totalItems={
                                        totalFiltered
                                    }
                                    perPage={
                                        perPage
                                    }
                                    startItem={
                                        startItem
                                    }
                                    endItem={
                                        endItem
                                    }
                                    onPageChange={
                                        handlePageChange
                                    }
                                    onPerPageChange={
                                        handlePerPageChange
                                    }
                                />
                            </motion.section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

export default memo(NotificationsPage);