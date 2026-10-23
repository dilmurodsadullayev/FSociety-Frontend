
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

// =========================================================
// NAVBAR COMPONENTS
// =========================================================

import NavbarBrand from "./navbar/NavbarBrand";

import NavbarLinks from "./navbar/NavbarLinks";

import NavbarActions from "./navbar/NavbarActions";

import MobileNavbarSidebar from "./MobileNavbarSidebar";

import {
  NAV_LINKS,
} from "./navbar/navConfig";

// =========================================================
// AUTH
// =========================================================

import {
  logoutUser,
} from "../features/auth/Auth";

import AuthService from "../services/auth";

// =========================================================
// UTILS
// =========================================================

import {
  getUserAvatarUrl,
} from "../utils/imageUtils";

// =========================================================
// FSOCIETY — MAIN NAVBAR
// =========================================================
//
// Architecture:
//
// Navbar
// ├── NavbarBrand
// │   └── NavbarLogoGlitch
// │
// ├── NavbarLinks
// │   └── navConfig
// │
// ├── NavbarActions
// │   ├── NavbarCoin
// │   ├── ThemeToggle
// │   ├── NotificationDropdown
// │   └── NavbarUserMenu
// │
// └── MobileNavbarSidebar
//
// Features:
//
// - Responsive navbar
// - Light / Dark mode
// - FSociety / Fix Society brand
// - Mr. Robot-inspired logo glitch
// - Compact FCoin balance
// - Notifications
// - User dropdown
// - Mobile sidebar
// - Protected logout
// - Route-aware active navigation
// - Outside click handling
// - Escape handling
// - Keyboard accessibility
//
// =========================================================

// =========================================================
// PATH HELPERS
// =========================================================

