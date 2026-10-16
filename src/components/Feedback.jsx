
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import { AlertCircle } from "lucide-react";

// =========================================================
// GLOBAL COMPONENTS
// =========================================================

import DeleteConfirmationModal from "./DeleteConfirmationModal";

// =========================================================
// FEEDBACK SECTIONS
// =========================================================

import FeedbackHero from "./feedback/FeedbackHero";
import FeedbackStatsSection from "./feedback/FeedbackStatsSection";
import FeedbackMySection from "./feedback/FeedbackMySection";
import FeedbackCommunitySection from "./feedback/FeedbackCommunitySection";

// =========================================================
// FEEDBACK MODALS
// =========================================================

import FeedbackCreateModal from "./feedback/FeedbackCreateModal";
import FeedbackEditModal from "./feedback/FeedbackEditModal";

// =========================================================
// CONTROLLER AND HELPERS
// =========================================================

import useFeedbackPage from "./feedback/useFeedbackPage";

import {
    canModifyFeedback,
} from "./feedback/feedbackHelpers";

// =========================================================
// FSOCIETY — FEEDBACK PAGE
//
// Architecture:
// - Stable page shell
// - Stable Hero during initial loading
// - Independent section loading
// - Dark / Light Mode
// - Responsive layout
// - Existing Redux and API contracts preserved
// - Create / Edit / Delete integrations
//
// IMPORTANT:
// Do not replace the entire page with FeedbackSkeleton.
// Each section displays its own loading state.
// =========================================================

// =========================================================
// GLOBAL ERROR COMPONENT
// =========================================================

