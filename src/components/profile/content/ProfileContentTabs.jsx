
 // src/components/profile/content/ProfileContentTabs.jsx

import React, { memo, useRef } from "react";

// =========================================================
// PROFILE CONTENT TAB DEFINITIONS
//
// Keep these keys in sync with the existing Profile page:
// - projects
// - posts
// - roadmap
// =========================================================

const PROFILE_TABS = [
    { key: "projects", label: "Loyihalar" },
    { key: "posts", label: "Postlar / Javoblar" },
    { key: "roadmap", label: "Yo‘l xaritasi" },
];

// =========================================================
// PROFILE CONTENT TABS
//
// The active tab is controlled by ProfileContent / Profile.jsx.
// This component does not fetch data or own tab state.
//
// Keyboard:
// - ArrowRight / ArrowLeft: switch tabs
// - Home / End: first / last tab
// - Tab: move into the selected tab panel
// =========================================================

const ProfileContentTabs = ({
    activeTab = "projects",
    onTabChange,
    idPrefix,
}) => {
    const tabRefs = useRef({});

    const changeTab = (nextTab) => {
        if (
            nextTab !== activeTab &&
            typeof onTabChange === "function"
        ) {
            onTabChange(nextTab);
        }
    };

    const handleKeyDown = (event, index) => {
        let nextIndex;

        switch (event.key) {
            case "ArrowRight":
                nextIndex = (index + 1) % PROFILE_TABS.length;
                break;

            case "ArrowLeft":
                nextIndex =
                    (index - 1 + PROFILE_TABS.length) %
                    PROFILE_TABS.length;
                break;

            case "Home":
                nextIndex = 0;
                break;

            case "End":
                nextIndex = PROFILE_TABS.length - 1;
                break;

            default:
                return;
        }

        event.preventDefault();

        const nextTab = PROFILE_TABS[nextIndex].key;

        tabRefs.current[nextTab]?.focus();
        changeTab(nextTab);
    };

    return (
        <div
            className="
                mb-5 min-w-0
                border-b border-slate-200
                dark:border-white/10
            "
        >
            <div
                role="tablist"
                aria-label="Profil bo‘limlari"
                className="
                    flex min-w-0 gap-1
                    overflow-x-auto
                    overscroll-x-contain
                "
            >
                {PROFILE_TABS.map((tab, index) => {
                    const active = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            ref={(element) => {
                                tabRefs.current[tab.key] = element;
                            }}
                            id={`${idPrefix}-tab-${tab.key}`}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            aria-controls={`${idPrefix}-panel-${tab.key}`}
                            tabIndex={active ? 0 : -1}
                            onClick={() => changeTab(tab.key)}
                            onKeyDown={(event) =>
                                handleKeyDown(event, index)
                            }
                            className={`
                                relative shrink-0
                                whitespace-nowrap

                                border-b-2
                                px-4 py-3.5

                                text-sm font-black
                                transition-colors

                                sm:px-5 sm:py-4

                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-inset
                                focus-visible:ring-indigo-500

                                ${
                                    active
                                        ? `
                                            border-indigo-600
                                            bg-indigo-50/70
                                            text-indigo-700

                                            dark:border-indigo-400
                                            dark:bg-indigo-500/10
                                            dark:text-white
                                        `
                                        : `
                                            border-transparent
                                            text-slate-600

                                            hover:border-slate-300
                                            hover:bg-slate-100/70
                                            hover:text-slate-900

                                            dark:text-slate-400
                                            dark:hover:border-slate-600
                                            dark:hover:bg-white/[0.04]
                                            dark:hover:text-white
                                        `
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(ProfileContentTabs);