const normalizePath = (path) => {
  if (
    typeof path !== "string" ||
    !path.trim()
  ) {
    return "/";
  }

  const normalized =
    path.replace(/\/+$/, "");

  return normalized || "/";
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function Navbar() {
  // =====================================================
  // HOOKS
  // =====================================================

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  // =====================================================
  // AUTH STATE
  // =====================================================

  const {
    isLoggedIn,
    user,
  } = useSelector((state) => ({
    isLoggedIn:
      Boolean(state.auth?.isLoggedIn),

    user:
      state.auth?.user ?? null,
  }));

  // =====================================================
  // LOCAL UI STATE
  // =====================================================

  const [
    openUserMenu,
    setOpenUserMenu,
  ] = useState(false);

  const [
    openNotifications,
    setOpenNotifications,
  ] = useState(false);

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  // =====================================================
  // REFS
  // =====================================================

  const userMenuRef =
    useRef(null);

  const notificationsRef =
    useRef(null);

  const logoutInFlightRef =
    useRef(false);

  // =====================================================
  // USER AVATAR
  // =====================================================

  const avatarUrl = useMemo(
    () => getUserAvatarUrl(user),
    [user]
  );

  // =====================================================
  // ACTIVE ROUTE
  // =====================================================
  //
  // In addition to direct navigation routes,
  // recognize nested detail pages:
  //
  // /project/:id/detail -> Projects
  // /problem/:id/detail -> Problems
  // /problem-create    -> Problems
  // /my-problems       -> Problems
  // /fcoin-history     -> F Coin
  //
  // =====================================================

  const currentPath = normalizePath(
    location.pathname
  );

  const isActive = useCallback(
    (path) => {
      const targetPath =
        normalizePath(path);

      if (targetPath === "/") {
        return currentPath === "/";
      }

      // Direct or nested route
      if (
        currentPath === targetPath ||
        currentPath.startsWith(
          `${targetPath}/`
        )
      ) {
        return true;
      }

      // Project detail route
      if (targetPath === "/projects") {
        return (
          currentPath === "/project" ||
          currentPath.startsWith(
            "/project/"
          )
        );
      }

      // Problem routes
      if (targetPath === "/problems") {
        return (
          currentPath === "/problem" ||
          currentPath.startsWith(
            "/problem/"
          ) ||
          currentPath === "/problem-create" ||
          currentPath === "/my-problems"
        );
      }

      // FCoin history
      if (targetPath === "/fcoin") {
        return (
          currentPath === "/fcoin-history"
        );
      }

      return false;
    },
    [currentPath]
  );

  // =====================================================
  // CLOSE ALL MENUS
  // =====================================================

  const closeAllMenus = useCallback(
    () => {
      setOpenUserMenu(false);

      setOpenNotifications(false);

      setIsMobileMenuOpen(false);
    },
    []
  );

  // =====================================================
  // CLOSE MENUS ON ROUTE CHANGE
  // =====================================================

  useEffect(() => {
    closeAllMenus();
  }, [
    location.pathname,
    location.search,
    location.hash,
    closeAllMenus,
  ]);

  // =====================================================
  // CLICK OUTSIDE
  // =====================================================
  //
  // Pointer events support:
  // - Mouse
  // - Touch
  // - Pen
  //
  // Mobile sidebar backdrop is handled
  // independently by MobileNavbarSidebar.
  //
  // =====================================================

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target =
        event.target;

      // USER MENU
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setOpenUserMenu(false);
      }

      // NOTIFICATION DROPDOWN
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, []);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      closeAllMenus();
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [closeAllMenus]);

  // =====================================================
  // CLOSE DROPDOWNS WHEN AUTH CHANGES
  // =====================================================

  useEffect(() => {
    if (!isLoggedIn) {
      closeAllMenus();
    }
  }, [
    isLoggedIn,
    closeAllMenus,
  ]);

  // =====================================================
  // LOGOUT
  // =====================================================
  //
  // Prevent repeated logout requests.
  //
  // Existing endpoint:
  // POST /users/logout/
  //
  // Even if backend logout fails, clear
  // frontend auth state, as before.
  //
  // =====================================================

  const handleLogout = useCallback(
    async () => {
      if (logoutInFlightRef.current) {
        return;
      }

      logoutInFlightRef.current = true;

      closeAllMenus();

      try {
        await AuthService.userLogout();
      } catch {
        // Logout API may fail due to a network
        // issue. Do not leave the frontend
        // showing the previous authenticated
        // session.
        //
        // Do not log full Axios errors,
        // because request configuration
        // may contain sensitive information.
      } finally {
        dispatch(logoutUser());

        navigate("/login", {
          replace: true,
        });

        logoutInFlightRef.current = false;
      }
    },
    [
      dispatch,
      navigate,
      closeAllMenus,
    ]
  );

  // =====================================================
  // MOBILE MENU TOGGLE
  // =====================================================
  //
  // Open sidebar:
  // - Close user dropdown
  // - Close notifications
  //
  // The sidebar controls:
  // - Backdrop
  // - Body scroll lock
  // - Focus management
  // - Desktop resize closing
  //
  // =====================================================

  const toggleMobileMenu = useCallback(
    () => {
      setOpenUserMenu(false);

      setOpenNotifications(false);

      setIsMobileMenuOpen(
        (previous) => !previous
      );
    },
    []
  );

  // =====================================================
  // OPEN ONLY ONE DROPDOWN
  // =====================================================
  //
  // Existing child components manage
  // their toggle callbacks.
  //
  // NavbarActions provides the exclusive
  // notification toggle wrapper.
  //
  // No duplicate state is introduced.
  //
  // =====================================================

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* ==========================================
          NAVBAR HEADER
         ========================================== */}

      <header
        className="
          sticky
          inset-x-0 top-0
          z-50

          w-full min-w-0

          border-b
          border-[#cdd7e8]

          bg-[#eaf0f9]/95
          text-slate-800

          shadow-[0_8px_28px_rgba(30,41,59,0.07)]

          backdrop-blur-xl

          transition-[background-color,border-color,color]
          duration-300

          dark:border-white/[0.06]
          dark:bg-[#080c12]/95
          dark:text-gray-100
          dark:shadow-none

          motion-reduce:transition-none
        "
      >
        {/* ======================================
            BOTTOM ACCENT LINE
           ====================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none

            absolute inset-x-0 bottom-0

            h-px

            bg-gradient-to-r
            from-transparent
            via-indigo-500/20
            to-transparent

            dark:via-cyan-400/10
          "
        />

        {/* ======================================
            NAVBAR CONTAINER
           ====================================== */}

        <div
          className="
            relative

            mx-auto

            w-full
            max-w-[1600px]

            px-3
            sm:px-5
            lg:px-5
            xl:px-6
          "
        >
          {/* ====================================
              MAIN NAVBAR ROW
             ==================================== */}

          <div
            className="
              flex
              min-h-[64px]
              w-full min-w-0

              items-center
              justify-between

              gap-2

              sm:min-h-[70px]
              sm:gap-3

              lg:min-h-[72px]

              xl:gap-4
            "
          >
            {/* ================================
                BRAND
               ================================ */}

            <NavbarBrand />

            {/* ================================
                DESKTOP NAVIGATION
               ================================ */}

            <NavbarLinks
              isActive={isActive}
            />

            {/* ================================
                RIGHT ACTIONS
               ================================ */}

            <NavbarActions
              // AUTH
              isLoggedIn={isLoggedIn}
              user={user}
              avatarUrl={avatarUrl}

              // USER MENU
              openUserMenu={openUserMenu}
              setOpenUserMenu={
                setOpenUserMenu
              }
              userMenuRef={userMenuRef}

              // NOTIFICATIONS
              openNotifications={
                openNotifications
              }
              setOpenNotifications={
                setOpenNotifications
              }
              notificationsRef={
                notificationsRef
              }

              // MOBILE SIDEBAR
              isMobileMenuOpen={
                isMobileMenuOpen
              }
              toggleMobileMenu={
                toggleMobileMenu
              }

              // LOGOUT
              handleLogout={
                handleLogout
              }
            />
          </div>
        </div>
      </header>

      {/* ==========================================
          MOBILE NAVIGATION SIDEBAR
         ========================================== */}

      <MobileNavbarSidebar
        // VISIBILITY
        isOpen={isMobileMenuOpen}
        setIsOpen={
          setIsMobileMenuOpen
        }

        // NAVIGATION
        navLinks={NAV_LINKS}
        isActive={isActive}

        // AUTH
        isLoggedIn={isLoggedIn}
        user={user}
        avatarUrl={avatarUrl}

        // LOGOUT
        handleLogout={
          handleLogout
        }
      />
    </>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(Navbar);
