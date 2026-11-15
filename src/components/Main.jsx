
import React, { memo } from "react";

import { useSelector } from "react-redux";

// =========================================================
// EXISTING HOME COMPONENTS
// =========================================================

import HomeSidebar from "./HomeSidebar";
import SiteUpdates from "./SiteUpdates";

// =========================================================
// HOME MAIN COMPONENTS
// =========================================================

import HomeHero from "./home/main/HomeHero";

import HomeTrendingProblems from "./home/main/HomeTrendingProblems";

import HomeRewards from "./home/main/HomeRewards";

import HomeCallToAction from "./home/main/HomeCallToAction";

import HomeCommunity from "./home/main/HomeCommunity";

// =========================================================
// HOME DATA CONTROLLER
// =========================================================

import useHomePopularProblems from "./home/main/useHomePopularProblems";

// =========================================================
// SHARED HOME STYLES
// =========================================================

import homeStyles from "./home/main/homeStyles";

// =========================================================
// FSOCIETY — HOME PAGE
// =========================================================
//
// Architecture:
//
// Main.jsx
// │
// ├── HomeSidebar
// │   ├── Welcome
// │   ├── Promotions
// │   └── Birthdays
// │
// └── Main Content
//     ├── HomeHero
//     │   ├── HomeHeroStat
//     │   └── HomeProblemRadar
//     │
//     ├── HomeTrendingProblems
//     ├── SiteUpdates
//     ├── HomeRewards
//     ├── HomeCallToAction
//     └── HomeCommunity
//         └── CommentSection
//
// Popular problems:
// useHomePopularProblems
//
// Authentication:
// Existing Redux auth state
//
// Theme:
// Existing ThemeContext / Tailwind
//
// Background:
// Managed globally by App.jsx.
//
// WinterBackground is NOT rendered here.
// It is rendered only once in App.jsx.
//
// Main page background:
// Transparent, so the global background
// remains visible behind the Home page.
//
// =========================================================


// =========================================================
// FSOCIETY — HOME COMPONENT
// =========================================================

const Main = () => {

    // =====================================================
    // AUTHENTICATION
    //
    // Select values individually to avoid creating a
    // new selector result object on every render.
    // =====================================================

    const isLoggedIn = useSelector(
        (state) => Boolean(state.auth?.isLoggedIn)
    );

    const user = useSelector(
        (state) => state.auth?.user ?? null
    );


    // =====================================================
    // POPULAR PROBLEMS CONTROLLER
    //
    // Handles:
    // - Django API
    // - Redux actions
    // - Popular problems loading
    // - Error and retry
    // - AbortController
    // - Top 3 radar data
    //
    // No duplicate API requests in Main.jsx.
    //
    // =====================================================

    const {
        popularProblems,
        radarProblems,
        popularCount,
        isLoading,
        error,
        retry,
    } = useHomePopularProblems();


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            id="fsociety-home"
            className={`
                ${homeStyles.page}

                relative
                isolate
                min-h-screen
                min-w-0
                overflow-x-clip

                !bg-transparent
                dark:!bg-transparent
            `}
            style={{
                background: "transparent",
                backgroundColor: "transparent",
                backgroundImage: "none",
            }}
        >

            {/* ============================================
                GLOBAL BACKGROUND

                WinterBackground is managed by App.jsx.

                Default:
                - Original PageGridBackground

                Winter mode:
                - Dark mode: winter-dark.webp
                - Light mode: winter-light.webp

                Winter background settings are managed
                through NewYearContext.

                No duplicate background is rendered here.

                The Main page itself stays transparent
                so the global background is visible.
            ============================================ */}


            {/* ============================================
                HOME LAYOUT

                Desktop:
                Sidebar + main content

                Mobile / Tablet:
                Sidebar above main content

                All interactive elements are kept
                above the global background.
            ============================================ */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    grid
                    w-full
                    min-w-0
                    max-w-[1540px]

                    items-start
                    gap-5

                    px-3
                    py-5

                    sm:px-6

                    lg:grid-cols-[300px_minmax(0,1fr)]

                    xl:grid-cols-[310px_minmax(0,1fr)]
                    xl:px-8
                "
            >

                {/* ========================================
                    LEFT SIDEBAR

                    Existing component preserved.

                    Includes its original API calls,
                    promotion widgets, birthday
                    information and user information.
                ======================================== */}

                <HomeSidebar
                    isLoggedIn={isLoggedIn}
                    user={user}
                />


                {/* ========================================
                    MAIN CONTENT WINDOW

                    Section order is preserved.

                    Shared card styles come from
                    homeStyles.js.
                ======================================== */}

                <div
                    className={`
                        ${homeStyles.mainCard}

                        min-w-0
                    `}
                >

                    {/* ==================================
                        1. HOME HERO

                        - Hero title
                        - Main navigation buttons
                        - Current user's FCoin
                        - Popular problems count
                        - Problem radar
                    ================================== */}

                    <HomeHero
                        isLoggedIn={isLoggedIn}

                        user={user}

                        popularProblems={
                            popularProblems
                        }

                        radarProblems={
                            radarProblems
                        }

                        popularCount={
                            popularCount
                        }

                        isLoading={isLoading}

                        error={error}

                        onRetry={retry}
                    />


                    {/* ==================================
                        2. TRENDING PROBLEMS

                        Existing PopularProblemCard
                        is rendered inside this module.

                        Data comes from the same
                        controller as HomeHero.
                    ================================== */}

                    <HomeTrendingProblems
                        problems={popularProblems}

                        isLoading={isLoading}

                        error={error}

                        onRetry={retry}
                    />


                    {/* ==================================
                        3. SITE UPDATES

                        Existing component preserved.

                        - Updates API
                        - Like / Unlike
                        - Dropdown
                        - Accordion
                        - Loading / Retry
                    ================================== */}

                    <SiteUpdates />


                    {/* ==================================
                        4. REWARD SYSTEM

                        - Help other developers
                        - FCoin reward system
                        - Reputation / badges
                        - Trust indicators
                    ================================== */}

                    <HomeRewards />


                    {/* ==================================
                        5. CALL TO ACTION

                        Guest:
                        /register

                        Authenticated:
                        /problem-create

                        Community:
                        /users
                    ================================== */}

                    <HomeCallToAction
                        isLoggedIn={isLoggedIn}
                    />


                    {/* ==================================
                        6. COMMUNITY

                        Existing CommentSection
                        is rendered inside this module.

                        All comment functionality
                        remains in CommentSection.
                    ================================== */}

                    <HomeCommunity />

                </div>

            </div>

        </main>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default memo(Main);
