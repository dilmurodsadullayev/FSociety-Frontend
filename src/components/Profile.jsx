
// src/components/Profile.jsx

import React, { memo } from "react";

import {
    AlertCircle,
    Loader2,
} from "lucide-react";

// =========================================================
// FSOCIETY — SHARED FUTURISTIC BACKGROUND
// =========================================================

import PageGridBackground from "./ui/PageGridBackground";

// =========================================================
// PROFILE CONTROLLER
// =========================================================

import useProfilePage from "./profile/useProfilePage";

// =========================================================
// PROFILE COMPONENTS
// =========================================================

import ProfileHero from "./profile/ProfileHero";
import ProfileSidebar from "./profile/ProfileSidebar";
import ProfileContent from "./profile/ProfileContent";
import ProfileSkeleton from "./profile/ProfileSkeleton";
import ProfileError from "./profile/ProfileError";
import ProfileNotFound from "./profile/ProfileNotFound";

// =========================================================
// PROFILE MODALS
// =========================================================

import EditProfileModal from "./profile/EditProfileModal";
import CoverImageEditModal from "./profile/CoverImageEditModal";

// =========================================================
// PAGE STYLES
//
// The page background follows the same design system
// used by ProjectDetail.jsx.
//
// Important:
// - PageGridBackground owns its overflow clipping.
// - Foreground remains above decorative elements.
// - No interference with buttons or modals.
// - Light / Dark Mode.
// =========================================================

const PROFILE_PAGE_CLASS = `
    relative
    isolate

    min-h-screen

    w-full
    min-w-0

    bg-[#edf4ff]
    text-slate-900

    transition-colors
    duration-300

    dark:bg-[#060b15]
    dark:text-white

    motion-reduce:transition-none
`;

const PROFILE_CONTAINER_CLASS = `
    container

    relative
    z-10

    mx-auto

    w-full
    min-w-0

    p-3

    font-sans

    sm:p-4
    md:p-6
`;

// =========================================================
// FSOCIETY — PROFILE PAGE
//
// Responsibilities:
//
// - Profile loading
// - Profile not found (HTTP 404)
// - Generic API errors
// - Route safety
// - Hero / Cover image
// - Sidebar
// - Posts / Projects / Roadmap
// - Profile edit modal
// - Cover edit modal
// - Telegram connection actions
// - Background refresh indicator
// - Background refresh error
//
// New:
//
// - Shared PageGridBackground
// - Consistent Light / Dark page theme
// - Decorative FSociety branding
//
// Business logic remains in useProfilePage.js.
// =========================================================

