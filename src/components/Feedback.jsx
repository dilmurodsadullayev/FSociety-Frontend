
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
// SHARED UI
// =========================================================

import PageGridBackground from "./ui/PageGridBackground";
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
// CONTROLLER / HELPERS
// =========================================================

import useFeedbackPage from "./feedback/useFeedbackPage";
import { canModifyFeedback } from "./feedback/feedbackHelpers";

// =========================================================
// GLOBAL ERROR
// =========================================================

const FeedbackError = React.memo(function FeedbackError({
    message,
}) {
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
// FSOCIETY — FEEDBACK PAGE
//
// - Shared futuristic background
// - Stable Hero, independent section loaders
// - Public and user feedback pagination
// - Create / Edit / Delete
// - Existing Redux and API contracts retained
// - Light / Dark Mode
// =========================================================

const Feedback = () => {
    // =====================================================
    // PAGE CONTROLLER
    // =====================================================

    const {
        // Authentication
        isLoggedIn,

        // Public feedbacks
        publicFeedbacks,
        publicCount,
        publicPagination,
        isPublicLoading,
        hasPublicLoaded,
        handlePublicPageChange,

        // My feedbacks
        myFeedbacks,
        myPagination,
        isMyLoading,
        hasMyLoaded,
        handleMyPageChange,

        // Statistics
        stats,
        isStatsLoading,
        hasStatsLoaded,

        // Status filter
        activeStatus,
        statusFilters,
        setActiveStatus,

        // Create
        isCreateModalOpen,
        handleOpenCreate,
        handleCloseCreate,
        handleCreated,

        // Edit
        editingFeedback,
        isEditModalOpen,
        isUpdating,
        updatingId,
        handleOpenEdit,
        handleCloseEdit,
        handleUpdateFeedback,

        // Delete
        isDeleting,
        deletingId,
        handleDeleteFeedback,

        // Loading / refresh / errors
        isRefreshing,
        isInitialLoading,
        isMyInitialLoading,
        isStatsInitialLoading,
        error,
        handleRefresh,
    } = useFeedbackPage();

    // =====================================================
    // DELETE CONFIRMATION STATE
    // =====================================================

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null);

    const deleteLockRef = useRef(false);

    // =====================================================
    // SAFE DATA
    // =====================================================

    const loggedIn = Boolean(isLoggedIn);

    const publicItems = Array.isArray(publicFeedbacks)
        ? publicFeedbacks
        : [];

    const myItems = Array.isArray(myFeedbacks)
        ? myFeedbacks
        : [];

    // =====================================================
    // INDEPENDENT SECTION LOADING
    //
    // No full-page skeleton.
    // Existing data remains visible while refreshing.
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

    const isMutating = Boolean(
        isUpdating ||
        isDeleting
    );

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

            // Existing backend-permission-aware helper.
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
    // A delete request is only sent after confirmation.
    // Duplicate requests are blocked synchronously.
    // =====================================================

    const handleConfirmDelete = useCallback(
        async () => {
            if (
                !loggedIn ||
                !deleteTarget ||
                isMutating ||
                deleteLockRef.current ||
                typeof handleDeleteFeedback !== "function"
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

                // Keep confirmation open if deletion failed.
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
    // RENDER
    // =====================================================

    return (
        <>
            {/* ==========================================
                STABLE PAGE SHELL
            ========================================== */}

            <main
                aria-busy={Boolean(isRefreshing)}

                className="
                    relative
                    isolate

                    min-h-screen
                    w-full
                    min-w-0

                    overflow-x-hidden

                    bg-[#edf4ff]

                    pb-20

                    font-sans
                    text-slate-900

                    sm:pb-24

                    dark:bg-[#060b15]
                    dark:text-white
                "
            >
                {/* ======================================
                    SHARED FUTURISTIC BACKGROUND

                    Same background as:
                    - Users
                    - Problems

                    Includes:
                    - Grid
                    - Network lines
                    - Glowing nodes
                    - Translucent cubes
                    - FS watermark

                    Does not intercept user interaction.
                ====================================== */}

                <PageGridBackground showMonogram />

                {/* ======================================
                    CONTENT CONTAINER

                    z-10 keeps all interactive content
                    above the decorative background.
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

                        No duplicate Hero skeleton.
                    ============================== */}

                    <FeedbackHero
                        isRefreshing={isRefreshing}

                        onRefresh={
                            handleRefresh
                        }

                        onCreate={
                            handleOpenCreate
                        }
                    />

                    {/* ==============================
                        GLOBAL ERROR
                    ============================== */}

                    <FeedbackError
                        message={error}
                    />

                    {/* ==============================
                        STATISTICS

                        Independent loading state.
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

                        Preserved:
                        - Status filtering
                        - Edit
                        - Delete
                        - Pagination
                        - Loading states
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

                        Preserved:
                        - Public feedbacks
                        - Public count
                        - Pagination
                        - Independent skeleton
                        - Refresh / Retry
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

                Remains outside the page stacking context.
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

                Only available to authenticated users.
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
