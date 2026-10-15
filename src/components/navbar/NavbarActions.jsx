
import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    LogIn,
    Menu,
    X,
} from "lucide-react";

// =========================================================
// EXISTING COMPONENTS
// =========================================================

import NotificationDropdown from "../NotificationDropdown";

import ThemeToggle from "../ui/ThemeToggle";

// =========================================================
// NAVBAR COMPONENTS
// =========================================================

import NavbarCoin from "./NavbarCoin";

import NavbarUserMenu from "./NavbarUserMenu";

// =========================================================
// FSOCIETY — NAVBAR ACTIONS
//
// Dark Mode:
// Original cyber appearance.
//
// Light Mode:
// Premium slate-indigo appearance.
//
// Performance:
// Lightweight CSS transitions.
// No unnecessary animation libraries.
//
// Existing notification, authentication
// and mobile sidebar contracts preserved.
// =========================================================

const NavbarActions = ({

    // =====================================================
    // AUTH
    // =====================================================

    isLoggedIn,
    user,
    avatarUrl,

    // =====================================================
    // USER MENU
    // =====================================================

    openUserMenu,
    setOpenUserMenu,
    userMenuRef,

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    openNotifications,
    setOpenNotifications,
    notificationsRef,

    // =====================================================
    // MOBILE MENU
    // =====================================================

    isMobileMenuOpen,
    toggleMobileMenu,

    // =====================================================
    // LOGOUT
    // =====================================================

    handleLogout,

}) => {

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                relative

                flex
                min-w-0
                shrink-0

                items-center
                justify-end

                gap-2
                sm:gap-3
            "
        >

            {/* ==========================================
                FCOIN BALANCE

                Authenticated users only.
            ========================================== */}

            {isLoggedIn && (

                <NavbarCoin
                    coins={
                        user?.coins
                    }
                />

            )}

            {/* ==========================================
                DARK / LIGHT MODE

                Available to all users.
                ThemeContext manages the state.
            ========================================== */}

            <div
                className="
                    relative
                    flex
                    shrink-0
                    items-center
                    justify-center
                "
            >
                <ThemeToggle />
            </div>

            {/* ==========================================
                AUTHENTICATED ACTIONS
            ========================================== */}

            {isLoggedIn ? (

                <>

                    {/* ==================================
                        NOTIFICATIONS

                        Existing component and props
                        are preserved.
                    ================================== */}

                    <NotificationDropdown

                        openNotifications={
                            openNotifications
                        }

                        setOpenNotifications={
                            setOpenNotifications
                        }

                        notificationsRef={
                            notificationsRef
                        }

                    />

                    {/* ==================================
                        USER PROFILE MENU

                        Existing behavior preserved.
                    ================================== */}

                    <NavbarUserMenu

                        user={user}

                        avatarUrl={
                            avatarUrl
                        }

                        openUserMenu={
                            openUserMenu
                        }

                        setOpenUserMenu={
                            setOpenUserMenu
                        }

                        setOpenNotifications={
                            setOpenNotifications
                        }

                        userMenuRef={
                            userMenuRef
                        }

                        handleLogout={
                            handleLogout
                        }

                    />

                </>

            ) : (

                <>

                    {/* ==================================
                        LOGIN BUTTON
                    ================================== */}

                    <Link
                        to="/login"

                        aria-label="Tizimga kirish"

                        className="
                            group/login

                            relative

                            inline-flex
                            h-10
                            shrink-0

                            items-center
                            justify-center

                            gap-2

                            overflow-hidden

                            rounded-xl

                            border
                            border-indigo-500/20

                            bg-indigo-600

                            px-3
                            sm:px-4

                            text-[13px]
                            font-bold

                            text-white

                            shadow-[0_4px_14px_rgba(79,70,229,0.15)]

                            transition-colors
                            duration-150

                            hover:border-indigo-400/40
                            hover:bg-indigo-500

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500
                            focus-visible:ring-offset-2

                            dark:border-indigo-400/20
                            dark:shadow-none

                            motion-reduce:transition-none
                        "
                    >

                        {/* ICON */}

                        <LogIn
                            size={17}
                            strokeWidth={2}

                            aria-hidden="true"

                            className="
                                relative
                                z-10

                                shrink-0

                                transition-transform
                                duration-150

                                group-hover/login:translate-x-0.5

                                motion-reduce:transition-none
                            "
                        />

                        {/* TEXT */}

                        <span
                            className="
                                relative
                                z-10

                                hidden
                                whitespace-nowrap

                                sm:inline
                            "
                        >
                            Kirish
                        </span>

                    </Link>

                </>

            )}

            {/* ==========================================
                MOBILE SIDEBAR BUTTON

                Visible below lg breakpoint.
                Same toggleMobileMenu callback.
            ========================================== */}

            <button
                type="button"

                onClick={
                    toggleMobileMenu
                }

                aria-label={
                    isMobileMenuOpen
                        ? "Mobil menyuni yopish"
                        : "Mobil menyuni ochish"
                }

                aria-expanded={
                    Boolean(isMobileMenuOpen)
                }

                aria-controls="fsociety-mobile-navigation"

                className="
                    group/mobile

                    relative

                    inline-flex
                    h-10
                    w-10

                    shrink-0

                    items-center
                    justify-center

                    overflow-hidden

                    rounded-xl

                    border
                    border-cyan-600/20

                    bg-cyan-500/[0.07]

                    text-cyan-700

                    transition-colors
                    duration-150

                    hover:border-cyan-600/35
                    hover:bg-cyan-500/[0.12]

                    active:scale-95

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cyan-500
                    focus-visible:ring-offset-2

                    lg:hidden

                    dark:border-cyan-400/10
                    dark:bg-cyan-400/[0.05]
                    dark:text-cyan-300

                    dark:hover:border-cyan-400/25
                    dark:hover:bg-cyan-400/[0.09]

                    motion-reduce:transition-none
                "
            >

                {/* SUBTLE HOVER */}

                <span
                    aria-hidden="true"

                    className="
                        pointer-events-none

                        absolute
                        inset-0

                        bg-cyan-500/[0.04]

                        opacity-0

                        transition-opacity
                        duration-150

                        group-hover/mobile:opacity-100

                        dark:bg-cyan-400/[0.03]
                    "
                />

                {/* ICON */}

                <span
                    className="
                        relative
                        z-10

                        flex
                        items-center
                        justify-center
                    "
                >

                    {isMobileMenuOpen ? (

                        <X
                            size={20}
                            strokeWidth={2}

                            aria-hidden="true"
                        />

                    ) : (

                        <Menu
                            size={20}
                            strokeWidth={2}

                            aria-hidden="true"
                        />

                    )}

                </span>

            </button>

        </div>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default NavbarActions;
