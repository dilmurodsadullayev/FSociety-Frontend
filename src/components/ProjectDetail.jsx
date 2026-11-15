
import React, { memo } from "react";

// =========================================================
// EXISTING COMPONENTS
// =========================================================

import ProjectDiscussion from "./ProjectDiscussion";

import ProjectLoadingSkeleton from "./projects/ProjectLoadingSkeleton";

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
// SHARED PAGE STYLES
// =========================================================
//
// IMPORTANT:
//
// The global WinterBackground is rendered in App.jsx.
//
// This page must remain transparent so that the
// global winter image or original PageGridBackground
// remains visible behind the page.
//
// =========================================================

const PAGE_CLASS = `
    relative
    isolate

    min-h-screen
    w-full
    min-w-0

    overflow-hidden

    bg-transparent
    text-slate-900

    dark:bg-transparent
    dark:text-white
`;

const CONTENT_CLASS = `
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
`;

const PROJECT_CONTAINER_CLASS = `
    min-w-0
    overflow-hidden

    rounded-[22px]

    border
    border-[#dce5f0]

    bg-white/75

    shadow-[0_24px_70px_rgba(15,23,42,0.065)]

    backdrop-blur-md

    sm:rounded-[28px]

    dark:border-white/[0.07]
    dark:bg-[#0b1018]/80

    dark:shadow-[0_40px_110px_rgba(0,0,0,0.35)]
`;

// =========================================================
// PROJECT DETAIL PAGE SHELL
// =========================================================
//
// Shared for:
//
// - Initial loading
// - Invalid project ID
// - API errors
// - Main project content
//
// Background is provided globally by App.jsx.
//
// No local PageGridBackground is rendered.
//
// =========================================================

const ProjectDetailPageShell = memo(
    function ProjectDetailPageShell({
        children,
        className = "",
    }) {
        return (
            <div
                className={PAGE_CLASS}
                style={{
                    background: "transparent",
                    backgroundColor: "transparent",
                    backgroundImage: "none",
                }}
            >

                {/* ======================================
                    GLOBAL BACKGROUND

                    Managed by App.jsx.

                    Winter ON:
                    - Dark: winter-dark.webp
                    - Light: winter-light.webp

                    Winter OFF:
                    - Original PageGridBackground

                    No duplicate background here.
                ====================================== */}


                {/* ======================================
                    FOREGROUND CONTENT
                ====================================== */}

                <div
                    className={`
                        relative
                        z-10

                        min-w-0

                        ${className}
                    `}
                >
                    {children}
                </div>

            </div>
        );
    }
);

// =========================================================
// PROJECT DETAIL LOADING
// =========================================================
//
// Keeps the existing ProjectLoadingSkeleton.
//
// Uses the same global background as the main page.
//
// =========================================================

const ProjectDetailLoading = memo(
    function ProjectDetailLoading() {
        return (
            <ProjectDetailPageShell>
                <div
                    role="status"
                    aria-label="Loyiha ma’lumotlari yuklanmoqda"
                    className="
                        min-h-screen
                        min-w-0
                    "
                >
                    <span className="sr-only">
                        Loyiha ma’lumotlari yuklanmoqda.
                    </span>

                    <ProjectLoadingSkeleton />
                </div>
            </ProjectDetailPageShell>
        );
    }
);

// =========================================================
// PROJECT DETAIL ERROR
// =========================================================
//
// Keeps the existing error component and retry support.
//
// Uses the same global background as the main page.
//
// =========================================================

const ProjectDetailError = memo(
    function ProjectDetailError({
        projectId,
        error,
        onRetry,
        isLoading = false,
    }) {
        return (
            <ProjectDetailPageShell>
                <ProjectDetailErrorState
                    projectId={projectId}
                    error={error}
                    onRetry={onRetry}
                    isLoading={isLoading}
                />
            </ProjectDetailPageShell>
        );
    }
);

