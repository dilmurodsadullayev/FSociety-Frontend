
import React, {
  memo,
  useCallback,
} from "react";

import { Link } from "react-router-dom";

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
// =========================================================
//
// Location:
// src/components/navbar/NavbarActions.jsx
//
// Features:
// - Compact FCoin balance
// - Light / Dark mode
// - Notification dropdown
// - Avatar / user dropdown
// - Login navigation
// - Mobile hamburger
// - Accessible buttons
// - Responsive spacing
//
// Existing Navbar.jsx props preserved.
//
// ThemeToggle manages theme through
// the existing ThemeContext.
//
// =========================================================

function NavbarActions({
  // AUTH
  isLoggedIn = false,
  user = null,
  avatarUrl = "",

  // USER MENU
  openUserMenu = false,
  setOpenUserMenu,
  userMenuRef,

  // NOTIFICATIONS
  openNotifications = false,
  setOpenNotifications,
  notificationsRef,

  // MOBILE SIDEBAR
  isMobileMenuOpen = false,
  toggleMobileMenu,

  // LOGOUT
  handleLogout,
}) {
  // =====================================================
  // NOTIFICATION MENU EXCLUSIVITY
  // =====================================================
  //
  // Opening notifications should close the
  // user dropdown, avoiding overlapping
  // popovers on compact screens.
  //
  // =====================================================

  const setNotificationsExclusive =
    useCallback(
      (nextValue) => {
        if (
          typeof setOpenUserMenu === "function"
        ) {
          setOpenUserMenu(false);
        }

        if (
          typeof setOpenNotifications === "function"
        ) {
          setOpenNotifications(nextValue);
        }
      },
      [
        setOpenUserMenu,
        setOpenNotifications,
      ]
    );

  // =====================================================
  // RENDER
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

        gap-1

        min-[390px]:gap-1.5

        sm:gap-2

        xl:gap-2.5
      "
    >
      {/* ==========================================
          FCOIN BALANCE
         ========================================== */}

      {isLoggedIn && (
        <div
          className="
            hidden
            shrink-0

            min-[390px]:flex

            lg:hidden
            xl:flex
          "
        >
          <NavbarCoin
            coins={user?.coins ?? 0}
          />
        </div>
      )}

      {/* ==========================================
          LIGHT / DARK MODE
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
          AUTHENTICATED USER ACTIONS
         ========================================== */}

      {isLoggedIn ? (
        <>
          {/* ====================================
              NOTIFICATIONS
             ==================================== */}

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

          {/* ====================================
              USER PROFILE MENU
             ==================================== */}

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
        /* ======================================
            LOGIN BUTTON
           ====================================== */

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

            rounded-xl

            border border-indigo-500/20

            bg-indigo-600

            px-2.5

            text-[13px]
            font-bold

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
              hidden
              whitespace-nowrap
              font-semibold

              sm:inline
            "
          >
            Kirish
          </span>
        </Link>
      )}

      {/* ==========================================
          MOBILE SIDEBAR BUTTON
         ========================================== */}

      <button
        type="button"

        onClick={toggleMobileMenu}

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
          h-10 w-10
          shrink-0

          items-center
          justify-center

          overflow-hidden

          rounded-xl

          border
          border-cyan-600/20

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
}

export default memo(NavbarActions);
