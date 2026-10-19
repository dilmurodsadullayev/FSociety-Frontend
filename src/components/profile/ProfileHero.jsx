// src/components/profile/ProfileHero.jsx

import React, { memo } from "react";

// =========================================================
// PROFILE HERO COMPONENTS
// =========================================================

import ProfileHeroCover from "./hero/ProfileHeroCover";

import ProfileHeroIdentity from "./hero/ProfileHeroIdentity";

import ProfileHeroActions from "./hero/ProfileHeroActions";

import ProfileHeroInfo from "./hero/ProfileHeroInfo";

import ProfileHeroStats from "./hero/ProfileHeroStats";

// =========================================================
// PROFILE HERO
//
// Responsibilities:
//
// 1. Cover Image
// 2. Avatar / Identity
// 3. Owner Actions
// 4. Information Cards
// 5. Profile Statistics
//
// Existing public props are preserved.
//
// All business logic remains in the parent
// Profile.jsx / useProfilePage.js.
// =========================================================

const ProfileHero = ({
    currentUser,

    isOwner = false,

    botLoading = false,
    isTelegramLinked = false,

    onConnectTelegram,
    onEditCover,
    onEditProfile,
}) => {
    // =====================================================
    // SAFE USER DATA
    // =====================================================

    const user = currentUser || {};

    // =====================================================
    // OWNER ACTION PROPS
    //
    // Telegram, Cover and Profile Edit callbacks
    // are passed unchanged to ProfileHeroActions.
    // =====================================================

    const actionProps = {
        isOwner,
        botLoading,
        isTelegramLinked,

        onConnectTelegram,
        onEditCover,
        onEditProfile,
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Foydalanuvchi profili"
            className="
                min-w-0 overflow-hidden
                rounded-3xl border

                border-slate-200
                bg-white/95

                font-sans text-slate-900

                shadow-[0_18px_60px_rgba(15,23,42,0.08)]

                dark:border-white/[0.08]
                dark:bg-[#0d1117]
                dark:text-slate-100

                dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]
            "
        >
            {/* =====================================
                COVER IMAGE

                Original cover image and fallback
                remain inside ProfileHeroCover.
            ====================================== */}

            <ProfileHeroCover
                coverImage={user.coverImage}
                isOwner={isOwner}
                onEditCover={onEditCover}
            />

            {/* =====================================
                MAIN PROFILE PANEL
            ====================================== */}

            <div
                className="
                    relative z-10 min-w-0
                    px-4 pb-5 sm:px-6
                "
            >
                {/* =================================
                    IDENTITY + DESKTOP ACTIONS

                    The avatar overlap is managed
                    by ProfileHeroIdentity.

                    Existing avatar and name
                    positions are preserved.
                ================================== */}

                <div
                    className="
                        flex min-w-0
                        flex-col gap-3

                        xl:flex-row
                        xl:items-start
                        xl:justify-between
                        xl:gap-5
                    "
                >
                    {/* AVATAR / USER INFORMATION */}

                    <ProfileHeroIdentity
                        currentUser={user}
                    />

                    {/* DESKTOP ACTION BUTTONS */}

                    <ProfileHeroActions
                        {...actionProps}
                        variant="desktop"
                    />
                </div>

                {/* =================================
                    MOBILE / TABLET ACTIONS

                    Visible below xl breakpoint.
                ================================== */}

                <ProfileHeroActions
                    {...actionProps}
                    variant="mobile"
                />

                {/* =====================================
                    PROFILE INFORMATION

                    - Position
                    - Company
                    - Membership date
                    - Website
                    - GitHub
                ====================================== */}

                <ProfileHeroInfo
                    currentUser={user}
                />
            </div>

            {/* =====================================
                PROFILE STATISTICS

                - Rating
                - FCoin
                - Problems
                - Solutions
                - Projects
            ====================================== */}

            <ProfileHeroStats
                currentUser={user}
            />
        </section>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileHero);