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
// WINTER EXPERIENCE
// =========================================================

import WinterSettingsSidebar from "../features/newYear/components/WinterSettingsSidebar";

import ChristmasLights from "../features/newYear/components/ChristmasLights";

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
// ├── ChristmasLights
// ├── NavbarBrand
// ├── NavbarLinks
// ├── NavbarActions
// │   ├── NavbarCoin
// │   ├── ThemeToggle
// │   ├── WinterExperienceButton
// │   ├── NotificationDropdown
// │   └── NavbarUserMenu
// │
// ├── MobileNavbarSidebar
// └── WinterSettingsSidebar
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
// - Mobile navigation sidebar
// - Winter Experience sidebar
// - Christmas lights decoration
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

  const isLoggedIn = useSelector((state) =>
    Boolean(state.auth?.isLoggedIn)
  );

  const user = useSelector(
    (state) => state.auth?.user ?? null
  );

  // =====================================================
  // LOCAL UI STATE
  // =====================================================

  // USER MENU

  const [
    openUserMenu,
    setOpenUserMenu,
  ] = useState(false);

  // NOTIFICATIONS

  const [
    openNotifications,
    setOpenNotifications,
  ] = useState(false);

  // MOBILE NAVIGATION SIDEBAR

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  // WINTER EXPERIENCE SIDEBAR

  const [
    isWinterSettingsOpen,
    setIsWinterSettingsOpen,
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
  // CLOSE WINTER SETTINGS
  // =====================================================

  const closeWinterSettings = useCallback(
    () => {
      setIsWinterSettingsOpen(false);
    },
    []
  );

  // =====================================================
  // CLOSE ALL MENUS
  // =====================================================

  const closeAllMenus = useCallback(
    () => {
      setOpenUserMenu(false);

      setOpenNotifications(false);

      setIsMobileMenuOpen(false);

      setIsWinterSettingsOpen(false);
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
  }, [
    closeAllMenus,
  ]);

  // =====================================================
  // CLOSE MENUS WHEN AUTH CHANGES
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

  const toggleMobileMenu = useCallback(
    () => {
      setOpenUserMenu(false);

      setOpenNotifications(false);

      setIsWinterSettingsOpen(false);

      setIsMobileMenuOpen(
        (previous) => !previous
      );
    },
    []
  );

  // =====================================================
  // WINTER EXPERIENCE TOGGLE
  // =====================================================

  const toggleWinterSettings = useCallback(
    () => {
      setOpenUserMenu(false);

      setOpenNotifications(false);

      setIsMobileMenuOpen(false);

      setIsWinterSettingsOpen(
        (previous) => !previous
      );
    },
    []
  );

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

          isolate

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
            CHRISTMAS LIGHTS
        ====================================== */}

        <ChristmasLights />

        {/* ======================================
            BOTTOM ACCENT LINE
        ====================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none

            absolute inset-x-0 bottom-0

            z-[3]

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
            z-[2]

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
              min-h-[66px]
              w-full min-w-0

              items-center
              justify-between

              gap-2
              pt-1.5

              sm:min-h-[72px]
              sm:gap-3
              sm:pt-2

              lg:min-h-[74px]

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

              // WINTER EXPERIENCE

              winterSettingsOpen={
                isWinterSettingsOpen
              }

              toggleWinterSettings={
                toggleWinterSettings
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
        isOpen={isMobileMenuOpen}

        setIsOpen={
          setIsMobileMenuOpen
        }

        navLinks={NAV_LINKS}

        isActive={isActive}

        isLoggedIn={isLoggedIn}

        user={user}

        avatarUrl={avatarUrl}

        handleLogout={
          handleLogout
        }
      />

      {/* ==========================================
          WINTER SETTINGS SIDEBAR
      ========================================== */}

      <WinterSettingsSidebar
        isOpen={isWinterSettingsOpen}

        onClose={closeWinterSettings}
      />
    </>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(Navbar);