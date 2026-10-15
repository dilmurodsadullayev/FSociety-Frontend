
import React from "react";

// =========================================================
// EXISTING COMPONENTS
// =========================================================

import ProjectDiscussion from "./ProjectDiscussion";

import ProjectLoadingSkeleton from "./ProjectLoadingSkeleton";

import DeleteConfirmationModal from "./DeleteConfirmationModal";

import ProjectFormModal from "./projects/CreateProjectModal";

// =========================================================
// PROJECT DETAIL COMPONENTS
// =========================================================

import ProjectDetailHeader from "./projectDetail/ProjectDetailHeader";

import ProjectDetailOverview from "./projectDetail/ProjectDetailOverview";

import ProjectDetailSidebar from "./projectDetail/ProjectDetailSidebar";

import ProjectDetailErrorState from "./projectDetail/ProjectDetailErrorState";

// =========================================================
// CONTROLLER
// =========================================================

import useProjectDetailController from "./projectDetail/useProjectDetailController";

// =========================================================
// FSOCIETY — PROJECT DETAIL PAGE
//
// Architecture:
//
// ProjectDetail.jsx
//     ├── useProjectDetailController
//     │     ├── Redux / API
//     │     ├── Auth / permissions
//     │     ├── Star / Unstar
//     │     ├── Edit / Delete
//     │     └── Promotion refresh
//     │
//     ├── ProjectDetailHeader
//     │     ├── PromotionBadge
//     │     ├── ProjectDetailOwnerControls
//     │     └── ProjectGallery
//     │
//     ├── ProjectDetailOverview
//     │     └── ProjectCollaboration
//     │
//     ├── ProjectDetailSidebar
//     │     ├── ProjectPromotion
//     │     ├── Author
//     │     ├── Technology stack
//     │     └── External links
//     │
//     ├── ProjectDiscussion
//     ├── ProjectFormModal
//     └── DeleteConfirmationModal
//
// Dark / Light Mode supported.
// =========================================================

// =========================================================
// MAIN PROJECT DETAIL
// =========================================================

