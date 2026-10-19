
// src/components/Profile.jsx

import React, { memo } from "react";

import {
    AlertCircle,
    Loader2,
} from "lucide-react";

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
// FSOCIETY — PROFILE PAGE
//
// PAGE RESPONSIBILITIES:
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
// THEME:
//
// - Light Mode
// - Dark Mode
//
// Business logic remains in useProfilePage.js.
//
// Dedicated 404 design is in ProfileNotFound.jsx.
// =========================================================

const Profile = () => {
    // =====================================================
    // CONTROLLER
    // =====================================================

    const {
        // =================================================
        // ROUTE
        // =================================================

        username,

        // =================================================
        // PROFILE
        // =================================================

        profile,
        error,
        isLoading,

        // =================================================
        // PROFILE REQUEST STATUS
        //
        // Provided by useProfilePage.js.
        // =================================================

        profileStatus,
        profileErrorStatus,

        isNotFound,
        notFoundUsername,

        // =================================================
        // ROUTE SAFETY / PERMISSIONS
        // =================================================

        profileMatchesRoute,
        isOwner,

        // =================================================
        // VIEW MODEL
        // =================================================

        currentUser,
        birthdayStatus,

        // =================================================
        // TELEGRAM
        // =================================================

        botLoading,
        isTelegramLinked,

        // =================================================
        // TABS
        // =================================================

        activeTab,
        setActiveTab,

        // =================================================
        // MODALS
        // =================================================

        isEditModalOpen,
        isCoverModalOpen,

        // =================================================
        // LOADING
        // =================================================

        isInitialLoading,
        isRefreshing,

        // =================================================
        // RETRY
        // =================================================

        retryProfile,

        // =================================================
        // TELEGRAM CALLBACKS
        // =================================================

        handleConnectTelegramBot,

        // =================================================
        // EDIT PROFILE CALLBACKS
        // =================================================

        handleOpenEditModal,
        handleCloseEditModal,

        // =================================================
        // COVER CALLBACKS
        // =================================================

        handleOpenCoverModal,
        handleCloseCoverModal,
    } = useProfilePage();

    // =====================================================
    // 1. USER NOT FOUND — HTTP 404
    //
    // This condition must be checked BEFORE skeleton.
    //
    // Example:
    //
    // /s/profile
    //
    // Backend:
    // GET /api/users/s/profile/
    // HTTP 404
    //
    // Controller:
    //
    // profileStatus = "not_found"
    // isNotFound = true
    //
    // UI:
    //
    // ProfileNotFound.jsx
    //
    // Important:
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
    //
    // - Network errors
    // - Server errors
    // - Other request failures
    //
    // The dedicated NotFound page has already
    // handled HTTP 404 above.
    //
    // A failed request for a different username
    // must not display stale profile content.
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
    //
    // - Cover skeleton
    // - Avatar skeleton
    // - Profile information skeleton
    // - Sidebar skeleton
    // - Badges skeleton
    // - Content skeleton
    //
    // Light / Dark Mode supported.
    // =====================================================

    if (isInitialLoading) {
        return <ProfileSkeleton />;
    }

    // =====================================================
    // 4. ROUTE SAFETY
    //
    // Previously loaded user data must not be
    // shown under a different username.
    //
    // The hook updates the request state when
    // a new username is requested.
    // =====================================================

    if (!profileMatchesRoute) {
        // If the controller has reported a terminal
        // error, render the retry UI rather than
        // leaving the user on a skeleton forever.

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
    // When the loaded profile already matches
    // the current username, preserve the page
    // during a background refresh.
    // =====================================================

    const showRefreshIndicator =
        Boolean(isRefreshing);

    // =====================================================
    // BACKGROUND REFRESH ERROR
    //
    // Only show errors from the current profile.
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
    //
    // - User is not missing
    // - Initial load is finished
    // - Profile matches the route
    //
    // Existing page design is preserved.
    // =====================================================

    return (
        <main
            className="
                relative
                isolate

                min-h-screen
                w-full
                min-w-0

                bg-[#f4f7fc]
                text-slate-900

                transition-colors
                duration-300

                dark:bg-[#0d1117]
                dark:text-[#e6edf3]
            "
        >
            {/* =============================================
                MAIN CONTAINER
            ============================================== */}

            <div
                className="
                    container
                    relative
                    z-10

                    mx-auto
                    min-w-0

                    p-3

                    font-sans

                    sm:p-4
                    md:p-6
                "
            >
                {/* =========================================
                    PROFILE HERO
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
                    - Sidebar / Content layout
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
                            min-w-0
                            w-full
                        "
                    >
                        <ProfileSidebar
                            currentUser={currentUser}
                            birthdayStatus={birthdayStatus}
                            username={username}
                        />
                    </div>

                    {/* =====================================
                        PROFILE CONTENT

                        - Posts
                        - Projects
                        - Roadmap
                        - Other existing tabs
                    ====================================== */}

                    <div
                        className="
                            min-w-0
                            w-full
                        "
                    >
                        <ProfileContent
                            username={username}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>
                </div>

                {/* =========================================
                    PROFILE MODALS
                    Only owner can edit profile.
                ========================================== */}

                {isOwner && (
                    <>
                        {/* =================================
                            EDIT PROFILE MODAL
                        ================================== */}

                        <EditProfileModal
                            profileData={profile}
                            isOpen={isEditModalOpen}
                            onClose={handleCloseEditModal}
                        />

                        {/* =================================
                            COVER IMAGE MODAL
                        ================================== */}

                        <CoverImageEditModal
                            isOpen={isCoverModalOpen}
                            currentCoverImage={
                                currentUser?.coverImage
                            }
                            onClose={handleCloseCoverModal}
                        />
                    </>
                )}

                {/* =========================================
                    BACKGROUND REFRESH INDICATOR

                    Preserve existing profile content
                    while a refresh is in progress.

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
                        {/* =================================
                            LOADING ICON
                        ================================== */}

                        <Loader2
                            size={15}
                            className="
                                shrink-0

                                animate-spin

                                motion-reduce:animate-none
                            "
                            aria-hidden="true"
                        />

                        {/* =================================
                            LOADING TEXT
                        ================================== */}

                        <span>
                            Profil yangilanmoqda
                        </span>
                    </div>
                )}

                {/* =========================================
                    BACKGROUND REFRESH ERROR

                    Existing profile remains visible.

                    Display only for genuine refresh
                    failures on the current route.
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
                        {/* =================================
                            ERROR ICON
                        ================================== */}

                        <AlertCircle
                            size={16}
                            className="
                                mt-0.5
                                shrink-0

                                text-red-600

                                dark:text-red-400
                            "
                            aria-hidden="true"
                        />

                        {/* =================================
                            ERROR MESSAGE
                        ================================== */}

                        <span
                            className="
                                min-w-0
                                flex-1

                                break-words
                            "
                        >
                            {backgroundErrorMessage}
                        </span>

                        {/* =================================
                            OPTIONAL STATUS
                        ================================== */}

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
