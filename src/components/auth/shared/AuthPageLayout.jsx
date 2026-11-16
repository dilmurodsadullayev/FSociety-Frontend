
// src/components/auth/shared/AuthPageLayout.jsx

import React, { memo } from "react";

import {
    LockKeyhole,
    ShieldCheck,
    Terminal,
} from "lucide-react";

// =========================================================
// FSOCIETY — AUTH PAGE LAYOUT
// =========================================================
//
// Location:
//
// src/components/auth/shared/AuthPageLayout.jsx
//
// Used by:
//
// - Register
// - Login
// - Future password reset pages
//
// Features:
//
// - Global Winter Background compatibility
// - Light / Dark mode
// - Responsive 320px+
// - Tailwind CSS only
// - Separate Register / Login widths
// - Mobile safe spacing
// - Long-form scrolling
// - No horizontal overflow
// - Accessible page structure
// - No Redux dependency
// - No extra theme state
// - Glassmorphism authentication card
// - Decorative indigo / cyan / violet lighting
//
// BACKGROUND:
//
// Winter Background is managed globally in App.jsx.
//
// This component intentionally does not render
// another PageGridBackground instance.
//
// Legacy showMonogram and showCubes props may still
// be passed by Login / Register, but are no longer
// used locally because the background is global.
//
// =========================================================

// =========================================================
// CONFIGURATION
// =========================================================

