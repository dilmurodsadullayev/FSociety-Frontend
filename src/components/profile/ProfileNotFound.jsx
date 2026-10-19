
// src/components/profile/ProfileNotFound.jsx

import React, { memo } from "react";

import {
    Link,
} from "react-router-dom";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    ArrowLeft,
    ArrowUpRight,
    House,
    SearchX,
    ShieldAlert,
    Terminal,
    UserRoundX,
    Users,
} from "lucide-react";

// =========================================================
// FSOCIETY — PROFILE NOT FOUND
//
// Dedicated 404 page for a missing user profile.
//
// Features:
//
// - FSociety visual identity
// - Light / Dark Mode
// - Mr. Robot inspired terminal aesthetic
// - Animated 404 illustration
// - Requested username display
// - Terminal-style status information
// - Users page navigation
// - Home page navigation
// - Responsive layout
// - Reduced motion support
// - Accessible semantic structure
//
// Usage:
//
// <ProfileNotFound username={username} />
//
// IMPORTANT:
//
// This component does not fetch data.
//
// HTTP 404 is detected inside useProfilePage.js.
//
// Profile.jsx decides when to display this page.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const USERS_PATH = "/users";

const HOME_PATH = "/";

const DEFAULT_MESSAGE =
    "Siz qidirayotgan profil mavjud emas, " +
    "o‘chirilgan yoki foydalanuvchi nomi noto‘g‘ri " +
    "kiritilgan bo‘lishi mumkin.";

// =========================================================
// SAFE USERNAME
//
// React automatically escapes rendered strings.
// No HTML injection or dangerouslySetInnerHTML.
//
// Long usernames are visually truncated where needed.
// =========================================================

const normalizeUsername = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
};

// =========================================================
// BACKGROUND DECORATION
//
// Light Mode:
// - Soft dotted/grid atmosphere
// - Gentle red and indigo glow
//
// Dark Mode:
// - Deep dark background
// - Subtle red glow
// - Terminal-inspired atmosphere
//
// All elements are decorative.
// =========================================================

const ProfileNotFoundBackground = memo(
    function ProfileNotFoundBackground() {
        return (
            <div
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    overflow-hidden
                "
            >
                {/* =========================================
                    TOP RED GLOW
                ========================================== */}

                <div
                    className="
                        absolute
                        left-1/2
                        top-[-180px]

                        h-[420px]
                        w-[420px]

                        -translate-x-1/2

                        rounded-full

                        bg-red-500/[0.07]
                        blur-[110px]

                        dark:bg-red-500/[0.12]

                        sm:h-[650px]
                        sm:w-[650px]
                    "
                />

                {/* =========================================
                    BOTTOM INDIGO GLOW
                ========================================== */}

                <div
                    className="
                        absolute
                        -bottom-40
                        -right-32

                        h-80
                        w-80

                        rounded-full

                        bg-indigo-500/[0.06]
                        blur-[100px]

                        dark:bg-indigo-500/[0.08]
                    "
                />

                {/* =========================================
                    SUBTLE TECHNICAL GRID
                ========================================== */}

                <div
                    className="
                        absolute
                        inset-0

                        opacity-[0.24]

                        dark:opacity-[0.11]
                    "
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(100,116,139,0.15) 1px, transparent 1px), " +
                            "linear-gradient(to bottom, rgba(100,116,139,0.15) 1px, transparent 1px)",

                        backgroundSize: "46px 46px",

                        maskImage:
                            "radial-gradient(ellipse at center, black 5%, transparent 75%)",

                        WebkitMaskImage:
                            "radial-gradient(ellipse at center, black 5%, transparent 75%)",
                    }}
                />

                {/* =========================================
                    TOP ACCENT
                ========================================== */}

                <div
                    className="
                        absolute
                        inset-x-0
                        top-0

                        h-px

                        bg-gradient-to-r

                        from-transparent
                        via-red-500/35
                        to-transparent
                    "
                />
            </div>
        );
    }
);

// =========================================================
// NOT FOUND ILLUSTRATION
//
// Large 404 typography and search icon.
//
// The animation respects prefers-reduced-motion.
// =========================================================

