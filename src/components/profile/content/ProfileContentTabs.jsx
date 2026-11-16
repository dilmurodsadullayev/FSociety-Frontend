
// src/components/profile/content/ProfileContentTabs.jsx

import React, { memo, useRef } from "react";

// =========================================================
// PROFILE CONTENT TAB DEFINITIONS
//
// Keep these keys in sync with the existing Profile page:
//
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
// ACTIVE TAB TEXT STYLE
//
// FSOCIETY AMBER GLOW
//
// IMPORTANT:
//
// - Only the active tab name becomes yellow.
// - No yellow background.
// - No yellow border.
// - No yellow surrounding container.
//
// Color: #FBBF24 — Amber 400
// =========================================================

const ACTIVE_TAB_TEXT_STYLE = {
    color: "#FBBF24",

    textShadow: `
        0 0 5px rgba(251, 191, 36, 0.45),
        0 0 12px rgba(251, 191, 36, 0.35),
        0 0 24px rgba(251, 191, 36, 0.18)
    `,
};

// =========================================================
// PROFILE CONTENT TABS
//
// The active tab is controlled by ProfileContent / Profile.jsx.
//
// This component does not fetch data or own tab state.
//
// Keyboard:
//
// - ArrowRight / ArrowLeft: switch tabs
// - Home / End: first / last tab
// - Tab: move into the selected tab panel
//
// Visual:
//
// - Glassmorphism navigation container
// - Neutral surrounding surface
// - Active tab name glows amber
// - No yellow button background
// - No yellow border
// =========================================================

const ProfileContentTabs = ({
    activeTab = "projects",
    onTabChange,
    idPrefix,
}) => {
    // =====================================================
    // TAB REFERENCES
    // =====================================================

    const tabRefs = useRef({});

    // =====================================================
    // CHANGE TAB
    // =====================================================

    const changeTab = (nextTab) => {
        if (
            nextTab !== activeTab &&
            typeof onTabChange === "function"
        ) {
            onTabChange(nextTab);
        }
    };

    // =====================================================
    // KEYBOARD NAVIGATION
    //
    // ArrowRight / ArrowLeft / Home / End
    // =====================================================

    const handleKeyDown = (event, index) => {
        let nextIndex;

        switch (event.key) {
            case "ArrowRight":
                nextIndex =
                    (index + 1) % PROFILE_TABS.length;
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

        // Move keyboard focus.

        tabRefs.current[nextTab]?.focus();

        // Update active tab.

        changeTab(nextTab);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                relative
                mb-5
                min-w-0
                w-full
            "
        >
            {/* =============================================
                GLASS NAVIGATION CONTAINER

                Neutral surface.

                Light:
                - Soft white glass
                - Subtle slate border
                - Gentle shadow

                Dark:
                - Deep navy glass
                - Subtle white border
                - Soft dark shadow
            ============================================== */}

            <div
                className="
                    relative

                    min-w-0
                    w-full

                    overflow-hidden

                    rounded-2xl
                    border

                    border-slate-200/80
                    bg-white/75

                    p-1.5

                    shadow-[0_8px_28px_rgba(15,23,42,0.045)]

                    backdrop-blur-xl

                    transition-colors
                    duration-200

                    dark:border-white/[0.075]
                    dark:bg-[#0b1220]/65

                    dark:shadow-[0_12px_35px_rgba(0,0,0,0.22)]
                "
            >
                {/* =========================================
                    SUBTLE TOP LIGHT
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        inset-x-8
                        top-0

                        h-px

                        bg-gradient-to-r

                        from-transparent
                        via-slate-300/60
                        to-transparent

                        dark:via-white/[0.08]
                    "
                />

                {/* =========================================
                    TAB NAVIGATION
                ========================================== */}

                <div
                    role="tablist"
                    aria-label="Profil bo‘limlari"
                    className="
                        relative

                        flex
                        min-w-0
                        items-center

                        gap-1

                        overflow-x-auto
                        overscroll-x-contain

                        rounded-xl
                    "
                >
                    {PROFILE_TABS.map((tab, index) => {
                        const active =
                            activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}

                                ref={(element) => {
                                    tabRefs.current[tab.key] =
                                        element;
                                }}

                                id={`${idPrefix}-tab-${tab.key}`}

                                type="button"

                                role="tab"

                                aria-selected={active}

                                aria-controls={`${idPrefix}-panel-${tab.key}`}

                                tabIndex={active ? 0 : -1}

                                onClick={() =>
                                    changeTab(tab.key)
                                }

                                onKeyDown={(event) =>
                                    handleKeyDown(
                                        event,
                                        index
                                    )
                                }

                                className={`
                                    relative

                                    z-10

                                    inline-flex
                                    min-h-11

                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-xl

                                    px-4
                                    py-3

                                    text-[12px]
                                    font-bold

                                    tracking-wide

                                    whitespace-nowrap

                                    transition-all
                                    duration-300

                                    sm:min-h-12
                                    sm:px-5
                                    sm:py-3.5
                                    sm:text-[13px]

                                    focus-visible:outline-none

                                    focus-visible:ring-2
                                    focus-visible:ring-inset
                                    focus-visible:ring-indigo-500/60

                                    ${
                                        active
                                            ? `
                                                bg-slate-100/85

                                                shadow-sm

                                                dark:bg-white/[0.055]

                                                dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]
                                            `
                                            : `
                                                bg-transparent

                                                text-slate-600

                                                hover:bg-slate-100/70
                                                hover:text-slate-950

                                                dark:text-slate-400

                                                dark:hover:bg-white/[0.035]
                                                dark:hover:text-slate-100
                                            `
                                    }
                                `}
                            >
                                {/* =================================
                                    TAB LABEL

                                    Only the active text gets
                                    the amber glow.

                                    Background and border remain
                                    neutral.
                                ================================== */}

                                <span
                                    style={
                                        active
                                            ? ACTIVE_TAB_TEXT_STYLE
                                            : undefined
                                    }
                                    className={`
                                        relative

                                        inline-block

                                        transition-all
                                        duration-300

                                        ${
                                            active
                                                ? `
                                                    font-black

                                                    dark:font-extrabold
                                                `
                                                : `
                                                    font-semibold
                                                `
                                        }
                                    `}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileContentTabs);
