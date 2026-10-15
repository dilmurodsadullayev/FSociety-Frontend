
import React from "react";

// =========================================================
// EXISTING COMPONENTS
// =========================================================

import DeleteConfirmationModal from "./DeleteConfirmationModal";

// =========================================================
// PROJECT DISCUSSION COMPONENTS
// =========================================================

import DiscussionHeader from "./projectDiscussion/DiscussionHeader";

import DiscussionCommentForm from "./projectDiscussion/DiscussionCommentForm";

import DiscussionCommentList from "./projectDiscussion/DiscussionCommentList";

import DiscussionSidebar from "./projectDiscussion/DiscussionSidebar";

import CommentEditModal from "./projectDiscussion/CommentEditModal";

// =========================================================
// CONTROLLER
// =========================================================

import useProjectDiscussion from "./projectDiscussion/useProjectDiscussion";

// =========================================================
// HELPERS
// =========================================================

import {
    getCommentDeleteTitle,
} from "./projectDiscussion/discussionHelpers";

// =========================================================
// FSOCIETY — PROJECT DISCUSSION
//
// Architecture:
//
// ProjectDiscussion.jsx
//
// ├── useProjectDiscussion
// │   ├── Redux
// │   ├── Django REST API
// │   ├── Authentication
// │   ├── Load comments
// │   ├── Create comment
// │   ├── Update comment
// │   ├── Delete comment
// │   ├── Toast notifications
// │   └── Modal states
// │
// ├── DiscussionHeader
// │   ├── Title
// │   ├── Comment count
// │   └── Refresh
// │
// ├── DiscussionCommentForm
// │   ├── User avatar
// │   ├── Comment textarea
// │   ├── $tag helper
// │   ├── Validation
// │   └── Submit
// │
// ├── DiscussionCommentList
// │   ├── Error state
// │   ├── Loading state
// │   ├── Empty state
// │   └── ProjectCommentCard
// │       ├── User profile
// │       ├── Comment body
// │       ├── $tag highlighting
// │       ├── Expand / collapse
// │       ├── Edit
// │       └── Delete
// │
// ├── DiscussionSidebar
// │   ├── Statistics
// │   └── FSociety tip
// │
// ├── CommentEditModal
// │
// └── DeleteConfirmationModal
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - Original API contracts preserved
// - Existing Redux actions preserved
// - Existing delete confirmation preserved
//
// No direct Redux or API calls in this component.
// =========================================================

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProjectDiscussion = ({
    projectId,
}) => {
    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        // ================================================
        // AUTH
        // ================================================

        isLoggedIn,
        user,

        // ================================================
        // COMMENTS
        // ================================================

        comments,
        commentsCount,

        isLoading,
        error,

        refreshComments,

        // ================================================
        // CREATE COMMENT
        // ================================================

        newCommentText,
        handleNewCommentChange,

        isSubmitting,
        submitError,

        addProjectComment,

        // ================================================
        // EDIT COMMENT
        // ================================================

        isEditModalOpen,
        editingComment,

        editCommentText,
        handleEditCommentChange,

        isUpdating,
        updateError,

        handleEditClick,
        handleCloseEditModal,
        handleUpdateComment,

        // ================================================
        // DELETE COMMENT
        // ================================================

        isDeleteModalOpen,
        commentToDelete,

        isDeleting,

        handleDeleteClick,
        handleCloseDeleteModal,
        handleConfirmDelete,

    } = useProjectDiscussion({
        projectId,
    });

    // =====================================================
    // DELETE CONFIRMATION TITLE
    //
    // Keep the original 55-character preview.
    // =====================================================

    const deleteItemTitle =
        getCommentDeleteTitle(
            commentToDelete?.body
        );

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            id="project-discussion"

            aria-labelledby="project-discussion-title"

            className="
                relative
                isolate

                w-full
                min-w-0

                border-t
                border-[#e0e7f1]

                bg-[#f8faff]/60

                dark:border-white/[0.07]
                dark:bg-black/[0.05]
            "
        >
            {/* ======================================
                BACKGROUND ACCENT
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none

                    absolute
                    inset-x-0
                    top-0

                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-indigo-500/15
                    to-transparent

                    dark:via-indigo-400/10
                "
            />

            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    w-full
                    min-w-0

                    px-4
                    py-7

                    sm:px-6
                    sm:py-9

                    lg:px-8
                    lg:py-10

                    xl:px-10
                    xl:py-12
                "
            >
                {/* ==================================
                    DISCUSSION HEADER

                    - Title
                    - Comments count
                    - Refresh button
                ================================== */}

                <DiscussionHeader
                    commentsCount={
                        commentsCount
                    }

                    isLoading={
                        isLoading
                    }

                    onRefresh={
                        refreshComments
                    }
                />

                {/* ==================================
                    DISCUSSION LAYOUT

                    Main column:
                    - Comment form
                    - Comment list

                    Sidebar:
                    - Discussion statistics
                    - Community tip
                ================================== */}

                <div
                    className="
                        mt-7

                        grid
                        w-full
                        min-w-0

                        grid-cols-1

                        items-start
                        content-start

                        gap-6

                        xl:grid-cols-[minmax(0,1fr)_320px]
                        xl:gap-7
                    "
                >
                    {/* ==============================
                        LEFT — DISCUSSION CONTENT
                    ============================== */}

                    <div
                        className="
                            flex
                            w-full
                            min-w-0

                            flex-col
                            items-stretch
                            justify-start

                            gap-6
                        "
                    >
                        {/* ==========================
                            CREATE COMMENT FORM
                        ========================== */}

                        <DiscussionCommentForm
                            user={
                                user
                            }

                            isLoggedIn={
                                isLoggedIn
                            }

                            newCommentText={
                                newCommentText
                            }

                            onChange={
                                handleNewCommentChange
                            }

                            onSubmit={
                                addProjectComment
                            }

                            isSubmitting={
                                isSubmitting
                            }

                            submitError={
                                submitError
                            }
                        />

                        {/* ==========================
                            COMMENTS LIST

                            - API errors
                            - Loading
                            - Empty state
                            - Comments
                            - Edit / Delete callbacks
                        ========================== */}

                        <DiscussionCommentList
                            comments={
                                comments
                            }

                            isLoading={
                                isLoading
                            }

                            error={
                                error
                            }

                            onRetry={
                                refreshComments
                            }

                            currentUser={
                                user
                            }

                            isLoggedIn={
                                isLoggedIn
                            }

                            onEdit={
                                handleEditClick
                            }

                            onDelete={
                                handleDeleteClick
                            }
                        />
                    </div>

                    {/* ==============================
                        RIGHT — DISCUSSION SIDEBAR

                        Visible on XL screens.
                        Does not stretch comment cards.
                    ============================== */}

                    <DiscussionSidebar
                        commentsCount={
                            commentsCount
                        }

                        isLoading={
                            isLoading
                        }
                    />
                </div>
            </div>

            {/* ======================================
                EDIT COMMENT MODAL

                Rendered through React Portal.
            ====================================== */}

            <CommentEditModal
                isOpen={
                    isEditModalOpen
                }

                comment={
                    editingComment
                }

                value={
                    editCommentText
                }

                onChange={
                    handleEditCommentChange
                }

                onClose={
                    handleCloseEditModal
                }

                onSave={
                    handleUpdateComment
                }

                isUpdating={
                    isUpdating
                }

                error={
                    updateError
                }
            />

            {/* ======================================
                DELETE COMMENT MODAL

                Existing confirmation component
                and its props are preserved.
            ====================================== */}

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
                    deleteItemTitle
                }

                isProcessing={
                    isDeleting
                }
            />
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProjectDiscussion
);
