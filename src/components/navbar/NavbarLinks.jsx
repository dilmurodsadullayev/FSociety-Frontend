
import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    NAV_LINKS,
} from "./navConfig";

// =========================================================
// FSOCIETY — NAVBAR LINKS
//
// Dark Mode:
// Original cyber navigation design.
//
// Light Mode:
// Premium slate-indigo navigation.
//
// Performance:
// Lightweight CSS transitions only.
// =========================================================

const NavbarLinks = ({
    isActive,
}) => {

    // =====================================================
    // JSX
    // =====================================================

    return (
        <nav
            aria-label="Asosiy navigatsiya"
            className="
                hidden
                items-center
                gap-1

                rounded-2xl
                border

                border-[#ccd7e9]/90
                bg-[#f6f8ff]/80

                p-1.5

                shadow-[0_4px_16px_rgba(30,41,59,0.04)]

                lg:flex

                dark:border-white/[0.06]
                dark:bg-white/[0.025]
                dark:shadow-none
            "
        >

            {NAV_LINKS.map(({
                path,
                text,
                Icon,
            }) => {

                // =========================================
                // ACTIVE ROUTE
                // =========================================

                const active =
                    isActive(path);

                // =========================================
                // LINK
                // =========================================

                return (
                    <Link
                        key={path}
                        to={path}

                        aria-current={
                            active
                                ? "page"
                                : undefined
                        }

                        className={`
                            group/nav
                            relative

                            inline-flex
                            shrink-0

                            items-center
                            justify-center
                            gap-2

                            whitespace-nowrap

                            rounded-xl

                            px-4
                            py-2.5

                            text-[12px]
                            font-bold

                            uppercase
                            tracking-[0.08em]

                            outline-none

                            transition-colors
                            duration-150

                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            ${
                                active
                                    ? `
                                        bg-indigo-500/[0.10]
                                        text-indigo-700

                                        shadow-[inset_0_0_0_1px_rgba(79,70,229,0.14)]

                                        dark:bg-indigo-500/15
                                        dark:text-indigo-300

                                        dark:shadow-[inset_0_0_0_1px_rgba(99,102,241,0.18)]
                                    `
                                    : `
                                        text-slate-600

                                        hover:bg-white/90
                                        hover:text-indigo-700

                                        dark:text-gray-500

                                        dark:hover:bg-white/[0.035]
                                        dark:hover:text-gray-200
                                    `
                            }
                        `}
                    >

                        {/* =================================
                            ICON
                        ================================= */}

                        <Icon
                            size={15}
                            strokeWidth={2}

                            aria-hidden="true"

                            className="
                                shrink-0

                                transition-colors
                                duration-150
                            "
                        />

                        {/* =================================
                            LABEL
                        ================================= */}

                        <span
                            className="
                                relative
                                z-10
                            "
                        >
                            {text}
                        </span>

                    </Link>
                );
            })}

        </nav>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(NavbarLinks);
