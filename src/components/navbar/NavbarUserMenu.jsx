
import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    Bug,
    ChevronDown,
    Coins,
    LogOut,
    UserCircle,
} from "lucide-react";

// =========================================================
// UTILS
// =========================================================

import {
    handleUserImageError,
} from "../../utils/imageUtils";

// =========================================================
// ANIMATIONS
// =========================================================

import {
    dropdownVariants,
} from "./navConfig";

// =========================================================
// FSOCIETY — NAVBAR USER MENU
//
// Dark Mode:
// Original FSociety cyber design.
//
// Light Mode:
// Premium slate-indigo design.
//
// Existing features:
// - User avatar
// - Username
// - Profile navigation
// - My Problems
// - FCoin History
// - Logout
// - Click outside
// - Escape handling
// =========================================================

const NavbarUserMenu = ({

    // USER
    user,
    avatarUrl,

    // MENU STATE
    openUserMenu,
    setOpenUserMenu,

    // NOTIFICATION STATE
    setOpenNotifications,

    // REF
    userMenuRef,

    // LOGOUT
    handleLogout,

}) => {

    // =====================================================
    // USER DATA
    // =====================================================

    const username =
        user?.username || "user";

    const displayName =
        user?.first_name
            ? `${user.first_name} ${user?.last_name || ""}`.trim()
            : username;

    // =====================================================
    // CLOSE MENU
    // =====================================================

    const closeMenu = () => {
        setOpenUserMenu(false);
    };

    // =====================================================
    // TOGGLE MENU
    // =====================================================

    const toggleMenu = () => {

        // Notification dropdownni yopamiz.
        setOpenNotifications(false);

        // User dropdown holatini almashtiramiz.
        setOpenUserMenu(
            (previous) => !previous
        );
    };

    // =====================================================
    // SHARED MENU ITEM STYLE
    // =====================================================

    const menuItemClass = `
        flex
        w-full
        items-center
        gap-3

        rounded-xl

        px-3
        py-3

        text-[13px]
        font-semibold

        transition-colors
        duration-150

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-500

        motion-reduce:transition-none
    `;

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            ref={userMenuRef}
            className="
                relative
                shrink-0
            "
        >

            {/* ==========================================
                USER BUTTON
            ========================================== */}

            <button
                type="button"

                onClick={toggleMenu}

                aria-label="Foydalanuvchi menyusi"

                aria-expanded={Boolean(openUserMenu)}

                aria-controls="fsociety-user-dropdown"

                className="
                    group/user

                    relative

                    flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-[#cdd7e8]

                    bg-[#f6f8ff]/90

                    p-1
                    pr-2

                    outline-none

                    transition-colors
                    duration-150

                    hover:border-indigo-400/40
                    hover:bg-indigo-50

                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    sm:pr-3

                    dark:border-white/[0.07]
                    dark:bg-white/[0.035]

                    dark:hover:border-indigo-400/30
                    dark:hover:bg-indigo-400/[0.055]

                    motion-reduce:transition-none
                "
            >

                {/* ======================================
                    AVATAR
                ====================================== */}

                <span
                    className="
                        relative

                        block
                        h-9
                        w-9

                        shrink-0

                        overflow-hidden

                        rounded-full

                        border
                        border-[#d5deec]

                        bg-[#e8edf6]

                        sm:h-10
                        sm:w-10

                        dark:border-white/10
                        dark:bg-[#161b22]
                    "
                >

                    <img
                        src={avatarUrl}

                        alt={`${username} avatar`}

                        onError={
                            handleUserImageError
                        }

                        className="
                            h-full
                            w-full
                            object-cover
                        "
                    />

                    {/* AVATAR INNER RING */}

                    <span
                        aria-hidden="true"

                        className="
                            pointer-events-none

                            absolute
                            inset-0

                            rounded-full

                            ring-1
                            ring-inset

                            ring-slate-900/[0.04]

                            dark:ring-white/[0.04]
                        "
                    />

                </span>

                {/* ======================================
                    USERNAME
                ====================================== */}

                <span
                    className="
                        hidden

                        max-w-[110px]
                        truncate

                        text-[13px]
                        font-semibold

                        text-slate-700

                        transition-colors
                        duration-150

                        group-hover/user:text-indigo-700

                        md:block

                        dark:text-gray-200
                        dark:group-hover/user:text-indigo-200
                    "
                >
                    @{username}
                </span>

                {/* ======================================
                    CHEVRON
                ====================================== */}

                <ChevronDown
                    size={15}
                    strokeWidth={2}

                    aria-hidden="true"

                    className={`
                        hidden

                        shrink-0

                        text-slate-500

                        transition-transform
                        duration-150

                        sm:block

                        dark:text-gray-600

                        ${
                            openUserMenu
                                ? "rotate-180"
                                : ""
                        }

                        motion-reduce:transition-none
                    `}
                />

            </button>

            {/* ==========================================
                USER DROPDOWN
            ========================================== */}

            <AnimatePresence>

                {openUserMenu && (

                    <motion.div
                        id="fsociety-user-dropdown"

                        variants={
                            dropdownVariants
                        }

                        initial="hidden"
                        animate="visible"
                        exit="exit"

                        aria-label="Foydalanuvchi menyusi"

                        className="
                            absolute
                            right-0
                            top-full

                            z-[60]

                            mt-3

                            w-[260px]
                            max-w-[calc(100vw-2rem)]

                            overflow-hidden

                            rounded-2xl

                            border
                            border-[#d8e1ee]

                            bg-[#f9fbff]/[0.98]

                            shadow-[0_20px_50px_rgba(30,41,59,0.14)]

                            dark:border-white/[0.07]
                            dark:bg-[#11161e]/[0.98]

                            dark:shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                        "
                    >

                        {/* ==================================
                            USER INFORMATION
                        ================================== */}

                        <div
                            className="
                                flex
                                items-center
                                gap-3

                                border-b
                                border-[#e2e8f2]

                                bg-[#eef3fb]/70

                                p-4

                                dark:border-white/[0.06]
                                dark:bg-white/[0.02]
                            "
                        >

                            {/* AVATAR */}

                            <img
                                src={avatarUrl}

                                alt={`${username} avatar`}

                                onError={
                                    handleUserImageError
                                }

                                className="
                                    h-11
                                    w-11

                                    shrink-0

                                    rounded-full

                                    border
                                    border-[#d5deec]

                                    bg-[#e8edf6]

                                    object-cover

                                    dark:border-white/10
                                    dark:bg-[#161b22]
                                "
                            />

                            {/* USER DETAILS */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >

                                {/* DISPLAY NAME */}

                                <p
                                    className="
                                        truncate

                                        text-[14px]
                                        font-bold

                                        text-slate-900

                                        dark:text-white
                                    "
                                >
                                    {displayName}
                                </p>

                                {/* USERNAME */}

                                <p
                                    className="
                                        mt-0.5

                                        truncate

                                        font-mono
                                        text-[10px]

                                        text-indigo-600

                                        dark:text-indigo-400
                                    "
                                >
                                    @{username}
                                </p>

                            </div>

                        </div>

                        {/* ==================================
                            MENU LINKS
                        ================================== */}

                        <div className="p-2">

                            {/* ==============================
                                PROFILE
                            ============================== */}

                            <Link
                                to={`/${username}/profile`}

                                onClick={closeMenu}

                                className={`
                                    ${menuItemClass}

                                    text-slate-600

                                    hover:bg-indigo-500/[0.08]
                                    hover:text-indigo-700

                                    dark:text-gray-400

                                    dark:hover:bg-indigo-500/10
                                    dark:hover:text-indigo-300
                                `}
                            >

                                <UserCircle
                                    size={18}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />

                                <span>
                                    Profilim
                                </span>

                            </Link>

                            {/* ==============================
                                MY PROBLEMS
                            ============================== */}

                            <Link
                                to="/my-problems"

                                onClick={closeMenu}

                                className={`
                                    ${menuItemClass}

                                    text-slate-600

                                    hover:bg-cyan-500/[0.07]
                                    hover:text-cyan-700

                                    dark:text-gray-400

                                    dark:hover:bg-cyan-400/[0.07]
                                    dark:hover:text-cyan-300
                                `}
                            >

                                <Bug
                                    size={18}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />

                                <span>
                                    Muammolarim
                                </span>

                            </Link>

                            {/* ==============================
                                FCOIN HISTORY
                            ============================== */}

                            <Link
                                to="/fcoin-history"

                                onClick={closeMenu}

                                className={`
                                    ${menuItemClass}

                                    text-slate-600

                                    hover:bg-amber-400/[0.10]
                                    hover:text-amber-800

                                    dark:text-gray-400

                                    dark:hover:bg-amber-400/[0.07]
                                    dark:hover:text-amber-300
                                `}
                            >

                                <Coins
                                    size={18}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />

                                <span>
                                    FCoin tarixi
                                </span>

                            </Link>

                            {/* ==============================
                                DIVIDER
                            ============================== */}

                            <div
                                aria-hidden="true"

                                className="
                                    my-2
                                    h-px

                                    bg-[#e2e8f2]

                                    dark:bg-white/[0.05]
                                "
                            />

                            {/* ==============================
                                LOGOUT
                            ============================== */}

                            <button
                                type="button"

                                onClick={handleLogout}

                                className={`
                                    ${menuItemClass}

                                    text-left

                                    text-red-600

                                    hover:bg-red-500/[0.08]
                                    hover:text-red-700

                                    dark:text-red-400

                                    dark:hover:bg-red-500/[0.08]
                                    dark:hover:text-red-300
                                `}
                            >

                                <LogOut
                                    size={18}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />

                                <span>
                                    Chiqish
                                </span>

                            </button>

                        </div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default NavbarUserMenu;