const ProjectDetail = () => {
    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        // ================================================
        // ROUTE
        // ================================================

        projectId,

        // ================================================
        // AUTH
        // ================================================

        user,

        // ================================================
        // PROJECT
        // ================================================

        projectData,
        projectTitle,
        projectImages,
        author,

        // ================================================
        // CONTENT
        // ================================================

        featuresList,
        projectLanguages,
        projectTechnologies,

        // ================================================
        // PERMISSIONS
        // ================================================

        isOwner,
        isCollaborator,

        // ================================================
        // PROMOTION
        // ================================================

        isPromoted,
        promotionExpiresAt,

        // ================================================
        // FETCH
        // ================================================

        isLoading,
        error,
        loadProject,
        refreshProject,

        // ================================================
        // STAR
        // ================================================

        isStarred,
        isStarLoading,
        handleStarToggle,

        // ================================================
        // EDIT
        // ================================================

        isEditModalOpen,
        isUpdating,
        handleOpenEditModal,
        handleCloseEditModal,
        handleUpdateProject,

        // ================================================
        // DELETE
        // ================================================

        isDeleteModalOpen,
        isDeleting,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmDelete,
    } = useProjectDetailController();

    // =====================================================
    // INVALID PROJECT ID
    // =====================================================

    if (!projectId) {
        return (
            <ProjectDetailErrorState
                projectId={null}

                error="Loyiha ID ko‘rsatilmagan."

                onRetry={undefined}

                isLoading={false}
            />
        );
    }

    // =====================================================
    // LOADING
    //
    // Use existing ProjectLoadingSkeleton.
    // =====================================================

    if (isLoading && !projectData) {
        return (
            <div
                className="
                    min-h-screen
                    min-w-0

                    bg-[#edf2fa]

                    dark:bg-[#05070a]
                "
            >
                <ProjectLoadingSkeleton />
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <ProjectDetailErrorState
                projectId={projectId}

                error={error}

                onRetry={() => {
                    loadProject();
                }}

                isLoading={isLoading}
            />
        );
    }

    // =====================================================
    // PROJECT NOT YET AVAILABLE
    //
    // Prevent flashing an error state before the
    // initial asynchronous request starts.
    // =====================================================

    if (!projectData?.id) {
        return (
            <div
                className="
                    min-h-screen
                    min-w-0

                    bg-[#edf2fa]

                    dark:bg-[#05070a]
                "
            >
                <ProjectLoadingSkeleton />
            </div>
        );
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative
                isolate

                min-h-screen
                min-w-0
                overflow-hidden

                bg-[#edf2fa]
                text-slate-900

                dark:bg-[#05070a]
                dark:text-white
            "
        >
            {/* ======================================
                BACKGROUND GRID
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-0

                    opacity-[0.025]

                    text-slate-900

                    [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)]
                    [background-size:58px_58px]

                    dark:opacity-[0.018]
                    dark:text-white
                "
            />

            {/* ======================================
                TOP AMBIENT GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none
                    absolute

                    left-1/2
                    top-20

                    hidden
                    h-[450px]
                    w-[450px]

                    -translate-x-1/2

                    rounded-full

                    bg-indigo-500/[0.07]

                    blur-[125px]

                    sm:block

                    dark:bg-indigo-600/[0.10]
                "
            />

            {/* ======================================
                RIGHT AMBIENT GLOW
            ====================================== */}

            <div
                aria-hidden="true"

                className="
                    pointer-events-none
                    absolute

                    -right-40
                    top-1/3

                    hidden
                    h-[380px]
                    w-[380px]

                    rounded-full

                    bg-purple-500/[0.055]

                    blur-[115px]

                    sm:block

                    dark:bg-purple-500/[0.07]
                "
            />

            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <main
                className="
                    relative
                    z-10

                    mx-auto

                    w-full
                    min-w-0
                    max-w-[1520px]

                    px-4
                    pb-16
                    pt-24

                    sm:px-6
                    sm:pb-20

                    md:pt-28

                    xl:px-8
                "
            >
                {/* ==================================
                    PROJECT CONTAINER
                ================================== */}

                <div
                    className="
                        min-w-0
                        overflow-hidden

                        rounded-[22px]
                        border
                        border-[#dce5f0]

                        bg-white/90

                        shadow-[0_24px_70px_rgba(15,23,42,0.065)]

                        sm:rounded-[28px]

                        dark:border-white/[0.07]
                        dark:bg-[#0b1018]/95

                        dark:shadow-[0_40px_110px_rgba(0,0,0,0.35)]
                    "
                >
                    {/* ==================================
                        PROJECT HEADER

                        - Title / description
                        - Promotion badge
                        - Edit / delete
                        - Star / unstar
                        - Statistics
                        - Gallery
                    ================================== */}

                    <ProjectDetailHeader
                        projectData={projectData}

                        projectTitle={projectTitle}

                        projectImages={projectImages}

                        isPromoted={isPromoted}

                        promotionExpiresAt={
                            promotionExpiresAt
                        }

                        isOwner={isOwner}

                        isUpdating={isUpdating}

                        isDeleting={isDeleting}

                        isStarred={isStarred}

                        isStarLoading={
                            isStarLoading
                        }

                        onStarToggle={
                            handleStarToggle
                        }

                        onEdit={
                            handleOpenEditModal
                        }

                        onDelete={
                            handleOpenDeleteModal
                        }
                    />

                    {/* ==================================
                        CONTENT GRID

                        Left:
                        Project information
                        Collaboration

                        Right:
                        Promotion
                        Author
                        Tech stack
                        External links
                    ================================== */}

                    <div
                        className="
                            grid
                            min-w-0
                            grid-cols-1

                            xl:grid-cols-[minmax(0,1fr)_520px]
                        "
                    >
                        {/* ==============================
                            MAIN OVERVIEW
                        ============================== */}

                        <ProjectDetailOverview
                            projectData={projectData}

                            featuresList={featuresList}

                            author={author}

                            isOwner={isOwner}

                            isCollaborator={
                                isCollaborator
                            }

                            projectId={projectId}
                        />

                        {/* ==============================
                            PROJECT SIDEBAR
                        ============================== */}

                        <ProjectDetailSidebar
                            projectData={projectData}

                            projectTitle={projectTitle}

                            author={author}

                            projectLanguages={
                                projectLanguages
                            }

                            projectTechnologies={
                                projectTechnologies
                            }

                            isOwner={isOwner}

                            userCoins={
                                user?.coins
                            }

                            onPromotionChange={
                                refreshProject
                            }
                        />
                    </div>

                    {/* ==================================
                        PROJECT DISCUSSION
                    ================================== */}

                    <ProjectDiscussion
                        projectId={projectId}
                    />
                </div>
            </main>

            {/* ======================================
                EDIT PROJECT MODAL
            ====================================== */}

            {isOwner && (
                <ProjectFormModal
                    isOpen={
                        isEditModalOpen
                    }

                    onClose={
                        handleCloseEditModal
                    }

                    onSubmit={
                        handleUpdateProject
                    }

                    initialData={
                        projectData
                    }

                    isSubmitting={
                        isUpdating
                    }
                />
            )}

            {/* ======================================
                DELETE PROJECT MODAL
            ====================================== */}

            {isOwner && (
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
                        projectTitle
                    }

                    isProcessing={
                        isDeleting
                    }
                />
            )}
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ProjectDetail;
