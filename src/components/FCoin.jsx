
import React, { memo } from "react";

import { useSelector } from "react-redux";

// =========================================================
// SHARED FSOCIETY BACKGROUND
// =========================================================

import PageGridBackground from "./ui/PageGridBackground";

// =========================================================
// FCOIN COMPONENTS
// =========================================================

import FCoinFloatingCoins from "./fcoin/FCoinFloatingCoins";

import FCoinHero from "./fcoin/FCoinHero";

import FCoinRewardPanels from "./fcoin/FCoinRewardPanels";

import FCoinFeedbackRewards from "./fcoin/FCoinFeedbackRewards";

import FCoinRulesRoadmap from "./fcoin/FCoinRulesRoadmap";

// =========================================================
// FSOCIETY — FCOIN ECONOMY PAGE
//
// Preserved functionality:
//
// - Current user FCoin balance from Redux
// - 14 animated floating coin images
// - Animated main FCoin logo
// - Biggest fixed reward
// - Bug reward
// - All 10 earning methods
// - All 4 spending opportunities
// - All 4 feedback rewards
// - All 4 platform rules
// - All 4 roadmap entries
// - Scroll reveal animations
//
// Improvements:
//
// - Shared PageGridBackground
// - Light / Dark Mode
// - Responsive design
// - Reduced motion support
// - Modular component structure
// - No duplicate background grid
// - No page-wide CSS side effects
// =========================================================

const FCoin = () => {
    // =====================================================
    // CURRENT USER BALANCE
    //
    // Keep the original Redux data source.
    //
    // No duplicate API request.
    // =====================================================

    const currentCoins = useSelector(
        (state) => state.auth?.user?.coins ?? 0
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            id="fcoin-economy"
            className="
                relative
                isolate

                min-h-screen
                w-full
                min-w-0

                overflow-x-clip

                bg-[#edf4ff]
                text-slate-900

                dark:bg-[#060b15]
                dark:text-white
            "
        >
            {/* ======================================
                SHARED FUTURISTIC BACKGROUND

                Common background for:
                - Main
                - Users
                - Problems
                - Feedback
                - Projects
                - FCoin

                Decorative only.
            ====================================== */}

            <PageGridBackground
                showMonogram
                showCubes
            />

            {/* ======================================
                FLOATING FCOIN PARTICLES

                IMPORTANT:
                These 14 animated FCoin images
                remain active over the shared grid.

                They are positioned behind the
                actual page content.
            ====================================== */}

            <FCoinFloatingCoins />

            {/* ======================================
                PAGE CONTENT
            ====================================== */}

            <main
                className="
                    relative
                    z-10

                    mx-auto

                    w-full
                    min-w-0
                    max-w-7xl

                    px-4
                    pb-20
                    pt-12

                    sm:px-6
                    sm:pb-24
                    sm:pt-16

                    lg:px-8
                "
            >
                {/* ==================================
                    HERO

                    - Floating main FCoin
                    - Wallet
                    - Biggest reward
                    - Bug reward
                ================================== */}

                <FCoinHero
                    currentCoins={currentCoins}
                />

                {/* ==================================
                    EARN / SPEND

                    - 10 earning methods
                    - 4 planned spending methods
                ================================== */}

                <FCoinRewardPanels />

                {/* ==================================
                    FEEDBACK REWARDS

                    - Bug
                    - Suggestion
                    - Praise
                    - Other

                    Admin approval remains required.
                ================================== */}

                <FCoinFeedbackRewards />

                {/* ==================================
                    RULES AND ROADMAP

                    - FCoin system rules
                    - Future development plans
                ================================== */}

                <FCoinRulesRoadmap />
            </main>
        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(FCoin);
