import React, {
    memo,
    useCallback,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import NavbarLogoGlitch from "./NavbarLogoGlitch";

import FSocietyLogo from "../../assests/logo/f_society.png";

// =========================================================
// FSOCIETY — NAVBAR BRAND
// =========================================================
//
// Features:
// - Bigger logo and text
// - Hover text swap: FSociety -> Fix Society
// - Mr. Robot vibe glitch logo
// - Responsive
// - Accessible home link
// =========================================================

function NavbarBrand({
    className = "",
    logoSrc = FSocietyLogo,
    showText = true,
}) {
    // =====================================================
    // HOVER / FOCUS STATE
    // =====================================================

    const [
        isGlitchActive,
        setIsGlitchActive,
    ] = useState(false);

    const [
        isHovered,
        setIsHovered,
    ] = useState(false);

    // =====================================================
    // ACTIVATE / DEACTIVATE
    // =====================================================

    const activateBrand = useCallback(() => {
        setIsGlitchActive(true);
        setIsHovered(true);
    }, []);

    const deactivateBrand = useCallback(() => {
        setIsGlitchActive(false);
        setIsHovered(false);
    }, []);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Link
            to="/"
            aria-label="FSociety bosh sahifasi"
            title="FSociety — Fix Society"
            onMouseEnter={activateBrand}
            onMouseLeave={deactivateBrand}
            onFocus={activateBrand}
            onBlur={deactivateBrand}
            className={`
                group/brand
                relative
                inline-flex
                min-w-0
                shrink-0
                items-center
                gap-3
                rounded-2xl
                outline-none
                transition-all
                duration-200
                hover:opacity-95
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2
                dark:focus-visible:ring-offset-[#080c12]
                motion-reduce:transition-none
                ${className}
            `}
        >
            {/* ======================================
                LOGO
               ====================================== */}
            <NavbarLogoGlitch
                active={isGlitchActive}
                logoSrc={logoSrc}
                className="
                    h-11 w-11
                    rounded-xl

                    sm:h-12 sm:w-12
                    sm:rounded-[14px]

                    lg:h-[50px] lg:w-[50px]
                "
            />

            {/* ======================================
                BRAND TEXT
               ====================================== */}
            {showText && (
                <div
                    className="
                        hidden
                        min-w-0
                        sm:flex
                        flex-col
                        justify-center
                        leading-none
                    "
                >
                    {/* Top mini label */}
                    <span
                        className="
                            mb-1
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.22em]
                            text-slate-500
                            transition-colors
                            duration-200
                            dark:text-slate-400
                            group-hover/brand:text-cyan-600
                            dark:group-hover/brand:text-cyan-400
                        "
                    >
                        Build • Share • Solve
                    </span>

                    {/* Main brand swap */}
                    <div
                        className="
                            relative
                            h-[24px]
                            min-w-[128px]
                            overflow-hidden
                        "
                    >
                        {/* Default text */}
                        <span
                            className={`
                                absolute
                                inset-0
                                flex
                                items-center
                                whitespace-nowrap
                                font-black
                                tracking-[-0.04em]
                                text-slate-900
                                transition-all
                                duration-300
                                dark:text-white

                                text-[22px]
                                lg:text-[24px]

                                ${
                                    isHovered
                                        ? "translate-y-[-110%] opacity-0"
                                        : "translate-y-0 opacity-100"
                                }
                            `}
                        >
                            F
                            <span
                                className="
                                    text-indigo-600
                                    transition-colors
                                    duration-200
                                    dark:text-indigo-400
                                    group-hover/brand:text-cyan-600
                                    dark:group-hover/brand:text-cyan-400
                                "
                            >
                                Society
                            </span>
                        </span>

                        {/* Hover text */}
                        <span
                            className={`
                                absolute
                                inset-0
                                flex
                                items-center
                                whitespace-nowrap
                                font-black
                                tracking-[-0.04em]
                                transition-all
                                duration-300

                                text-[20px]
                                lg:text-[22px]

                                text-slate-900
                                dark:text-white

                                ${
                                    isHovered
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-[110%] opacity-0"
                                }
                            `}
                        >
                            <span
                                className="
                                    text-cyan-600
                                    dark:text-cyan-400
                                "
                            >
                                Fix
                            </span>
                            <span className="ml-1">
                                Society
                            </span>
                        </span>
                    </div>

                    {/* Sub text */}
                    <span
                        className="
                            mt-1
                            text-[11px]
                            font-semibold
                            tracking-[0.08em]
                            text-slate-500
                            transition-colors
                            duration-200
                            dark:text-slate-400
                            group-hover/brand:text-slate-700
                            dark:group-hover/brand:text-slate-300
                        "
                    >
                        Developer community
                    </span>
                </div>
            )}
        </Link>
    );
}

export default memo(NavbarBrand);