const Profile = () => {
    // =====================================================
    // PROFILE CONTROLLER
    // =====================================================

    const {
        // ================================================
        // ROUTE
        // ================================================

        username,

        // ================================================
        // PROFILE
        // ================================================

        profile,
        error,
        isLoading,

        // ================================================
        // PROFILE REQUEST STATUS
        // ================================================

        profileStatus,
        profileErrorStatus,

        isNotFound,
        notFoundUsername,

        // ================================================
        // ROUTE SAFETY / PERMISSIONS
        // ================================================

        profileMatchesRoute,
        isOwner,

        // ================================================
        // VIEW MODEL
        // ================================================

        currentUser,
        birthdayStatus,

        // ================================================
        // TELEGRAM
        // ================================================

        botLoading,
        isTelegramLinked,

        // ================================================
        // TABS
        // ================================================

        activeTab,
        setActiveTab,

        // ================================================
        // MODALS
        // ================================================

        isEditModalOpen,
        isCoverModalOpen,

        // ================================================
        // LOADING
        // ================================================

        isInitialLoading,
        isRefreshing,

        // ================================================
        // RETRY
        // ================================================

        retryProfile,

        // ================================================
        // TELEGRAM CALLBACKS
        // ================================================

        handleConnectTelegramBot,

        // ================================================
        // EDIT PROFILE CALLBACKS
        // ================================================

        handleOpenEditModal,
        handleCloseEditModal,

        // ================================================
        // COVER CALLBACKS
        // ================================================

        handleOpenCoverModal,
        handleCloseCoverModal,
    } = useProfilePage();

    // =====================================================
    // 1. USER NOT FOUND — HTTP 404
    //
    // This condition must be checked before skeleton.
    //
    // Do not render an old user's profile.
    // Do not render an infinite skeleton.
    // Do not render a generic server error.
    // =====================================================

    if (isNotFound) {
        return (
            <ProfileNotFound
                username={
                    notFoundUsername || username
                }
            />
        );
    }

    // =====================================================
    // 2. INITIAL / ROUTE ERROR
    //
    // Handles:
    // - Network errors
    // - Server errors
    // - Other request failures
    //
    // HTTP 404 is already handled above.
    // =====================================================

    if (
        error &&
        !profileMatchesRoute &&
        !isLoading
    ) {
        return (
            <ProfileError
                username={username}
                error={error}
                onRetry={retryProfile}
                isRetrying={isLoading}
            />
        );
    }

    // =====================================================
    // 3. INITIAL / ROUTE LOADING
    //
    // ProfileSkeleton handles:
    // - Cover skeleton
    // - Avatar skeleton
    // - Profile information skeleton
    // - Sidebar skeleton
    // - Badges skeleton
    // - Content skeleton
    // =====================================================

    if (isInitialLoading) {
        return <ProfileSkeleton />;
    }

    // =====================================================
    // 4. ROUTE SAFETY
    //
    // Previously loaded user data must not be shown
    // under a different username.
    // =====================================================

    if (!profileMatchesRoute) {
        if (
            profileStatus === "error" &&
            !isLoading
        ) {
            return (
                <ProfileError
                    username={username}
                    error={error}
                    onRetry={retryProfile}
                    isRetrying={isLoading}
                />
            );
        }

        return <ProfileSkeleton />;
    }

    // =====================================================
    // 5. BACKGROUND REFRESH STATES
    //
    // Preserve existing profile content while refresh
    // is in progress.
    // =====================================================

    const showRefreshIndicator =
        Boolean(isRefreshing);

    // =====================================================
    // BACKGROUND REFRESH ERROR
    //
    // Display errors only for the current profile.
    // =====================================================

    const showBackgroundError =
        Boolean(error) &&
        Boolean(profileMatchesRoute) &&
        !isLoading &&
        !isNotFound;

    // =====================================================
    // SAFE ERROR MESSAGE
    // =====================================================

    const backgroundErrorMessage =
        typeof error === "string" &&
        error.trim()
            ? error
            : "Profilni yangilab bo‘lmadi.";

    // =====================================================
    // 6. PROFILE CONTENT
    //
    // At this point:
    // - User exists
    // - Initial load has finished
    // - Profile matches the current route
    // =====================================================

    return (
        <main className={PROFILE_PAGE_CLASS}>
            {/* =============================================
                FSOCIETY FUTURISTIC BACKGROUND

                Shared with ProjectDetail.

                Features:
                - Blueprint grid
                - Developer network
                - Geometric lines
                - Illuminated nodes
                - Glass-like 3D cubes
                - Cyan / Indigo / Violet glows
                - FS brand watermarks
                - Light / Dark Mode

                This component:
                - Is decorative
                - Has pointer-events-none
                - Uses z-0
                - Does not block profile interactions
            ============================================== */}

            <PageGridBackground
                showMonogram
                showCubes
            />

            {/* =============================================
                PROFILE FOREGROUND CONTENT

                z-10 keeps the profile above the
                decorative background.
            ============================================== */}

            <div className={PROFILE_CONTAINER_CLASS}>
                {/* =========================================
                    PROFILE HERO

                    Features preserved:
                    - Cover image
                    - Avatar
                    - User information
                    - Telegram connection
                    - Edit profile
                    - Edit cover
                ========================================== */}

                <ProfileHero
                    currentUser={currentUser}
                    isOwner={isOwner}
                    botLoading={botLoading}
                    isTelegramLinked={isTelegramLinked}
                    onConnectTelegram={
                        handleConnectTelegramBot
                    }
                    onEditCover={
                        handleOpenCoverModal
                    }
                    onEditProfile={
                        handleOpenEditModal
                    }
                />

                {/* =========================================
                    PROFILE BODY

                    Mobile:
                    - Single column

                    Desktop:
                    - Sidebar
                    - Profile content

                    Existing responsive layout preserved.
                ========================================== */}

                <div
                    className="
                        mt-6

                        grid
                        min-w-0

                        grid-cols-1

                        items-start
                        gap-6

                        lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]
                    "
                >
                    {/* =====================================
                        PROFILE SIDEBAR
                    ====================================== */}

                    <div
                        className="
                            w-full
                            min-w-0
                        "
                    >
                        <ProfileSidebar
                            currentUser={currentUser}
                            birthdayStatus={
                                birthdayStatus
                            }
                            username={username}
                        />
                    </div>

                    {/* =====================================
                        PROFILE CONTENT

                        Preserved:
                        - Posts
                        - Projects
                        - Roadmap
                        - Other existing tabs
                    ====================================== */}

                    <div
                        className="
                            w-full
                            min-w-0
                        "
                    >
                        <ProfileContent
                            username={username}
                            activeTab={activeTab}
                            onTabChange={
                                setActiveTab
                            }
                        />
                    </div>
                </div>

                {/* =========================================
                    PROFILE MODALS

                    Only profile owners can edit
                    profile information and cover.
                ========================================== */}

                {isOwner && (
                    <>
                        {/* =================================
                            EDIT PROFILE MODAL
                        ================================== */}

                        <EditProfileModal
                            profileData={profile}
                            isOpen={isEditModalOpen}
                            onClose={
                                handleCloseEditModal
                            }
                        />

                        {/* =================================
                            COVER IMAGE MODAL
                        ================================== */}

                        <CoverImageEditModal
                            isOpen={isCoverModalOpen}
                            currentCoverImage={
                                currentUser?.coverImage
                            }
                            onClose={
                                handleCloseCoverModal
                            }
                        />
                    </>
                )}

                {/* =========================================
                    BACKGROUND REFRESH INDICATOR

                    Existing profile remains visible.

                    Light / Dark Mode supported.
                ========================================== */}

                {showRefreshIndicator && (
                    <div
                        role="status"
                        aria-live="polite"
                        aria-label="Profil yangilanmoqda"
                        className="
                            pointer-events-none

                            fixed
                            bottom-5
                            right-4

                            z-50

                            inline-flex

                            max-w-[calc(100vw-2rem)]

                            items-center
                            gap-2.5

                            rounded-2xl
                            border

                            border-indigo-200
                            bg-white/95

                            px-4
                            py-3

                            font-display

                            text-[10px]
                            font-semibold

                            uppercase
                            tracking-[0.08em]

                            text-indigo-700

                            shadow-xl
                            shadow-slate-900/10

                            backdrop-blur-xl

                            sm:right-5

                            dark:border-indigo-400/15
                            dark:bg-[#0b0e14]/95
                            dark:text-indigo-300

                            dark:shadow-2xl
                            dark:shadow-black/30
                        "
                    >
                        {/* =============================
                            LOADING ICON
                        ============================== */}

                        <Loader2
                            size={15}
                            aria-hidden="true"
                            className="
                                shrink-0

                                animate-spin

                                motion-reduce:animate-none
                            "
                        />

                        {/* =============================
                            LOADING TEXT
                        ============================== */}

                        <span>
                            Profil yangilanmoqda
                        </span>
                    </div>
                )}

                {/* =========================================
                    BACKGROUND REFRESH ERROR

                    Existing profile remains visible.

                    Display only genuine errors from
                    the current profile request.
                ========================================== */}

                {showBackgroundError && (
                    <div
                        role="alert"
                        className="
                            fixed
                            bottom-5
                            left-4

                            z-40

                            flex

                            w-[calc(100vw-2rem)]
                            max-w-md

                            items-start
                            gap-2.5

                            rounded-2xl
                            border

                            border-red-200
                            bg-red-50/95

                            px-4
                            py-3

                            text-[11px]
                            font-medium
                            leading-5

                            text-red-800

                            shadow-xl
                            shadow-red-900/5

                            backdrop-blur-xl

                            sm:left-5
                            sm:w-auto

                            dark:border-red-400/15
                            dark:bg-[#0b0e14]/95
                            dark:text-red-300

                            dark:shadow-xl
                            dark:shadow-black/30
                        "
                    >
                        {/* =============================
                            ERROR ICON
                        ============================== */}

                        <AlertCircle
                            size={16}
                            aria-hidden="true"
                            className="
                                mt-0.5
                                shrink-0

                                text-red-600
                                dark:text-red-400
                            "
                        />

                        {/* =============================
                            ERROR MESSAGE
                        ============================== */}

                        <span
                            className="
                                min-w-0
                                flex-1

                                break-words
                            "
                        >
                            {backgroundErrorMessage}
                        </span>

                        {/* =============================
                            OPTIONAL HTTP STATUS
                        ============================== */}

                        {profileErrorStatus &&
                            profileErrorStatus !== 404 && (
                                <span
                                    className="
                                        shrink-0

                                        rounded-md

                                        bg-red-100

                                        px-1.5
                                        py-0.5

                                        font-mono
                                        text-[10px]

                                        text-red-700

                                        dark:bg-red-500/10
                                        dark:text-red-300
                                    "
                                >
                                    {profileErrorStatus}
                                </span>
                            )}
                    </div>
                )}
            </div>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(Profile);
