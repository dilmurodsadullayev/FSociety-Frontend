
import React from "react";

import {
    CheckCircle2,
    Clock3,
    Loader2,
    Settings2,
    UserPlus,
    Users,
} from "lucide-react";

// =========================================================
// PROJECT COLLABORATION COMPONENTS
// =========================================================

import {
    CollaborationMemberCard,
} from "./projectCollaboration/CollaborationCards";

import JoinCollaborationModal from "./projectCollaboration/JoinCollaborationModal";

import ManageCollaboratorsModal from "./projectCollaboration/ManageCollaboratorsModal";

// =========================================================
// CONTROLLER
// =========================================================

import useProjectCollaboration from "./projectCollaboration/useProjectCollaboration";

// =========================================================
// FSOCIETY — PROJECT COLLABORATION
//
// Architecture:
//
// ProjectCollaboration.jsx
//   ├── useProjectCollaboration
//   │     ├── Redux
//   │     ├── Fetch collaborators
//   │     ├── Fetch requests
//   │     ├── Send join request
//   │     ├── Accept / reject request
//   │     └── Modal state
//   │
//   ├── CollaborationMemberCard
//   │     ├── Project owner
//   │     └── Active collaborators
//   │
//   ├── JoinCollaborationModal
//   │     └── CollaborationModalFrame
//   │
//   └── ManageCollaboratorsModal
//         ├── CollaborationModalFrame
//         ├── CollaborationRequestCard
//         └── CollaborationCollaboratorRow
//
// Dark / Light Mode supported.
//
// No direct API calls here.
// =========================================================

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProjectCollaboration = ({
    projectId,

    projectOwner,

    isOwner = false,

    isCollaborator = false,

    hasSentRequest = false,

    currentCollaborators,
    pendingRequests,
}) => {
    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        // ================================================
        // AUTH
        // ================================================

        isOwner: currentUserIsOwner,

        isCollaborator:
            currentUserIsCollaborator,

        hasSentRequest:
            currentUserHasSentRequest,

        // ================================================
        // TEAM
        // ================================================

        currentCollaborators:
            collaborationMembers,

        displayedCollaborators,

        totalMembers,

        // ================================================
        // REQUESTS
        // ================================================

        pendingRequests:
            collaborationRequests,

        // ================================================
        // LOADING / ERROR
        // ================================================

        collaboratorsLoading,
        requestsLoading,
        requestError,
        isActionLoading,

        // ================================================
        // JOIN MODAL
        // ================================================

        showJoinModal,
        handleOpenJoinModal,
        handleCloseJoinModal,

        selectedRole,
        setSelectedRole,

        comment,
        setComment,

        joinRequestError,
        isJoining,

        sendJoinRequest,

        // ================================================
        // MANAGE MODAL
        // ================================================

        showManageModal,
        handleOpenManageModal,
        handleCloseManageModal,

        activeTab,
        setActiveTab,

        isManaging,
        managingRequestId,

        acceptRequest,
        rejectRequest,

        // ================================================
        // REFRESH
        // ================================================

        refreshCollaboration,
    } = useProjectCollaboration({
        projectId,
        projectOwner,

        isOwner,
        isCollaborator,
        hasSentRequest,

        currentCollaborators,
        pendingRequests,
    });

    // =====================================================
    // SAFE OWNER
    // =====================================================

    const owner = projectOwner || {};

    const hasOwner =
        owner.id != null ||
        Boolean(owner.username);

    // =====================================================
    // STATISTICS
    // =====================================================

    const displayedMemberCount = hasOwner
        ? totalMembers
        : displayedCollaborators.length;

    const pendingCount =
        collaborationRequests.length;

    // =====================================================
    // JOIN BUTTON STATUS
    // =====================================================

    const joinBusy =
        isJoining ||
        isActionLoading;

    // =====================================================
    // REFRESH CALLBACK FOR MODAL
    // =====================================================

    const handleRefresh = () => {
        return refreshCollaboration({
            silent: false,
        });
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            aria-labelledby="project-collaboration-title"

            className="
                relative

                w-full
                min-w-0

                self-start
                overflow-hidden

                bg-white/40

                px-4
                py-5

                sm:px-6
                sm:py-6

                lg:px-8

                xl:px-10
                xl:py-7

                dark:bg-transparent
            "
        >
            {/* ======================================
                HEADER
            ====================================== */}

            <div
                className="
                    flex
                    min-w-0

                    flex-col
                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* ==================================
                    TITLE
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    {/* ICON */}

                    <div
                        className="
                            grid
                            h-10
                            w-10
                            shrink-0
                            place-items-center

                            rounded-xl
                            border
                            border-indigo-400/25

                            bg-indigo-500/[0.08]

                            text-indigo-700

                            dark:border-indigo-400/15
                            dark:bg-indigo-400/[0.07]
                            dark:text-indigo-300
                        "
                    >
                        <Users
                            size={20}
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    </div>

                    {/* TITLE / COUNT */}

                    <div className="min-w-0">
                        <h2
                            id="project-collaboration-title"

                            className="
                                text-[18px]
                                font-black
                                tracking-tight

                                text-slate-900

                                sm:text-xl

                                dark:text-white
                            "
                        >
                            Loyiha jamoasi
                        </h2>

                        <p
                            className="
                                mt-1

                                font-mono
                                text-[10px]
                                font-semibold

                                text-slate-500

                                dark:text-gray-500
                            "
                        >
                            {collaboratorsLoading
                                ? "Hamkorlar yuklanmoqda..."
                                : `${displayedMemberCount} ta a’zo`}
                        </p>
                    </div>
                </div>

                {/* ==================================
                    OWNER MANAGEMENT BUTTON
                ================================== */}

                {currentUserIsOwner && (
                    <button
                        type="button"

                        onClick={handleOpenManageModal}

                        aria-haspopup="dialog"

                        className="
                            inline-flex
                            min-h-10

                            items-center
                            justify-center
                            gap-2

                            self-start

                            rounded-xl
                            border
                            border-indigo-400/30

                            bg-indigo-500/[0.08]

                            px-3.5
                            py-2.5

                            text-[11px]
                            font-bold

                            text-indigo-700

                            transition-colors

                            hover:bg-indigo-500/[0.13]

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            dark:border-indigo-400/20
                            dark:bg-indigo-400/[0.07]
                            dark:text-indigo-300

                            dark:hover:bg-indigo-400/[0.12]
                        "
                    >
                        <Settings2
                            size={16}
                            aria-hidden="true"
                        />

                        <span>
                            Hamkorlarni boshqarish
                        </span>

                        {/* REQUEST COUNT */}

                        <span
                            className="
                                inline-flex
                                min-w-5
                                items-center
                                justify-center

                                rounded-md

                                bg-indigo-500/[0.10]

                                px-1.5
                                py-0.5

                                font-mono
                                text-[10px]

                                dark:bg-indigo-400/[0.12]
                            "
                        >
                            {requestsLoading
                                ? "..."
                                : pendingCount}
                        </span>
                    </button>
                )}
            </div>

            {/* ======================================
                TEAM MEMBERS

                Important layout rules:
                - Natural content height
                - No h-full
                - No min-h-screen
                - No justify-between
                - No mt-auto
            ====================================== */}

            <div
                className="
                    mt-5

                    grid
                    w-full
                    min-w-0
                    grid-cols-1

                    content-start
                    items-start

                    gap-3

                    sm:grid-cols-2
                "
            >
                {/* ==================================
                    PROJECT OWNER
                ================================== */}

                {hasOwner && (
                    <CollaborationMemberCard
                        user={owner}
                        isProjectOwner
                    />
                )}

                {/* ==================================
                    ACTIVE COLLABORATORS
                ================================== */}

                {!collaboratorsLoading &&
                    displayedCollaborators.map(
                        (collaborator, index) => (
                            <CollaborationMemberCard
                                key={
                                    collaborator.id ??
                                    collaborator.user?.id ??
                                    `collaborator-${index}`
                                }

                                user={
                                    collaborator.user
                                }

                                role={
                                    collaborator.role
                                }
                            />
                        )
                    )}
            </div>

            {/* ======================================
                LOADING INDICATOR
            ====================================== */}

            {collaboratorsLoading && (
                <div
                    role="status"

                    className="
                        mt-3

                        flex
                        items-center
                        gap-2

                        text-[11px]
                        font-semibold

                        text-indigo-700

                        dark:text-indigo-300
                    "
                >
                    <Loader2
                        size={15}
                        aria-hidden="true"

                        className="
                            animate-spin
                            motion-reduce:animate-none
                        "
                    />

                    Hamkorlar yuklanmoqda...
                </div>
            )}

            {/* ======================================
                EMPTY OWNER STATE
            ====================================== */}

            {!hasOwner &&
                !collaboratorsLoading &&
                displayedCollaborators.length === 0 && (
                    <p
                        className="
                            mt-4

                            rounded-xl
                            border
                            border-dashed
                            border-[#dce5f0]

                            bg-slate-50

                            p-4

                            text-xs
                            font-medium

                            text-slate-500

                            dark:border-white/[0.08]
                            dark:bg-white/[0.025]
                            dark:text-gray-400
                        "
                    >
                        Jamoa a’zolari haqida
                        ma’lumot topilmadi.
                    </p>
                )}

            {/* ======================================
                JOIN / PENDING / COLLABORATOR STATUS

                This block directly follows
                the team cards.

                No excessive vertical spacing.
            ====================================== */}

            {!currentUserIsOwner && (
                <div
                    className="
                        mt-4
                        w-full
                        min-w-0
                    "
                >
                    {/* ==============================
                        ALREADY A COLLABORATOR
                    ============================== */}

                    {currentUserIsCollaborator ? (
                        <div
                            role="status"

                            className="
                                flex
                                min-h-11
                                w-full

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-emerald-300/60

                                bg-emerald-500/[0.08]

                                px-4
                                py-3

                                text-xs
                                font-bold

                                text-emerald-700

                                dark:border-emerald-400/20
                                dark:bg-emerald-400/[0.08]
                                dark:text-emerald-300
                            "
                        >
                            <CheckCircle2
                                size={17}
                                aria-hidden="true"
                            />

                            Siz ushbu loyiha hamkorisiz!
                        </div>

                    ) : currentUserHasSentRequest ? (
                        /* ==========================
                            PENDING REQUEST
                        ========================== */

                        <div
                            role="status"

                            className="
                                flex
                                min-h-11
                                w-full

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-amber-300/60

                                bg-amber-500/[0.07]

                                px-4
                                py-3

                                text-xs
                                font-bold

                                text-amber-800

                                dark:border-amber-400/20
                                dark:bg-amber-400/[0.07]
                                dark:text-amber-300
                            "
                        >
                            <Clock3
                                size={17}
                                aria-hidden="true"
                            />

                            Hamkorlik so‘rovingiz
                            kutilmoqda
                        </div>

                    ) : (
                        /* ==========================
                            JOIN BUTTON
                        ========================== */

                        <button
                            type="button"

                            onClick={
                                handleOpenJoinModal
                            }

                            disabled={joinBusy}

                            aria-haspopup="dialog"

                            className="
                                inline-flex
                                min-h-11
                                w-full

                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-indigo-500/60

                                bg-indigo-600

                                px-4
                                py-3

                                text-xs
                                font-bold

                                text-white

                                transition-colors

                                hover:bg-indigo-700

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500
                                focus-visible:ring-offset-2

                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                dark:focus-visible:ring-offset-[#0b1018]
                            "
                        >
                            {joinBusy ? (
                                <Loader2
                                    size={17}
                                    aria-hidden="true"

                                    className="
                                        animate-spin
                                        motion-reduce:animate-none
                                    "
                                />
                            ) : (
                                <UserPlus
                                    size={17}
                                    aria-hidden="true"
                                />
                            )}

                            <span>
                                {joinBusy
                                    ? "Yuborilmoqda..."
                                    : "Loyihaga qo‘shilish"}
                            </span>
                        </button>
                    )}
                </div>
            )}

            {/* ======================================
                JOIN MODAL
            ====================================== */}

            {!currentUserIsOwner && (
                <JoinCollaborationModal
                    isOpen={
                        showJoinModal
                    }

                    onClose={
                        handleCloseJoinModal
                    }

                    onSend={
                        sendJoinRequest
                    }

                    selectedRole={
                        selectedRole
                    }

                    onRoleChange={
                        setSelectedRole
                    }

                    comment={
                        comment
                    }

                    onCommentChange={
                        setComment
                    }

                    error={
                        joinRequestError
                    }

                    isSubmitting={
                        isJoining ||
                        isActionLoading
                    }
                />
            )}

            {/* ======================================
                OWNER MANAGEMENT MODAL
            ====================================== */}

            {currentUserIsOwner && (
                <ManageCollaboratorsModal
                    isOpen={
                        showManageModal
                    }

                    onClose={
                        handleCloseManageModal
                    }

                    activeTab={
                        activeTab
                    }

                    onTabChange={
                        setActiveTab
                    }

                    requests={
                        collaborationRequests
                    }

                    collaborators={
                        collaborationMembers
                    }

                    requestsLoading={
                        requestsLoading
                    }

                    collaboratorsLoading={
                        collaboratorsLoading
                    }

                    requestError={
                        requestError
                    }

                    isActionLoading={
                        isManaging
                    }

                    managingRequestId={
                        managingRequestId
                    }

                    onAccept={
                        acceptRequest
                    }

                    onReject={
                        rejectRequest
                    }

                    onRefresh={
                        handleRefresh
                    }
                />
            )}
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    ProjectCollaboration
);
