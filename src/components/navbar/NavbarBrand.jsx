
import React from "react";

import {
    Link,
} from "react-router-dom";

import FSocietyLogo from "../../assests/logo/f_society.png";

// =========================================================
// FSOCIETY — NAVBAR BRAND
//
// Dark Mode:
// Original cyber appearance.
//
// Light Mode:
// Clean, professional slate-indigo appearance.
//
// Performance:
// CSS animations only.
// =========================================================

const NavbarBrand = () => {
    return (
        <Link
            to="/"
            aria-label="FSociety — Bosh sahifa"
            className="
                group
                relative
                z-10

                flex
                shrink-0
                items-center
                gap-3

                rounded-lg

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2
                dark:focus-visible:ring-offset-[#080c12]
            "
        >

            {/* ==========================================
                LOGO CONTAINER
            ========================================== */}

            <div
                className="
                    relative

                    flex
                    h-12
                    w-12
                    shrink-0

                    items-center
                    justify-center
                "
            >

                {/* ======================================
                    LOGO HOVER GLOW
                ====================================== */}

                <span
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        inset-1

                        rounded-full

                        bg-indigo-500/0

                        opacity-0
                        blur-xl

                        transition-all
                        duration-300

                        group-hover:scale-125
                        group-hover:bg-indigo-500/20
                        group-hover:opacity-100

                        dark:group-hover:bg-indigo-500/25

                        motion-reduce:transition-none
                    "
                />

                {/* ======================================
                    LOGO IMAGE
                ====================================== */}

                <img
                    src={FSocietyLogo}
                    alt=""
                    draggable={false}
                    className="
                        relative
                        z-10

                        h-11
                        w-auto
                        max-w-none

                        object-contain

                        transition-transform
                        duration-500

                        ease-[cubic-bezier(0.16,1,0.3,1)]

                        group-hover:rotate-[360deg]
                        group-hover:scale-105

                        motion-reduce:transition-none
                        motion-reduce:transform-none
                    "
                />

            </div>

            {/* ==========================================
                BRAND TEXT WRAPPER
            ========================================== */}

            <div
                className="
                    relative

                    hidden
                    h-[36px]
                    w-[145px]

                    overflow-hidden

                    sm:block
                "
            >

                {/* ======================================
                    ORIGINAL BRAND — FSOCIETY
                ====================================== */}

                <span
                    className="
                        absolute
                        left-0
                        top-1/2

                        -translate-y-1/2

                        whitespace-nowrap

                        text-[24px]
                        font-bold
                        leading-none

                        tracking-[-0.055em]

                        text-slate-900

                        opacity-100

                        transition-all
                        duration-500

                        ease-[cubic-bezier(0.16,1,0.3,1)]

                        group-hover:-translate-y-[160%]
                        group-hover:opacity-0

                        dark:text-white

                        motion-reduce:transition-none
                    "
                >
                    F

                    <span
                        className="
                            text-indigo-600
                            dark:text-indigo-400
                        "
                    >
                        Society
                    </span>

                </span>

                {/* ======================================
                    HOVER BRAND — FIX SOCIETY
                ====================================== */}

                <span
                    className="
                        absolute
                        left-0
                        top-1/2

                        translate-y-[70%]

                        whitespace-nowrap

                        text-[24px]
                        font-bold
                        leading-none

                        tracking-[-0.055em]

                        text-indigo-600

                        opacity-0

                        transition-all
                        duration-500

                        ease-[cubic-bezier(0.16,1,0.3,1)]

                        group-hover:-translate-y-1/2
                        group-hover:opacity-100

                        dark:text-indigo-400

                        motion-reduce:transition-none
                    "
                >
                    Fix{" "}

                    <span
                        className="
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Society
                    </span>

                </span>

            </div>

        </Link>
    );
};

export default React.memo(NavbarBrand);