const MODE_CONFIG = {
    register: {
        label: "REGISTER",
        width: "max-w-[560px]",
        title: "Ro‘yxatdan o‘tish",
    },

    login: {
        label: "LOGIN",
        width: "max-w-[460px]",
        title: "Tizimga kirish",
    },
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function AuthPageLayout({
    children,

    // "register" or "login"
    mode = "register",

    // Optional accessibility label
    ariaLabel,

    // Footer
    showFooter = true,
    footer = null,

    // Custom Tailwind classes
    className = "",
    cardClassName = "",
    contentClassName = "",
}) {
    // =====================================================
    // MODE
    // =====================================================

    const config =
        MODE_CONFIG[mode] ||
        MODE_CONFIG.register;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            aria-label={
                ariaLabel || config.title
            }
            className={`
                relative

                flex
                min-h-screen
                min-h-[100dvh]

                w-full
                min-w-0
                max-w-full

                flex-col

                bg-transparent

                font-sans
                text-slate-900

                dark:bg-transparent
                dark:text-slate-100

                ${className}
            `}
            style={{
                backgroundColor: "transparent",
                backgroundImage: "none",
            }}
        >
            {/* ==========================================
                GLOBAL WINTER BACKGROUND

                Winter Background is rendered globally
                through App.jsx.

                This layout intentionally does not render:

                - PageGridBackground
                - Another Winter Background instance
                - An opaque page gradient
                - A local background image

                The transparent main element allows
                the global winter scenery to remain visible.
            ========================================== */}

            {/* ==========================================
                DECORATIVE LIGHTING

                Local decorative lighting is retained.

                It does not replace or cover the
                global Winter Background.

                All elements:
                - pointer-events-none
                - decorative only
                - do not block authentication controls
            ========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    z-[1]

                    overflow-hidden
                "
            >
                {/* =================================
                    LEFT GLOW
                ================================== */}

                <div
                    className="
                        absolute

                        -left-32
                        top-[12%]

                        h-72
                        w-72

                        rounded-full

                        bg-indigo-400/[0.055]

                        blur-[90px]

                        dark:bg-indigo-500/[0.075]
                    "
                />

                {/* =================================
                    RIGHT GLOW
                ================================== */}

                <div
                    className="
                        absolute

                        -right-36
                        bottom-[12%]

                        h-80
                        w-80

                        rounded-full

                        bg-cyan-400/[0.045]

                        blur-[95px]

                        dark:bg-cyan-500/[0.065]
                    "
                />

                {/* =================================
                    CENTER ACCENT
                ================================== */}

                <div
                    className="
                        absolute

                        left-1/2
                        top-1/2

                        h-[400px]
                        w-[400px]

                        max-w-full

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-violet-400/[0.025]

                        blur-[100px]

                        dark:bg-violet-500/[0.035]

                        sm:h-[550px]
                        sm:w-[550px]
                    "
                />
            </div>

            {/* ==========================================
                PAGE CONTENT

                z-10 keeps authentication content above
                the decorative lighting.

                Global Winter Background stays behind
                the transparent page.
            ========================================== */}

            <div
                className="
                    relative
                    z-10

                    flex

                    w-full
                    min-w-0

                    flex-1
                    flex-col

                    items-center
                    justify-center

                    px-3
                    py-6

                    sm:px-5
                    sm:py-10

                    lg:px-8
                    lg:py-12
                "
            >
                {/* ======================================
                    AUTH CARD CONTAINER
                ====================================== */}

                <div
                    className={`
                        relative

                        w-full
                        min-w-0

                        ${config.width}
                    `}
                >
                    {/* ====================================
                        CARD OUTER GLOW
                    ===================================== */}

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            absolute
                            -inset-1

                            rounded-[28px]

                            bg-gradient-to-br

                            from-indigo-500/[0.09]
                            via-transparent
                            to-cyan-400/[0.08]

                            blur-xl

                            dark:from-indigo-500/[0.12]
                            dark:to-cyan-400/[0.10]
                        "
                    />

                    {/* ====================================
                        MAIN CARD
                    ===================================== */}

                    <div
                        className={`
                            relative

                            w-full
                            min-w-0
                            max-w-full

                            overflow-hidden

                            rounded-[22px]

                            border
                            border-slate-200/80

                            bg-white/[0.88]

                            shadow-[0_16px_55px_rgba(15,23,42,0.10)]

                            backdrop-blur-2xl

                            dark:border-white/[0.10]
                            dark:bg-[#0b1220]/[0.88]

                            dark:shadow-[0_20px_65px_rgba(0,0,0,0.38)]

                            sm:rounded-[26px]

                            ${cardClassName}
                        `}
                    >
                        {/* ================================
                            CARD INNER LIGHT
                        ================================= */}

                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none

                                absolute
                                inset-0

                                bg-gradient-to-br

                                from-white/[0.20]
                                via-transparent
                                to-indigo-100/[0.12]

                                dark:from-white/[0.035]
                                dark:via-transparent
                                dark:to-indigo-500/[0.025]
                            "
                        />

                        {/* ================================
                            TOP ACCENT
                        ================================= */}

                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none

                                absolute
                                inset-x-0
                                top-0

                                z-20

                                h-[2px]

                                bg-gradient-to-r

                                from-indigo-500
                                via-cyan-400
                                to-violet-500
                            "
                        />

                        {/* ================================
                            CARD TOP DECORATION
                        ================================= */}

                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none

                                absolute

                                -right-20
                                -top-24

                                h-56
                                w-56

                                rounded-full

                                bg-indigo-500/[0.035]

                                blur-[65px]

                                dark:bg-indigo-400/[0.055]
                            "
                        />

                        {/* ================================
                            CARD BODY
                        ================================= */}

                        <div
                            className={`
                                relative
                                z-10

                                w-full
                                min-w-0

                                px-4
                                pb-5
                                pt-5

                                sm:px-7
                                sm:pb-7
                                sm:pt-7

                                ${contentClassName}
                            `}
                        >
                            {children}
                        </div>

                        {/* ================================
                            CARD BOTTOM STRIP
                        ================================= */}

                        <div
                            aria-hidden="true"
                            className="
                                relative
                                z-10

                                flex
                                min-w-0

                                items-center
                                justify-between

                                border-t

                                border-slate-200/70

                                bg-slate-50/65

                                px-4
                                py-2.5

                                dark:border-white/[0.06]
                                dark:bg-white/[0.025]

                                sm:px-7
                            "
                        >
                            {/* FSOCIETY LABEL */}

                            <span
                                className="
                                    inline-flex

                                    items-center
                                    gap-1.5

                                    font-mono

                                    text-[9px]
                                    font-semibold

                                    uppercase
                                    tracking-[0.10em]

                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                <Terminal
                                    size={12}
                                    aria-hidden="true"
                                />

                                FSOCIETY://AUTH
                            </span>

                            {/* MODE LABEL */}

                            <span
                                className="
                                    inline-flex

                                    items-center
                                    gap-1.5

                                    font-mono

                                    text-[9px]
                                    font-semibold

                                    text-indigo-600

                                    dark:text-indigo-400
                                "
                            >
                                <ShieldCheck
                                    size={12}
                                    aria-hidden="true"
                                />

                                {config.label}
                            </span>
                        </div>
                    </div>

                    {/* ====================================
                        CARD BOTTOM ACCENT
                    ===================================== */}

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            mx-auto
                            mt-2

                            h-px
                            w-[65%]

                            bg-gradient-to-r

                            from-transparent
                            via-indigo-400/30
                            to-transparent

                            dark:via-indigo-400/20
                        "
                    />
                </div>

                {/* ======================================
                    PAGE FOOTER
                ====================================== */}

                {showFooter && (
                    <footer
                        className="
                            mt-6

                            w-full
                            min-w-0
                            max-w-[560px]

                            px-2

                            text-center
                        "
                    >
                        {footer || (
                            <div
                                className="
                                    flex

                                    flex-wrap

                                    items-center
                                    justify-center

                                    gap-x-2
                                    gap-y-1.5

                                    font-mono

                                    text-[10px]

                                    text-slate-600

                                    dark:text-slate-400
                                "
                            >
                                {/* SECURITY ICON */}

                                <LockKeyhole
                                    size={12}
                                    className="
                                        shrink-0

                                        text-indigo-500

                                        dark:text-indigo-400
                                    "
                                    aria-hidden="true"
                                />

                                {/* BRAND */}

                                <span>
                                    FSOCIETY
                                </span>

                                {/* SEPARATOR */}

                                <span
                                    aria-hidden="true"
                                    className="
                                        text-slate-300

                                        dark:text-slate-600
                                    "
                                >
                                    /
                                </span>

                                {/* FOOTER TEXT */}

                                <span>
                                    Connect. Code. Collaborate.
                                </span>
                            </div>
                        )}
                    </footer>
                )}
            </div>
        </main>
    );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(AuthPageLayout);
