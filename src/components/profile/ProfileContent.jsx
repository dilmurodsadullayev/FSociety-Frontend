
 // src/components/profile/ProfileContent.jsx

import React, { memo, useId } from "react";

import ProfilePosts from "./ProfilePosts";
import ProfileProjects from "./ProfileProjects";
import ProfileRoadmap from "./ProfileRoadmap";

import ProfileContentTabs from "./content/ProfileContentTabs";

// =========================================================
// PROFILE CONTENT
//
// Original parent contract is unchanged:
// - username
// - activeTab
// - onTabChange
//
// The existing Posts / Projects / Roadmap components
// retain ownership of their API calls, pagination,
// Redux state, loading states and modals.
//
// Only the active child component is mounted, matching
// the previous behavior when users switch tabs.
// =========================================================

const ProfileContent = ({
    username,
    activeTab = "projects",
    onTabChange,
}) => {
    const generatedId = useId();

    const idPrefix = `profile-content-${generatedId}`;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            aria-label="Profil kontenti"
            className="min-w-0"
        >
            {/* =====================================
                TAB NAVIGATION

                - Projects
                - Posts / Answers
                - Roadmap
            ====================================== */}

            <ProfileContentTabs
                activeTab={activeTab}
                onTabChange={onTabChange}
                idPrefix={idPrefix}
            />

            {/* =====================================
                CONTENT PANELS

                All three panel elements exist for
                valid accessibility references.

                Their inner components mount only
                when the corresponding tab is active.
            ====================================== */}

            {/* =====================================
                PROJECTS
            ====================================== */}

            <div
                id={`${idPrefix}-panel-projects`}
                role="tabpanel"
                aria-labelledby={`${idPrefix}-tab-projects`}
                tabIndex={0}
                hidden={activeTab !== "projects"}
                className="
                    min-w-0 space-y-4
                "
            >
                {activeTab === "projects" && (
                    <ProfileProjects
                        username={username}
                    />
                )}
            </div>

            {/* =====================================
                POSTS / ANSWERS
            ====================================== */}

            <div
                id={`${idPrefix}-panel-posts`}
                role="tabpanel"
                aria-labelledby={`${idPrefix}-tab-posts`}
                tabIndex={0}
                hidden={activeTab !== "posts"}
                className="
                    min-w-0 space-y-4
                "
            >
                {activeTab === "posts" && (
                    <ProfilePosts
                        username={username}
                    />
                )}
            </div>

            {/* =====================================
                ROADMAP
            ====================================== */}

            <div
                id={`${idPrefix}-panel-roadmap`}
                role="tabpanel"
                aria-labelledby={`${idPrefix}-tab-roadmap`}
                tabIndex={0}
                hidden={activeTab !== "roadmap"}
                className="
                    min-w-0 space-y-4
                "
            >
                {activeTab === "roadmap" && (
                    <ProfileRoadmap
                        username={username}
                    />
                )}
            </div>
        </section>
    );
};

export default memo(ProfileContent);