// =========================================================
// FSOCIETY — PROJECT DETAIL PAGE
// =========================================================
//
// Architecture:
//
// ProjectDetail.jsx
//     ├── ProjectDetailPageShell
//     │     └── Global WinterBackground
//     │
//     ├── useProjectDetailController
//     │     ├── Redux / API
//     │     ├── Authentication
//     │     ├── Permissions
//     │     ├── Star / Unstar
//     │     ├── Edit / Delete
//     │     └── Promotion refresh
//     │
//     ├── ProjectDetailHeader
//     ├── ProjectDetailOverview
//     ├── ProjectDetailSidebar
//     ├── ProjectDiscussion
//     ├── ProjectFormModal
//     └── DeleteConfirmationModal
//
// Existing behavior is preserved.
//
// Background is managed only by App.jsx.
//
// =========================================================


// =========================================================
// PROJECT DETAIL COMPONENT
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
            <ProjectDetailError
                projectId={null}
                error="Loyiha ID ko‘rsatilmagan."
                onRetry={undefined}
                isLoading={false}
            />
        );
    }


    // =====================================================
    // INITIAL LOADING
    // =====================================================
    //
    // Keep the existing skeleton while the project
    // data has not been loaded.
    //
    // =====================================================

    if (isLoading && !projectData) {
        return <ProjectDetailLoading />;
    }


    // =====================================================
    // API ERROR
    // =====================================================
    //
    // Preserve the existing retry function.
    //
    // =====================================================

    if (error) {
        return (
            <ProjectDetailError
                projectId={projectId}
                error={error}
                onRetry={loadProject}
                isLoading={isLoading}
            />
        );
    }


    // =====================================================
    // PROJECT NOT YET AVAILABLE
    // =====================================================
    //
    // Avoid displaying an error before the initial
    // asynchronous request has started.
    //
    // =====================================================

    if (!projectData?.id) {
        return <ProjectDetailLoading />;
    }


    // =====================================================
    // MAIN PROJECT PAGE
    // =====================================================

    return (
        <div
            className={PAGE_CLASS}
            style={{
                background: "transparent",
                backgroundColor: "transparent",
                backgroundImage: "none",
            }}
        >

            {/* ======================================
                GLOBAL BACKGROUND

                Managed by App.jsx.

                Same background is used across:

                - Home
                - Projects
                - ProjectDetail
                - Users
                - Problems
                - Feedback

                No local PageGridBackground is rendered.
            ====================================== */}


            {/* ======================================
                PROJECT CONTENT

                Existing spacing and layout preserved.

                All interactive content stays above
                the global decorative background.
            ====================================== */}

            <main className={CONTENT_CLASS}>

                {/* ==================================
                    PROJECT CONTAINER
                ================================== */}

                <div className={PROJECT_CONTAINER_CLASS}>

                    {/* ==============================
                        PROJECT HEADER

                        Preserved:

                        - Title and description
                        - Promotion badge
                        - Owner controls
                        - Edit / Delete
                        - Star / Unstar
                        - Statistics
                        - Gallery
                    ============================== */}

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


                    {/* ==============================
                        CONTENT GRID

                        Left:
                        - Project overview
                        - Collaboration

                        Right:
                        - Promotion
                        - Author
                        - Languages
                        - Technologies
                        - External links
                    ============================== */}

                    <div
                        className="
                            grid
                            min-w-0
                            grid-cols-1

                            xl:grid-cols-[minmax(0,1fr)_520px]
                        "
                    >

                        {/* ==========================
                            MAIN OVERVIEW
                        ========================== */}

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


                        {/* ==========================
                            PROJECT SIDEBAR
                        ========================== */}

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


                    {/* ==============================
                        PROJECT DISCUSSION
                    ============================== */}

                    <ProjectDiscussion
                        projectId={projectId}
                    />

                </div>

            </main>


            {/* ======================================
                EDIT PROJECT MODAL

                Kept outside the main container to
                preserve the previous modal layout.

                Only project owners can open it.
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

                Confirmation is preserved.

                Only project owners can open it.
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

export default memo(ProjectDetail);
