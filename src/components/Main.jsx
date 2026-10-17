
import React, { memo } from "react";

import { useSelector } from "react-redux";

// =========================================================
// FSOCIETY — SHARED PAGE BACKGROUND
// =========================================================

import PageGridBackground from "./ui/PageGridBackground";

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
//
// Architecture:
//
// Main.jsx
// ├── PageGridBackground
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

                min-w-0
                overflow-x-clip
            `}
        >
            {/* ======================================
                FUTURISTIC SHARED BACKGROUND

                Same background used in:
                - Users
                - Problems
                - Feedback
                - Projects
                - ProjectDetail

                Contains:
                - Grid texture
                - Network connections
                - Glowing nodes
                - Isometric glass cubes
                - FS watermark
                - Light / Dark Mode

                It is decorative only.
            ====================================== */}

            <PageGridBackground
                showMonogram
                showCubes
            />

            {/* ======================================
                HOME LAYOUT

                Desktop:
                Sidebar + main content

                Mobile / Tablet:
                Sidebar above main content

                All interactive elements are kept
                above the background.
            ====================================== */}

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
                {/* ==================================
                    LEFT SIDEBAR

                    Existing component preserved.

                    Includes its original API calls,
                    promotion widgets, birthday
                    information and user information.
                ================================== */}

                <HomeSidebar
                    isLoggedIn={isLoggedIn}
                    user={user}
                />

                {/* ==================================
                    MAIN CONTENT WINDOW

                    Section order is preserved.

                    Shared card styles come from
                    homeStyles.js.
                ================================== */}

                <div
                    className={`
                        ${homeStyles.mainCard}

                        min-w-0
                    `}
                >
                    {/* ==============================
                        1. HOME HERO

                        - Hero title
                        - Main navigation buttons
                        - Current user's FCoin
                        - Popular problems count
                        - Problem radar
                    ============================== */}

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

                    {/* ==============================
                        2. TRENDING PROBLEMS

                        Existing PopularProbelmCard
                        is rendered inside this module.

                        Data comes from the same
                        controller as HomeHero.
                    ============================== */}

                    <HomeTrendingProblems
                        problems={popularProblems}

                        isLoading={isLoading}

                        error={error}

                        onRetry={retry}
                    />

                    {/* ==============================
                        3. SITE UPDATES

                        Existing component preserved.

                        - Updates API
                        - Like / Unlike
                        - Dropdown
                        - Accordion
                        - Loading / Retry
                    ============================== */}

                    <SiteUpdates />

                    {/* ==============================
                        4. REWARD SYSTEM

                        - Help other developers
                        - FCoin reward system
                        - Reputation / badges
                        - Trust indicators
                    ============================== */}

                    <HomeRewards />

                    {/* ==============================
                        5. CALL TO ACTION

                        Guest:
                        /register

                        Authenticated:
                        /problem-create

                        Community:
                        /users
                    ============================== */}

                    <HomeCallToAction
                        isLoggedIn={isLoggedIn}
                    />

                    {/* ==============================
                        6. COMMUNITY

                        Existing CommentSection
                        is rendered inside this module.

                        All comment functionality
                        remains in CommentSection.
                    ============================== */}

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