const ProfileNotFoundIllustration = memo(
    function ProfileNotFoundIllustration() {
        const reduceMotion =
            useReducedMotion();

        return (
            <div
                aria-hidden="true"
                className="
                    relative

                    mx-auto
                    flex
                    w-full

                    items-center
                    justify-center

                    overflow-hidden

                    py-5

                    sm:py-8
                "
            >
                {/* =========================================
                    GLOW BEHIND NUMBERS
                ========================================== */}

                <div
                    className="
                        pointer-events-none

                        absolute
                        left-1/2
                        top-1/2

                        h-40
                        w-56

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-red-500/10
                        blur-3xl

                        dark:bg-red-500/20
                    "
                />

                {/* =========================================
                    LARGE 404
                ========================================== */}

                <motion.div
                    initial={
                        reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 14,
                                scale: 0.96,
                            }
                    }
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: reduceMotion
                            ? 0
                            : 0.55,

                        ease: "easeOut",
                    }}
                    className="
                        relative

                        select-none

                        font-black

                        text-[112px]
                        leading-none

                        tracking-[-0.10em]

                        text-slate-200

                        dark:text-white/[0.10]

                        sm:text-[160px]
                        md:text-[190px]
                    "
                >
                    404

                    {/* =====================================
                        BOTTOM RED ACCENT
                    ====================================== */}

                    <div
                        className="
                            absolute
                            bottom-1
                            left-1/2

                            h-[3px]
                            w-20

                            -translate-x-1/2

                            rounded-full

                            bg-gradient-to-r

                            from-transparent
                            via-red-500
                            to-transparent

                            sm:bottom-3
                        "
                    />
                </motion.div>

                {/* =========================================
                    CENTER SEARCH ICON
                ========================================== */}

                <motion.div
                    initial={
                        reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                scale: 0.8,
                            }
                    }
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        delay: reduceMotion
                            ? 0
                            : 0.2,

                        duration: reduceMotion
                            ? 0
                            : 0.4,
                    }}
                    className="
                        absolute
                        left-1/2
                        top-1/2

                        flex
                        h-[74px]
                        w-[74px]

                        -translate-x-1/2
                        -translate-y-1/2

                        items-center
                        justify-center

                        rounded-[23px]
                        border

                        border-red-200
                        bg-white/95

                        text-red-600

                        shadow-xl
                        shadow-red-500/10

                        backdrop-blur-xl

                        dark:border-red-400/25
                        dark:bg-[#17131a]/95
                        dark:text-red-400

                        sm:h-[90px]
                        sm:w-[90px]
                    "
                >
                    <UserRoundX
                        size={36}
                        strokeWidth={1.6}
                        className="
                            sm:h-11
                            sm:w-11
                        "
                    />
                </motion.div>
            </div>
        );
    }
);

// =========================================================
// TERMINAL STATUS
//
// Decorative terminal output explaining what happened.
//
// The username is displayed as plain React text,
// never interpolated into raw HTML.
// =========================================================

