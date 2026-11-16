
import React, { memo } from "react";

import { useSelector } from "react-redux";

// =========================================================
// SHARED FSOCIETY BACKGROUND
//
// Global Winter Background is managed in App.jsx.
//
// This page does not create another PageGridBackground
// or WinterBackground instance.
//
// Transparent page surface allows the global
// Light / Dark Winter Background to remain visible.
// =========================================================


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
// Background:
//
// - Global Winter Background managed in App.jsx
// - No duplicate local background grid
// - Floating FCoin particles remain active
// - Transparent page surface
// - Light / Dark Mode
//
// Improvements:
//
// - Responsive design
// - Reduced motion support
// - Modular component structure
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

                bg-transparent
                text-slate-900

                dark:bg-transparent
                dark:text-white
            "

            style={{
                background: "transparent",
                backgroundColor: "transparent",
                backgroundImage: "none",
            }}
        >

            {/* ======================================
                GLOBAL WINTER BACKGROUND

                Winter Background is rendered globally
                inside App.jsx.

                This page must not create another
                PageGridBackground or WinterBackground.

                No opaque background color or gradient
                should cover the global winter image.

                Light / Dark image switching is handled
                by the global ThemeProvider and
                WinterBackground component.
            ====================================== */}


            {/* ======================================
                FLOATING FCOIN PARTICLES

                IMPORTANT:

                These 14 animated FCoin images
                remain active over the global
                Winter Background.

                They are positioned behind the
                actual page content.

                The original FCoinFloatingCoins
                component and its behavior are preserved.
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
