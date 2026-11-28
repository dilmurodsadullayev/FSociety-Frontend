
// src/components/navbar/NavbarActions.jsx

import React, {
    memo,
    useCallback,
} from "react";

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

import NavbarEventGiftButton from "./NavbarEventGiftButton";

// =========================================================
// WINTER EXPERIENCE
// =========================================================

import WinterExperienceButton from "../../features/newYear/components/WinterExperienceButton";

// =========================================================
// FSOCIETY — NAVBAR ACTIONS
// =========================================================
//
// Location:
// src/components/navbar/NavbarActions.jsx
//
// Features:
// - FCoin balance
// - Universal Event Gift icon
// - Upcoming holiday countdown
// - Backend-confirmed gift indicator
// - Light / Dark mode
// - Winter Experience settings
// - Notification dropdown
// - User profile dropdown
// - Login navigation
// - Mobile hamburger menu
// - Accessible interactions
// - Popover exclusivity
//
// IMPORTANT:
//
// No Daily Gift modules are imported.
//
// Event Gift:
// - Public /events navigation
// - One gift per user per event
// - Backend controls eligibility
// - No automatic gift claim
//
// Winter Experience remains independent.
//
// =========================================================


// =========================================================
// MAIN COMPONENT
// =========================================================

function NavbarActions({
    // =====================================================
    // AUTH
    // =====================================================

    isLoggedIn = false,

    user = null,

    avatarUrl = "",

    // =====================================================
    // USER MENU
    // =====================================================

    openUserMenu = false,

    setOpenUserMenu,

    userMenuRef,

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    openNotifications = false,

    setOpenNotifications,

    notificationsRef,

    // =====================================================
    // WINTER EXPERIENCE
    // =====================================================

    winterSettingsOpen = false,

    toggleWinterSettings,

    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    isMobileMenuOpen = false,

    toggleMobileMenu,

    // =====================================================
    // LOGOUT
    // =====================================================

    handleLogout,
}) {
    // =====================================================
    // CLOSE NAVBAR POPOVERS
    // =====================================================
    //
    // Shared by:
    // - Event Gift navigation
    // - Winter Experience
    //
    // Prevent overlapping dropdowns.
    //
    // =====================================================

    const closeNavbarPopovers = useCallback(
        () => {
            if (
                typeof setOpenUserMenu ===
                "function"
            ) {
                setOpenUserMenu(false);
            }

            if (
                typeof setOpenNotifications ===
                "function"
            ) {
                setOpenNotifications(false);
            }
        },
        [
            setOpenUserMenu,
            setOpenNotifications,
        ]
    );

    // =====================================================
    // NOTIFICATIONS EXCLUSIVE TOGGLE
    // =====================================================
    //
    // Opening notifications closes user menu.
    //
    // Existing NotificationDropdown contract
    // remains unchanged.
    //
    // =====================================================

    const setNotificationsExclusive =
        useCallback(
            (nextValue) => {
                if (
                    typeof setOpenUserMenu ===
                    "function"
                ) {
                    setOpenUserMenu(false);
                }

                if (
                    typeof setOpenNotifications ===
                    "function"
                ) {
                    setOpenNotifications(
                        nextValue
                    );
                }
            },
            [
                setOpenUserMenu,
                setOpenNotifications,
            ]
        );

    // =====================================================
    // WINTER EXPERIENCE TOGGLE
    // =====================================================
    //
    // Close:
    // - User menu
    // - Notifications
    //
    // Toggle the existing Winter sidebar.
    //
    // =====================================================

    const handleWinterToggle = useCallback(
        () => {
            closeNavbarPopovers();

            if (
                typeof toggleWinterSettings ===
                "function"
            ) {
                toggleWinterSettings();
            }
        },
        [
            closeNavbarPopovers,
            toggleWinterSettings,
        ]
    );

    // =====================================================
    // EVENT GIFT NAVIGATION
    // =====================================================
    //
    // Called before Link navigates to /events.
    //
    // Close:
    // - User menu
    // - Notifications
    // - Winter Settings
    // - Mobile navigation
    //
    // Do NOT:
    // - Open an obsolete gift modal
    // - Dispatch reward claim POST
    // - Change user FCoin locally
    //
    // =====================================================

    const handleEventGiftNavigate =
        useCallback(
            () => {
                closeNavbarPopovers();

                // Close Winter Experience when open.

                if (
                    winterSettingsOpen &&
                    typeof toggleWinterSettings ===
                        "function"
                ) {
                    toggleWinterSettings();
                }

                // Close mobile menu when open.

                if (
                    isMobileMenuOpen &&
                    typeof toggleMobileMenu ===
                        "function"
                ) {
                    toggleMobileMenu();
                }
            },
            [
                closeNavbarPopovers,

                winterSettingsOpen,
                toggleWinterSettings,

                isMobileMenuOpen,
                toggleMobileMenu,
            ]
        );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                relative
                flex min-w-0 shrink-0
                items-center justify-end
                gap-1
                min-[390px]:gap-1.5
                sm:gap-2
                xl:gap-2.5
            "
        >
            {/* =========================================
                FCOIN BALANCE
            ========================================= */}

            {isLoggedIn && (
                <div
                    className="
                        hidden shrink-0
                        min-[390px]:flex
                        lg:hidden
                        xl:flex
                    "
                >
                    <NavbarCoin
                        coins={
                            user?.coins ?? 0
                        }
                    />
                </div>
            )}

            {/* =========================================
                UNIVERSAL EVENT GIFT
            ========================================= */}
            {/*
                Placed after FCoin and before
                the theme toggle.

                Available for:
                - Guests (view public events)
                - Authenticated users

                Only signed-in users can claim
                gifts through the Events page.

                The navbar does not contain
                any reward-claiming logic.
            */}

            <div
                className="
                    relative flex shrink-0
                    items-center justify-center
                "
            >
                <NavbarEventGiftButton
                    isLoggedIn={isLoggedIn}
                    onNavigate={
                        handleEventGiftNavigate
                    }
                />
            </div>

            {/* =========================================
                LIGHT / DARK MODE
            ========================================= */}

            <div
                className="
                    relative flex shrink-0
                    items-center justify-center
                "
            >
                <ThemeToggle />
            </div>

            {/* =========================================
                WINTER EXPERIENCE
            ========================================= */}

            <div
                className="
                    relative flex shrink-0
                    items-center justify-center
                "
            >
                <WinterExperienceButton
                    isOpen={
                        winterSettingsOpen
                    }
                    onClick={
                        handleWinterToggle
                    }
                />
            </div>

            {/* =========================================
                AUTHENTICATED USER ACTIONS
            ========================================= */}

            {isLoggedIn ? (
                <>
                    {/* =================================
                        NOTIFICATIONS
                    ================================= */}

                    <NotificationDropdown
                        openNotifications={
                            openNotifications
                        }
                        setOpenNotifications={
                            setNotificationsExclusive
                        }
                        notificationsRef={
                            notificationsRef
                        }
                    />

                    {/* =================================
                        USER PROFILE MENU
                    ================================= */}

                    <NavbarUserMenu
                        user={user}
                        avatarUrl={avatarUrl}
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
                /* =====================================
                    LOGIN BUTTON
                ===================================== */

                <Link
                    to="/login"
                    aria-label="Tizimga kirish"
                    className="
                        group/login
                        relative inline-flex
                        h-10 shrink-0
                        items-center justify-center
                        gap-2 rounded-xl
                        border border-indigo-500/20
                        bg-indigo-600
                        px-2.5
                        text-[13px] font-bold
                        text-white

                        shadow-[0_4px_14px_rgba(79,70,229,0.15)]

                        transition-[background-color,border-color,transform]
                        duration-200

                        hover:border-indigo-400/40
                        hover:bg-indigo-500

                        active:scale-95

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500
                        focus-visible:ring-offset-2

                        dark:border-indigo-400/20
                        dark:shadow-none
                        dark:focus-visible:ring-offset-[#080c12]

                        sm:px-4

                        motion-reduce:transform-none
                        motion-reduce:transition-none
                    "
                >
                    <LogIn
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="
                            shrink-0
                            transition-transform
                            duration-200
                            group-hover/login:translate-x-0.5
                            motion-reduce:transform-none
                        "
                    />

                    <span
                        className="
                            hidden whitespace-nowrap
                            font-semibold sm:inline
                        "
                    >
                        Kirish
                    </span>
                </Link>
            )}

            {/* =========================================
                MOBILE NAVIGATION
            ========================================= */}

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
                    relative inline-flex
                    h-10 w-10 shrink-0
                    items-center justify-center
                    overflow-hidden rounded-xl

                    border border-cyan-600/20
                    bg-cyan-500/[0.07]
                    text-cyan-700

                    transition-[background-color,border-color,transform]
                    duration-200

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

                    dark:focus-visible:ring-offset-[#080c12]

                    motion-reduce:transform-none
                    motion-reduce:transition-none
                "
            >
                {/* SUBTLE HOVER */}

                <span
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute inset-0
                        bg-cyan-500/[0.04]
                        opacity-0
                        transition-opacity
                        duration-200
                        group-hover/mobile:opacity-100
                        dark:bg-cyan-400/[0.03]
                    "
                />

                {/* ICON */}

                <span
                    className="
                        relative z-10
                        flex items-center
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
}


// =========================================================
// EXPORT
// =========================================================

export default memo(NavbarActions);