const ProfileNotFoundTerminal = memo(
    function ProfileNotFoundTerminal({
        username,
    }) {
        const reduceMotion =
            useReducedMotion();

        const displayedUsername =
            username || "unknown";

        return (
            <div
                className="
                    mx-auto
                    mt-7

                    w-full
                    max-w-lg

                    overflow-hidden

                    rounded-2xl
                    border

                    border-slate-200
                    bg-slate-950

                    text-left

                    shadow-xl
                    shadow-slate-900/10

                    dark:border-white/[0.09]
                    dark:bg-[#090c12]
                    dark:shadow-black/25
                "
            >
                {/* =========================================
                    TERMINAL HEADER
                ========================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between

                        gap-3

                        border-b
                        border-white/[0.08]

                        bg-white/[0.035]

                        px-4
                        py-3
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        {/* TERMINAL DOTS */}

                        <span
                            aria-hidden="true"
                            className="
                                h-2.5
                                w-2.5

                                rounded-full

                                bg-red-500/80
                            "
                        />

                        <span
                            aria-hidden="true"
                            className="
                                h-2.5
                                w-2.5

                                rounded-full

                                bg-amber-400/80
                            "
                        />

                        <span
                            aria-hidden="true"
                            className="
                                h-2.5
                                w-2.5

                                rounded-full

                                bg-emerald-400/80
                            "
                        />
                    </div>

                    {/* TERMINAL NAME */}

                    <span
                        className="
                            inline-flex
                            min-w-0

                            items-center
                            gap-1.5

                            font-mono

                            text-[10px]
                            font-semibold

                            tracking-wider

                            text-slate-400
                        "
                    >
                        <Terminal
                            size={13}
                            aria-hidden="true"
                        />

                        <span className="truncate">
                            fsociety@terminal
                        </span>
                    </span>

                    <div className="w-[38px]" />
                </div>

                {/* =========================================
                    TERMINAL BODY
                ========================================== */}

                <div
                    className="
                        space-y-2.5

                        px-4
                        py-4

                        font-mono

                        text-[11px]
                        leading-6

                        sm:px-5
                        sm:text-xs
                    "
                >
                    {/* REQUEST */}

                    <p
                        className="
                            flex
                            min-w-0
                            flex-wrap

                            items-center
                            gap-x-2
                        "
                    >
                        <span
                            className="
                                text-emerald-400
                            "
                        >
                            $
                        </span>

                        <span
                            className="
                                text-slate-300
                            "
                        >
                            lookup --user
                        </span>

                        <span
                            className="
                                max-w-full
                                break-all

                                text-indigo-300
                            "
                        >
                            @{displayedUsername}
                        </span>
                    </p>

                    {/* SYSTEM RESPONSE */}

                    <p
                        className="
                            flex
                            items-center
                            gap-2

                            text-red-400
                        "
                    >
                        <ShieldAlert
                            size={13}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        ERROR: PROFILE_NOT_FOUND
                    </p>

                    {/* STATUS */}

                    <p
                        className="
                            flex
                            flex-wrap

                            items-center
                            gap-2

                            text-slate-400
                        "
                    >
                        <span>
                            status:
                        </span>

                        <span
                            className="
                                text-red-300
                            "
                        >
                            HTTP 404
                        </span>
                    </p>

                    {/* CURSOR */}

                    <div
                        aria-hidden="true"
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                text-emerald-400
                            "
                        >
                            $
                        </span>

                        <span
                            className={`
                                inline-block

                                h-4
                                w-2

                                bg-emerald-400

                                ${
                                    reduceMotion
                                        ? ""
                                        : "animate-pulse"
                                }

                                motion-reduce:animate-none
                            `}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

// =========================================================
// NOT FOUND ACTIONS
//
// Verified frontend routes:
//
// /users
// /
//
// These are React Router Link components;
// no full page reload is required.
// =========================================================

const ProfileNotFoundActions = memo(
    function ProfileNotFoundActions() {
        return (
            <div
                className="
                    mt-7

                    flex
                    w-full

                    flex-col
                    items-center
                    justify-center

                    gap-3

                    sm:flex-row
                "
            >
                {/* =========================================
                    USERS PAGE — PRIMARY
                ========================================== */}

                <Link
                    to={USERS_PATH}
                    className="
                        group

                        inline-flex
                        min-h-12
                        w-full

                        items-center
                        justify-center
                        gap-2.5

                        rounded-xl
                        border

                        border-red-600
                        bg-red-600

                        px-6
                        py-3

                        text-sm
                        font-bold

                        text-white

                        shadow-lg
                        shadow-red-500/15

                        transition-all
                        duration-200

                        hover:border-red-500
                        hover:bg-red-500
                        hover:shadow-red-500/25

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-red-500/50
                        focus-visible:ring-offset-2

                        active:scale-[0.98]

                        motion-reduce:transform-none

                        sm:w-auto

                        dark:focus-visible:ring-offset-[#0d1117]
                    "
                >
                    <Users
                        size={18}
                        aria-hidden="true"
                    />

                    Foydalanuvchilar

                    <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                        className="
                            transition-transform
                            duration-200

                            group-hover:translate-x-0.5
                            group-hover:-translate-y-0.5

                            motion-reduce:transform-none
                        "
                    />
                </Link>

                {/* =========================================
                    HOME PAGE — SECONDARY
                ========================================== */}

                <Link
                    to={HOME_PATH}
                    className="
                        group

                        inline-flex
                        min-h-12
                        w-full

                        items-center
                        justify-center
                        gap-2.5

                        rounded-xl
                        border

                        border-slate-300
                        bg-white

                        px-6
                        py-3

                        text-sm
                        font-bold

                        text-slate-700

                        transition-all
                        duration-200

                        hover:border-slate-400
                        hover:bg-slate-50

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500/50
                        focus-visible:ring-offset-2

                        active:scale-[0.98]

                        motion-reduce:transform-none

                        sm:w-auto

                        dark:border-white/[0.12]
                        dark:bg-white/[0.05]
                        dark:text-slate-200

                        dark:hover:border-white/[0.2]
                        dark:hover:bg-white/[0.09]

                        dark:focus-visible:ring-offset-[#0d1117]
                    "
                >
                    <House
                        size={17}
                        aria-hidden="true"
                    />

                    Bosh sahifa

                    <ArrowLeft
                        size={16}
                        aria-hidden="true"
                        className="
                            transition-transform
                            duration-200

                            group-hover:-translate-x-0.5

                            motion-reduce:transform-none
                        "
                    />
                </Link>
            </div>
        );
    }
);

// =========================================================
// MAIN PROFILE NOT FOUND
//
// Props:
//
// username:
//   Requested username from React Router.
//
// Example:
//
// /not-a-user/profile
//
// <ProfileNotFound username="not-a-user" />
//
// Controller contract:
//
// useProfilePage() returns:
//
// isNotFound
// notFoundUsername
// profileStatus
//
// This page should render ONLY when:
// isNotFound === true
// =========================================================

const ProfileNotFound = ({
    username = "",
}) => {
    // =====================================================
    // REDUCED MOTION
    // =====================================================

    const reduceMotion =
        useReducedMotion();

    // =====================================================
    // NORMALIZED USERNAME
    // =====================================================

    const requestedUsername =
        normalizeUsername(username);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            className="
                relative
                isolate

                flex
                min-h-screen
                w-full
                min-w-0

                items-center
                justify-center

                overflow-hidden

                bg-[#f4f7fc]
                text-slate-900

                px-4
                py-12

                font-sans

                transition-colors
                duration-300

                dark:bg-[#0d1117]
                dark:text-[#e6edf3]

                sm:px-6
                sm:py-16
            "
        >
            {/* =============================================
                BACKGROUND
            ============================================== */}

            <ProfileNotFoundBackground />

            {/* =============================================
                PAGE CONTENT
            ============================================== */}

            <motion.section
                initial={
                    reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 20,
                        }
                }
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: reduceMotion
                        ? 0
                        : 0.45,

                    ease: "easeOut",
                }}
                aria-labelledby="profile-not-found-title"
                aria-describedby="profile-not-found-description"
                className="
                    relative
                    z-10

                    mx-auto
                    w-full
                    max-w-3xl

                    text-center
                "
            >
                {/* =========================================
                    STATUS EYEBROW
                ========================================== */}

                <div
                    className="
                        inline-flex

                        items-center
                        justify-center
                        gap-2

                        rounded-full
                        border

                        border-red-200
                        bg-red-50

                        px-4
                        py-2

                        dark:border-red-400/20
                        dark:bg-red-500/[0.08]
                    "
                >
                    <span
                        aria-hidden="true"
                        className="
                            h-2
                            w-2

                            rounded-full

                            bg-red-500

                            shadow-[0_0_10px_rgba(239,68,68,0.35)]
                        "
                    />

                    <span
                        className="
                            font-mono

                            text-[10px]
                            font-bold

                            uppercase
                            tracking-[0.16em]

                            text-red-700

                            dark:text-red-300
                        "
                    >
                        User lookup failed
                    </span>
                </div>

                {/* =========================================
                    404 ILLUSTRATION
                ========================================== */}

                <ProfileNotFoundIllustration />

                {/* =========================================
                    TITLE
                ========================================== */}

                <h1
                    id="profile-not-found-title"
                    className="
                        mx-auto

                        max-w-2xl

                        text-2xl
                        font-black

                        tracking-tight

                        text-slate-900

                        dark:text-white

                        sm:text-3xl
                        md:text-4xl
                    "
                >
                    Foydalanuvchi{" "}

                    <span
                        className="
                            text-red-600
                            dark:text-red-400
                        "
                    >
                        topilmadi
                    </span>
                </h1>

                {/* =========================================
                    DESCRIPTION
                ========================================== */}

                <p
                    id="profile-not-found-description"
                    className="
                        mx-auto
                        mt-4

                        max-w-lg

                        text-sm
                        font-medium
                        leading-7

                        text-slate-600

                        dark:text-slate-400

                        sm:text-base
                    "
                >
                    {DEFAULT_MESSAGE}
                </p>

                {/* =========================================
                    REQUESTED USERNAME
                ========================================== */}

                {requestedUsername && (
                    <div
                        className="
                            mx-auto
                            mt-6

                            inline-flex
                            max-w-full

                            items-center
                            gap-2.5

                            rounded-xl
                            border

                            border-slate-200
                            bg-white

                            px-4
                            py-2.5

                            shadow-sm

                            dark:border-white/[0.10]
                            dark:bg-white/[0.04]
                        "
                    >
                        <SearchX
                            size={17}
                            aria-hidden="true"
                            className="
                                shrink-0

                                text-red-500
                            "
                        />

                        <span
                            className="
                                min-w-0
                                max-w-[210px]

                                truncate

                                font-mono

                                text-sm
                                font-bold

                                text-slate-800

                                dark:text-slate-200

                                sm:max-w-[350px]
                            "
                            title={requestedUsername}
                        >
                            @{requestedUsername}
                        </span>
                    </div>
                )}

                {/* =========================================
                    TERMINAL
                ========================================== */}

                <ProfileNotFoundTerminal
                    username={requestedUsername}
                />

                {/* =========================================
                    ACTIONS
                ========================================== */}

                <ProfileNotFoundActions />

                {/* =========================================
                    FOOTER LABEL
                ========================================== */}

                <div
                    className="
                        mt-10

                        flex
                        items-center
                        justify-center
                        gap-2

                        font-mono

                        text-[10px]
                        font-semibold

                        uppercase
                        tracking-[0.18em]

                        text-slate-400

                        dark:text-slate-600
                    "
                >
                    <Terminal
                        size={13}
                        aria-hidden="true"
                    />

                    FSOCIETY / FIX SOCIETY
                </div>
            </motion.section>
        </main>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default memo(ProfileNotFound);