const FeedbackError = React.memo(({ message }) => {
    const reduceMotion = useReducedMotion();

    const errorText =
        typeof message === "string"
            ? message.trim()
            : typeof message?.message === "string"
                ? message.message.trim()
                : "";

    return (
        <AnimatePresence initial={false}>
            {errorText && (
                <motion.div
                    key="feedback-global-error"

                    initial={
                        reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: -8,
                            }
                    }

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    exit={{
                        opacity: 0,
                        y: -8,
                    }}

                    transition={{
                        duration: reduceMotion
                            ? 0
                            : 0.2,
                    }}

                    role="alert"

                    className="
                        mt-6

                        flex
                        min-w-0

                        items-start
                        gap-3

                        rounded-2xl
                        border
                        border-red-200

                        bg-red-50

                        px-4
                        py-3.5

                        text-xs
                        font-medium
                        leading-6

                        text-red-700

                        sm:px-5

                        dark:border-red-400/20
                        dark:bg-red-500/[0.07]
                        dark:text-red-300
                    "
                >
                    <AlertCircle
                        size={18}
                        strokeWidth={1.9}
                        aria-hidden="true"

                        className="
                            mt-0.5
                            shrink-0
                        "
                    />

                    <span
                        className="
                            min-w-0
                            flex-1

                            whitespace-pre-wrap
                            break-words
                            [overflow-wrap:anywhere]
                        "
                    >
                        {errorText}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

// =========================================================
// MAIN FEEDBACK PAGE
// =========================================================

const Feedback = () => {
    // =====================================================
    // PAGE CONTROLLER
    // =====================================================

    const {
        // ================================================
        // AUTHENTICATION
        // ================================================

        isLoggedIn,

        // ================================================
        // PUBLIC FEEDBACKS
        // ================================================

        publicFeedbacks,
        publicCount,
        publicPagination,

        isPublicLoading,
        hasPublicLoaded,

        handlePublicPageChange,

        // ================================================
        // USER FEEDBACKS
        // ================================================

        myFeedbacks,
        myPagination,

        isMyLoading,
        hasMyLoaded,

        handleMyPageChange,

        // ================================================
        // STATISTICS
        // ================================================

        stats,
        isStatsLoading,
        hasStatsLoaded,

        // ================================================
        // STATUS FILTERS
        // ================================================

        activeStatus,
        statusFilters,
        setActiveStatus,

        // ================================================
        // CREATE
        // ================================================

        isCreateModalOpen,

        handleOpenCreate,
        handleCloseCreate,
        handleCreated,

        // ================================================
        // EDIT
        // ================================================

        editingFeedback,
        isEditModalOpen,

        isUpdating,
        updatingId,

        handleOpenEdit,
        handleCloseEdit,
        handleUpdateFeedback,

        // ================================================
        // DELETE
        // ================================================

        isDeleting,
        deletingId,

        handleDeleteFeedback,

        // ================================================
        // PAGE REQUEST STATE
        // ================================================

        isRefreshing,

        isInitialLoading,
        isMyInitialLoading,
        isStatsInitialLoading,

        error,

        // ================================================
        // REFRESH
        // ================================================

        handleRefresh,
    } = useFeedbackPage();

    // =====================================================
    // DELETE CONFIRMATION
    // =====================================================

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null);

    const deleteLockRef = useRef(false);

    // =====================================================
    // NORMALIZE DATA
    // =====================================================

    const loggedIn = Boolean(isLoggedIn);

    const publicItems =
        Array.isArray(publicFeedbacks)
            ? publicFeedbacks
            : [];

    const myItems =
        Array.isArray(myFeedbacks)
            ? myFeedbacks
            : [];

    // =====================================================
    // INDEPENDENT LOADING STATES
    //
    // Important:
    // Initial loading is only for the corresponding
    // section, never the entire page.
    //
    // Existing data must not disappear while refreshing.
    // =====================================================

    const publicInitialLoading =
        !hasPublicLoaded &&
        publicItems.length === 0 &&
        Boolean(
            isInitialLoading ||
            isPublicLoading
        );

    const myInitialLoading =
        loggedIn &&
        !hasMyLoaded &&
        myItems.length === 0 &&
        Boolean(
            isMyInitialLoading ||
            isMyLoading
        );

    const statsInitialLoading =
        loggedIn &&
        !hasStatsLoaded &&
        Boolean(
            isStatsInitialLoading ||
            isStatsLoading
        );

    // =====================================================
    // GLOBAL MUTATION STATE
    // =====================================================

    const isMutating =
        Boolean(isUpdating || isDeleting);

    // =====================================================
    // DELETE MODAL DATA
    // =====================================================

    const isDeleteModalOpen =
        loggedIn &&
        Boolean(deleteTarget);

    const deleteTargetTitle =
        String(
            deleteTarget?.title ?? ""
        ).trim() || "Feedback";

    // =====================================================
    // AUTH CHANGE
    //
    // Close delete confirmation when user logs out.
    // =====================================================

    useEffect(() => {
        if (!loggedIn) {
            setDeleteTarget(null);
        }
    }, [loggedIn]);

    // =====================================================
    // OPEN DELETE CONFIRMATION
    // =====================================================

    const handleOpenDeleteModal = useCallback(
        (feedback) => {
            if (
                !loggedIn ||
                !feedback ||
                typeof feedback !== "object" ||
                feedback.id == null ||
                isMutating ||
                deleteLockRef.current
            ) {
                return;
            }

            // The backend's permission information
            // takes priority in the helper.
            if (!canModifyFeedback(feedback)) {
                return;
            }

            setDeleteTarget(feedback);
        },
        [
            loggedIn,
            isMutating,
        ]
    );

    // =====================================================
    // CLOSE DELETE CONFIRMATION
    // =====================================================

    const handleCloseDeleteModal = useCallback(
        () => {
            if (
                isDeleting ||
                deleteLockRef.current
            ) {
                return;
            }

            setDeleteTarget(null);
        },
        [isDeleting]
    );

    // =====================================================
    // CONFIRM DELETE
    //
    // A delete request is never sent until confirmed.
    // Duplicate requests are blocked synchronously.
    // =====================================================

    const handleConfirmDelete = useCallback(
        async () => {
            if (
                !loggedIn ||
                !deleteTarget ||
                isMutating ||
                deleteLockRef.current ||
                typeof handleDeleteFeedback !==
                    "function"
            ) {
                return false;
            }

            deleteLockRef.current = true;

            try {
                const success =
                    await handleDeleteFeedback(
                        deleteTarget
                    );

                if (success === true) {
                    setDeleteTarget(null);

                    return true;
                }

                // Keep confirmation open if deletion
                // did not succeed.
                return false;
            } catch (deleteError) {
                console.error(
                    "Feedback deletion failed:",
                    deleteError
                );

                return false;
            } finally {
                deleteLockRef.current = false;
            }
        },
        [
            loggedIn,
            deleteTarget,
            isMutating,
            handleDeleteFeedback,
        ]
    );

    // =====================================================
    // JSX
    //
    // The page is always rendered.
    //
    // No early return with FeedbackSkeleton.
    // No duplicate Hero skeleton.
    // =====================================================

    return (
        <>
            {/* ==========================================
                STABLE PAGE SHELL
            ========================================== */}

            <main
                aria-busy={
                    Boolean(isRefreshing)
                }

                className="
                    relative
                    isolate

                    min-h-screen
                    w-full
                    min-w-0

                    overflow-x-hidden

                    bg-slate-50
                    text-slate-900

                    pb-20

                    font-sans

                    transition-colors
                    duration-200

                    sm:pb-24

                    dark:bg-[#06080d]
                    dark:text-white
                "
            >
                {/* ======================================
                    BACKGROUND DECORATIONS
                ====================================== */}

                <div
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        left-1/2
                        top-0

                        h-[460px]
                        w-[680px]
                        max-w-none

                        -translate-x-1/2

                        rounded-full

                        bg-indigo-500/[0.035]

                        blur-[125px]

                        dark:bg-indigo-600/[0.06]
                    "
                />

                <div
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        -right-36
                        top-[500px]

                        h-[350px]
                        w-[350px]

                        rounded-full

                        bg-cyan-500/[0.025]

                        blur-[110px]

                        dark:bg-cyan-500/[0.04]
                    "
                />

                {/* ======================================
                    CONTENT
                ====================================== */}

                <div
                    className="
                        relative
                        z-10

                        mx-auto

                        w-full
                        max-w-7xl
                        min-w-0

                        px-3
                        py-7

                        sm:px-6
                        sm:py-10

                        lg:px-8
                    "
                >
                    {/* ==============================
                        HERO — ALWAYS VISIBLE
                    ============================== */}

                    <FeedbackHero
                        isRefreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        onCreate={handleOpenCreate}
                    />

                    {/* ==============================
                        GLOBAL ERROR
                    ============================== */}

                    <FeedbackError
                        message={error}
                    />

                    {/* ==============================
                        STATISTICS
                    ============================== */}

                    {loggedIn && (
                        <FeedbackStatsSection
                            stats={stats}

                            isLoading={
                                statsInitialLoading
                            }
                        />
                    )}

                    {/* ==============================
                        MY FEEDBACKS
                    ============================== */}

                    {loggedIn && (
                        <FeedbackMySection
                            myFeedbacks={
                                myItems
                            }

                            myPagination={
                                myPagination
                            }

                            isMyLoading={
                                isMyLoading
                            }

                            isMyInitialLoading={
                                myInitialLoading
                            }

                            activeStatus={
                                activeStatus
                            }

                            statusFilters={
                                statusFilters
                            }

                            onStatusChange={
                                setActiveStatus
                            }

                            isUpdating={
                                isUpdating
                            }

                            updatingId={
                                updatingId
                            }

                            isDeleting={
                                isDeleting
                            }

                            deletingId={
                                deletingId
                            }

                            onEdit={
                                handleOpenEdit
                            }

                            onDelete={
                                handleOpenDeleteModal
                            }

                            onPageChange={
                                handleMyPageChange
                            }
                        />
                    )}

                    {/* ==============================
                        COMMUNITY FEEDBACKS
                    ============================== */}

                    <FeedbackCommunitySection
                        publicFeedbacks={
                            publicItems
                        }

                        publicCount={
                            publicCount
                        }

                        publicPagination={
                            publicPagination
                        }

                        isPublicLoading={
                            isPublicLoading
                        }

                        isInitialLoading={
                            publicInitialLoading
                        }

                        onRetry={
                            handleRefresh
                        }

                        onPageChange={
                            handlePublicPageChange
                        }
                    />
                </div>
            </main>

            {/* ==========================================
                CREATE MODAL
            ========================================== */}

            <FeedbackCreateModal
                isOpen={
                    isCreateModalOpen
                }

                onClose={
                    handleCloseCreate
                }

                onCreated={
                    handleCreated
                }
            />

            {/* ==========================================
                EDIT MODAL
            ========================================== */}

            <FeedbackEditModal
                isOpen={
                    isEditModalOpen
                }

                feedback={
                    editingFeedback
                }

                isSubmitting={
                    isUpdating
                }

                onClose={
                    handleCloseEdit
                }

                onSubmit={
                    handleUpdateFeedback
                }
            />

            {/* ==========================================
                DELETE CONFIRMATION MODAL
            ========================================== */}

            {loggedIn && (
                <DeleteConfirmationModal
                    isOpen={
                        isDeleteModalOpen
                    }

                    onClose={
                        handleCloseDeleteModal
                    }

                    onConfirm={
                        handleConfirmDelete
                    }

                    itemTitle={
                        deleteTargetTitle
                    }

                    isProcessing={
                        isDeleting
                    }
                />
            )}
        </>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default Feedback;
