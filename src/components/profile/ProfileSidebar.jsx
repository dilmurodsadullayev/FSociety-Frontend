
 // src/components/profile/ProfileSidebar.jsx

import React, { memo } from "react";

// =========================================================
// PROFILE COMPONENTS
// =========================================================

import ProfileBadges from "./ProfileBadges";

import ProfileSidebarDetails from "./sidebar/ProfileSidebarDetails";

import ProfileSidebarAbout from "./sidebar/ProfileSidebarAbout";

import ProfileSidebarSkills from "./sidebar/ProfileSidebarSkills";

// =========================================================
// PROFILE SIDEBAR
//
// Existing public props:
//
// - currentUser
// - birthdayStatus
// - username
//
// Structure:
//
// 1. Personal Details
// 2. About Me
// 3. Skills
// 4. Profile Badges
//
// All original business integrations are preserved.
// =========================================================

const ProfileSidebar = ({
    currentUser,
    birthdayStatus,
    username,
}) => {
    // =====================================================
    // SAFE USER DATA
    // =====================================================

    const user = currentUser || {};

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <aside
            aria-label="Profil qo‘shimcha ma’lumotlari"
            className="
                min-w-0
                space-y-6
            "
        >
            {/* =========================================
                PERSONAL DETAILS + ABOUT ME

                Both components stay inside one
                shared card to preserve the
                original layout and spacing.
            ========================================== */}

            <section
                className="
                    min-w-0
                    rounded-3xl
                    border

                    border-slate-200
                    bg-white/95
                    p-4

                    shadow-[0_12px_35px_rgba(15,23,42,0.055)]

                    dark:border-white/[0.08]
                    dark:bg-[#0d1117]
                    dark:shadow-[0_15px_35px_rgba(0,0,0,0.2)]

                    sm:p-5
                "
            >
                {/* =====================================
                    PERSONAL DETAILS

                    - Full Name
                    - Birthday
                    - Location
                    - Email
                    - Website
                    - GitHub
                    - Telegram Bot
                ====================================== */}

                <ProfileSidebarDetails
                    currentUser={user}
                    birthdayStatus={birthdayStatus}
                />

                {/* =====================================
                    ABOUT ME

                    - Biography
                    - Multiline text
                    - Empty state
                ====================================== */}

                <ProfileSidebarAbout
                    about={user.aboutMe}
                />
            </section>

            {/* =========================================
                SKILLS

                - Technology colors
                - Count
                - Responsive chips
                - Empty state

                Extracted to:
                sidebar/ProfileSidebarSkills.jsx
            ========================================== */}

            <ProfileSidebarSkills
                skills={user.skills}
            />

            {/* =========================================
                PROFILE BADGES

                Original component is reused.

                Its existing Redux, API requests,
                loading and badge functionality
                are not changed.
            ========================================== */}

            <ProfileBadges
                username={username}
            />
        </aside>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileSidebar);
