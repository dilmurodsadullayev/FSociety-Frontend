
import React from "react";

import {
    Link,
} from "react-router-dom";

// =========================================================
// ASSETS
// =========================================================

import FCoinIcon from "../../assests/coin/fcoin.png";

// =========================================================
// FSOCIETY — NAVBAR FCOIN
//
// Dark Mode:
// Original cyber-gold appearance.
//
// Light Mode:
// Soft amber-gold premium appearance.
//
// Performance:
// CSS transitions only.
// =========================================================

const NavbarCoin = ({
    coins = 0,
}) => {

    // =====================================================
    // COIN BALANCE
    // =====================================================

    const balance = coins ?? 0;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <Link
            to="/fcoin-history"
            aria-label={`FCoin tarixi. Balans: ${balance}`}
            title="FCoin tarixini ko'rish"

            className="
                group/fcoin
                relative

                hidden
                shrink-0
                items-center
                gap-2

                overflow-hidden

                rounded-full
                border

                border-amber-400/25
                bg-gradient-to-r
                from-amber-50
                to-orange-50/80

                py-1
                pl-1
                pr-3

                shadow-[0_2px_10px_rgba(180,83,9,0.05)]

                transition-colors
                duration-150

                hover:border-amber-400/50

                sm:flex

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-500

                dark:border-amber-400/15
                dark:from-amber-400/[0.035]
                dark:to-amber-500/[0.025]

                dark:shadow-none

                dark:hover:border-amber-400/30
            "
        >

            {/* ==========================================
                HOVER GLOW
            ========================================== */}

            <span
                aria-hidden="true"

                className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-amber-400/[0.04]

                    opacity-0

                    transition-opacity
                    duration-150

                    group-hover/fcoin:opacity-100

                    dark:bg-amber-400/[0.035]
                "
            />

            {/* ==========================================
                COIN ICON CONTAINER
            ========================================== */}

            <span
                className="
                    relative
                    z-10

                    grid
                    h-9
                    w-9

                    shrink-0
                    place-items-center

                    rounded-full

                    border
                    border-amber-400/25

                    bg-amber-400/[0.10]

                    shadow-[inset_0_0_12px_rgba(245,158,11,0.04)]

                    transition-transform
                    duration-200

                    group-hover/fcoin:rotate-[8deg]
                    group-hover/fcoin:scale-105

                    dark:border-amber-400/20
                    dark:bg-amber-400/[0.06]

                    motion-reduce:transition-none
                    motion-reduce:transform-none
                "
            >

                {/* ======================================
                    FCOIN IMAGE
                ====================================== */}

                <img
                    src={FCoinIcon}
                    alt=""
                    draggable={false}

                    className="
                        h-6
                        w-6

                        object-contain
                    "
                />

            </span>

            {/* ==========================================
                COIN BALANCE
            ========================================== */}

            <span
                className="
                    relative
                    z-10

                    min-w-0

                    text-[15px]
                    font-bold

                    tracking-tight

                    text-amber-800

                    transition-colors
                    duration-150

                    group-hover/fcoin:text-amber-700

                    dark:text-amber-300
                    dark:group-hover/fcoin:text-amber-200
                "
            >
                {balance}
            </span>

        </Link>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(NavbarCoin);
